# ProjectForge - Production Digital Software Project Marketplace

> **Tagline:** Build. Understand. Showcase.  
> **Target Audience:** B.Tech CSE / IT College Students & Developers  
> **Core Positioning:** Industry-style software projects, complete source code, documentation, architecture diagrams, presentation decks, viva guides, and WhatsApp technical support.

---

## 🚀 Overview

**ProjectForge** is a premium, high-converting digital product marketplace engineered to sell software project packages to college students and developers. Unlike cheap project selling scripts, ProjectForge delivers a modern, developer-centric experience with bank-grade payment security, server-side signature verification, and authenticated digital file delivery.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 / 19 (Vite + TypeScript)
- **Styling:** Tailwind CSS (Deep navy technology aesthetic & subtle glassmorphism)
- **Icons:** Lucide React
- **Routing:** React Router v7
- **Data Fetching:** TanStack Query (React Query) & Axios
- **Form Management:** React Hook Form + Zod

### Backend
- **Runtime:** Node.js + Express.js + TypeScript
- **Database:** MongoDB + Mongoose ORM (Supports Local MongoDB, MongoMemoryServer fallback, and MongoDB Atlas)
- **Security:** Bcryptjs password hashing, JSON Web Tokens (JWT), Helmet security headers, CORS protection, Express Rate Limiting
- **Payment Gateway:** Razorpay SDK with HMAC SHA-256 server-side signature verification & webhook idempotency
- **Secure File Storage:** Private protected object storage with short-lived HMAC-signed download URLs

---

## 📂 Project Structure

```
project-forge/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # Navbar, Footer, WhatsAppButton
│   │   │   └── marketplace/  # ProjectCard, TrustSection, HowItWorks, FAQSection, CategoryFilter
│   │   ├── config/           # Centralized Brand & Site Constants (brand.config.ts)
│   │   ├── context/          # AuthContext & state provider
│   │   ├── layouts/          # DashboardLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── Home.tsx, Projects.tsx, ProjectDetail.tsx, CampaignPage.tsx
│   │   │   ├── About.tsx, Pricing.tsx, FAQ.tsx, Contact.tsx, Support.tsx
│   │   │   ├── Login.tsx, Register.tsx, ForgotPassword.tsx, ResetPassword.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── dashboard/    # Overview, MyPurchases, Downloads, SupportTickets, Profile, Security
│   │   │   └── admin/        # AdminDashboard, AdminProducts, AdminOrders, AdminCoupons, AdminAuditLogs
│   │   ├── services/         # API Client & Auth Service
│   │   └── types/            # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── config/           # DB, Brand, and Storage configuration
│   │   ├── controllers/      # Auth, Product, Order, Payment, Entitlement, Download, Admin, Support, SEO
│   │   ├── middlewares/      # Auth & RequireAdmin Guards
│   │   ├── models/           # Mongoose Schemas (User, Product, Order, Entitlement, Download, Coupon, etc.)
│   │   ├── routes/           # REST API Route Endpoints
│   │   ├── seeders/          # Database Seeder (5 Pre-populated Products & Categories)
│   │   ├── utils/            # JWT, Passwords, Signed Token, Storage generator
│   │   └── server.ts         # Express server entry point
│   ├── storage/protected/    # Private file storage (NOT publicly accessible)
│   ├── package.json
│   └── tsconfig.json
├── README.md
└── .env.example
```

---

## 🔧 Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017/projectforge`) OR MongoDB Atlas URI. *(If no local MongoDB server is running, the backend automatically launches a `mongodb-memory-server` in-memory database for seamless local execution).*

---

## 🔐 Environment Variables Configuration

Copy `.env.example` to `.env` in the `backend/` folder:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/projectforge

JWT_SECRET=projectforge_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_placeholder_key_id
RAZORPAY_KEY_SECRET=rzp_test_placeholder_key_secret
RAZORPAY_WEBHOOK_SECRET=rzp_webhook_secret_placeholder

STORAGE_TYPE=local
STORAGE_LOCAL_PATH=./storage/protected

EMAIL_FROM=support@projectforge.dev
EMAIL_API_KEY=mock_email_api_key

WHATSAPP_NUMBER=918081220303
BRAND_NAME=ProjectForge
```

---

## 🚦 Quick Start Guide (Local Setup)

### 1. Backend Setup & Seeding

```bash
cd backend
npm install
npm run seed     # Seed database with sample products & admin credentials
npm run dev      # Start Express API server at http://localhost:5000
```

**Default Seeded Admin Credentials:**
- **Email:** `admin@projectforge.dev`
- **Password:** `Admin@123456`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev      # Start Vite dev server at http://localhost:5173
```

---

## 💳 Payment & Webhook Architecture

ProjectForge integrates with Razorpay using server-side signature verification:

1. **Price Calculation**: Checkout fetches prices server-side directly from MongoDB (`POST /api/payments/create-order`). Client-provided prices are never trusted.
2. **Signature Verification**: Payment success triggers `POST /api/payments/verify`. Backend verifies the HMAC SHA256 signature using `RAZORPAY_KEY_SECRET`.
3. **Webhook Processing**: Webhook calls `POST /api/webhooks/razorpay`. Signature is verified with `RAZORPAY_WEBHOOK_SECRET`.
4. **Idempotency**: Webhook logic checks if an `Entitlement` already exists for `(userId, productId)` to prevent duplicate order generation.

---

## 🛡️ Secure File Download Architecture

Paid source code packages are stored in a private protected directory (`backend/storage/protected/packages/`) and are **NEVER** exposed as public static files.

Download Flow:
1. User clicks **"Download Source (.ZIP)"** in *My Purchases*.
2. Client calls `POST /api/downloads/:productId/request`.
3. Backend checks `Entitlement` ownership and download limits.
4. Backend issues a single-use HMAC SHA256 signed URL token valid for 15 minutes.
5. Client opens `/api/downloads/file/:token`. Backend validates token signature, records an audit log entry (`Download` & `AuditLog`), and streams the file with `Content-Disposition: attachment`.

---

## 📊 Pre-Populated Initial Products

1. **AI Resume Analyzer & ATS Optimizer** (React + Node.js + MongoDB + Gemini AI)
2. **AI Interview Preparation & Mock System** (React + WebRTC + Speech-to-Text + AI)
3. **MERN Stack Production E-Commerce Platform** (React + Redux + Node.js + Razorpay)
4. **Hospital & Healthcare Management System** (React + TypeScript + Express + MongoDB)
5. **Job Portal & Career Opportunities Hub** (React + Express + MongoDB)

---

## 🚀 Production Deployment

### Frontend (Vercel / Netlify)
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render / Railway / AWS EC2)
- Root Directory: `backend`
- Build Command: `npm run build`
- Start Command: `npm start` (or `node dist/server.js`)
