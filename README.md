<div align="center">

# Smart PC Store

**Hi-end PC & Gaming Gear — E-commerce Platform**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A modern, full-featured e-commerce storefront for PC hardware and gaming gear — built with the latest Next.js App Router, React 19, and a fully integrated AI assistant.

</div>

---

## 1. What's inside

| Area | Highlights |
|---|---|
| 🛍️ **Customer Store** | Product catalog, cart, checkout with QR payment |
| 🤖 **AI Features** | Price forecast chart + conversational product chatbot |
| 🔐 **Auth** | JWT + silent refresh, race-condition-safe token rotation |
| 🗂️ **Admin Panel** | Full CRUD for products, orders, users, suppliers & stock |
| 📊 **Analytics** | Revenue, visitor, and category charts via Recharts |

---

## 2. Tech Stack

```
Next.js 16 (App Router)   →  Framework
React 19                  →  UI runtime
TypeScript 5              →  Type safety
Tailwind CSS v4           →  Styling
shadcn/ui + Radix UI      →  Component primitives
Zustand v5                →  Client state
TanStack Query v5         →  Server state & caching
React Hook Form + Zod     →  Forms & validation
Axios                     →  HTTP client with JWT interceptors
Recharts                  →  Data visualization
```

---

## 3. Project Structure

```
smart-pc-store-frontend/
│
├── app/                        # Next.js App Router
│   ├── (auth)/                 # /dang-nhap  /dang-ky
│   ├── admin/                  # Admin panel
│   │   ├── categories/
│   │   ├── nhap-hang/          # Stock imports
│   │   ├── orders/
│   │   ├── products/
│   │   ├── suppliers/
│   │   └── users/
│   ├── danh-muc/[slug]/        # Category pages
│   ├── gio-hang/               # Cart
│   ├── san-pham/[id]/          # Product detail
│   ├── tai-khoan/              # User profile
│   └── thanh-toan/             # Checkout → QR payment → Success
│
├── components/
│   ├── admin/                  # Charts, tables, CRUD dialogs
│   ├── chat/                   # AIChatBox (floating widget)
│   ├── header/                 # Navbar, search, cart, user menu
│   ├── home/                   # Hero slider, category grid, banners
│   ├── shared/                 # ProductCard, SectionHeader
│   └── ui/                     # shadcn/ui primitives (30+ components)
│
├── services/                   # API calls — one file per domain
├── stores/                     # Zustand stores — one per domain
├── types/                      # Global TypeScript types
├── lib/
│   ├── axios.ts                # Axios instance + JWT interceptors
│   ├── jwt.ts                  # Token utilities
│   └── utils.ts                # Shared helpers
└── configs/
    ├── Routes.ts
    └── Contacts.ts
```

---

## 4. Getting Started

### Prerequisites

- **Node.js** 20+
- Backend API running at `localhost:9999` ([smart-pc-store-backend](https://github.com/your-org/smart-pc-store-backend))

### a — Clone & install

```bash
git clone https://github.com/your-org/smart-pc-store-frontend.git
cd smart-pc-store-frontend
npm install
```

### b — Configure environment

Create a `.env.local` in the root:

```env
NEXT_PUBLIC_MODE=development
NEXT_PUBLIC_API_URL=http://localhost:9999/smart_pc_store_war
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=admin
NEXT_PUBLIC_AI_ASSISTANT_URL=https://smart-pc-store-ai-server.vercel.app
```

### c — Run

```bash
npm run dev        # development  →  http://localhost:3000
npm run build      # production build
npm run start      # serve production build
```

---

## 5. Auth Architecture

The token lifecycle is managed entirely inside `lib/axios.ts` with two Axios interceptors:

- **Request interceptor** — checks token expiry before every request and silently refreshes if it expires within 30 seconds
- **Response interceptor** — catches `401/403` responses and retries with a fresh token; a singleton `refreshPromise` prevents race conditions when multiple requests fire simultaneously

```
Access token   →  in-memory only (never persisted)
Refresh token  →  localStorage via Zustand persist
Cookies        →  synced for Next.js middleware (SSR)
```

---

## 6. AI Features

Two independent AI integrations connected to a dedicated microservice:

**Price Forecast Chart** — shown on every product detail page. Renders historical price data as a solid line and a 7-day forward prediction as a dashed line using Recharts.

**AI Chat Widget** — a floating `AIChatBox` component. Sends user messages to `POST /chat` on the AI server and streams back a text answer alongside suggested products.

---

## 7. Related Repositories

| Repo | Stack | Description |
|---|---|---|
| `smart-pc-store-backend` | Java / Spring | REST API backend |
| `smart-pc-store-ai-server` | Python (Vercel) | AI microservice for chat & price prediction |
