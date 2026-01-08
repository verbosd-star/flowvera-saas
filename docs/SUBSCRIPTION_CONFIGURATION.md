# Subscription System Configuration Guide

This guide explains how to configure and use the subscription system with database persistence, Stripe payments, and email notifications.

## Database Configuration

### Development (SQLite)
The system uses SQLite by default for easy development. No additional setup required.

```env
DATABASE_URL="file:./dev.db"
```

### Production (PostgreSQL)
For production, switch to PostgreSQL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/flowvera?schema=public"
```

Then update `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
}
```

Run migrations:
```bash
cd backend
npx prisma migrate deploy
```

## Stripe Configuration

### 1. Create a Stripe Account
1. Sign up at https://stripe.com
2. Get your API keys from the Stripe Dashboard

### 2. Create Products and Prices
Create products in Stripe for each subscription plan:

**Basic Plan ($10/month):**
```bash
stripe products create --name "Flowvera Basic" --description "Perfect for small teams"
stripe prices create --product <PRODUCT_ID> --unit-amount 1000 --currency usd --recurring interval=month
```

**Premium Plan ($30/month):**
```bash
stripe products create --name "Flowvera Premium" --description "For growing teams"
stripe prices create --product <PRODUCT_ID> --unit-amount 3000 --currency usd --recurring interval=month
```

### 3. Configure Environment Variables

Add to `backend/.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic_monthly_id
STRIPE_PREMIUM_PRICE_ID=price_premium_monthly_id
```

### 4. Set Up Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/stripe/webhook`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Test Webhooks Locally

Use Stripe CLI for local testing:

```bash
stripe listen --forward-to localhost:3001/stripe/webhook
```

## Email Configuration

### Option 1: SendGrid (Recommended)

1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email/domain
4. Configure in `.env`:

```env
EMAIL_FROM=noreply@your-domain.com
EMAIL_FROM_NAME=Flowvera
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Option 2: SMTP (Gmail, Outlook, etc.)

For Gmail:
1. Enable 2-factor authentication
2. Create an App Password
3. Configure in `.env`:

```env
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Flowvera
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
```

For other SMTP providers, adjust the host and port accordingly.

## API Endpoints

### Subscription Endpoints

#### Get Available Plans
```http
GET /subscriptions/plans
```
Public endpoint, no authentication required.

#### Create Subscription
```http
POST /subscriptions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "plan": "free_trial"
}
```

#### Get Current Subscription
```http
GET /subscriptions
Authorization: Bearer <jwt_token>
```

#### Update Subscription
```http
PUT /subscriptions
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "plan": "premium"
}
```

#### Cancel Subscription
```http
POST /subscriptions/cancel
Authorization: Bearer <jwt_token>
```

### Stripe Payment Endpoints

#### Create Checkout Session
```http
POST /stripe/create-checkout-session
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "plan": "basic"
}
```

Response:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

Redirect the user to the `url` to complete payment.

#### Create Billing Portal Session
```http
POST /stripe/create-portal-session
Authorization: Bearer <jwt_token>
```

Response:
```json
{
  "url": "https://billing.stripe.com/session/..."
}
```

Redirect the user to manage their billing and payment methods.

## Email Templates

Email templates are located in `backend/src/email/templates/`:

- `welcome.hbs` - Sent when user registers
- `trial-expiring.hbs` - Sent when trial is about to expire
- `payment-success.hbs` - Sent after successful payment
- `subscription-cancelled.hbs` - Sent when subscription is cancelled
- `payment-failed.hbs` - Sent when payment fails

Templates use Handlebars syntax and can be customized with your branding.

## Testing

### Test Registration Flow
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

This will:
1. Create a user account
2. Create a free trial subscription
3. Send a welcome email (if configured)

### Test Stripe Checkout
1. Register and log in to get a JWT token
2. Call `/stripe/create-checkout-session` with the token
3. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Failure: `4000 0000 0000 0002`

### Test Emails Locally
Without configuring a real email service, emails will be logged to the console with `[MOCK]` prefix.

## Deployment Checklist

- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure Stripe with production API keys
- [ ] Configure email service (SendGrid or SMTP)
- [ ] Set up Stripe webhooks pointing to production URL
- [ ] Update `FRONTEND_URL` environment variable
- [ ] Set a strong `JWT_SECRET`
- [ ] Run database migrations
- [ ] Test registration, payment, and email flows
- [ ] Monitor webhook events in Stripe Dashboard

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL is correctly formatted
- For PostgreSQL, ensure the database exists
- Check network connectivity and firewall rules

### Stripe Webhook Not Working
- Verify webhook signing secret matches
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing
- Review Stripe Dashboard for webhook delivery logs

### Emails Not Sending
- Verify email credentials are correct
- Check SendGrid or SMTP provider status
- Look for authentication errors in logs
- For Gmail, ensure App Passwords are enabled

### Payment Not Processing
- Verify Stripe API keys are correct
- Check price IDs match products in Stripe
- Test with Stripe test cards first
- Review Stripe Dashboard for payment logs

## Support

For issues or questions:
- Check the logs: `npm run start:dev` in backend directory
- Review Stripe Dashboard events
- Check email provider logs
- Contact support at support@flowvera.com
