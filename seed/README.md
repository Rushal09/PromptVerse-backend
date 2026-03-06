# Seed Data Scripts

This directory contains scripts to populate the database with sample data for development and testing.

## Available Scripts

### 1. `create-admin.js`

Creates an admin user account that can be used as the creator for seeded prompts.

### 2. `prompts.seed.js`

Populates the database with 30 diverse, high-quality AI prompts.

## Prerequisites

Before running any seed scripts, make sure:

1. MongoDB is running and accessible
2. Environment variables are set in `.env`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

## Usage

### Step 1: Create Admin User (First Time Only)

Before running the prompts seed script, you need to create an admin user:

```bash
cd Aifule-backend
node seed/create-admin.js
```

This will create an admin user with the following credentials:

- **Username:** admin
- **Email:** admin@promptverse.com
- **Password:** admin123
- **Mobile:** +1234567890

⚠️ **IMPORTANT:** Change the admin password after first login!

If an admin user already exists, the script will display the existing admin's information.

### Step 2: Seed Prompts Data
