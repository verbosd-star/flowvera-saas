import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from './users/user.entity';
import { randomUUID } from 'crypto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  console.log('🌱 Starting database seed...');

  // Check if admin already exists
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@flowvera.com';
  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (existingAdmin) {
    console.log('✅ Admin user already exists');
  } else {
    // Create default admin user
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    
    await usersService.create({
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    });

    console.log('✅ Admin user created successfully');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
  }

  console.log('🎉 Seed completed!');
  await app.close();
}

bootstrap();
