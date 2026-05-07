# Quick Start Guide

Get the backend running in 5 minutes!

## 1. Install Dependencies

```bash
cd app/backend
npm install
```

## 2. Create Database

```bash
createdb products_db
```

## 3. Create .env File

Create `app/backend/.env` with this content:

```env
NODE_ENV=development
PORT=6010

DB_HOST=localhost
DB_PORT=5432
DB_NAME=products_db
DB_USER=postgres
DB_PASSWORD=postgres

JWT_SECRET=change_this_to_random_32_character_string_please
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=change_this_to_another_random_32_character_string
JWT_REFRESH_EXPIRES_IN=7d

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

FRONTEND_URL=http://localhost:3000
```

**Update the password and JWT secrets!**

## 4. Run Migrations

```bash
npm run migrate
```

## 5. Start Server

```bash
npm run dev
```

## 6. Test It

Open another terminal and run:

```bash
curl http://localhost:6010/health
```

You should see:
```json
{"status":"ok","database":"connected"}
```

## Login with Default Admin

- **Email**: admin@greyd.io
- **Password**: admin123

## Done! 🎉

The backend is now running on `http://localhost:6010`

Frontend at `http://localhost:3000` is already configured to connect to it.

## Troubleshooting

**Database error?**
- Make sure PostgreSQL is running: `brew services list` (macOS)
- Check password in .env matches your PostgreSQL password

**Port already in use?**
- Change PORT in .env to something else

**Need more help?**
- See `INSTALLATION.md` for detailed instructions

