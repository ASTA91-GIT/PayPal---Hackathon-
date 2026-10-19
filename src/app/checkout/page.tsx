"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard,
  Check,
  Loader2,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import confetti from "canvas-confetti";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shippingFee, taxFee, total, avgRiskScore, clearCart } = useCart();

  const [buyerName, setBuyerName] = useState("Olivia Vance");
  const [buyerEmail, setBuyerEmail] = useState("olivia.vance@techcorp.io");
  const [shippingLine, setShippingLine] = useState("420 Silicon Boulevard, San Jose, CA");
  const [termsApproved, setTermsApproved] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const isSafeCart = avgRiskScore < 25;

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          NO ACTIVE CHECKOUT SESSION
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
          Your cart is currently empty. Please add items to proceed with checkout.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
          style={{ backgroundColor: "var(--accent-lavender)", color: "#171722" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    );
  }

  // Success Receipt State
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <div className="p-8 rounded-3xl border glass-panel-elevated text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: "var(--status-mint-bg)",
              color: "var(--status-mint)",
              borderColor: "var(--status-mint-border)",
            }}
          >
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--status-mint)" }}>
            TRANSACTION CAPTURE COMPLETED
          </span>

          <h1 className="font-display font-extrabold text-3xl sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            PAYMENT CONFIRMED
          </h1>

          <p className="text-xs sm:text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            PayPal verified transaction capture confirmed by server. Order record has been persisted into application database.
          </p>

          <div className="p-4 rounded-xl border glass-subtle max-w-md mx-auto text-left font-mono-tech text-xs space-y-2">
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Order Reference:</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>PayPal Capture ID:</span>
              <span className="font-bold truncate max-w-[180px]" style={{ color: "var(--accent-lavender)" }}>
                {completedOrder.captureId}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Captured Amount:</span>
              <span className="font-bold" style={{ color: "var(--status-mint)" }}>
                ${completedOrder.amount ? completedOrder.amount.toFixed(2) : total.toFixed(2)} USD
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: "var(--text-muted)" }}>Payment Status:</span>
              <span className="font-bold uppercase" style={{ color: "var(--status-mint)" }}>COMPLETED</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/orders/${completedOrder.orderId || completedOrder.orderNumber}`}
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md"
              style={{
                backgroundColor: "var(--accent-lavender)",
                color: "#171722",
              }}
            >
              View Order Receipt &amp; Status
            </Link>

            <Link
              href="/orders"
              className="px-5 py-3 rounded-xl border text-xs font-semibold glass-subtle"
              style={{ color: "var(--text-primary)" }}
            >
              Order History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Create Order Handler called by PayPal SDK Buttons
  const handleCreateOrder = async () => {
    try {
      setProcessing(true);
      setErrorMsg(null);

      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          buyerName,
          buyerEmail,
          shippingAddress: { line1: shippingLine },
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to initialize PayPal order");
      }

      return data.paypalOrderId;
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate PayPal order");
      setProcessing(false);
      throw err;
    }
  };

  // Capture Order Handler called by PayPal SDK Buttons on buyer approval
  const handleApprove = async (data: any) => {
    try {
      setProcessing(true);
      const res = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paypalOrderId: data.orderID,
        }),
      });

      const captureData = await res.json();
      if (!captureData.success) {
        throw new Error(captureData.error || "Capture verification failed");
      }

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#9D87E8", "#5BA8C2", "#D97E9E", "#2E8B65"],
        });
      } catch {}

      clearCart();
      setCompletedOrder(captureData);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to capture payment");
    } finally {
      setProcessing(false);
    }
  };

  // Safe Instant Sandbox Simulation Trigger (for zero-friction test runs)
  const handleSimulateSandboxCapture = async () => {
    try {
      setProcessing(true);
      setErrorMsg(null);

      // 1. Create order
      const createRes = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
          buyerName,
          buyerEmail,
          shippingAddress: { line1: shippingLine },
        }),
      });

      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error);

      // 2. Capture order
      const captureRes = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: createData.orderId,
          paypalOrderId: createData.paypalOrderId,
        }),
      });

      const captureData = await captureRes.json();
      if (!captureData.success) throw new Error(captureData.error);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ["#C4B5FD", "#A9D9F0", "#F0BDD3", "#AEE4CD"],
        });
      } catch {}

      clearCart();
      setCompletedOrder(captureData);
    } catch (err: any) {
      setErrorMsg(err.message || "Sandbox clearance failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
            CHECKOUT CLEARANCE &amp; PAYPAL INTEGRATION
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            FINAL CHECKOUT REVIEW
          </h1>
        </div>

        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-tech hover:text-[var(--accent-lavender)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Edit Cart</span>
        </Link>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl border flex items-center gap-3 text-xs"
          style={{
            backgroundColor: "var(--status-coral-bg)",
            borderColor: "var(--status-coral-border)",
            color: "var(--status-coral)",
          }}
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Buyer Info & Trust Clearance */}
        <div className="lg:col-span-7 space-y-6">
          {/* Buyer Details */}
          <div className="p-6 rounded-2xl border glass-panel space-y-4">
            <h2 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>
              1. Delivery &amp; Buyer Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono-tech">
              <div>
                <label className="block mb-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Full Buyer Name
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border glass-subtle focus:outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Verified Contact Email
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full p-2.5 rounded-lg border glass-subtle focus:outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-1 font-semibold" style={{ color: "var(--text-secondary)" }}>
                  Express Shipping Destination
                </label>
                <input
                  type="text"
                  value={shippingLine}
                  onChange={(e) => setShippingLine(e.target.value)}
                  className="w-full p-2.5 rounded-lg border glass-subtle focus:outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
              </div>
            </div>
          </div>

          {/* Trust Certification Seal */}
          <div className="p-6 rounded-2xl border glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                <ShieldCheck className="w-5 h-5" style={{ color: "var(--status-mint)" }} />
                <span>2. TrustCart AI Risk Certification</span>
              </h2>
              <span className="font-mono-tech text-xs font-bold px-2 py-0.5 rounded"
                style={{
                  backgroundColor: isSafeCart ? "var(--status-mint-bg)" : "var(--status-coral-bg)",
                  color: isSafeCart ? "var(--status-mint)" : "var(--status-coral)",
                }}
              >
                Avg Risk: {avgRiskScore}/100
              </span>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Every item in this order has undergone automated 5-vector inspection against price anomalies, counterfeit seller syndicates, and specification veracity.
            </p>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1 text-xs" style={{ color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={termsApproved}
                onChange={(e) => setTermsApproved(e.target.checked)}
                className="mt-0.5 rounded accent-[var(--accent-lavender)]"
              />
              <span>
                I confirm the order specifications and authorize proceeding to PayPal Sandbox Checkout.
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Order Total & Real PayPal Buttons */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl border glass-panel-elevated space-y-6 shadow-lg">
            <h2 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>
              Authoritative Payment Total
            </h2>

            {/* Item list mini summary */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs font-mono-tech">
                  <span className="truncate max-w-[200px]" style={{ color: "var(--text-secondary)" }}>
                    {quantity}x {product.title}
                  </span>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>
                    ${(product.price * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px border-b" style={{ borderColor: "var(--border-color)" }} />

            {/* Calculations */}
            <div className="space-y-1.5 text-xs font-mono-tech">
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Sales Tax (5%)</span>
                <span>${taxFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2" style={{ color: "var(--text-primary)" }}>
                <span>Grand Total</span>
                <span className="text-xl" style={{ color: "var(--accent-lavender)" }}>${total.toFixed(2)} USD</span>
              </div>
            </div>

            {/* PayPal Buttons Render Container */}
            <div className="space-y-3 pt-2">
              <span className="font-cyber-tag text-[10px] block" style={{ color: "var(--text-muted)" }}>
                SELECT PAYMENT METHOD:
              </span>

              {termsApproved ? (
                <div className="space-y-3">
                  {/* Official PayPal Buttons Component */}
                  <div className="min-h-[90px] relative z-10">
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "paypal",
                      }}
                      createOrder={handleCreateOrder}
                      onApprove={handleApprove}
                      onError={(err) => {
                        console.error("PayPal Button error:", err);
                        setErrorMsg("PayPal checkout encountered an error. Please try again or use the Instant Sandbox Simulator.");
                      }}
                      onCancel={() => {
                        setErrorMsg("Payment was cancelled by user.");
                      }}
                    />
                  </div>

                  {/* Dual Mode: One-Click Sandbox Capture Simulator for zero-friction evaluation */}
                  <div className="pt-2">
                    <button
                      onClick={handleSimulateSandboxCapture}
                      disabled={processing}
                      className="w-full py-2.5 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 glass-subtle transition-all hover:bg-[var(--bg-surface-elevated)]"
                      style={{ color: "var(--accent-lavender)" }}
                      title="Simulates full server order creation and verified capture without opening external popups"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Capture...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Quick Sandbox Capture (1-Click Test)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-center block mt-1" style={{ color: "var(--text-muted)" }}>
                      Executes full server validation &amp; DB persistence.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border text-center text-xs font-mono-tech"
                  style={{
                    backgroundColor: "var(--status-peach-bg)",
                    color: "var(--status-peach)",
                  }}
                >
                  Please approve the risk certification check above to activate PayPal checkout buttons.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
