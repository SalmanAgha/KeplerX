# Backend Setup Instructions

Follow these steps to set up and run the backend:

## Quick Start

```bash
# 1. Navigate to backend directory
cd app/backend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example and update with your values)
# IMPORTANT: Update database password and JWT secrets!

# 4. Create PostgreSQL database
createdb products_db

# 5. Run migrations to create tables
npm run migrate

# 6. Start the server
npm run dev
```

## Detailed Setup

### Step 1: Install Dependencies

```bash
cd app/backend
npm install
```

### Step 2: PostgreSQL Setup

Make sure PostgreSQL is installed and running:

```bash
# Check PostgreSQL status
brew services list  # macOS
# or
sudo systemctl status postgresql  # Linux

# Create database
createdb products_db

# Or manually:
psql -U postgres
CREATE DATABASE products_db;
\q
```

### Step 3: Environment Configuration

The `.env` file is **blocked by gitignore** for security. You need to create it manually:

```bash
# Create .env file
touch .env
```

Add the following content (update with your actual values):

```env
# Server Configuration
NODE_ENV=development
PORT=6010

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_make_it_long_and_random
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_make_it_long_and_random
JWT_REFRESH_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANT**: 
- Replace `your_postgres_password` with your actual PostgreSQL password
- Replace `your_super_secret_jwt_key...` with random long strings (at least 32 characters)
- In production, use environment variables or secret management service

### Step 4: Database Migration

Run the migration to create the users table:

```bash
npm run migrate
```

This will:
- Create the `users` table
- Add indexes for better performance
- Insert a default admin user

**Default Admin Credentials:**
- Email: `admin@greyd.io`
- Password: `admin123`
- Role: `super_admin`

**⚠️ CHANGE THIS PASSWORD IMMEDIATELY IN PRODUCTION!**

### Step 5: Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:6010`.

Verify it's running:
```bash
curl http://localhost:6010/health
```

You should see a JSON response with status information.

## Testing the API

### Test Login

```bash
# With default admin credentials
curl -X POST http://localhost:6010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greyd.io","password":"admin123"}'
```

### Test Registration

```bash
curl -X POST http://localhost:6010/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### Test Guest Access

```bash
curl -X POST http://localhost:6010/api/auth/guest \
  -H "Content-Type: application/json"
```

## Troubleshooting

### Database Connection Error

**Error**: `error: password authentication failed`

**Solution**: Check your PostgreSQL password in `.env` matches your actual PostgreSQL password.

```bash
# Test PostgreSQL connection
psql -U postgres -d products_db
```

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::6010`

**Solution**: Either:
1. Kill the process using port 6010
2. Change PORT in `.env` file

```bash
# Find process using port 6010
lsof -i :6010

# Kill it
kill -9 <PID>
```

### Migration Errors

**Error**: `relation "users" already exists`

**Solution**: Table already exists. If you want to recreate, drop it first:

```bash
psql -U postgres -d products_db -c "DROP TABLE IF EXISTS users CASCADE;"
npm run migrate
```

## Next Steps

1. ✅ Backend is running on port 6010
2. ✅ Frontend should connect to `http://localhost:6010`
3. ✅ Test the authentication flow in the frontend
4. ✅ Update `.env` with production values before deployment

## Security Notes

- Never commit `.env` file to git
- Use strong, random JWT secrets (minimum 32 characters)
- Change default admin password
- Use environment variables in production
- Enable HTTPS in production
- Configure firewall rules appropriately

