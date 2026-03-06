# Aifule Backend API Documentation

## Overview

The Aifule Backend API is a comprehensive RESTful service for managing users, prompts, and credits in an AI prompt sharing platform. The API supports user authentication, prompt creation and management, social features (likes, comments, following), and a credit system with automatic rewards.

## Base URL

```
http://localhost:3000/api
```

## API Modules

### 📁 [User API](./user-api.md)

**Base URL**: `/api/user`

Handles user management, authentication, and social features.

**Key Features:**

- User registration and login
- JWT-based authentication
- Profile management
- Follow/unfollow system
- User discovery

**Main Endpoints:**

- `POST /register` - Register new user
- `POST /login` - User authentication
- `GET /profile` - Get current user profile
- `PUT /update` - Update user profile
- `GET /all` - Get all users
- `PUT /follow/:id` - Follow/unfollow user

---

### 📁 [Prompt API](./prompt-api.md)

**Base URL**: `/api/promt`

Manages AI prompts with file uploads, social interactions, and content discovery.

**Key Features:**

- Create prompts with image/file uploads
- CRUD operations for prompts
- Like/unlike functionality
- Comment system
- Pagination support
- Cloudinary integration

**Main Endpoints:**

- `POST /create` - Create new prompt
- `GET /all` - Get all prompts (paginated)
- `GET /my-prompts` - Get user's prompts
- `PUT /like-dislike/:id` - Like/unlike prompt
- `POST /comment/:id` - Add comment
- `DELETE /delete/:id` - Delete prompt

---

### 📁 [Credit API](./credit-api.md)

**Base URL**: `/api/credit`

Manages the credit system with automatic rewards and admin controls.

**Key Features:**

- Credit/debit transactions
- Auto-credit for popular prompts
- Transaction history
- Admin-only manual credit management
- Balance tracking

**Main Endpoints:**

- `POST /create` - Create credit transaction (admin only)
- `GET /balance` - Get user balance
- `GET /history` - Get credit history
- `POST /check-credit/:promptId` - Trigger auto-credit check

---

## Global Features

### 🔐 Authentication

All API endpoints (except registration and login) require JWT authentication.

**Authentication Methods:**

1. **Cookie-based**: Token stored in HTTP-only cookie named "Aifule"
2. **Header-based**: `Authorization: Bearer <token>`

**Token Details:**

- **Validity**: 15 days
- **Algorithm**: HS256
- **Payload**: User ID and email

### 📤 File Uploads

The API supports file uploads through Cloudinary integration.

**Supported Operations:**

- Image uploads for prompts
- File attachments for prompts
- Automatic optimization and CDN delivery
- Secure URL generation

**File Specifications:**

- **Max Size**: 10MB per file
- **Formats**: Images (JPG, PNG, GIF, WebP), Documents (PDF, DOC, TXT)
- **Storage**: Cloudinary with folder organization

### 📊 Pagination

List endpoints support pagination for better performance.

**Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

**Response Format:**

```json
{
  "items": [...],
  "totalPages": 5,
  "currentPage": 1
}
```

---

## Quick Start Guide

### 1. User Registration

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "mobileNumber": "+1234567890",
    "password": "securepassword"
  }'
```

### 2. User Login

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepassword"
  }'
```

### 3. Create a Prompt

```bash
curl -X POST http://localhost:3000/api/promt/create \
  -H "Authorization: Bearer <your-token>" \
  -F "title=My AI Prompt" \
  -F "description=A creative AI prompt" \
  -F "category=Art" \
  -F "image=@/path/to/image.jpg"
```

### 4. Get All Prompts

```bash
curl -X GET "http://localhost:3000/api/promt/all?page=1&limit=10" \
  -H "Authorization: Bearer <your-token>"
```

### 5. Check Credit Balance

```bash
curl -X GET http://localhost:3000/api/credit/balance \
  -H "Authorization: Bearer <your-token>"
```

---

## Environment Setup

### Required Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/aifule

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3000
NODE_ENV=production
```

### Dependencies

```json
{
  "express": "^5.1.0",
  "mongoose": "^8.16.5",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "cloudinary": "^2.7.0",
  "multer": "^2.0.2",
  "cookie-parser": "^1.4.7",
  "dotenv": "^17.2.1"
}
```

---

## Data Flow

### User Journey

1. **Registration** → JWT token issued
2. **Login** → Token validation
3. **Create Prompt** → File upload to Cloudinary
4. **Social Interaction** → Likes, comments, follows
5. **Auto-Credit** → Rewards for popular content

### Credit System Flow

1. **Prompt Creation** → User creates content
2. **Community Engagement** → Other users like the prompt
3. **Auto-Reward** → 500+ likes triggers 10 credits
4. **Balance Update** → Credits added to user account
5. **Transaction Record** → History maintained

---

## Security Features

### 🛡️ Authentication & Authorization

- JWT-based stateless authentication
- Password hashing with bcryptjs (10 salt rounds)
- HTTP-only cookies for secure token storage
- Role-based access control (admin/user)

### 🔒 Data Validation

- Input sanitization and validation
- File type and size restrictions
- MongoDB injection prevention
- CORS protection

### 🚀 Performance

- Database indexing on frequently queried fields
- Pagination for large datasets
- Cloudinary CDN for fast file delivery
- Efficient MongoDB queries with population

---

## Error Handling

### Standard HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

### Error Response Format

```json
{
  "message": "Descriptive error message"
}
```

### Common Errors

- **Invalid JWT**: Token expired or malformed
- **Insufficient permissions**: User trying admin actions
- **File upload errors**: Size/type restrictions
- **Validation errors**: Missing required fields
- **Database errors**: Connection or query issues

---

## Rate Limiting (Recommended)

### Suggested Limits

```javascript
// Authentication endpoints
/api/user/register: 5 requests per 15 minutes per IP
/api/user/login: 5 requests per 15 minutes per IP

// Content creation
/api/promt/create: 10 requests per hour per user
/api/promt/comment/*: 30 requests per hour per user

// Social actions
/api/promt/like-dislike/*: 60 requests per hour per user
/api/user/follow/*: 20 requests per hour per user

// Admin actions
/api/credit/create: 10 requests per minute (admin only)
```

---

## Testing

### API Testing Tools

- **Postman**: Complete collection available
- **cURL**: Examples provided in documentation
- **Thunder Client**: VS Code extension
- **Insomnia**: REST client

### Test User Accounts

```json
{
  "admin": {
    "email": "admin@aifule.com",
    "password": "admin123",
    "userType": "admin"
  },
  "user": {
    "email": "user@aifule.com",
    "password": "user123",
    "userType": "user"
  }
}
```

---

## Monitoring & Logging

### Health Check

- **Endpoint**: `GET /health`
- **Response**: Server status and timestamp
- **Use**: Load balancer health checks

### Logging Levels

- **Error**: Server errors, authentication failures
- **Info**: User actions, credit transactions
- **Debug**: Database queries, file uploads

---

## Future Roadmap

### Planned Features

1. **Real-time Features**: WebSocket integration for live updates
2. **Advanced Search**: Full-text search with filters
3. **Monetization**: Paid prompts, subscriptions
4. **Analytics**: User engagement metrics
5. **Mobile API**: Optimized endpoints for mobile apps
6. **AI Integration**: Prompt quality scoring
7. **Marketplace**: Buy/sell premium prompts

### API Versioning

- **Current**: v1 (implicit)
- **Future**: `/api/v2/` for breaking changes
- **Deprecation**: 6-month notice for v1 endpoints

---

## Support & Resources

### Documentation Links

- [User API Documentation](./user-api.md)
- [Prompt API Documentation](./prompt-api.md)
- [Credit API Documentation](./credit-api.md)
- [Deployment Guide](../DEPLOYMENT.md)

### Contact Information

- **Developer**: aadi1232
- **Repository**: [Aifule-backend](https://github.com/aadi1232/Aifule-backend)
- **Issues**: GitHub Issues for bug reports and feature requests

---

## License

ISC License - See package.json for details.
