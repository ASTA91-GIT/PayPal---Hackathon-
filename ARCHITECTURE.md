# TrustCart AI — Technical Architecture Specification

**PayPal AI Hackathon 2026**

TrustCart AI is an autonomous, explainable AI shopping and fraud-intelligence platform. It combines conversational intent extraction, deterministic multi-vector risk evaluation, and official PayPal Sandbox checkout clearance.

---

## 1. System Architecture Overview

```
[ Buyer / Evaluator ]
        │
        ▼ (Pastel Glassmorphic Dual-Theme UI)
┌─────────────────────────────────────────────────────────────────────────┐
│ Next.js 16 App Router (React 19 + Tailwind v4 + Framer Motion + Three.js)│
│                                                                         │
│ Routes:                                                                 │
│  /           Landing Page with 3D Holographic Trust Core                │
│  /discover   Product Catalog with Risk Badges & Sliders                 │
│  /agent      AI Shopping Workspace & Live Tool Tracing Console          │
│  /products   Product Details, Technical Specs, Seller Reputation        │
│  /investigate Deep Forensic Trust Report & 5-Vector Breakdown           │
│  /compare    Multi-Product Value-to-Safety Matrix                       │
│  /cart       Server-Recalculated Cart & Risk Profile Summary            │
│  /checkout   PayPal Orders API v2 Preparation & Real Capture            │
│  /orders     Persistent Audit Ledger & Cryptographic Verification       │
│  /dashboard  Real-Time Transaction Stream Cockpit (Stitch Spec)         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
           ┌─────────────────────────┴─────────────────────────┐
           ▼                                                   ▼
┌──────────────────────────────────┐      ┌───────────────────────────────┐
│ Autonomous AI Shopping Agent     │      │ Deterministic Trust Engine    │
│  • search_products               │      │  • Vector 1: Price Anomaly    │
│  • assess_listing                │      │  • Vector 2: Seller History   │
│  • compare_products              │      │  • Vector 3: Listing Specs    │
│  • prepare_cart                  │      │  • Vector 4: Review Velocity  │
│  • get_checkout_summary          │      │  • Vector 5: Evidence Density │
└──────────────────┬───────────────┘      └───────────────┬───────────────┘
                   │                                      │
                   └──────────────────┬───────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Server-Side Operations & PayPal Payment Gateway Layer                   │
│                                                                         │
│  1. /api/paypal/create-order:                                           │
│     • Revalidates stock and authoritative pricing from database         │
│     • Acquires OAuth2 bearer token from PayPal Sandbox                  │
│     • Creates order via POST /v2/checkout/orders                        │
│     • Persists internal Order with "AWAITING_APPROVAL" state             │
│                                                                         │
│  2. Buyer approves order via official @paypal/react-paypal-js Buttons    │
│                                                                         │
│  3. /api/paypal/capture-order:                                          │
│     • Captures via POST /v2/checkout/orders/{id}/capture                │
│     • Verifies capture status == "COMPLETED"                            │
│     • Idempotently creates PaymentCapture record in database            │
│     • Transitions internal Order state to "COMPLETED"                   │
│                                                                         │
│  4. /api/paypal/webhook:                                                │
│     • Asynchronous event reconciliation (PAYMENT.CAPTURE.COMPLETED)     │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ Persistent Data Storage (Prisma ORM + SQLite / PostgreSQL)              │
│  • Product, Seller, RiskAssessment, RiskSignal                          │
│  • Cart, CartItem, Order, OrderItem, PaymentCapture                     │
│  • AgentSession, AgentMessage                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Deterministic Risk Scoring Model

The risk engine computes an explainable score $R \in [0, 100]$ using five weighted evidence tenets:

$$\text{RawScore} = \sum_{i=1}^5 w_i \cdot V_i$$

Where:
- $V_1$: **Price Anomaly Vector** ($w_1 = 0.25$) — MSRP discount deviation $> 70\%$ flags critical counterfeit indicators ($92/100$).
- $V_2$: **Seller Reputation Vector** ($w_2 = 0.25$) — Dispute rate $> 5\%$ or newly created storefronts ($< 30$ days) trigger high dispute signals.
- $V_3$: **Product Listing Integrity Vector** ($w_3 = 0.20$) — Hardware specification completeness and opaque technical data checks.
- $V_4$: **Behavioral & Review Velocity Vector** ($w_4 = 0.15$) — Detects unnatural astroturfing review bursts (e.g., $850+$ reviews in $< 7$ days).
- $V_5$: **Evidence Coverage & Density Vector** ($w_5 = 0.15$) — Penalizes missing cross-merchant corroboration data.

### Presentation Bands
- **0 – 24**: Lower Observed Risk (`SAFE_CLEARANCE`) — Verified authentic.
- **25 – 49**: Moderate Observed Risk (`VERIFIED_TRUST`) — Minor pricing or history variances.
- **50 – 74**: High Observed Risk (`STEP_UP_REVIEW`) — Elevated dispute or missing hardware baseline.
- **75 – 100**: Critical Observed Risk (`ANOMALY_HALT`) — Synergistic anomaly / counterfeit warning.

---

## 3. Official PayPal Integration Workflow

TrustCart AI integrates directly with official PayPal developer APIs:
1. **Frontend**: `@paypal/react-paypal-js` `PayPalScriptProvider` and `PayPalButtons`.
2. **Backend**:
   - `https://api-m.sandbox.paypal.com/v1/oauth2/token` for secure server-to-server credentials.
   - `https://api-m.sandbox.paypal.com/v2/checkout/orders` for order generation and capture.
3. **Price Authority**: Prices submitted by the client are strictly ignored; all line totals, shipping thresholds, and tax percentages are recalculated server-side from active catalog database records.
4. **Resilient Sandbox Fallback**: If sandbox credentials are not yet configured in `.env`, TrustCart AI provides an Instant Sandbox Simulator that executes the exact same server validation and order persistence lifecycle.

---

## 4. Dual-Theme Pastel Design Tokens

- **Light Mode ("Dreamy")**:
  - Background: `#F8F7FC`
  - Secondary: `#F1EFF9`
  - Lavender Accent: `#9D87E8`
  - Blue Accent: `#5BA8C2`
  - Pink Accent: `#D97E9E`
  - Primary Text: `#29263D`
- **Dark Mode ("Midnight")**:
  - Background: `#171722`
  - Secondary: `#201F30`
  - Lavender Accent: `#C4B5FD`
  - Blue Accent: `#A9D9F0`
  - Pink Accent: `#F0BDD3`
  - Primary Text: `#F3F0FA`
- **Status Tones**:
  - Mint: `#2E8B65` (Light) / `#AEE4CD` (Dark)
  - Coral: `#C74A6A` (Light) / `#F59EA0` (Dark)
  - Peach: `#A66524` (Light) / `#F3D0B4` (Dark)
