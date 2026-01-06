# 🚀 Flowvera

**Projects. Clients. Growth.**

Flowvera is an all-in-one SaaS platform that combines **project management (Monday-style)** with an **integrated CRM**, built for modern teams, agencies, and growing businesses.

---

## ✨ Features

- 🗂️ **Visual project boards** ✅
- 📋 **Monday-style task management** ✅
- 🤝 **Built-in CRM** ✅
- 🔐 **Secure authentication with JWT & RBAC** ✅
- ⚙️ **User settings & profile management** ✅
- 🎛️ **Admin control panel** ✅
- 💳 Subscription-based SaaS model

> ✅ = Implemented | 🚧 = In Progress | 📋 = Planned

---

## 🎯 Why Flowvera?

- One platform instead of multiple tools
- Simple, clean, modern UI
- Designed for scalability
- Built to sell

---

## 🧪 Free Trial

No credit card required.  
Upgrade anytime.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 + Tailwind CSS + TypeScript
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL (in-memory for now)
- **Auth**: JWT + RBAC with Passport.js ✅
- **Billing**: Stripe Subscriptions (planned)

---

## 🚧 Status

Flowvera is currently in active development.  
Feedback and contributions are welcome.

---

## 🔧 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production deployment)

### Getting Started

The project includes a complete authentication system with login, registration, and protected routes!

```bash
# Clone the repository
git clone https://github.com/verbosd-star/flowvera-saas.git
cd flowvera-saas

# Install all dependencies (root, frontend, and backend)
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit the .env files with your configuration

# Run both frontend and backend in development mode
npm run dev

# Or run them separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

**Try it out:**
1. Visit http://localhost:3000
2. Click "Get Started" to create an account
3. Access the protected dashboard
4. Navigate to Projects to manage your work
5. Navigate to CRM to manage contacts and companies
6. Navigate to Settings to update your profile and password
7. Test login/logout functionality

### Project Structure

```
flowvera-saas/
├── frontend/          # Next.js 16 + Tailwind CSS + TypeScript
├── backend/           # NestJS + TypeScript
├── docs/              # Documentation
└── package.json       # Root workspace configuration
```

### Development

```bash
# Frontend development (Next.js)
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint

# Backend development (NestJS)
cd backend
npm run start:dev    # Start with watch mode
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run ESLint
```

### Authentication

The authentication module is fully implemented! See detailed documentation:

- **[Authentication API Documentation](docs/AUTHENTICATION.md)** - API endpoints and usage
- **[Authentication Development Guide](docs/AUTHENTICATION_GUIDE.md)** - Implementation details and examples

**Features:**
- User registration and login
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected routes on frontend
- Password hashing with bcrypt
- Token-based session management

### CRM Module

The CRM module is now available for managing contacts and companies!

**API Endpoints (http://localhost:3001):**
- `POST /crm/contacts` - Create a new contact
- `GET /crm/contacts` - Get all contacts
- `GET /crm/contacts/:id` - Get a specific contact
- `PATCH /crm/contacts/:id` - Update a contact
- `DELETE /crm/contacts/:id` - Delete a contact
- `POST /crm/companies` - Create a new company
- `GET /crm/companies` - Get all companies
- `GET /crm/companies/:id` - Get a specific company
- `PATCH /crm/companies/:id` - Update a company
- `DELETE /crm/companies/:id` - Delete a company
- `GET /crm/companies/:id/contacts` - Get all contacts for a company

**Frontend Pages (http://localhost:3000):**
- `/crm/contacts` - Manage contacts
- `/crm/companies` - Manage companies

**Features:**
- Contact management with types (lead, prospect, client)
- Company management with industry and size tracking
- Contact-company associations
- JWT authentication on all endpoints
- Full CRUD operations

### Settings Module

User settings for profile and account management!

**API Endpoints (http://localhost:3001):**
- `PUT /settings/profile` - Update user profile (first name, last name)
- `PUT /settings/password` - Change user password (requires current password)

**Frontend Page (http://localhost:3000):**
- `/settings` - User settings with Profile and Password tabs

**Features:**
- Profile information updates (first name, last name)
- Secure password change with current password verification
- Form validation (new password must be ≥8 characters)
- Real-time state updates without page reload
- JWT authentication required
- Success/error feedback messages

### Admin Panel

User management for administrators!

**API Endpoints (http://localhost:3001):**
- `GET /admin/users` - Get all users (admin only)
- `PATCH /admin/users/:id` - Update user role or status (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)

**Frontend Page (http://localhost:3000):**
- `/admin` - Admin panel with user management

**Features:**
- View all registered users with their roles and status
- Edit user roles (user, manager, admin)
- Activate/deactivate user accounts
- Delete users with confirmation
- Prevents admins from deleting themselves
- JWT authentication and role-based access control
- Only accessible to users with admin role

**Default Admin Credentials:**
- Email: `admin@flowvera.com`
- Password: `Admin123!`
- Can be customized via environment variables

---

## 📈 Roadmap

See [ROADMAP.md](ROADMAP.md)

---

## 🚀 Deployment & Hosting

### Vercel (Frontend)

The frontend can be deployed to Vercel with automatic deployments from GitHub.

**Quick Setup:**
1. Import repository to Vercel
2. Set Root Directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy!

For detailed Vercel configuration, see [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md)

### Backend Deployment

For backend and full production deployment instructions, see [docs/HOSTING.md](docs/HOSTING.md)

---

## 📬 Contact

Interested in partnering or contributing?  
Open an issue or start a discussion.
