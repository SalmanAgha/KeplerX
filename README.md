# SaaS Platform Boilerplate 2026 🚀

A production-ready, high-performance SaaS boilerplate built with **Next.js 15 (Turbopack)**, **Node.js (Express)**, and **PostgreSQL (Prisma)**. Designed for speed, security, and developer experience.

## ✨ Features

- **🛡️ Secure Authentication**: Google OAuth 2.0 (Passport.js) + JWT sessions + Local Login/Signup.
- **🔐 Role-Based Access Control (RBAC)**: Dedicated logic for `Admin` and `User` dashboards.
- **🎨 Premium 2026 UI**: Built with modern Glassmorphism, Tailwind-compatible vanilla CSS, and Lucide icons.
- **🌓 Dynamic Theming**: Built-in Day/Night mode with persistent state management.
- **📊 Admin Portal**: Full-featured User Management (CRUD) with real-time database integration.
- **🏗️ Scalable Architecture**: Separate frontend and backend services for independent scaling.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS (Global Variables)
- **State**: React Context (Auth & Theme)
- **Icons**: Lucide React

### Backend
- **Engine**: Node.js & Express
- **Persistence**: PostgreSQL 16
- **ORM**: Prisma 6
- **Auth**: Passport.js & JWT

## 🚀 Getting Started

### 1. Database Setup
Ensure you have PostgreSQL running. Update your connection string in `backend/.env`.
```bash
npx prisma migrate dev
```

### 2. Backend Initialization
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```

## 📂 Project Structure

- `/backend`: Express server, Prisma models, and Auth logic.
- `/frontend`: Next.js application with role-based routing.
- `/docs`: Detailed system documentation.
- `/db`: SQL schema exports and queries.

## 📄 Documentation

For detailed guides, please refer to the [Docs folder](./docs):
- [Backend Documentation](./docs/backend/README.md)
- [Frontend Documentation](./docs/frontend/README.md)
- [Database Documentation](./docs/db/README.md)

## 🔑 License
MIT
