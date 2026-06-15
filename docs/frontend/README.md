# Frontend Documentation 🎨

The user interface is built as a highly interactive SPA using **Next.js 15 (App Router)** and **React 19**.

## 🌓 UI System: Day/Night Mode

- Managed via a custom `ThemeContext`.
- **State**: Persistent to `localStorage`.
- **CSS Variables**: Theme-aware color palette defined in `styles/variables.css`.
- **Flicker Protection**: Designed to prevent a white flash when loading Dark Mode from cold-boot.

---

## 🗂️ Routing Strategy

All dashboards are grouped under the `(dashboard)` route group. They use a common `layout.tsx` for consistent navigation.

### Role-Based Access (RBAC)
1.  **`/` (Root)**: Automatically detects user role and redirects to the correct dashboard.
2.  **`/user`**: The standard user workstation.
3.  **`/admin`**: Governance portal available only to those with the `admin` role.
4.  **`/profile`**: High-priority user settings and identity management.
5.  **`/subscription`**: Service level and billing management.

---

## 🔐 Auth Interface

- **`AuthContext`**: Provides `user`, `token`, and `login()`/`logout()` methods across the app.
- **`Suspense` Protection**: Auth callbacks are wrapped in React Suspense to handle search parameter parsing safely.
- **History Sanitization**: Upon a successful Google login, we automatically clear the JWT and user data from the browser history for enhanced security (`history.replaceState`).

---

## 🛠️ Global Components

- **`DashboardLayout`**: A responsive, collapsible sidebar architecture.
- **`Header`**: Contains the sidebar toggle, dynamic page titles, theme switcher, and profile dropdown.
- **`UserTable`**: (Admin Only) A powerful data-grid for managing the platform's neural citizen registry.

---

## 🧪 Styling Architecture

- No Tailwind by default.
- Modern CSS Variables for all tokens.
- Glassmorphism effects through standard CSS `backdrop-filter`.
- Snappy, GPU-accelerated micro-animations (`animate-fade-in`).
