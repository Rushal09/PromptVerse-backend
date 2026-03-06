# Credit API Documentation

## Base URL

```
/api/credit
```

## Authentication

All endpoints require JWT token authentication.

---

## Endpoints

### 1. Create Credit Transaction

**POST** `/api/credit/create`

Create a new credit transaction (admin only). Can be used to add or deduct credits from a user's account.

#### Headers

```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request Body

```json
{
  "userId": "string (required)", // User ID to credit/debit
  "amount": "number (required)", // Amount to credit/debit (must be > 0)
  "transactionType": "string (required)", // "credit" or "debit"
  "description": "string (required)" // Description of the transaction
}
```

#### Response

**Status: 201 Created**

```json
{
  "message": "Credit created successfully",
  "credit": {
    "_id": "string",
    "userId": "string",
    "amount": "number",
    "transactionType": "string",
    "description": "string",
    "balance": "number",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  },
  "userBalance": "number"
}
```

#### Error Responses

- **400 Bad Request**: Missing required fields, invalid transaction type, invalid amount, or insufficient balance for debit
- **401 Unauthorized**: Invalid or missing token
- **403 Forbidden**: User is not admin
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X POST http://localhost:3000/api/credit/create \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "64a7b123c456789012345678",
    "amount": 50,
    "transactionType": "credit",
    "description": "Bonus credits for excellent prompt"
  }'
```

---

### 2. Check and Credit Popular Prompts

**POST** `/api/credit/check-credit/:promptId`

Manually trigger the check for popular prompts and auto-credit system.

#### Headers

```
Authorization: Bearer <token>
```

#### URL Parameters

- `promptId` (string, required): Prompt ID to check for auto-crediting

#### Response

**Status: 200 OK**

```json
{
  "message": "Check and credit process completed"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: Prompt not found
- **500 Internal Server Error**: Server error

#### Auto-Credit Logic

- Automatically credits 10 points when a prompt reaches 500+ likes
- Credits are added to the prompt creator's balance
- Creates a credit transaction record with description "Auto credit for popular prompt"

#### Example

```bash
curl -X POST http://localhost:3000/api/credit/check-credit/64a7b123c456789012345678 \
  -H "Authorization: Bearer <your-token>"
```

---

### 3. Get Credit History

**GET** `/api/credit/history`

Retrieve the credit transaction history for the current user.

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
    "userId": "string",
    "amount": "number",
    "transactionType": "string", // "credit" or "debit"
    "description": "string",
    "balance": "number",
    "createdAt": "string (ISO date)",
    "updatedAt": "string (ISO date)"
  }
]
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET http://localhost:3000/api/credit/history \
  -H "Authorization: Bearer <your-token>"
```

---

### 4. Get User Balance

**GET** `/api/credit/balance`

Get the current credit balance for the authenticated user.

#### Headers

```
Authorization: Bearer <token>
```

#### Response

**Status: 200 OK**

```json
{
  "balance": "number"
}
```

#### Error Responses

- **401 Unauthorized**: Invalid or missing token
- **404 Not Found**: User not found
- **500 Internal Server Error**: Server error

#### Example

```bash
curl -X GET http://localhost:3000/api/credit/balance \
  -H "Authorization: Bearer <your-token>"
```

---

## Data Models

### Credit Schema

```javascript
{
  _id: ObjectId,
  userId: ObjectId (required, references User),
  balance: Number (required, default: 0),
  amount: Number (required),
  transactionType: String (required, enum: ["credit", "debit"]),
  description: String (required),
  createdAt: Date (default: now),
  updatedAt: Date (default: now)
}
```

### User Balance Field

```javascript
{
  balance: Number (default: 0) // Updated automatically with each transaction
}
```

---

## Transaction Types

### Credit Transaction

- **Type**: `"credit"`
- **Effect**: Adds the specified amount to user's balance
- **Use Cases**:
  - Reward for popular prompts
  - Admin bonuses
  - Promotional credits
  - Refunds

### Debit Transaction

- **Type**: `"debit"`
- **Effect**: Subtracts the specified amount from user's balance
- **Validation**: Ensures user has sufficient balance
- **Use Cases**:
  - Purchase premium prompts
  - Service charges
  - Admin penalties

---

## Auto-Credit System

### Popular Prompt Auto-Credit

The system automatically awards credits to users whose prompts become popular:

#### Trigger Conditions

- **500+ likes**: 10 credits awarded automatically
- **Future scaling**: System designed to handle incremental rewards (1000 likes, 1500 likes, etc.)

#### Process Flow

1. User creates a prompt
2. Other users like the prompt
3. When likes reach 500, auto-credit is triggered
4. 10 credits added to creator's balance
5. Credit transaction record created
6. User receives notification (future feature)

#### Implementation

```javascript
// Automatic credit logic
if (prompt.likes.length >= 500) {
  // Award 10 credits to prompt creator
  user.balance += 10;

  // Create transaction record
  const creditTransaction = new Credit({
    userId: prompt.createdBy,
    amount: 10,
    transactionType: "credit",
    description: "Auto credit for popular prompt",
  });
}
```

---

## Admin Functions

### Admin-Only Operations

- **Create Credit/Debit**: Only users with `userType: "admin"` can create manual credit transactions
- **Bulk Operations**: Admins can credit/debit any user's account
- **System Management**: Monitor and manage the overall credit economy

### Admin Validation

```javascript
if (req.user.userType !== "admin") {
  return res.status(403).json({
    message: "You are not authorized to perform this action",
  });
}
```

---

## Security Notes

1. **Admin Authorization**: Only admin users can create manual credit transactions
2. **Balance Validation**: Debit transactions validate sufficient balance
3. **Transaction Integrity**: All balance updates are atomic operations
4. **Audit Trail**: Complete transaction history maintained
5. **Input Validation**: All amounts must be positive numbers

---

## Business Rules

### Credit Economy

- **Starting Balance**: New users start with 0 credits
- **Earning Credits**:
  - Popular prompts (500+ likes): 10 credits
  - Admin rewards: Variable amounts
  - Future: Prompt sales, referrals, etc.
- **Spending Credits**:
  - Future: Premium prompts, advanced features
  - Current: Admin deductions only

### Balance Management

- **Minimum Balance**: Cannot go below 0 (debit validation prevents this)
- **Maximum Balance**: No limit (but could be implemented if needed)
- **Precision**: Integer values only (no decimal credits)

---

## Future Enhancements

### Planned Features

1. **Tiered Rewards**: Different credit amounts for different like milestones
2. **Prompt Marketplace**: Spend credits to purchase premium prompts
3. **Subscription Models**: Monthly credit allowances
4. **Referral System**: Credits for bringing new users
5. **Achievement System**: Credits for various platform activities

### API Extensibility

The current API is designed to support future features:

- Transaction categories/types
- Bulk operations
- Credit expiration
- Exchange rates
- Promotional campaigns

---

## Error Handling

### Common Error Scenarios

1. **Insufficient Balance**: When trying to debit more than available
2. **Invalid Amount**: Negative or zero amounts
3. **User Not Found**: Invalid user ID in credit creation
4. **Permission Denied**: Non-admin trying to create credits
5. **Prompt Not Found**: Invalid prompt ID in auto-credit check

### Error Response Format

```json
{
  "message": "Descriptive error message"
}
```

---

## Rate Limiting Recommendations

### Suggested Limits

- **Credit Creation**: 10 requests per minute (admin only)
- **Balance Check**: 60 requests per minute per user
- **History Retrieval**: 20 requests per minute per user
- **Auto-Credit Check**: 5 requests per minute per prompt

---

## Common Error Codes

- **400**: Bad Request - Invalid input data or business rule violation
- **401**: Unauthorized - Invalid or missing authentication
- **403**: Forbidden - Insufficient permissions (non-admin)
- **404**: Not Found - User or prompt not found
- **500**: Internal Server Error - Server-side error
