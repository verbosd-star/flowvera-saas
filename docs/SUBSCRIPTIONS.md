# Subscription API Documentation

## Overview

The Subscription API allows you to manage subscription plans and user subscriptions for the Flowvera SaaS platform. The API supports multiple subscription tiers with configurable limits and features.

## Base URL

```
http://localhost:3001/subscriptions
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

**Exception:** The `/subscriptions/plans` endpoint is public and doesn't require authentication.

---

## Endpoints

### 1. Get All Plans

**GET** `/subscriptions/plans`

Get a list of all available subscription plans with their features and pricing.

**Authentication:** Not required (public endpoint)

**Response:**

```json
[
  {
    "plan": "free_trial",
    "name": "Free Trial",
    "pricePerUser": 0,
    "description": "14 days free trial with full access",
    "limits": {
      "maxUsers": 5,
      "maxProjects": -1,
      "maxContacts": 500,
      "maxCompanies": 100,
      "storageGB": 1,
      "hasAdvancedCRM": false,
      "hasAdminPanel": false,
      "hasAnalytics": false,
      "hasAutomation": false,
      "hasIntegrations": false
    }
  },
  {
    "plan": "basic",
    "name": "Basic",
    "pricePerUser": 10,
    "description": "Perfect for small teams and freelancers",
    "limits": {
      "maxUsers": 5,
      "maxProjects": -1,
      "maxContacts": 500,
      "maxCompanies": 100,
      "storageGB": 1,
      "hasAdvancedCRM": false,
      "hasAdminPanel": false,
      "hasAnalytics": false,
      "hasAutomation": false,
      "hasIntegrations": false
    }
  },
  {
    "plan": "premium",
    "name": "Premium",
    "pricePerUser": 30,
    "description": "For growing teams with advanced needs",
    "limits": {
      "maxUsers": -1,
      "maxProjects": -1,
      "maxContacts": -1,
      "maxCompanies": -1,
      "storageGB": 10,
      "hasAdvancedCRM": true,
      "hasAdminPanel": true,
      "hasAnalytics": true,
      "hasAutomation": true,
      "hasIntegrations": true
    }
  },
  {
    "plan": "enterprise",
    "name": "Enterprise",
    "pricePerUser": 0,
    "description": "For large organizations with custom needs",
    "limits": {
      "maxUsers": -1,
      "maxProjects": -1,
      "maxContacts": -1,
      "maxCompanies": -1,
      "storageGB": -1,
      "hasAdvancedCRM": true,
      "hasAdminPanel": true,
      "hasAnalytics": true,
      "hasAutomation": true,
      "hasIntegrations": true
    }
  }
]
```

**Note:** `-1` indicates unlimited for that limit.

---

### 2. Create Subscription

**POST** `/subscriptions`

Create a new subscription for the authenticated user.

**Authentication:** Required

**Request Body:**

```json
{
  "plan": "free_trial"
}
```

**Parameters:**
- `plan` (string, required): The subscription plan. Valid values: `free_trial`, `basic`, `premium`, `enterprise`

**Response:**

```json
{
  "message": "Subscription created successfully",
  "subscription": {
    "id": "uuid",
    "userId": "user-uuid",
    "plan": "free_trial",
    "status": "trial",
    "startDate": "2026-01-06T19:00:00.000Z",
    "endDate": "2026-01-20T19:00:00.000Z",
    "trialEndsAt": "2026-01-20T19:00:00.000Z",
    "pricePerUser": 0,
    "currency": "USD",
    "limits": {
      "maxUsers": 5,
      "maxProjects": -1,
      "maxContacts": 500,
      "maxCompanies": 100,
      "storageGB": 1,
      "hasAdvancedCRM": false,
      "hasAdminPanel": false,
      "hasAnalytics": false,
      "hasAutomation": false,
      "hasIntegrations": false
    },
    "createdAt": "2026-01-06T19:00:00.000Z",
    "updatedAt": "2026-01-06T19:00:00.000Z"
  }
}
```

**Error Responses:**

- `400 Bad Request`: User already has an active subscription
- `401 Unauthorized`: Invalid or missing JWT token

---

### 3. Get Current Subscription

**GET** `/subscriptions`

Get the subscription details for the authenticated user.

**Authentication:** Required

**Response:**

```json
{
  "id": "uuid",
  "userId": "user-uuid",
  "plan": "free_trial",
  "planName": "Free Trial",
  "status": "trial",
  "startDate": "2026-01-06T19:00:00.000Z",
  "endDate": "2026-01-20T19:00:00.000Z",
  "trialEndsAt": "2026-01-20T19:00:00.000Z",
  "pricePerUser": 0,
  "currency": "USD",
  "limits": {
    "maxUsers": 5,
    "maxProjects": -1,
    "maxContacts": 500,
    "maxCompanies": 100,
    "storageGB": 1,
    "hasAdvancedCRM": false,
    "hasAdminPanel": false,
    "hasAnalytics": false,
    "hasAutomation": false,
    "hasIntegrations": false
  },
  "daysRemaining": 14,
  "isExpired": false
}
```

**Error Responses:**

- `404 Not Found`: No subscription found for user
- `401 Unauthorized`: Invalid or missing JWT token

---

### 4. Update Subscription

**PUT** `/subscriptions`

Update the subscription plan for the authenticated user (upgrade or downgrade).

**Authentication:** Required

**Request Body:**

```json
{
  "plan": "premium"
}
```

**Parameters:**
- `plan` (string, required): The new subscription plan. Valid values: `free_trial`, `basic`, `premium`, `enterprise`

**Response:**

```json
{
  "message": "Subscription updated successfully",
  "subscription": {
    "id": "uuid",
    "userId": "user-uuid",
    "plan": "premium",
    "status": "active",
    "startDate": "2026-01-06T19:00:00.000Z",
    "endDate": "2026-02-06T19:00:00.000Z",
    "pricePerUser": 30,
    "currency": "USD",
    "limits": {
      "maxUsers": -1,
      "maxProjects": -1,
      "maxContacts": -1,
      "maxCompanies": -1,
      "storageGB": 10,
      "hasAdvancedCRM": true,
      "hasAdminPanel": true,
      "hasAnalytics": true,
      "hasAutomation": true,
      "hasIntegrations": true
    },
    "createdAt": "2026-01-06T19:00:00.000Z",
    "updatedAt": "2026-01-06T19:00:00.000Z"
  }
}
```

**Error Responses:**

- `404 Not Found`: No subscription found for user
- `400 Bad Request`: Cannot update cancelled or expired subscription
- `401 Unauthorized`: Invalid or missing JWT token

---

### 5. Cancel Subscription

**POST** `/subscriptions/cancel`

Cancel the subscription for the authenticated user. The subscription will remain active until the end of the billing period.

**Authentication:** Required

**Response:**

```json
{
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": "uuid",
    "userId": "user-uuid",
    "plan": "premium",
    "status": "cancelled",
    "cancelledAt": "2026-01-06T19:00:00.000Z",
    "endDate": "2026-02-06T19:00:00.000Z",
    ...
  }
}
```

**Error Responses:**

- `404 Not Found`: No subscription found for user
- `400 Bad Request`: Subscription is already cancelled
- `401 Unauthorized`: Invalid or missing JWT token

---

## Subscription Status

A subscription can have one of the following statuses:

- `trial`: User is in free trial period
- `active`: Active paid subscription
- `inactive`: Subscription is inactive (not in use)
- `cancelled`: Subscription has been cancelled but still valid until end date
- `expired`: Subscription has expired

---

## Subscription Plans

### Free Trial
- **Duration**: 14 days
- **Price**: $0
- **Features**:
  - Up to 5 users
  - Unlimited projects
  - 500 contacts
  - 100 companies
  - 1 GB storage
  - Basic CRM features
  - No admin panel
  - No analytics
  - No automation
  - No integrations

### Basic
- **Price**: $10/user/month
- **Features**:
  - Up to 5 users
  - Unlimited projects
  - 500 contacts
  - 100 companies
  - 1 GB storage
  - Basic CRM features
  - No admin panel
  - No analytics
  - No automation
  - No integrations

### Premium
- **Price**: $30/user/month
- **Features**:
  - Unlimited users
  - Unlimited projects
  - Unlimited contacts
  - Unlimited companies
  - 10 GB storage
  - Advanced CRM features
  - Admin panel access
  - Analytics and reports
  - Automation workflows
  - Third-party integrations

### Enterprise
- **Price**: Custom pricing (contact sales)
- **Features**:
  - All Premium features
  - Unlimited storage
  - White-label capabilities
  - Dedicated support
  - Custom integrations
  - SLA guarantees
  - On-premise deployment options

---

## Example Usage

### Using cURL

**Get all plans:**

```bash
curl http://localhost:3001/subscriptions/plans
```

**Create a subscription:**

```bash
curl -X POST http://localhost:3001/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "free_trial"}'
```

**Get current subscription:**

```bash
curl http://localhost:3001/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Upgrade subscription:**

```bash
curl -X PUT http://localhost:3001/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan": "premium"}'
```

**Cancel subscription:**

```bash
curl -X POST http://localhost:3001/subscriptions/cancel \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Notes

- New users automatically receive a 14-day free trial subscription upon registration
- Subscription limits are enforced on the backend when creating/accessing resources
- The `endDate` is automatically calculated based on the billing cycle (monthly)
- Upgrading from free trial to a paid plan immediately changes status from `trial` to `active`
- A value of `-1` for any limit means unlimited
- All prices are in USD
- Subscriptions are stored in-memory and will be lost on server restart (until database integration is implemented)
