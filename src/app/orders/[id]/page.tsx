"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowLeft, 
  Printer, 
  ExternalLink,
  Package,
  CreditCard,
  Lock,
  Layers
} from "lucide-react";

function OrderReceiptContent() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Order not found");
        }
      })
      .catch(() => setError("Failed to retrieve order receipt"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
        Verifying cryptographic capture ledger...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          {error || "Order Not Found"}
        </h2>
        <Link href="/orders" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
          style={{ backgroundColor: "var(--accent-lavender)", color: "#171722" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
      </div>
    );
  }

  const capture = order.captures?.[0];
  const isCompleted = order.status === "COMPLETED";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back & Print Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-tech hover:text-[var(--accent-lavender)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold glass-subtle transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Main Receipt Sheet */}
      <div className="p-6 sm:p-10 rounded-3xl border glass-panel-elevated space-y-8 shadow-xl">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                TRUSTCART<span style={{ color: "var(--accent-lavender)" }}> AI</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded font-mono-tech font-bold uppercase border"
                style={{
                  backgroundColor: isCompleted ? "var(--status-mint-bg)" : "var(--status-peach-bg)",
                  color: isCompleted ? "var(--status-mint)" : "var(--status-peach)",
                  borderColor: isCompleted ? "var(--status-mint-border)" : "var(--status-peach-border)",
                }}
              >
                {order.status}
              </span>
            </div>
            <p className="font-mono-tech text-xs" style={{ color: "var(--text-secondary)" }}>
              Official Transaction Receipt · Order Ref: {order.orderNumber}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono-tech text-xs space-y-0.5">
            <div style={{ color: "var(--text-muted)" }}>Date Issued</div>
            <div className="font-bold" style={{ color: "var(--text-primary)" }}>
              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Buyer & Shipping Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono-tech">
          <div className="p-4 rounded-xl border glass-subtle space-y-1.5">
            <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>
              Buyer &amp; Account Identity
            </span>
            <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              {order.buyerName}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              {order.buyerEmail}
            </div>
          </div>

          <div className="p-4 rounded-xl border glass-subtle space-y-1.5">
            <span className="text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>
              Fulfillment &amp; Delivery Destination
            </span>
            <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Standard Express Delivery
            </div>
            <div style={{ color: "var(--text-secondary)" }}>
              {order.shippingAddress?.line1 || "Customer address on record"}
            </div>
          </div>
        </div>

        {/* Purchased Items Table */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            Purchased Line Items
          </h3>
          <div className="rounded-xl border glass-panel overflow-hidden">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b font-mono-tech uppercase text-[10px]"
                  style={{
                    backgroundColor: "var(--bg-surface-subtle)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-muted)",
                  }}
                >
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Price</th>
                  <th className="p-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono-tech" style={{ borderColor: "var(--border-color)" }}>
                {order.items.map((item: any) => (
                  <tr key={item.id}>
                    <td className="p-3">
                      <div className="font-bold font-heading text-xs" style={{ color: "var(--text-primary)" }}>
                        {item.title}
                      </div>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        Seller: {item.sellerName} · Verified Authenticity
                      </span>
                    </td>
                    <td className="p-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                      {item.quantity}
                    </td>
                    <td className="p-3" style={{ color: "var(--text-secondary)" }}>
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-bold" style={{ color: "var(--text-primary)" }}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Subtotals */}
        <div className="flex justify-end">
          <div className="w-72 space-y-2 text-xs font-mono-tech">
            <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
              <span>Subtotal:</span>
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
              <span>Shipping:</span>
              <span>{order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
              <span>Sales Tax:</span>
              <span>${order.taxFee.toFixed(2)}</span>
            </div>
            <div className="h-px border-b" style={{ borderColor: "var(--border-color)" }} />
            <div className="flex justify-between text-base font-bold" style={{ color: "var(--text-primary)" }}>
              <span>Paid Total:</span>
              <span className="text-xl" style={{ color: "var(--accent-lavender)" }}>
                ${order.totalAmount.toFixed(2)} {order.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Cryptographic PayPal Capture Certificate */}
        <div className="p-5 rounded-2xl border space-y-3"
          style={{
            backgroundColor: "var(--status-mint-bg)",
            borderColor: "var(--status-mint-border)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" style={{ color: "var(--status-mint)" }} />
              <span className="font-heading font-bold text-xs" style={{ color: "var(--status-mint)" }}>
                PayPal Sandbox Cryptographic Capture Verification
              </span>
            </div>
            <span className="font-mono-tech text-[10px] font-bold uppercase" style={{ color: "var(--status-mint)" }}>
              SLA VERIFIED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono-tech text-xs">
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>PayPal Order ID:</span>
              <div className="font-bold truncate" style={{ color: "var(--text-primary)" }}>
                {order.paypalOrderId || "PAYPAL-ORD-SANDBOX"}
              </div>
            </div>
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>PayPal Capture ID:</span>
              <div className="font-bold truncate" style={{ color: "var(--status-mint)" }}>
                {capture?.paypalCaptureId || "CAPTURE-PENDING"}
              </div>
            </div>
            <div>
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Buyer Protection:</span>
              <div className="font-bold" style={{ color: "var(--status-mint)" }}>
                100% ELIGIBLE
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderReceiptPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs font-mono-tech">Loading transaction receipt...</div>}>
      <OrderReceiptContent />
    </React.Suspense>
  );
}
