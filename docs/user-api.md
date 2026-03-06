# User API Documentation

## Base URL

```
/api/user
```

## Authentication

Most endpoints require JWT token authentication. Include the token in cookies or Authorization header.

---

## Endpoints

### 1. Register User

**POST** `/api/user/register`

Register a new user account.

#### Request Body

```json
{
  "username": "string (required)",
  "email": "string (required)",
  "mobileNumber": "string (required)",
  "password": "string (required, min 6 chars)",
  "profilePicture": "string (optional)"
}
```

#### Response

**Status: 201 Created**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "mobileNumber": "string",
    "profilePicture": "string"
  },
  "token": "string"
}
```

#### Error Responses

- **400 Bad Request**: Missing required fields, user already exists, or mobile number already registered
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "mobileNumber": "+1234567890",
    "password": "securepassword"
  }'
```

---

### 2. Login User

**POST** `/api/user/login`

Authenticate user and get access token.

#### Request Body

```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

#### Response

**Status: 200 OK**

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "mobileNumber": "string",
    "profilePicture": "string"
  },
  "token": "string"
}
```

#### Error Responses

- **400 Bad Request**: Missing email or password
- **404 Not Found**: User not found
- **401 Unauthorized**: Invalid password
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

---

### 3. Get Current User Profile

**GET** `/api/user/profile`

Get the profile of the currently logged-in user.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Status: 200 OK**

```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "mobileNumber": "string",
    "profilePicture": "string",
    "bio": "string",
    "following": "number",
    "followers": "number"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <your-token>"
```

---

### 4. Update User Profile

**PUT** `/api/user/update`

Update the current user's profile information.

#### Headers

```
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "username": "string (optional)",
  "bio": "string (optional, max 250 chars)",
  "profilePicture": "string (optional)"
}
```

#### Response

**Status: 200 OK**

```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "mobileNumber": "string",
    "profilePicture": "string",
    "bio": "string"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X PUT http://localhost:3000/api/user/update \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newusername",
    "bio": "Updated bio description"
  }'
```

---

### 5. Get All Users

**GET** `/api/user/all`

Retrieve a list of all users (excluding passwords).

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Status: 200 OK**

```json
{
  "message": "All users retrieved successfully",
  "users": [
    {
      "id": "string",
      "username": "string",
      "email": "string",
      "mobileNumber": "string",
      "profilePicture": "string",
      "bio": "string",
      "userType": "string",
      "following": ["string"],
      "followers": ["string"],
      "balance": "number",
      "createdAt": "string",
      "isActive": "boolean"
    }
  ]
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET http://localhost:3000/api/user/all \
  -H "Authorization: Bearer <your-token>"
```

---

### 6. Follow/Unfollow User

**PUT** `/api/user/follow/:id`

Follow or unfollow a user. If already following, it will unfollow; if not following, it will follow.

#### Headers

```
Authorization: Bearer <token>
```

#### URL Parameters

- `id` (string, required): User ID to follow/unfollow

#### Response

**Status: 200 OK**

**For Follow:**

```json
{
  "message": "Followed successfully",
  "user": {
    "id": "string",
    "username": "string",
    "followers": "number",
    "following": "number"
  }
}
```

**For Unfollow:**

```json
{
  "message": "Unfollowed successfully",
  "user": {
    "id": "string",
    "username": "string",
    "followers": "number",
    "following": "number"
  }
}
```

#### Error Responses

- **400 Bad Request**: Missing user ID
- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: User to follow not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X PUT http://localhost:3000/api/user/follow/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>"
```

---

## Data Models

### User Schema

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique, lowercase),
  mobileNumber: String (required, unique),
  password: String (required, min 6 chars, hashed),
  userType: String (enum: ["admin", "user"], default: "user"),
  Email_verification: Boolean (default: false),
  following: [ObjectId] (references to User),
  followers: [ObjectId] (references to User),
  profilePicture: String (auto-generated if not provided),
  bio: String (max 250 chars),
  isActive: Boolean (default: true),
  balance: Number (default: 0),
  createdAt: Date (default: now)
}
```

---

## Security Notes

1. **Passwords**: Automatically hashed using bcryptjs with salt rounds of 10
2. **JWT Tokens**: Valid for 15 days
3. **Cookies**: HTTP-only cookies used for token storage
4. **Profile Pictures**: Auto-generated SVG avatars if not provided
5. **Input Validation**: All required fields validated before processing

---

## Rate Limiting

Consider implementing rate limiting for:

- Registration: 5 requests per 15 minutes per IP
- Login: 5 requests per 15 minutes per IP
- Follow/Unfollow: 10 requests per minute per user

---

## Common Error Codes

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid or missing authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **500**: Internal Server Error - Server-side error
