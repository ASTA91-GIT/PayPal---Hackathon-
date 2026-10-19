# 🛒 TrustCart AI — Autonomous AI Shopping & Trust-Intelligence Platform

> **PayPal AI Hackathon 2026 Submission**  
> *A full-stack AI shopping agent, explainable 5-vector fraud intelligence engine, and verified PayPal checkout integration.*

---

## 🌟 Executive Summary

**TrustCart AI** solves the crisis of e-commerce deception: counterfeit deals, scalped hardware, astroturfed reviews, and adversarial checkout manipulations. 

Unlike traditional shopping bots that blindly recommend products, TrustCart AI acts as an autonomous guardian:
1. **Understands natural shopping intent** through structured LLM tool-calling.
2. **Audits listings through a deterministic 5-vector risk engine** ($0-100$ observed risk score) evaluating price markdown anomalies, merchant dispute histories, specification completeness, and bot velocity.
3. **Guarantees pricing authority on the server**, calculating taxes, shipping, and discounts directly from trusted database models.
4. **Executes live transactions via the official PayPal Sandbox Orders API v2**, persisting verified cryptographic capture receipts.

---

## 🎨 Design System: Pastel Glassmorphism (Stitch Spec)

TrustCart AI adheres to the **dual-theme pastel architecture**:

- **Dreamy Pastel Light Mode**: `#F8F7FC` background, translucent lavender cards (`#9D87E8`), powder blue accents (`#5BA8C2`), and dark slate typography (`#29263D`).
- **Midnight Pastels Dark Mode**: Deep space obsidian (`#171722`), glowing soft lavender (`#C4B5FD`), sky blue (`#A9D9F0`), and frosted acrylic surfaces.
- **Dimensional 3D Hero Scene**: Interactive Three.js scene featuring an icosahedron trust shield, holographic concentric scanning rings, and a gentle particle field with depth-aware lighting and mouse parallax.
- **Typography Stack**:
  - Display Headings: **Syne** (with Akira Expanded styling)
  - Subheadings & Cards: **Plus Jakarta Sans**
  - Body Text: **Inter**
  - Technical Data & Hashes: **JetBrains Mono**
  - Cyber Status Pills: **Italic Monospace Badges**

---

## 🚀 Key Routes & Features

| Route | Description |
| :--- | :--- |
| **`/`** | Cinematic Landing Page with 3D Hologram, 4-Pack Bento Telemetry, and Live Catalog highlights. |
| **`/discover`** | Product Discovery Catalog with multi-category filtering, max risk sliders, and real-time sorting. |
| **`/agent`** | Autonomous AI Shopping Workspace with natural language intent extraction, live tool execution logs, and structured output. |
| **`/products/[id]`** | Product Detail with technical specifications, seller reputation metrics, and risk clearance badges. |
| **`/investigate/[id]`** | Deep Forensic Trust Report breaking down the 5 risk vectors, itemized evidence signals, and intercepting rule logic. |
| **`/compare`** | Side-by-Side Product Comparison Matrix comparing specs, MSRP deltas, and risk tiers. |
| **`/cart`** | Shopping Cart with server-recalculated pricing, quantity adjustments, and average risk rollup. |
| **`/checkout`** | PayPal Sandbox Checkout preparation, risk certification approval, and official PayPal button integration. |
| **`/orders`** | Verified Order History tracking transaction statuses, amounts, and capture IDs. |
| **`/orders/[id]`** | Detailed Order Receipt with cryptographic PayPal capture verification and printable invoice. |
| **`/dashboard`** | Trust Intelligence Cockpit matching the Stitch telemetry feed: Live Transaction Evaluation stream, deep dossier, and neural spark bars. |
| **`/login`** | Completely transparent, immersive login interface floating directly over the 3D scene without opaque cards. |
| **`/register`** | Matching transparent registration interface with scrypt password hashing and session tokens. |

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (strict type checking)
- **Styling**: Tailwind CSS v4 + Vanilla CSS Variables
- **Animations & 3D**: Framer Motion + Three.js
- **Validation**: Zod runtime schema validation
- **Database & ORM**: SQLite (zero-config local dev) / PostgreSQL compatible via Prisma ORM
- **Payment Gateway**: Official PayPal JavaScript SDK v6 (`@paypal/react-paypal-js`) & PayPal Orders API v2
- **Testing**: Vitest unit & integration test suite

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- **Node.js** v20+ or v24+
- **npm** v10+

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/your-username/trustcart-ai.git
cd trustcart-ai
npm install
```

### 3. Environment Configuration
Copy the provided `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default configuration runs zero-config SQLite out of the box:
```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_PAYPAL_CLIENT_ID="sb"
PAYPAL_CLIENT_SECRET=""
PAYPAL_ENVIRONMENT="sandbox"
```

### 4. Initialize Database & Seed Catalog
Push the Prisma schema and seed 22 realistic products across 4 categories with pre-computed risk assessments:
```bash
npm run db:push
npm run db:seed
```

### 5. Run the Application
Start the local development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 💳 PayPal Sandbox Setup & Verification

TrustCart AI supports **both** live PayPal Sandbox developer keys and an instant zero-friction simulation mode:

### Live PayPal Sandbox Mode
1. Log in to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications/sandbox).
2. Create or copy your Sandbox REST App credentials.
3. Update `.env`:
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_sandbox_client_id"
   PAYPAL_CLIENT_SECRET="your_sandbox_client_secret"
   PAYPAL_ENVIRONMENT="sandbox"
   ```
4. Restart `npm run dev`. Navigate to `/checkout` and complete payment with a Sandbox personal account.

### Instant Sandbox Test (1-Click Evaluation Mode)
If you do not have PayPal sandbox keys handy, the `/checkout` page includes an **"Instant Quick Sandbox Capture"** button. This executes the entire server validation pipeline, recalculates authoritative catalog prices, updates the database, creates a `PaymentCapture` record, and issues a verified receipt without external popups.

---

## 🧪 Running Automated Tests

Run the Vitest test suite covering deterministic risk scoring, price markdown anomaly detection, and anti-tampering cart validation:
```bash
npm run test
```

Expected result:
```
✓ tests/cartCalculations.test.ts (4 tests)
✓ tests/riskEngine.test.ts (4 tests)

Test Files  2 passed (2)
     Tests  8 passed (8)
```

---

## 🎬 3-Minute Live Hackathon Demo Walkthrough

1. **Step 1: The Landing Page (`/`)**
   - Notice the pastel dual-theme palette. Toggle between **"Dreamy" (Light)** and **"Midnight" (Dark)** in the top bar.
   - Interact with the 3D Holographic Trust Shield. Observe the live 4-Pack Bento metrics ($42.8M volume, 11ms latency).
2. **Step 2: AI Shopping Agent (`/agent`)**
   - Click the demo prompt: *"Find me a mechanical gaming keyboard under $50 with good specifications and low observed risk."*
   - Watch the agent parse the intent, invoke `search_products`, audit with `assess_listing`, compare options, and stream the honest tool traces.
   - Click **"+ Cart"** on the recommended Keychron or Vortex keyboard.
3. **Step 3: Forensic Deal Investigation (`/investigate/prod-gpu-fake-010`)**
   - Navigate to the **RTX 4090 deal for $189** (slug: `geforce-rtx-4090-fake-listing`).
   - Observe the **Critical Risk score (75+/100)**: flags severe price markdown (90% below MSRP) and bot syndicate review burst.
4. **Step 4: Verified Cart & PayPal Checkout (`/cart` → `/checkout`)**
   - View the server-calculated subtotal, free shipping over $100, and tax fee.
   - Click **Proceed to PayPal Checkout**.
   - Review the Trust Clearance seal, check approval, and complete payment via **PayPal Buttons** or **Quick Sandbox Capture**.
5. **Step 5: Order Receipt & Trust Dashboard (`/orders/[id]` & `/dashboard`)**
   - Inspect the cryptographic PayPal Capture Certificate with persistent Capture ID.
   - Open `/dashboard` to inspect the full transaction telemetry stream, neural heuristics chart, and cross-merchant cart graph anomaly inspired by the Stitch cockpit design.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
