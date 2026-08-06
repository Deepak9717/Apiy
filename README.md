## APIY — Browser-Based API Testing Tool
APIY is a high-performance, developer-focused API client built for the modern web. It features a minimal, Vercel-inspired dark aesthetic and provides robust testing capabilities for REST and GraphQL endpoints without browser-enforced CORS limitations.

## 🚀 Core Features

* Dual-Protocol Testing: Full-featured REST client alongside a dedicated GraphQL workspace featuring schema introspection and an interactive type/field explorer.
* Secure Serverless Proxy: Bypasses browser CORS constraints via a custom /api/proxy endpoint with built-in SSRF protection (blocks private subnet ranges and cloud metadata endpoints).
* Advanced Auth Layer: Native support for Bearer tokens, Basic Auth, and API Keys, complete with full NextAuth.js user authentication (MongoDB, bcrypt, JWT sessions).
* Granular State Architecture: Isolated state management across three dedicated Zustand stores (Request, History, UI) leveraging Immer middleware to eliminate rendering bottlenecks.
* React Query Integration: Asynchronous lifecycle states (loading, cancellation, errors) managed natively via useMutation hooks integrated with browser AbortController engines.

## 🛠️ Tech Stack

* Framework: Next.js 15 (App Router) + TypeScript
* Styling: Tailwind CSS + Framer Motion (Linear-style UI)
* State & Data: Zustand (with Immer) + React Query
* Backend & Auth: NextAuth.js + MongoDB + Mongoose

## 💻 Getting Started

   1. Clone and Install:
   
   git clone https://github.com
   cd apiy
   npm install
   
   2. Configure Environment:
   Create a .env.local file:
   
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_jwt_secret
   NEXTAUTH_URL=http://localhost:3000
   
   3. Run Development Server:
   
   npm run dev
