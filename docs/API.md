# API Documentation

This document provides comprehensive information about the Mu3een API endpoints, request/response formats, and authentication.

## Table of Contents

- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Webhooks](#webhooks)
- [SDK Examples](#sdk-examples)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Authentication Flow

1. **Login**: Send credentials to `/api/auth/login`
2. **Receive Token**: Get JWT token and refresh token
3. **Use Token**: Include token in subsequent requests
4. **Refresh Token**: Use refresh token to get new JWT token

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/login

Login with email and password.

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-123"
  }
}
```

#### POST /api/auth/register

Register a new user.

**Request:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-123"
  }
}
```

#### POST /api/auth/logout

Logout and invalidate token.

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### POST /api/auth/refresh

Refresh JWT token using refresh token.

**Request:**

```json
{
  "refreshToken": "refresh-token-123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "new-refresh-token-123"
  }
}
```

### User Endpoints

#### GET /api/users

Get list of users with pagination.

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search term
- `role` (string): Filter by role
- `status` (string): Filter by status

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET /api/users/:id

Get user by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### PUT /api/users/:id

Update user information.

**Request:**

```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "john.smith@example.com",
    "name": "John Smith",
    "role": "admin",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### DELETE /api/users/:id

Delete user.

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

### Channel Endpoints

#### GET /api/channels

Get list of channels.

**Query Parameters:**

- `page` (number): Page number
- `limit` (number): Items per page
- `type` (string): Filter by channel type
- `search` (string): Search term

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "channel-123",
      "name": "General",
      "description": "General discussion channel",
      "type": "public",
      "members": ["user-123", "user-456"],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### POST /api/channels

Create a new channel.

**Request:**

```json
{
  "name": "New Channel",
  "description": "Channel description",
  "type": "public",
  "members": ["user-123", "user-456"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "channel-123",
    "name": "New Channel",
    "description": "Channel description",
    "type": "public",
    "members": ["user-123", "user-456"],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### GET /api/channels/:id

Get channel by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "channel-123",
    "name": "General",
    "description": "General discussion channel",
    "type": "public",
    "members": ["user-123", "user-456"],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  }
}
```

#### PUT /api/channels/:id

Update channel.

**Request:**

```json
{
  "name": "Updated Channel Name",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "channel-123",
    "name": "Updated Channel Name",
    "description": "Updated description",
    "type": "public",
    "members": ["user-123", "user-456"],
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T12:00:00Z"
  }
}
```

#### DELETE /api/channels/:id

Delete channel.

**Response:**

```json
{
  "success": true,
  "message": "Channel deleted successfully"
}
```

### Message Endpoints

#### GET /api/channels/:channelId/messages

Get messages for a channel.

**Query Parameters:**

- `page` (number): Page number
- `limit` (number): Items per page
- `before` (string): Get messages before this ID
- `after` (string): Get messages after this ID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "message-123",
      "content": "Hello, world!",
      "channelId": "channel-123",
      "userId": "user-123",
      "timestamp": "2023-01-01T00:00:00Z",
      "edited": false,
      "deleted": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### POST /api/channels/:channelId/messages

Send a message to a channel.

**Request:**

```json
{
  "content": "Hello, world!",
  "replyTo": "message-456"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "message-123",
    "content": "Hello, world!",
    "channelId": "channel-123",
    "userId": "user-123",
    "timestamp": "2023-01-01T00:00:00Z",
    "edited": false,
    "deleted": false
  }
}
```

#### PUT /api/messages/:id

Update a message.

**Request:**

```json
{
  "content": "Updated message content"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "message-123",
    "content": "Updated message content",
    "channelId": "channel-123",
    "userId": "user-123",
    "timestamp": "2023-01-01T00:00:00Z",
    "edited": true,
    "deleted": false
  }
}
```

#### DELETE /api/messages/:id

Delete a message.

**Response:**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### Settings Endpoints

#### GET /api/settings

Get user settings.

**Response:**

```json
{
  "success": true,
  "data": {
    "theme": "light",
    "language": "en",
    "notifications": {
      "email": true,
      "push": true,
      "sound": true
    },
    "privacy": {
      "showOnlineStatus": true,
      "allowDirectMessages": true
    }
  }
}
```

#### PUT /api/settings

Update user settings.

**Request:**

```json
{
  "theme": "dark",
  "notifications": {
    "email": false,
    "push": true,
    "sound": false
  }
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": {
      "email": false,
      "push": true,
      "sound": false
    },
    "privacy": {
      "showOnlineStatus": true,
      "allowDirectMessages": true
    }
  }
}
```

## Error Handling

### Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_REQUIRED` - Authentication required
- `INVALID_CREDENTIALS` - Invalid login credentials
- `TOKEN_EXPIRED` - JWT token expired
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `DUPLICATE_RESOURCE` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Rate limit exceeded

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Webhook Events

- `user.created` - User account created
- `user.updated` - User information updated
- `user.deleted` - User account deleted
- `channel.created` - Channel created
- `channel.updated` - Channel updated
- `channel.deleted` - Channel deleted
- `message.sent` - Message sent
- `message.updated` - Message updated
- `message.deleted` - Message deleted

### Webhook Payload

```json
{
  "id": "webhook-123",
  "type": "user.created",
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "timestamp": "2023-01-01T00:00:00Z",
  "processed": false
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { Mu3eenAPI } from '@mu3een/sdk';

const api = new Mu3eenAPI({
  baseURL: 'https://api.mu3een.com',
  apiKey: 'your-api-key',
});

// Login
const { data } = await api.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

// Get users
const users = await api.users.list({
  page: 1,
  limit: 20,
});

// Send message
const message = await api.messages.create('channel-123', {
  content: 'Hello, world!',
});
```

### Python

```python
from mu3een import Mu3eenAPI

api = Mu3eenAPI(
    base_url='https://api.mu3een.com',
    api_key='your-api-key'
)

# Login
response = api.auth.login(
    email='user@example.com',
    password='password123'
)

# Get users
users = api.users.list(page=1, limit=20)

# Send message
message = api.messages.create('channel-123', {
    'content': 'Hello, world!'
})
```

### cURL Examples

```bash
# Login
curl -X POST https://api.mu3een.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get users
curl -X GET https://api.mu3een.com/api/users \
  -H "Authorization: Bearer your-jwt-token"

# Send message
curl -X POST https://api.mu3een.com/api/channels/channel-123/messages \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello, world!"}'
```
