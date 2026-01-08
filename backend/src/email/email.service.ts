import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: Transporter | null = null;
  private isConfigured = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const emailFrom = this.configService.get<string>('EMAIL_FROM');
    const sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpUser = this.configService.get<string>('SMTP_USER');

    // Try SendGrid first
    if (sendgridApiKey && sendgridApiKey !== 'your_sendgrid_api_key') {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: 'apikey',
          pass: sendgridApiKey,
        },
      });
      this.isConfigured = true;
      console.log('✅ Email service initialized with SendGrid');
      return;
    }

    // Fallback to SMTP
    if (smtpHost && smtpUser) {
      const smtpPort = parseInt(this.configService.get<string>('SMTP_PORT') || '587', 10);
      const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');

      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });
      this.isConfigured = true;
      console.log('✅ Email service initialized with SMTP');
      return;
    }

    console.warn('⚠️  Email service is not configured. Set SENDGRID_API_KEY or SMTP settings in .env to enable email notifications.');
  }

  private async loadTemplate(templateName: string, context: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    
    try {
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const template = handlebars.compile(templateSource);
      return template(context);
    } catch (error) {
      console.error(`Failed to load email template ${templateName}:`, error);
      // Fallback to plain text
      return this.generatePlainTextEmail(templateName, context);
    }
  }

  private generatePlainTextEmail(templateName: string, context: Record<string, any>): string {
    // Simple fallback if template loading fails
    switch (templateName) {
      case 'welcome':
        return `Welcome to Flowvera, ${context.firstName}!\n\nYour free trial has started. You have ${context.trialDays} days to explore all features.`;
      case 'trial-expiring':
        return `Hi ${context.firstName},\n\nYour free trial expires in ${context.daysRemaining} days. Upgrade to continue using Flowvera.`;
      case 'payment-success':
        return `Hi ${context.firstName},\n\nYour payment of $${context.amount} was successful. Thank you for subscribing to Flowvera!`;
      case 'subscription-cancelled':
        return `Hi ${context.firstName},\n\nYour subscription has been cancelled. Your access will continue until ${context.endDate}.`;
      default:
        return JSON.stringify(context);
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isConfigured || !this.transporter) {
      console.log(`📧 [MOCK] Email would be sent to ${options.to}: ${options.subject}`);
      return false;
    }

    try {
      const html = await this.loadTemplate(options.template, options.context);
      const emailFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@flowvera.com';
      const emailFromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'Flowvera';

      await this.transporter.sendMail({
        from: `"${emailFromName}" <${emailFrom}>`,
        to: options.to,
        subject: options.subject,
        html: html,
      });

      console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Flowvera - Your Trial Has Started!',
      template: 'welcome',
      context: {
        firstName,
        trialDays: 14,
        loginUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/login`,
      },
    });
  }

  async sendTrialExpiringEmail(email: string, firstName: string, daysRemaining: number): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Your Flowvera Trial Expires in ${daysRemaining} Days`,
      template: 'trial-expiring',
      context: {
        firstName,
        daysRemaining,
        upgradeUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/subscription`,
      },
    });
  }

  async sendPaymentSuccessEmail(email: string, firstName: string, amount: number, plan: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Payment Successful - Thank You!',
      template: 'payment-success',
      context: {
        firstName,
        amount,
        plan,
        dashboardUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/dashboard`,
      },
    });
  }

  async sendSubscriptionCancelledEmail(email: string, firstName: string, endDate: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Subscription Cancelled',
      template: 'subscription-cancelled',
      context: {
        firstName,
        endDate,
        reactivateUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/subscription`,
      },
    });
  }

  async sendPaymentFailedEmail(email: string, firstName: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Payment Failed - Action Required',
      template: 'payment-failed',
      context: {
        firstName,
        billingUrl: `${this.configService.get('FRONTEND_URL') || 'http://localhost:3000'}/subscription`,
      },
    });
  }
}
