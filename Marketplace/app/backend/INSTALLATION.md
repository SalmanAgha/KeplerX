# Installation and Setup Guide

This guide will help you set up the Node.js backend with PostgreSQL and JWT authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Step-by-Step Installation

### 1. Install Backend Dependencies

```bash
cd app/backend
npm install
```

This will install all required packages:
- express - Web framework
- pg - PostgreSQL client
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- dotenv - Environment variable management
- cors - CORS middleware
- helmet - Security headers
- express-rate-limit - Rate limiting
- validator - Input validation
- uuid - UUID generation

### 2. Configure PostgreSQL

**Option A: Using createdb (recommended)**

```bash
createdb products_db
```

**Option B: Using psql**

```bash
psql -U postgres
CREATE DATABASE products_db;
\q
```

### 3. Create Environment File

**Important**: The `.env` file is not tracked by git for security. You must create it manually.

```bash
cd app/backend
touch .env
```

Now open the `.env` file and add the following content:

```env
# Server Configuration
NODE_ENV=development
PORT=6010

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_db
DB_USER=postgres
DB_PASSWORD=postgres

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

**⚠️ CRITICAL**: Update these values:
- `DB_PASSWORD`: Your actual PostgreSQL password
- `JWT_SECRET`: Generate a random long string (at least 32 characters)
- `JWT_REFRESH_SECRET`: Generate another random long string

### 4. Run Database Migrations

```bash
npm run migrate
```

This will:
- Create the `users` table with proper indexes
- Set up triggers for automatic timestamp updates
- Insert a default admin user

**Default Admin Credentials:**
- Email: `admin@greyd.io`
- Password: `admin123`
- Role: `super_admin`

**⚠️ CHANGE THIS PASSWORD IN PRODUCTION!**

### 5. Start the Backend Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:6010` (or the port specified in .env).

## Verify Installation

### Test Server Health

```bash
curl http://localhost:6010/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "database": "connected"
}
```

### Test Login

```bash
curl -X POST http://localhost:6010/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greyd.io","password":"admin123"}'
```

Expected response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@greyd.io",
    "name": "Super Admin",
    "role": "super_admin"
  }
}
```

## Frontend Configuration

The frontend is already configured to connect to the backend at `http://localhost:6010`.

To verify frontend connection:
1. Ensure backend is running on port 6010
2. Start frontend with `cd app/frontend && npm start`
3. Navigate to `http://localhost:3000`
4. Try logging in with admin credentials

## Troubleshooting

### "Cannot connect to database"

1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `.env`
3. Test connection:
   ```bash
   psql -U postgres -d products_db
   ```

### "Port 6010 already in use"

Option 1: Kill the process
```bash
lsof -i :6010
kill -9 <PID>
```

Option 2: Change port in `.env`
```env
PORT=6011
```

### "Error: password authentication failed"

Update `DB_PASSWORD` in `.env` with your actual PostgreSQL password.

### Migration Errors

If migrations fail:
```bash
# Drop and recreate database (⚠️ deletes all data)
dropdb products_db
createdb products_db
npm run migrate
```

## Project Structure

```
backend/
├── config/
│   └── database.js           # Database connection configuration
├── controllers/
│   └── authController.js     # Authentication business logic
├── middleware/
│   └── auth.js               # JWT verification middleware
├── migrations/
│   ├── create_users_table.sql
│   └── runMigrations.js      # Migration runner script
├── routes/
│   └── authRoutes.js         # API route definitions
├── utils/
│   └── validators.js         # Input validation utilities
├── server.js                 # Express application entry point
├── package.json
├── .env                      # Environment variables (create this!)
└── SETUP_INSTRUCTIONS.md     # Detailed setup guide
```

## Next Steps

Once the backend is running:

1. ✅ Test the `/health` endpoint
2. ✅ Test login with admin credentials
3. ✅ Test registration endpoint
4. ✅ Test guest access endpoint
5. ✅ Try forgot password flow
6. ✅ Connect frontend and test full authentication flow

## Security Checklist for Production

Before deploying to production:

- [ ] Change all default passwords
- [ ] Generate strong, random JWT secrets (minimum 32 characters)
- [ ] Update database credentials
- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up proper CORS origins
- [ ] Review and adjust rate limiting settings
- [ ] Set up database backups
- [ ] Configure logging and monitoring
- [ ] Never commit `.env` file to git

## Getting Help

If you encounter issues:

1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Ensure PostgreSQL is running
4. Check `.env` file configuration
5. Review the troubleshooting section above

## API Endpoints

Once running, these endpoints are available:

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/guest` - Create guest session
- `GET /api/auth/me` - Get current user (requires auth)

See `README.md` for detailed API documentation.

