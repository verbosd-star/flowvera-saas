# Authentication API Documentation

This document describes the authentication endpoints available in the Flowvera API.

## Base URL

```
http://localhost:3001
```

## Endpoints

### 1. Register a New User

**POST** `/auth/register`

Create a new user account.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response (201 Created)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Error Responses

- **400 Bad Request**: Validation errors
- **409 Conflict**: User with this email already exists

---

### 2. Login

**POST** `/auth/login`

Authenticate an existing user.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response (200 OK)

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid credentials or inactive account

---

### 3. Get User Profile

**GET** `/auth/profile`

Get the authenticated user's profile information.

#### Headers

```
Authorization: Bearer <access_token>
```

#### Response (200 OK)

```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "user"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token

---

## Authentication Flow

1. **Register** or **Login** to receive an access token
2. Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <access_token>
   ```
3. Token expires after 7 days (configurable)

## User Roles

The system supports Role-Based Access Control (RBAC) with the following roles:

- **user**: Standard user with basic permissions
- **manager**: Manager with elevated permissions
- **admin**: Administrator with full permissions

## Password Requirements

- Minimum 8 characters
- Required for registration and login

## Validation Rules

### Email
- Must be a valid email format
- Required field

### Password
- Minimum 8 characters
- Required field

### First Name & Last Name
- Optional fields
- String type

## Security Features

- Passwords are hashed using bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- CORS enabled for frontend communication
- Global validation pipes for request validation
- Protected routes require valid JWT token

## Example Usage

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get profile (requires token)
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer <your_token_here>"
```

### Using JavaScript (Axios)

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Register
const registerResponse = await axios.post(`${API_URL}/auth/register`, {
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
});

const token = registerResponse.data.access_token;

// Get profile
const profileResponse = await axios.get(`${API_URL}/auth/profile`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## Environment Variables

Configure the following environment variables in your `.env` file:

```env
# Application
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production-use-strong-random-string
JWT_EXPIRES_IN=7d
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!
