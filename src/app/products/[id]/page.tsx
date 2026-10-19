"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft, 
  Scale, 
  ExternalLink,
  Store,
  Layers,
  Clock
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

function ProductDetailContent() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.product) {
          setProduct(data.product);
        } else {
          setError(data.error || "Product not found");
        }
      })
      .catch((err) => setError("Failed to load product details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
        Loading product telemetry and forensic evaluation...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          {error || "Product Not Found"}
        </h2>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
          style={{
            backgroundColor: "var(--accent-lavender)",
            color: "#171722",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover Catalog</span>
        </Link>
      </div>
    );
  }

  const assessment = product.assessment;
  const score = assessment?.overallScore ?? 15;
  const isSafe = score < 25;
  const isHigh = score >= 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Link */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-tech transition-colors hover:text-[var(--accent-lavender)]"
        style={{ color: "var(--text-secondary)" }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Product Discovery</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Image & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border glass-panel p-2 relative bg-black/10">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute top-4 right-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold font-mono-tech uppercase border shadow-md"
                style={{
                  backgroundColor: isSafe
                    ? "var(--status-mint-bg)"
                    : isHigh
                    ? "var(--status-coral-bg)"
                    : "var(--status-peach-bg)",
                  color: isSafe
                    ? "var(--status-mint)"
                    : isHigh
                    ? "var(--status-coral)"
                    : "var(--status-peach)",
                  borderColor: isSafe
                    ? "var(--status-mint-border)"
                    : isHigh
                    ? "var(--status-coral-border)"
                    : "var(--status-peach-border)",
                }}
              >
                Risk Score: {score}/100 · {assessment?.riskTier || "LOW"}
              </span>
            </div>
          </div>

          {/* Quick Forensic Banner */}
          <div className="p-4 rounded-xl border glass-panel flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
                FORENSIC CLEARANCE VERDICT
              </span>
              <div className="font-mono-tech font-bold text-xs" style={{ color: isSafe ? "var(--status-mint)" : "var(--status-coral)" }}>
                {assessment?.verdict || "SAFE_CLEARANCE"}
              </div>
            </div>
            <Link
              href={`/investigate/${product.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"
              style={{
                backgroundColor: "var(--accent-lavender)",
                color: "#171722",
              }}
            >
              <span>Full Trust Report</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Title, Pricing, Actions, Seller Bio */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono-tech px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--bg-surface-subtle)",
                  color: "var(--accent-lavender)",
                }}
              >
                {product.category}
              </span>
              <span className="text-xs font-mono-tech" style={{ color: "var(--text-muted)" }}>
                ID: {product.id}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl leading-snug" style={{ color: "var(--text-primary)" }}>
              {product.title}
            </h1>
          </div>

          {/* Price Authority Block */}
          <div className="p-4 rounded-xl border glass-panel flex items-center justify-between">
            <div>
              <span className="text-[10px] font-cyber-tag" style={{ color: "var(--text-muted)" }}>
                SERVER-VERIFIED CATALOG PRICE
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono-tech font-black text-3xl" style={{ color: "var(--text-primary)" }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.referencePrice && (
                  <span className="font-mono-tech text-sm line-through" style={{ color: "var(--text-muted)" }}>
                    MSRP ${product.referencePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="font-mono-tech text-xs" style={{ color: "var(--status-mint)" }}>
                ● {product.stock} Units In Stock
              </span>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                Ships via Express Logistics
              </div>
            </div>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {product.description}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() =>
                addItem({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  currency: "USD",
                  imageUrl: product.imageUrl,
                  category: product.category,
                  sellerName: product.seller.name,
                  riskScore: score,
                  riskTier: assessment?.riskTier || "LOW",
                })
              }
              className="flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              style={{
                backgroundColor: "var(--accent-lavender)",
                color: "#171722",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Shopping Cart</span>
            </button>

            <Link
              href={`/compare?id1=${product.id}&id2=prod-kb-003`}
              className="py-3.5 px-4 rounded-xl border text-xs font-semibold glass-subtle hover:bg-[var(--bg-surface-elevated)] flex items-center gap-1.5 transition-all"
              style={{ color: "var(--text-primary)" }}
            >
              <Scale className="w-4 h-4" />
              <span>Compare</span>
            </Link>
          </div>

          {/* Seller Snapshot Box */}
          <div className="p-4 rounded-xl border glass-panel space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4" style={{ color: "var(--accent-lavender)" }} />
                <span className="font-heading font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                  Merchant Identity Record
                </span>
              </div>
              {product.seller.isVerified && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech"
                  style={{
                    backgroundColor: "var(--status-mint-bg)",
                    color: "var(--status-mint)",
                  }}
                >
                  VERIFIED MERCHANT
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-tech">
              <div className="p-2 rounded-lg border glass-subtle">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Merchant</span>
                <div className="font-bold truncate" style={{ color: "var(--text-primary)" }}>{product.seller.name}</div>
              </div>
              <div className="p-2 rounded-lg border glass-subtle">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Rating</span>
                <div className="font-bold" style={{ color: "var(--accent-lavender)" }}>{product.seller.rating} ★</div>
              </div>
              <div className="p-2 rounded-lg border glass-subtle">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Account Age</span>
                <div className="font-bold" style={{ color: "var(--text-primary)" }}>{product.seller.accountAgeDays} days</div>
              </div>
              <div className="p-2 rounded-lg border glass-subtle">
                <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Dispute Rate</span>
                <div className="font-bold" style={{ color: product.seller.disputeRate > 0.05 ? "var(--status-coral)" : "var(--status-mint)" }}>
                  {(product.seller.disputeRate * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>
              Technical Specifications
            </h3>
            <div className="rounded-xl border glass-panel overflow-hidden">
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val], i) => (
                    <tr
                      key={key}
                      className={i % 2 === 0 ? "glass-subtle" : "transparent"}
                    >
                      <td className="px-4 py-2 font-medium" style={{ color: "var(--text-secondary)" }}>
                        {key}
                      </td>
                      <td className="px-4 py-2 font-mono-tech font-bold" style={{ color: "var(--text-primary)" }}>
                        {String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs font-mono-tech">Loading product details...</div>}>
      <ProductDetailContent />
    </React.Suspense>
  );
}
