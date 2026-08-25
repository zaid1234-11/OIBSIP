# CRUST — Custom Pizza Ordering Platform

> **Build the pizza you actually want.**  
> A full-stack, architectural pizza customization and live-order tracking platform built for the Oasis Infobyte Web Development Internship (Level 3).

---

## 🍕 Project Overview

**CRUST** is not a generic food delivery app clone. It is a purpose-built constructor for pizza lovers and pizzeria kitchens alike. CRUST treats every pizza order like an architectural project:
- **Layer-by-Layer Customization**: Dynamic selection of crust size, sauce coverage, cheese blends, and fresh toppings with real-time server-verified pricing.
- **Live Kitchen Ticket Tracking**: Ticket-stub visual metaphors featuring dashed perforations, IBM Plex Mono typography, rubber-stamp status badges, and real-time Socket.IO preparation updates.
- **Dual-Theme Design System**: Tailored **Customer Theme** (warm cream base, oxblood, ember gradient, pill-radius buttons) and a focused **Admin Theme** (charcoal-ember dark mode, tomato accents, 12px buttons).
- **Automated Inventory & RBAC**: Real-time ingredient stock deduction on order confirmation, automated low-stock background checks, and strict server-side role-based access control.

---

## 🛠️ Technology Stack

### Frontend (`/client`)
- **Core**: React 19, Vite, JavaScript (ESM)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, CSS `@theme` design tokens, zero v3 config files)
- **State Management**: Zustand (with persistent local storage integration)
- **Routing**: React Router DOM v7 (Customer & Admin route guards)
- **HTTP Client**: Axios (configured with automated JWT Bearer interceptors)
- **Icons & Typography**: Lucide React, Google Fonts (*Fraunces*, *Inter*, *IBM Plex Mono*)

### Backend (`/server`)
- **Runtime & Framework**: Node.js (ESM), Express.js
- **Database & ODM**: MongoDB / MongoDB Atlas, Mongoose 8 (with local `MongoMemoryServer` fallback for development)
- **Security & Auth**: `bcryptjs` (password hashing with 10 salt rounds), `jsonwebtoken` (JWT bearer authorization)
- **Real-Time Communication**: Socket.IO (room-based tracking for customers and kitchen staff)
- **Task Automation**: `node-cron` (scheduled low-stock background alerts)
- **Payment Processing**: Razorpay (secure webhook signature verification)

---

## 📁 Project Structure

Following the locked design specification layout:

```text
crust/
├── client/
│   ├── src/
│   │   ├── admin/             # Admin portal pages (Dashboard, Orders, Inventory, Pizzas, Customers, Settings)
│   │   ├── components/
│   │   │   ├── auth/          # ProtectedRoute and authentication guards
│   │   │   ├── builder/       # Pizza constructor step components
│   │   │   ├── layouts/       # Scoped CustomerLayout and AdminLayout wrappers
│   │   │   ├── navbar/        # Dynamic navigation header
│   │   │   ├── orders/        # OrderTracker and order ticket components
│   │   │   └── ui/            # Reusable UI library (Button, StatusPill, TicketCard, StockBadge, Toast, EmptyState, Skeleton, BuildShot)
│   │   ├── pages/             # Customer pages (Home, Menu, PizzaDetail, PizzaBuilder, Cart, Checkout, Orders, OrderDetail, Profile, Auth)
│   │   ├── services/          # Axios API instance and endpoints
│   │   ├── store/             # Zustand stores (authStore, cartStore, pizzaStore)
│   │   ├── App.jsx            # Master route tree with role-based protections
│   │   ├── index.css          # Tailwind v4 theme tokens and scoped .theme-customer / .theme-admin
│   │   └── main.jsx           # Root React mount
│   ├── package.json
│   └── vite.config.js         # Vite configuration with proxy to backend (/api -> localhost:5000)
├── server/
│   ├── src/
│   │   ├── config/            # Centralized environment loader (env.js) and database connection (db.js)
│   │   ├── controllers/       # Route business logic (authController, orderController, pizzaController, etc.)
│   │   ├── jobs/              # Background cron tasks (lowStockCheck.js)
│   │   ├── middleware/        # Security middlewares (auth.js, requireRole.js, errorHandler.js)
│   │   ├── models/            # Mongoose schemas (User, Pizza, Option, Ingredient, Order, Cart, Notification, Tokens)
│   │   ├── routes/            # Express routers (authRoutes, adminRoutes, pizzaRoutes, orderRoutes, etc.)
│   │   ├── sockets/           # Socket.IO room subscriptions and event handlers
│   │   ├── utils/             # Helper utilities (seedAdmin.js)
│   │   └── server.js          # Express app entry point
│   ├── package.json
│   └── testAuthFlow.js        # Automated integration test suite for auth and RBAC
├── .env.example               # Environment variables template
├── .gitignore
├── CRUST-design-spec.md       # Product design specification & single source of truth
└── README.md
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance OR MongoDB Atlas connection string (falls back to in-memory database automatically during development)

### 2. Clone & Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-username/crust.git
cd crust

# Copy environment variables template
cp .env.example server/.env
```

Ensure `server/.env` contains the required configuration:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/crust
JWT_SECRET=your_super_secret_jwt_key_here
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=rzp_secret_placeholder
```

### 3. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 4. Running the Development Servers
Open two terminal windows:

**Terminal 1 — Express Backend API**:
```bash
cd server
npm run dev
# Server boots on http://localhost:5000
```

**Terminal 2 — Vite React Frontend**:
```bash
cd client
npm run dev
# Client boots on http://localhost:5173
```

---

## 🔒 Authentication & Role-Based Access Control (RBAC)

CRUST implements strict server-side access control:
- **Customer Role**: Access to storefront, pizza builder, cart, checkout, order history, and personal live tracking.
- **Admin Role**: Exclusive access to the Kitchen Queue, Inventory Management, Ingredient Thresholds, and Global Settings.
- **Route Guarding**: All `/api/admin/*` endpoints strictly require `auth.js` (JWT token verification) and `requireRole('admin')`. Forged customer tokens receive an immediate `403 Forbidden` response.
- **Default Seeded Admin**: `admin@crustpizza.com` / `Admin@12345` (autofill option available on `/admin/login`).

---

## 🤖 AI-Assisted Development Workflow

CRUST is engineered following a rigorous, milestone-driven AI pair-programming workflow:
1. **Specification as Single Source of Truth**: Every schema, component prop, route, and design token is derived directly from `CRUST-design-spec.md`.
2. **Phase-by-Phase Verification**: Each development phase concludes with:
   - Automated unit & integration tests (`testAuthFlow.js`).
   - Full browser subagent navigation and visual regression testing.
   - Atomic, descriptive git commits (e.g., `feat: implement authentication and role-based access`).
3. **Living Design Reference**: The interactive `/styleguide` route provides side-by-side inspection of all UI components, tokens, and states across both customer and admin environments.

---

## 📄 License
MIT © Oasis Infobyte Web Development Internship
