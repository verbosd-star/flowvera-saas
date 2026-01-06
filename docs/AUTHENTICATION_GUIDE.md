# Authentication Module - Development Guide

This guide explains how to use and extend the authentication module in Flowvera.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Structure](#backend-structure)
3. [Frontend Structure](#frontend-structure)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Extending the Module](#extending-the-module)

## Architecture Overview

The authentication module follows a modern, secure architecture:

- **Backend**: NestJS with JWT-based authentication
- **Frontend**: Next.js with React Context for state management
- **Storage**: In-memory storage (will be replaced with PostgreSQL)
- **Security**: bcrypt for password hashing, JWT for token-based auth
- **Authorization**: Role-Based Access Control (RBAC)

## Backend Structure

```
backend/src/
├── auth/
│   ├── decorators/
│   │   ├── current-user.decorator.ts    # Extract current user from request
│   │   └── roles.decorator.ts           # Define required roles for endpoints
│   ├── dto/
│   │   ├── login.dto.ts                 # Login validation
│   │   └── register.dto.ts              # Registration validation
│   ├── guards/
│   │   ├── jwt-auth.guard.ts            # JWT authentication guard
│   │   └── roles.guard.ts               # Role-based authorization guard
│   ├── strategies/
│   │   └── jwt.strategy.ts              # Passport JWT strategy
│   ├── auth.controller.ts               # Authentication endpoints
│   ├── auth.module.ts                   # Auth module configuration
│   ├── auth.service.ts                  # Authentication business logic
│   └── auth.service.spec.ts             # Unit tests
└── users/
    ├── dto/
    │   └── create-user.dto.ts           # User creation validation
    ├── user.entity.ts                   # User entity definition
    ├── users.module.ts                  # Users module configuration
    └── users.service.ts                 # User management service
```

## Frontend Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   └── page.tsx                     # Protected dashboard page
│   ├── login/
│   │   └── page.tsx                     # Login page
│   ├── register/
│   │   └── page.tsx                     # Registration page
│   ├── layout.tsx                       # Root layout with AuthProvider
│   └── page.tsx                         # Home page
├── components/
│   └── auth/
│       └── ProtectedRoute.tsx           # HOC for protected routes
├── contexts/
│   └── AuthContext.tsx                  # Authentication context & hook
├── lib/
│   └── api/
│       ├── auth.ts                      # Auth API methods
│       └── client.ts                    # Axios client with interceptors
└── types/
    └── auth.ts                          # TypeScript interfaces
```

## Usage Examples

### Backend: Protecting Routes

#### Using JWT Auth Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller('projects')
export class ProjectsController {
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@CurrentUser() user: any) {
    // user object contains: { id, email, role, firstName, lastName }
    return `User ${user.email} is accessing projects`;
  }
}
```

#### Using Roles Guard

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { Roles } from './auth/decorators/roles.decorator';
import { UserRole } from './users/user.entity';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Get('users')
  @Roles(UserRole.ADMIN)
  getAllUsers() {
    return 'Only admins can see this';
  }

  @Get('stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  getStats() {
    return 'Admins and managers can see this';
  }
}
```

### Frontend: Using Authentication

#### In a Component

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName || user?.email}!</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Creating a Protected Page

```tsx
'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
}
```

#### Making Authenticated API Calls

```tsx
import apiClient from '@/lib/api/client';

// The token is automatically added by the axios interceptor
async function fetchMyData() {
  try {
    const response = await apiClient.get('/my-endpoint');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}
```

## Testing

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run specific test file
npm test -- auth.service.spec.ts

# Run tests with coverage
npm run test:cov
```

### Manual Testing

1. Start the backend:
   ```bash
   cd backend
   npm run start:dev
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Test the flow:
   - Visit http://localhost:3000
   - Click "Get Started" to register
   - Fill in the registration form
   - You should be redirected to the dashboard
   - Navigate to Projects (http://localhost:3000/projects)
   - Navigate to CRM (http://localhost:3000/crm/contacts)
   - Navigate to Settings (http://localhost:3000/settings)
   - Try logging out and logging back in

## Extending the Module

### Adding a New Role

1. Update the `UserRole` enum in `backend/src/users/user.entity.ts`:
   ```typescript
   export enum UserRole {
     ADMIN = 'admin',
     USER = 'user',
     MANAGER = 'manager',
     CUSTOM_ROLE = 'custom_role', // Add your role here
   }
   ```

2. Use the role in your controllers:
   ```typescript
   @Roles(UserRole.CUSTOM_ROLE)
   @Get('custom-endpoint')
   customEndpoint() {
     return 'Only custom role can access this';
   }
   ```

### Adding Email Verification

To add email verification:

1. Update `User` entity to include `emailVerified` field
2. Create email service for sending verification emails
3. Add verification token generation in `auth.service.ts`
4. Create `/auth/verify-email/:token` endpoint
5. Update registration flow to send verification email

### Adding Password Reset

To add password reset functionality:

1. Create `ForgotPasswordDto` and `ResetPasswordDto`
2. Add reset token field to User entity
3. Create password reset endpoints in auth controller
4. Implement email sending for reset links
5. Add frontend pages for forgot password and reset password

### Migrating to Database

To replace in-memory storage with PostgreSQL:

1. Install dependencies:
   ```bash
   npm install @nestjs/typeorm typeorm pg
   ```

2. Update `User` entity to use TypeORM decorators:
   ```typescript
   import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
   
   @Entity('users')
   export class User {
     @PrimaryGeneratedColumn('uuid')
     id: string;
     
     @Column({ unique: true })
     email: string;
     
     // ... other fields
   }
   ```

3. Update `UsersService` to use repository pattern
4. Configure TypeORM in `app.module.ts`

### Adding OAuth (Google, GitHub)

To add OAuth providers:

1. Install dependencies:
   ```bash
   npm install @nestjs/passport passport-google-oauth20 passport-github2
   ```

2. Create OAuth strategies (similar to JWT strategy)
3. Add OAuth routes in auth controller
4. Add OAuth buttons to login/register pages

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong JWT secrets** - Generate random strings for production
3. **Implement rate limiting** - Prevent brute force attacks
4. **Add refresh tokens** - For better security and UX
5. **Validate all inputs** - Use DTOs with class-validator
6. **Hash passwords properly** - Use bcrypt with appropriate salt rounds
7. **Use HTTPS in production** - Never send tokens over HTTP
8. **Implement CSRF protection** - For cookie-based auth
9. **Add logging** - Track authentication events
10. **Regular security audits** - Keep dependencies updated

## Troubleshooting

### Common Issues

**Issue**: "JWT malformed" error
- **Solution**: Check that the token is properly formatted and not expired

**Issue**: CORS errors
- **Solution**: Verify `FRONTEND_URL` in backend `.env` matches your frontend URL

**Issue**: "User not found" after login
- **Solution**: Check that the user was properly saved and the token payload matches

**Issue**: Protected routes not working
- **Solution**: Ensure AuthProvider wraps your app in layout.tsx

## Next Steps

- [ ] Implement database persistence with PostgreSQL
- [ ] Add email verification
- [ ] Add password reset functionality
- [ ] Implement refresh tokens
- [ ] Add OAuth providers (Google, GitHub)
- [ ] Add rate limiting
- [ ] Implement session management
- [ ] Add audit logging
- [ ] Create admin panel for user management
