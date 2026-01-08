import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, ChangePasswordDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole as PrismaUserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
    // Create default admin user on startup
    this.initializeDefaultAdmin();
  }

  private async initializeDefaultAdmin() {
    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@flowvera.com';
    const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!';
    
    const existingAdmin = await this.findByEmail(adminEmail);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN' as PrismaUserRole,
          isActive: true,
        },
      });
      console.log(`✅ Default admin user created: ${adminEmail}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const dbUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        role: (createUserDto.role?.toUpperCase() || 'USER') as PrismaUserRole,
        isActive: true,
      },
    });

    return this.mapPrismaToUser(dbUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const dbUser = await this.prisma.user.findUnique({
      where: { email },
    });

    return dbUser ? this.mapPrismaToUser(dbUser) : undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const dbUser = await this.prisma.user.findUnique({
      where: { id },
    });

    return dbUser ? this.mapPrismaToUser(dbUser) : undefined;
  }

  async findAll(): Promise<User[]> {
    const dbUsers = await this.prisma.user.findMany();
    return dbUsers.map(user => this.mapPrismaToUser(user));
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const dbUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
      },
    });

    return this.mapPrismaToUser(dbUser);
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {};
    if (updateUserDto.firstName !== undefined) {
      updateData.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      updateData.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.role !== undefined) {
      updateData.role = updateUserDto.role.toUpperCase() as PrismaUserRole;
    }
    if (updateUserDto.isActive !== undefined) {
      updateData.isActive = updateUserDto.isActive;
    }

    const dbUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return this.mapPrismaToUser(dbUser);
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  // Helper method to map Prisma user to entity
  private mapPrismaToUser(dbUser: any): User {
    return {
      id: dbUser.id,
      email: dbUser.email,
      password: dbUser.password,
      firstName: dbUser.firstName,
      lastName: dbUser.lastName,
      role: dbUser.role.toLowerCase() as UserRole,
      isActive: dbUser.isActive,
      subscriptionId: undefined, // This would need to be fetched if needed
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt,
    };
  }
}
