# 🛒 TrustCart AI

<p align="center">
  <strong>Shop Smarter. Detect Scams. Buy with Confidence.</strong><br />
  <em>Autonomous AI Shopping Assistant &amp; 5-Vector Fraud Intelligence Platform</em><br />
  <strong>Built for the PayPal AI Hackathon 2026</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.4-black?style=flat-square&logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19.3-blue?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PayPal-Sandbox_Orders_v2-00457C?style=flat-square&logo=paypal" alt="PayPal Sandbox" />
  <img src="https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square&logo=prisma" alt="Prisma &amp; SQLite" />
  <img src="https://img.shields.io/badge/Vitest-68_Tests_Passing-6E9F18?style=flat-square&logo=vitest" alt="Vitest Passing" />
  <img src="https://img.shields.io/badge/AI-Dynamic_Model_Driven-8A2BE2?style=flat-square" alt="Dynamic AI" />
</p>

<p align="center">
  <img src="public/brand/trustcart-animated-pipeline.svg" alt="TrustCart AI Execution Pipeline" width="100%" />
</p>

---

## 🌟 What is TrustCart AI?

**TrustCart AI** is an intelligent e-commerce shopping agent and trust platform that protects buyers from counterfeit deals, fake review bursts, and predatory pricing anomalies.

It combines a **natural-language shopping assistant** with a **deterministic 5-vector fraud risk engine** and server-verified **PayPal Orders API v2** checkout—giving consumers verified confidence before every transaction.

---

## 📸 Product Preview Gallery

<table width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">1. Landing Page</h3>
      <img src="public/readme/landing-page.png" alt="TrustCart AI Landing Page" width="100%" />
      <p align="center"><em>Interactive 3D Holographic Trust Shield with live market telemetry and verified catalog highlights.</em></p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">2. AI Shopping Assistant</h3>
      <img src="public/readme/ai-assistant.png" alt="AI Shopping Assistant" width="100%" />
      <p align="center"><em>Model-driven shopping workspace with dynamic intent interpretation, slang/typo handling, and live tool traces.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">3. Product Discovery Catalog</h3>
      <img src="public/readme/product-discovery.png" alt="Product Discovery" width="100%" />
      <p align="center"><em>Multi-category browser with real-time risk-tolerance filters, budget constraints, and instant clearance badges.</em></p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">4. Forensic Scam Investigation</h3>
      <img src="public/readme/risk-investigation.png" alt="Forensic Risk Investigation" width="100%" />
      <p align="center"><em>Deep risk audit exposing counterfeit hardware listings through 5 explainable telemetry vectors.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">5. Side-by-Side Product Comparison</h3>
      <img src="public/readme/product-comparison.png" alt="Product Comparison Matrix" width="100%" />
      <p align="center"><em>Comparative analysis matrix evaluating hardware specifications, MSRP deltas, and merchant credibility.</em></p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">6. Verified PayPal Sandbox Checkout</h3>
      <img src="public/readme/checkout.png" alt="PayPal Checkout" width="100%" />
      <p align="center"><em>Server price authority and instant risk certification paired with official PayPal Sandbox Smart Payment buttons.</em></p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3 align="center">7. Order Tracking &amp; Cryptographic Receipt</h3>
      <img src="public/readme/order-history.png" alt="Order History and Receipts" width="100%" />
      <p align="center"><em>Immutable order receipts verified by PayPal capture transactions and server-side settlement validation.</em></p>
    </td>
    <td width="50%" valign="top">
      <h3 align="center">8. Trust Intelligence Cockpit</h3>
      <img src="public/readme/trust-dashboard.png" alt="Trust Intelligence Dashboard" width="100%" />
      <p align="center"><em>Real-time merchant evaluation stream, neural risk radar, and cross-merchant anomaly telemetry.</em></p>
    </td>
  </tr>
</table>

---

## 🗺️ Visual User Journey

```mermaid
flowchart LR
    A["🔍 Discover<br>Browse catalog with<br>risk tolerance filters"] --> B["🤖 Ask AI<br>Chat naturally with<br>slang, typos & budgets"]
    B --> C["🛡️ Evaluate Risk<br>5-vector forensic audit<br>scores listing safety"]
    C --> D["⚖️ Compare<br>Side-by-side spec &<br>reputation breakdown"]
    D --> E["💳 Checkout<br>Server price authority &<br>PayPal Sandbox Orders v2"]
    E --> F["📦 Track Order<br>Cryptographic receipt with<br>verified capture record"]

    classDef step fill:#1E1B4B,stroke:#818CF8,stroke-width:2px,color:#F8FAFC;
    class A,B,C,D,E,F step;
```

1. **🔍 Discover**: Explore genuine electronics and gear with dynamic risk-tolerance sliders.
2. **🤖 Ask AI**: Request recommendations (*"find a keeb below 80 bucks"*); the agent resolves intent without hardcoded rules.
3. **🛡️ Evaluate Risk**: An explainable 5-vector audit flags markdown anomalies, merchant dispute histories, and review bot spikes.
4. **⚖️ Compare**: Review candidate alternatives side-by-side across MSRP deltas and risk tiers.
5. **💳 Checkout**: Authoritative server pricing stages items into an official PayPal Orders v2 sandbox checkout.
6. **📦 Track Order**: View confirmed purchases with cryptographic PayPal capture receipts and persistent transaction logs.

---

## ⚡ Core Feature Highlights

| Feature | Description | Key Highlight |
| :--- | :--- | :--- |
| **🤖 AI Shopping Assistant** | Dynamic model-driven agent handling arbitrary natural phrasing, typos, and multi-turn context. | Zero hardcoded branches; asks for clarification when requests are ambiguous. |
| **🛡️ 5-Vector Risk Engine** | Explainable $0-100$ risk scoring across price markdowns, merchant dispute histories, and review velocity. | Flags counterfeit listings before checkout without opaque black-box guessing. |
| **🔍 Smart Discovery & Filters** | Filter catalog items by category, maximum budget, and maximum acceptable risk score ($0-100$). | Real-time sorting and risk tier classification (`LOW`, `MODERATE`, `HIGH`, `CRITICAL`). |
| **⚖️ Product Comparison** | Side-by-side matrices comparing specifications, MSRP variance, and seller ratings. | Enables confident decision-making between multiple viable alternatives. |
| **💳 PayPal Orders v2 Sandbox** | Full integration with official PayPal JavaScript SDK v6 and Orders API v2 capture. | Includes 1-Click Sandbox Simulation mode for immediate zero-friction evaluations. |
| **📦 Verified Order Receipts** | Persistent order histories with cryptographic capture IDs and printable receipts. | Prevents checkout price-tampering with 100% server pricing authority. |

---

## 🏗️ High-Level System Architecture

```mermaid
flowchart TD
    User(["👤 Buyer / Operator"]) <--> UI["🎨 Next.js 16 Web Application<br>(Dual-Theme Pastel Glassmorphism & Three.js 3D Shield)"]
    
    UI <--> Agent["🤖 Autonomous Agent Orchestrator<br>(Discourse Classifier, Semantic Mapping & Context Resolver)"]
    
    Agent --> Tools["🔧 Controlled Agent Tools<br>(Search Products · Assess Listing · Compare · Prepare Cart)"]
    
    Tools <--> Risk["🛡️ 5-Vector Deterministic Risk Engine<br>(Markdown · Dispute Rate · Spec Integrity · Bot Review Velocity · Provenance)"]
    
    Tools <--> DB[("🗄️ SQLite Dev Database<br>(Prisma ORM: Products, Sellers, Risk Signals, Orders)")]
    
    UI --> PayPal["💳 PayPal Sandbox Gateway<br>(Official Orders API v2: Create Order & Capture Authorization)"]
    
    PayPal <--> DB

    classDef primary fill:#1E1B4B,stroke:#818CF8,stroke-width:2px,color:#F8FAFC;
    classDef secondary fill:#0F172A,stroke:#38BDF8,stroke-width:2px,color:#F8FAFC;
    classDef accent fill:#064E3B,stroke:#34D399,stroke-width:2px,color:#F8FAFC;
    class UI primary;
    class Agent,Tools secondary;
    class Risk,PayPal,DB accent;
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | **Next.js 16** (App Router, Turbopack, React 19) |
| **Styling & Design** | **Tailwind CSS v4**, Vanilla CSS Design Tokens, Dual-Theme Pastels |
| **3D Graphics & Motion** | **Three.js** (Holographic Icosahedron Shield), **Framer Motion** |
| **Backend & Validation** | Next.js API Route Handlers, **Zod** Schema Validation, **Scrypt** Auth |
| **Database & Persistence** | **SQLite** with **Prisma ORM** (22 products, 8 sellers, pre-computed risk data) |
| **Payment Gateway** | **PayPal Orders API v2** (`@paypal/react-paypal-js`), Webhooks, Sandbox Capture |
| **AI Intelligence** | Model-Driven Orchestrator (Google Gemini / OpenAI compatible REST client + Semantic Fallback) |
| **Testing** | **Vitest** (68 passing unit, integration & parameterised generalisation tests) |

---

## 🚀 Quick Setup & Testing

### 1. Clone & Install
```bash
git clone https://github.com/ASTA91-GIT/PayPal---Hackathon-.git
cd PayPal---Hackathon-
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
*(Default `.env` runs zero-config SQLite out of the box. `GEMINI_API_KEY` and `OPENAI_API_KEY` are optional.)*

### 3. Seed Database & Start Server
```bash
npm run db:push
npm run db:seed
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.  
Demo Operator Login: `olivia.vance@techcorp.io` / `Password123!`

### 4. Run Automated Test Suite
```bash
npm run test
```
```
 ✓ tests/cartCalculations.test.ts (4 tests) - Server price authority & anti-tamper
 ✓ tests/riskEngine.test.ts (4 tests) - 5-Vector deterministic risk scoring
 ✓ tests/auth.test.ts (4 tests) - Scrypt hashing & timing-safe authentication
 ✓ tests/agentGeneralisation.test.ts (56 tests) - Dynamic language invariants

Test Files  4 passed (4)
     Tests  68 passed (68)
```

---

## 💳 PayPal Sandbox Notes

- **Instant 1-Click Simulation**: When evaluating without external PayPal sandbox credentials, click the **"⚡ Instant Quick Sandbox Capture"** button on `/checkout` to execute server-side validation and issue a verified capture receipt.
- **Live PayPal Sandbox Credentials**: To test with your personal PayPal sandbox account, add your `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` to `.env`. The official PayPal Smart Payment Buttons will render automatically.

---

## ⚖️ Copyright & Attribution

```
Copyright (c) 2026 TrustCart AI Contributors. All rights reserved.
Developed for the PayPal AI Hackathon 2026.
```

- Distributed under the **[MIT License](LICENSE)**.
- **PayPal**, **PayPal Sandbox**, **PayPal Orders API v2**, and respective logos are trademarks or registered trademarks of **PayPal Holdings, Inc.**
- Product names and reference brands in demonstration data belong to their respective owners.

---
*Built with passion for the PayPal AI Hackathon 2026.*
