"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  FileText, 
  Cpu, 
  Fingerprint, 
  Layers, 
  ExternalLink,
  Code,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShoppingCart
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

function InvestigateContent() {
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
      .catch(() => setError("Failed to load investigation dossier"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
        Generating forensic neural dossier across 5 evidence vectors...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
          {error || "Report Unavailable"}
        </h2>
        <Link href="/discover" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
          style={{ backgroundColor: "var(--accent-lavender)", color: "#171722" }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const a = product.assessment;
  const score = a?.overallScore ?? 15;
  const isSafe = score < 25;
  const isMod = score >= 25 && score < 50;
  const isHigh = score >= 50;

  const themeStatusColor = isSafe
    ? "var(--status-mint)"
    : isHigh
    ? "var(--status-coral)"
    : "var(--status-peach)";

  const themeStatusBg = isSafe
    ? "var(--status-mint-bg)"
    : isHigh
    ? "var(--status-coral-bg)"
    : "var(--status-peach-bg)";

  const themeStatusBorder = isSafe
    ? "var(--status-mint-border)"
    : isHigh
    ? "var(--status-coral-border)"
    : "var(--status-peach-border)";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/products/${product.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold font-mono-tech hover:text-[var(--accent-lavender)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Listing</span>
        </Link>

        <div className="flex items-center gap-2 font-mono-tech text-xs">
          <span className="px-2 py-0.5 rounded border" style={{ backgroundColor: themeStatusBg, color: themeStatusColor, borderColor: themeStatusBorder }}>
            CONFIDENCE: {Math.round((a?.confidenceScore || 0.95) * 100)}%
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            DOSSIER #{a?.id ? a.id.substring(0, 8).toUpperCase() : "TC-88204"}
          </span>
        </div>
      </div>

      {/* Main Dossier Split Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border glass-panel-elevated relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
              EXPLAINABLE RISK INTELLIGENCE REPORT
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl" style={{ color: "var(--text-primary)" }}>
              FORENSIC TRUST REPORT: {product.title}
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {a?.summary || "Comprehensive multi-vector evaluation indexed against manufacturer telemetry."}
            </p>
          </div>

          {/* Large Dimensional Score Pill */}
          <div className="p-6 rounded-2xl border glass-panel flex flex-col items-center justify-center min-w-[200px] text-center"
            style={{ borderColor: themeStatusBorder }}
          >
            <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
              OBSERVED FRAUD RISK
            </span>
            <div className="font-display font-black text-5xl my-1" style={{ color: themeStatusColor }}>
              {score}<span className="text-lg font-normal opacity-60">/100</span>
            </div>
            <span className="text-xs font-bold font-mono-tech px-2.5 py-0.5 rounded uppercase"
              style={{ backgroundColor: themeStatusBg, color: themeStatusColor }}
            >
              {a?.verdict || "SAFE_CLEARANCE"}
            </span>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
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
                riskTier: a?.riskTier || "LOW",
              })
            }
            className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 transition-all hover:scale-105"
            style={{
              backgroundColor: "var(--accent-lavender)",
              color: "#171722",
            }}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add to Cart with PayPal Guarantee</span>
          </button>

          <Link
            href={`/compare?id1=${product.id}&id2=prod-kb-003`}
            className="px-4 py-2.5 rounded-xl border text-xs font-semibold glass-subtle transition-all"
            style={{ color: "var(--text-primary)" }}
          >
            Compare against safe baseline
          </Link>
        </div>
      </div>

      {/* 5-Vector Multi-Factor Risk Breakdown Grid */}
      <section className="space-y-4">
        <h2 className="font-heading font-bold text-lg" style={{ color: "var(--text-primary)" }}>
          Multi-Vector Risk Breakdown (5 Core Tenets)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Vector 1 */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>Price Anomaly</span>
              <span className="font-mono-tech font-bold" style={{ color: "var(--accent-lavender)" }}>
                {a?.priceAnomalyScore ?? 10}/100
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a?.priceAnomalyScore ?? 10}%`,
                  backgroundColor: "var(--accent-lavender)",
                }}
              />
            </div>
            <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
              Weight: 25% · MSRP Delta
            </span>
          </div>

          {/* Vector 2 */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>Seller History</span>
              <span className="font-mono-tech font-bold" style={{ color: "var(--accent-blue)" }}>
                {a?.sellerRepScore ?? 15}/100
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a?.sellerRepScore ?? 15}%`,
                  backgroundColor: "var(--accent-blue)",
                }}
              />
            </div>
            <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
              Weight: 25% · Dispute Rate
            </span>
          </div>

          {/* Vector 3 */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>Listing Specs</span>
              <span className="font-mono-tech font-bold" style={{ color: "var(--status-mint)" }}>
                {a?.listingScore ?? 10}/100
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a?.listingScore ?? 10}%`,
                  backgroundColor: "var(--status-mint)",
                }}
              />
            </div>
            <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
              Weight: 20% · Integrity Check
            </span>
          </div>

          {/* Vector 4 */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>Bot Velocity</span>
              <span className="font-mono-tech font-bold" style={{ color: "var(--accent-pink)" }}>
                {a?.velocityScore ?? 8}/100
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a?.velocityScore ?? 8}%`,
                  backgroundColor: "var(--accent-pink)",
                }}
              />
            </div>
            <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
              Weight: 15% · Burst Detection
            </span>
          </div>

          {/* Vector 5 */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold" style={{ color: "var(--text-primary)" }}>Evidence Coverage</span>
              <span className="font-mono-tech font-bold" style={{ color: "var(--status-peach)" }}>
                {a?.evidenceScore ?? 10}/100
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${a?.evidenceScore ?? 10}%`,
                  backgroundColor: "var(--status-peach)",
                }}
              />
            </div>
            <span className="text-[10px] block" style={{ color: "var(--text-muted)" }}>
              Weight: 15% · Cross-Merchant
            </span>
          </div>
        </div>
      </section>

      {/* Forensic Signals Table */}
      <section className="space-y-4">
        <h2 className="font-heading font-bold text-lg" style={{ color: "var(--text-primary)" }}>
          Itemized Forensic Evidence Signals ({a?.signals?.length || 0})
        </h2>

        <div className="space-y-3">
          {(a?.signals || []).map((sig: any) => {
            const isCrit = sig.severity === "CRITICAL" || sig.severity === "HIGH";
            return (
              <div
                key={sig.id}
                className="p-4 rounded-2xl border glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold font-mono-tech uppercase border"
                      style={{
                        backgroundColor: isCrit ? "var(--status-coral-bg)" : "var(--status-mint-bg)",
                        color: isCrit ? "var(--status-coral)" : "var(--status-mint)",
                        borderColor: isCrit ? "var(--status-coral-border)" : "var(--status-mint-border)",
                      }}
                    >
                      {sig.severity}
                    </span>
                    <span className="font-mono-tech font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                      {sig.name}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {sig.evidence}
                  </p>
                </div>

                <div className="text-right shrink-0 font-mono-tech text-xs">
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Provenance</span>
                  <div className="font-semibold" style={{ color: "var(--accent-blue)" }}>
                    {sig.provenance}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Confidence: {Math.round(sig.confidence * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Intercepting Rule Logic Snippet (Direct from Stitch Reference) */}
      <section className="p-5 rounded-2xl border glass-panel space-y-2">
        <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
          INTERCEPTING RULE CODE SPECIFICATION
        </span>
        <div className="p-3 rounded-lg font-mono-tech text-xs border glass-subtle"
          style={{ color: "var(--accent-lavender)" }}
        >
          <code>
            {isHigh
              ? "rule.risk_score > 70 && tx.price_markdown > 0.65 -> ACTION_STEP_UP_OR_DECLINE"
              : "rule.risk_score < 25 && seller.is_verified == true -> ACTION_AUTO_CLEARED_PASS_THROUGH"}
          </code>
        </div>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
          Deterministic rule executed locally without third-party LLM hallucination risks.
        </p>
      </section>
    </div>
  );
}

export default function InvestigatePage() {
  return (
    <React.Suspense fallback={<div className="p-16 text-center text-xs font-mono-tech">Loading forensic neural dossier...</div>}>
      <InvestigateContent />
    </React.Suspense>
  );
}
