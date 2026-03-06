# Prompt API Documentation

## Base URL

```
/api/promt
```

## Authentication

All endpoints require JWT token authentication.

---

## Endpoints

### 1. Create Prompt

**POST** `/api/promt/create`

Create a new prompt with optional image and file uploads.

#### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request Body (multipart/form-data)

```javascript
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (required)",
  "tags": "array of strings (optional)",
  "image": "file (optional)", // Image file for the prompt
  "file": "file (optional)"   // Additional file attachment
}
```

#### Response

**Status: 201 Created**

```json
{
  "message": "Prompt created successfully",
  "promt": {
    "id": "string",
    "title": "string",
    "description": "string",
    "image": "string (cloudinary URL)",
    "category": "string",
    "createdBy": {
      "id": "string",
      "username": "string",
      "profilePicture": "string"
    },
    "tags": ["string"],
    "file": "string (cloudinary URL)",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: User not found
- **400 Bad Request**: Failed to upload image/file
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X POST http://localhost:3000/api/promt/create \
  -H "Authorization: Bearer <your-token>" \
  -F "title=AI Art Generation Prompt" \
  -F "description=A detailed prompt for generating beautiful AI art" \
  -F "category=Art" \
  -F "tags=AI,Art,Creative" \
  -F "image=@/path/to/image.jpg"
```

---

### 2. Delete Prompt

**DELETE** `/api/promt/delete/:id`

Delete a prompt (only the creator can delete their own prompts).

#### Headers

```
Authorization: Bearer <token>
```

#### URL Parameters

- `id` (string, required): Prompt ID to delete

#### Response

**Status: 200 OK**

```json
{
  "message": "Prompt deleted successfully"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Prompt not found
- **403 Forbidden**: Not authorized to delete this prompt
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X DELETE http://localhost:3000/api/promt/delete/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>"
```

---

### 3. Update Prompt

**PUT** `/api/promt/update/:id`

Update an existing prompt (only the creator can update their own prompts).

#### Headers

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### URL Parameters

- `id` (string, required): Prompt ID to update

#### Request Body (multipart/form-data)

```javascript
{
  "title": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "tags": "array of strings (optional)",
  "image": "file (optional)", // New image file
  "file": "file (optional)"   // New file attachment
}
```

#### Response

**Status: 200 OK**

```json
{
  "message": "Prompt updated successfully",
  "promt": {
    "id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "category": "string",
    "createdBy": {
      "id": "string",
      "username": "string",
      "profilePicture": "string"
    },
    "tags": ["string"],
    "file": "string",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Prompt not found
- **403 Forbidden**: Not authorized to update this prompt
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X PUT http://localhost:3000/api/promt/update/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>" \
  -F "title=Updated AI Art Prompt" \
  -F "description=An updated description"
```

---

### 4. Get My Prompts

**GET** `/api/promt/my-prompts`

Retrieve all prompts created by the current user.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Status: 200 OK**

```json
[
  {
    "_id": "string",
    "title": "string",
    "description": "string",
    "image": "string",
    "category": "string",
    "file": "string",
    "createdBy": {
      "_id": "string",
      "username": "string",
      "profilePicture": "string"
    },
    "createdAt": "string",
    "updatedAt": "string",
    "tags": ["string"],
    "likes": ["string"],
    "comments": [
      {
        "user": "string",
        "comment": "string",
        "createdAt": "string",
        "_id": "string"
      }
    ],
    "isPublic": "boolean",
    "isfree": "boolean",
    "price": "number",
    "isActive": "boolean"
  }
]
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET http://localhost:3000/api/promt/my-prompts \
  -H "Authorization: Bearer <your-token>"
```

---

### 5. Get All Prompts

**GET** `/api/promt/all`

Retrieve all public prompts with pagination.

#### Headers

```
Authorization: Bearer <token>
```

#### Query Parameters

- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of prompts per page (default: 10)

#### Response

**Status: 200 OK**

```json
{
  "prompts": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "image": "string",
      "category": "string",
      "file": "string",
      "createdBy": {
        "_id": "string",
        "username": "string",
        "profilePicture": "string"
      },
      "createdAt": "string",
      "updatedAt": "string",
      "tags": ["string"],
      "likes": ["string"],
      "comments": [
        {
          "user": "string",
          "comment": "string",
          "createdAt": "string",
          "_id": "string"
        }
      ],
      "isPublic": "boolean",
      "isfree": "boolean",
      "price": "number",
      "isActive": "boolean"
    }
  ],
  "totalPages": "number",
  "currentPage": "number"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET "http://localhost:3000/api/promt/all?page=1&limit=5" \
  -H "Authorization: Bearer <your-token>"
```

---

### 6. Like/Unlike Prompt

**PUT** `/api/promt/like-dislike/:id`

Like or unlike a prompt. If already liked, it will unlike; if not liked, it will like.

#### Headers

```
Authorization: Bearer <token>
```

#### URL Parameters

- `id` (string, required): Prompt ID to like/unlike

#### Response

**Status: 200 OK**

**For Like:**

```json
{
  "message": "Prompt liked successfully",
  "likes": ["array of user IDs who liked"]
}
```

**For Unlike:**

```json
{
  "message": "Prompt unliked successfully",
  "likes": ["array of user IDs who liked"]
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Prompt not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X PUT http://localhost:3000/api/promt/like-dislike/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>"
```

---

### 7. Comment on Prompt

**POST** `/api/promt/comment/:id`

Add a comment to a prompt.

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### URL Parameters

- `id` (string, required): Prompt ID to comment on

#### Request Body

```json
{
  "comment": "string (required)"
}
```

#### Response

**Status: 200 OK**

```json
{
  "message": "Comment added successfully",
  "comments": [
    {
      "user": "string (user ID)",
      "comment": "string",
      "createdAt": "string (ISO date)",
      "_id": "string"
    }
  ],
  "user": {
    "id": "string",
    "username": "string",
    "profilePicture": "string"
  }
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Prompt not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X POST http://localhost:3000/api/promt/comment/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Great prompt! Very creative."}'
```

---

## Data Models

### Prompt Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  image: String (required, cloudinary URL),
  category: String (required),
  file: String (optional, cloudinary URL),
  createdBy: ObjectId (required, references User),
  createdAt: Date (default: now),
  updatedAt: Date (default: now),
  tags: [String] (default: []),
  likes: [ObjectId] (references User),
  comments: [
    {
      user: ObjectId (references User),
      comment: String (required),
      createdAt: Date (default: now)
    }
  ],
  isPublic: Boolean (default: true),
  isfree: Boolean (default: true),
  price: Number (default: 0),
  isActive: Boolean (default: true)
}
```

### Comment Schema (Subdocument)

```javascript
{
  user: ObjectId (references User),
  comment: String (required),
  createdAt: Date (default: now),
  _id: ObjectId (auto-generated)
}
```

---

## File Upload Specifications

### Supported File Types

- **Images**: JPG, JPEG, PNG, GIF, WebP
- **Files**: PDF, DOC, DOCX, TXT, and other document formats

### File Size Limits

- **Images**: Maximum 10MB
- **Files**: Maximum 10MB

### Storage

- All files are uploaded to Cloudinary
- Automatic optimization and format conversion
- CDN delivery for fast access

---

## Security Notes

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only modify their own prompts
3. **File Upload**: Secure file handling with type validation
4. **Input Sanitization**: All text inputs are trimmed and validated
5. **Auto-cleanup**: Cloudinary files are deleted when prompts are deleted

---

## Pagination

The `getAllPrompts` endpoint supports pagination:

- Default page size: 10 prompts
- Maximum page size: 50 prompts
- Results are sorted by creation date (newest first)

---

## Auto-Credit System

When a prompt receives 500+ likes, the creator automatically receives credits:

- 500+ likes: 10 credits
- System checks likes count on each like action
- Credits are added to user balance automatically

---

## Common Error Codes

- **400**: Bad Request - Invalid input or file upload error
- **401**: Unauthorized - Invalid or missing authentication
- **403**: Forbidden - Not authorized to perform action
- **404**: Not Found - Prompt not found
- **500**: Internal Server Error - Server-side error
