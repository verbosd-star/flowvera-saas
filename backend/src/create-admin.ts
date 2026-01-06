import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

async function createAdminUser() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Check if admin user already exists
    const existingAdmin = await usersService.findByEmail('admin@flowvera.com');
    
    if (!existingAdmin) {
      // Create admin user
      const admin = await usersService.create({
        email: 'admin@flowvera.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('Email: admin@flowvera.com');
      console.log('Password: Admin123!');
      console.log('User ID:', admin.id);
    } else {
      console.log('ℹ️ Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await app.close();
  }
}

createAdminUser();
