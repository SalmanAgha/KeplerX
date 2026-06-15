# Backend Documentation 🛠️

The backend is built as a RESTful API using **Node.js (Express)**, serving as the core logic engine for authentication and user management.

## 🔑 Authentication Flow

### Local Authentication
- **Signup**: Hashes passwords using `bcrypt` and stores them in PostgreSQL via Prisma.
- **Login**: Verifies credentials and returns a secure JWT (JSON Web Token).

### Google OAuth 2.0 (Passport.js)
- Integrated via `passport-google-oauth20`.
- **Redirect URI**: `http://localhost:5000/api/auth/google/callback`.
- Once authenticated, it encodes user data and JWT into the frontend URL for seamless redirection.

---

## 🛤️ API Endpoints

### Auth Routes (`/api/auth`)
- `POST /login`: Standard credential login.
- `POST /signup`: Create a new user account.
- `GET /google`: Initiate Google OAuth flow.
- `GET /google/callback`: Finalize authentication.

### User Routes (`/api/users`)
- `GET /profile`: Fetch currently authenticated user metadata.
- `GET /all`: (Admin Only) List of all users in the system.
- `PUT /:id`: (Admin Only) Update user role, status, or details.
- `DELETE /:id`: (Admin Only) Remove a user from the platform.

### Subscription Routes (`/api/subscriptions`)
- `POST /update`: Toggle or upgrade user service tiers.

---

## 🏗️ Data Models (Prisma)

- **User Model**: Primary identity table including email, hashed password, role (`admin`|`user`), and subscription tier (`free`|`pro`|`enterprise`).
- **Subscription Model**: Tracks historical and active service agreements linked to users.

---

## 📦 Middlewares

1.  **`verifyToken`**: Validates the JWT in the `Authorization` header.
2.  **`isAdmin`**: Gatekeeper for administrative-level endpoints; checks user object in the request for the `admin` role.
3.  **`CORS`**: Configured to ONLY allow your specified frontend origin for enhanced security.
