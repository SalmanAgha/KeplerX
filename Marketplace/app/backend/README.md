# Products Backend

A Node.js/Express backend with PostgreSQL, JWT authentication, and comprehensive auth features.

## Features

- **JWT Authentication**: Secure token-based authentication
- **PostgreSQL Database**: Reliable data storage
- **User Management**: Registration, login, forgot password, guest access
- **Role-Based Access Control**: Multiple user roles (super_admin, admin, editor, viewer, user, guest)
- **Environment Configuration**: All sensitive data stored in .env file
- **Database Migrations**: Automated database setup scripts
- **Middleware**: Auth verification, CORS, rate limiting, security headers

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
cd app/backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `app/backend` directory based on `.env.example`:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production

FRONTEND_URL=http://localhost:3000
```

### 3. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE products_db;

# Exit psql
\q
```

### 4. Run Database Migrations

```bash
npm run migrate
```

This will create the `users` table and insert a default admin user:
- **Email**: admin@greyd.io
- **Password**: admin123
- **Role**: super_admin

**⚠️ IMPORTANT**: Change the default admin password after first login in production!

### 5. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:6010` (or the port specified in .env).

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "user"
  }
}
```

#### POST `/api/auth/register`
Register a new user.

**Request:**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### POST `/api/auth/forgot-password`
Request password reset.

**Request:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`
Reset password with token.

**Request:**
```json
{
  "token": "reset_token",
  "newPassword": "newpassword123"
}
```

#### POST `/api/auth/guest`
Create guest session.

**Response:**
```json
{
  "message": "Guest access granted",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "guest_uuid@guest.com",
    "name": "Guest User",
    "role": "guest"
  }
}
```

#### GET `/api/auth/me`
Get current user info (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

### Health Check

#### GET `/health`
Check server and database status.

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection pool
├── controllers/
│   └── authController.js    # Authentication logic
├── middleware/
│   └── auth.js              # JWT verification middleware
├── migrations/
│   ├── create_users_table.sql
│   └── runMigrations.js     # Migration runner
├── routes/
│   └── authRoutes.js        # Auth API routes
├── utils/
│   └── validators.js        # Input validation
├── server.js                # Express app setup
├── package.json
└── .env                     # Environment variables
```

## Security Features

- **JWT Tokens**: Secure, stateless authentication
- **Bcrypt Password Hashing**: Passwords are never stored in plain text
- **Rate Limiting**: Prevents brute force attacks
- **Helmet**: Security headers
- **CORS**: Configured for frontend
- **Environment Variables**: Sensitive data never hardcoded

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

## Development

### Debugging

Set `NODE_ENV=development` in `.env` for detailed error messages.

### Database Migrations

To add new migrations:
1. Create a new `.sql` file in `migrations/` directory
2. Run `npm run migrate`

## Troubleshooting

### Database Connection Error

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### Port Already in Use

Change `PORT` in `.env` to a different value.

### Migration Errors

- Ensure database is created
- Check PostgreSQL version (requires 12+)
- Review error messages in console

## License

ISC

