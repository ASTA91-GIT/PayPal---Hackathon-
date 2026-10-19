"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle,
  ArrowLeft
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    taxFee,
    total,
    avgRiskScore,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const isSafeCart = avgRiskScore < 25;
  const isHighRiskCart = avgRiskScore >= 50;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center border glass-panel"
          style={{ color: "var(--accent-lavender)" }}
        >
          <ShoppingCart className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            YOUR SHOPPING CART IS EMPTY
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Explore our curated catalog of gaming peripherals, electronics, and accessories with verified trust ratings.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md"
            style={{
              backgroundColor: "var(--accent-lavender)",
              color: "#171722",
            }}
          >
            <span>Browse Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
            SECURE SHOPPING CONTAINER
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            SHOPPING CART ({itemCount} ITEMS)
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-tech transition-colors hover:text-[var(--status-coral)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Cols: Item List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map(({ product, quantity }) => {
            const risk = product.riskScore ?? 15;
            const isSafe = risk < 25;
            return (
              <div
                key={product.id}
                className="p-4 sm:p-5 rounded-2xl border glass-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-black/10">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-cyber-tag text-[9px]" style={{ color: "var(--text-muted)" }}>
                        {product.category}
                      </span>
                      <span
                        className="px-2 py-0.2 rounded text-[9px] font-bold font-mono-tech uppercase border"
                        style={{
                          backgroundColor: isSafe ? "var(--status-mint-bg)" : "var(--status-coral-bg)",
                          color: isSafe ? "var(--status-mint)" : "var(--status-coral)",
                          borderColor: isSafe ? "var(--status-mint-border)" : "var(--status-coral-border)",
                        }}
                      >
                        Risk: {risk}/100
                      </span>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-heading font-bold text-xs sm:text-sm line-clamp-1 hover:text-[var(--accent-lavender)]" style={{ color: "var(--text-primary)" }}>
                        {product.title}
                      </h3>
                    </Link>

                    <div className="font-mono-tech text-xs" style={{ color: "var(--accent-lavender)" }}>
                      ${product.price.toFixed(2)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  {/* Quantity Controls */}
                  <div className="flex items-center rounded-lg border glass-subtle p-0.5">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="p-1 rounded hover:bg-black/10 transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-mono-tech font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="p-1 rounded hover:bg-black/10 transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[70px]">
                    <div className="font-mono-tech font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                      ${(product.price * quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1.5 rounded-lg text-xs hover:text-[var(--status-coral)] transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 4 Cols: Summary & Risk Profile */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl border glass-panel space-y-6">
            <h2 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>
              Order &amp; Pricing Summary
            </h2>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs font-mono-tech">
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Estimated Shipping</span>
                <span className="font-bold" style={{ color: shippingFee === 0 ? "var(--status-mint)" : "var(--text-primary)" }}>
                  {shippingFee === 0 ? "FREE ($100+ Order)" : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between" style={{ color: "var(--text-secondary)" }}>
                <span>Estimated Sales Tax (5%)</span>
                <span className="font-bold" style={{ color: "var(--text-primary)" }}>${taxFee.toFixed(2)}</span>
              </div>

              <div className="h-px pt-2 border-b" style={{ borderColor: "var(--border-color)" }} />

              <div className="flex justify-between text-base font-bold pt-1" style={{ color: "var(--text-primary)" }}>
                <span>Guaranteed Total</span>
                <span className="text-xl" style={{ color: "var(--accent-lavender)" }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Cart Trust Assessment Pill */}
            <div className="p-3.5 rounded-xl border space-y-1.5"
              style={{
                backgroundColor: isSafeCart ? "var(--status-mint-bg)" : "var(--status-coral-bg)",
                borderColor: isSafeCart ? "var(--status-mint-border)" : "var(--status-coral-border)",
              }}
            >
              <div className="flex items-center justify-between text-xs font-bold font-mono-tech">
                <span style={{ color: isSafeCart ? "var(--status-mint)" : "var(--status-coral)" }}>
                  CART TRUST SCORE: {avgRiskScore}/100
                </span>
                <span className="uppercase text-[10px]" style={{ color: isSafeCart ? "var(--status-mint)" : "var(--status-coral)" }}>
                  {isSafeCart ? "Optimal Trust" : "Review Caution"}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {isSafeCart
                  ? "All cart contents cleared standard merchant authenticity checks. Eligible for automated PayPal buyer protection."
                  : "Cart includes items with elevated observed risk. Review product forensics before approval."}
              </p>
            </div>

            {/* Checkout CTA Button */}
            <Link
              href="/checkout"
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              style={{
                backgroundColor: "var(--accent-lavender)",
                color: "#171722",
              }}
            >
              <span>Proceed to PayPal Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-center">
              <span className="text-[10px] font-mono-tech" style={{ color: "var(--text-muted)" }}>
                🔒 Official PayPal JavaScript SDK v6 Integration
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
