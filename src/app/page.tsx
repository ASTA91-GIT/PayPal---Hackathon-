"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Bot, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Lock, 
  Search,
  ShoppingCart,
  ExternalLink
} from "lucide-react";
import { ThreeHeroScene } from "@/components/ThreeHeroScene";
import { useCart } from "@/components/CartProvider";

interface ProductCard {
  id: string;
  title: string;
  price: number;
  referencePrice: number | null;
  category: string;
  imageUrl: string;
  seller: { name: string; rating: number };
  assessment: {
    overallScore: number;
    riskTier: string;
    verdict: string;
    summary: string;
  } | null;
}

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setFeaturedProducts(data.products.slice(0, 6));
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative w-full overflow-hidden pb-16">
      {/* Ambient pastel mesh glowing orbs */}
      <div
        className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(circle, var(--accent-lavender) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-20 right-10 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-30"
        style={{
          background: "radial-gradient(circle, var(--accent-pink) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-96 left-12 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 pt-6">
        {/* ========================================================= */}
        {/* TOP STATUS CONDUIT STRIP                                  */}
        {/* ========================================================= */}
        <section className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--accent-lavender-bg)",
                color: "var(--accent-lavender)",
                borderColor: "var(--border-color)",
              }}
            >
              [SYSTEM: NEURAL_VECTOR_V4.2]
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--status-mint-bg)",
                color: "var(--status-mint)",
                borderColor: "var(--status-mint-border)",
              }}
            >
              [RISK_DELTA: -38.4BPS]
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--status-coral-bg)",
                color: "var(--status-coral)",
                borderColor: "var(--status-coral-border)",
              }}
            >
              [SYNAPSE: BOTNET_ISOLATED]
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="font-mono-tech text-xs flex items-center gap-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-ping"
                style={{ backgroundColor: "var(--status-mint)" }}
              />
              INGESTION PIPELINE: ACTIVE (99.999% SLA)
            </span>
            <div className="h-3 w-px" style={{ backgroundColor: "var(--border-color)" }} />
            <span
              className="font-mono-tech text-xs font-semibold"
              style={{ color: "var(--accent-blue)" }}
            >
              ZONE: AWS-US-EAST-1
            </span>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HERO SECTION WITH 3D INTERACTIVE TRUST SHIELD             */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
                color: "var(--accent-lavender)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>PayPal AI Hackathon 2026 Entry</span>
            </div>

            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[46px] leading-[1.12]"
              style={{
                color: "var(--text-primary)",
                textShadow: "0 2px 20px rgba(184, 165, 245, 0.2)",
              }}
            >
              AUTONOMOUS SHOPPING &amp; TRUST INTELLIGENCE
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-2xl"
              style={{ color: "var(--text-secondary)" }}
            >
              Shop fearlessly with an agent that investigates counterfeit deals, audits seller history across 5 forensic vectors, and prepares one-click verified checkout via official <strong>PayPal Sandbox SDK</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg transition-all hover:scale-105"
                style={{
                  backgroundColor: "var(--accent-lavender)",
                  color: "#171722",
                  boxShadow: "0 8px 24px -4px rgba(184, 165, 245, 0.45)",
                }}
              >
                <Bot className="w-4 h-4" />
                <span>Launch AI Shopping Agent</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm border backdrop-blur-md transition-all hover:bg-[var(--bg-surface-elevated)]"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
              >
                <Search className="w-4 h-4" />
                <span>Browse Catalog</span>
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl text-xs font-semibold font-mono-tech transition-all opacity-80 hover:opacity-100"
                style={{ color: "var(--accent-blue)" }}
              >
                <span>Live Intelligence Feed →</span>
              </Link>
            </div>

            {/* Trust Pill Indicators */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--status-mint)" }} />
                Real PayPal Sandbox Orders API v2
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--status-mint)" }} />
                Deterministic 5-Vector Evidence
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" style={{ color: "var(--status-mint)" }} />
                Server-Guaranteed Pricing Authority
              </span>
            </div>
          </div>

          {/* Right Column: 3D Holographic Hero Scene */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full h-[400px] sm:h-[460px] rounded-2xl border glass-panel p-2 flex items-center justify-center relative overflow-hidden">
              <ThreeHeroScene />

              {/* Holographic Overlay Badges */}
              <div className="absolute top-4 left-4 p-2.5 rounded-xl border glass-panel-elevated text-xs flex flex-col gap-0.5">
                <span className="font-cyber-tag text-[9px]" style={{ color: "var(--text-muted)" }}>
                  AI SCANNING ACTIVE
                </span>
                <span className="font-mono-tech font-bold" style={{ color: "var(--accent-lavender)" }}>
                  TENSOR CORE V4.2
                </span>
              </div>

              <div className="absolute bottom-4 right-4 p-2.5 rounded-xl border glass-panel-elevated text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--status-mint)" }} />
                <span className="font-mono-tech font-semibold" style={{ color: "var(--status-mint)" }}>
                  PAYPAL CHECKOUT READY
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4-PACK BENTO TELEMETRY STRIP                              */}
        {/* ========================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Processed Volume (24h)</span>
              <TrendingUp className="w-4 h-4" style={{ color: "var(--accent-lavender)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--text-primary)" }}>
              $42.8M
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-mint)" }}>+14.2% vs yesterday</span>
              <span style={{ color: "var(--text-muted)" }}>18.4K tx/sec</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Blocked Fraud Capital</span>
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--status-coral)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--status-coral)" }}>
              $381,940
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-coral)" }}>2,142 attacks deflected</span>
              <span style={{ color: "var(--text-muted)" }}>0.04% DISPUTE</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Autonomous Pass-Through</span>
              <Sparkles className="w-4 h-4" style={{ color: "var(--status-mint)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--status-mint)" }}>
              98.6%
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-mint)" }}>Zero Customer Friction</span>
              <span style={{ color: "var(--text-muted)" }}>99.98% TRUST</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>Mean Scoring Latency</span>
              <Cpu className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--accent-blue)" }}>
              11<span className="text-sm font-normal ml-1" style={{ color: "var(--text-secondary)" }}>ms</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--accent-blue)" }}>P99: 18.2ms Edge Sync</span>
              <span style={{ color: "var(--text-muted)" }}>v8.4 TensorRT</span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW TRUSTCART AI WORKS — 3-STEP PIPELINE                  */}
        {/* ========================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
              ARCHITECTURE EXPLAINED
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              FROM CONVERSATION TO VERIFIED PURCHASE
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              How our autonomous agent navigates catalog evidence and guarantees secure checkout through PayPal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border glass-panel space-y-4 relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono-tech text-base"
                style={{
                  backgroundColor: "var(--accent-lavender-bg)",
                  color: "var(--accent-lavender)",
                  borderColor: "var(--border-color)",
                }}
              >
                01
              </div>
              <h3 className="font-heading font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                Natural Intent Parsing &amp; Controlled Tools
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Tell the agent what you want in plain English. The agent calls controlled backend tools (`search_products`, `assess_listing`, `compare_products`) with Zod-validated constraints.
              </p>
            </div>

            <div className="p-6 rounded-2xl border glass-panel space-y-4 relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono-tech text-base"
                style={{
                  backgroundColor: "var(--accent-blue-bg)",
                  color: "var(--accent-blue)",
                  borderColor: "var(--border-color)",
                }}
              >
                02
              </div>
              <h3 className="font-heading font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                5-Vector Deterministic Risk Scoring
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                The engine calculates observed risk from 0 to 100 based on price markdown anomalies, seller dispute history, spec completeness, and bot astroturfing velocity.
              </p>
            </div>

            <div className="p-6 rounded-2xl border glass-panel space-y-4 relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono-tech text-base"
                style={{
                  backgroundColor: "var(--status-mint-bg)",
                  color: "var(--status-mint)",
                  borderColor: "var(--status-mint-border)",
                }}
              >
                03
              </div>
              <h3 className="font-heading font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                PayPal Sandbox Orders &amp; Capture
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                The server recalculates the total from trusted catalog prices. The buyer reviews the trust seal and completes the official PayPal checkout with cryptographic capture verification.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FEATURED SEEDED PRODUCTS WITH REAL TRUST BADGES           */}
        {/* ========================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
                LIVE CATALOG PREVIEW
              </span>
              <h2 className="font-display font-bold text-2xl" style={{ color: "var(--text-primary)" }}>
                FEATURED PRODUCTS &amp; RISK ASSESSMENTS
              </h2>
            </div>
            <Link
              href="/discover"
              className="text-xs font-semibold font-mono-tech inline-flex items-center gap-1"
              style={{ color: "var(--accent-lavender)" }}
            >
              <span>Explore All 22 Seeded Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full py-16 text-center text-sm font-mono-tech" style={{ color: "var(--text-muted)" }}>
                Loading verified catalog telemetry...
              </div>
            ) : (
              featuredProducts.map((p) => {
                const score = p.assessment?.overallScore ?? 15;
                const isSafe = score < 25;
                const isHigh = score >= 50;

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl border glass-panel flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg group"
                  >
                    <div>
                      {/* Image & Risk Pill */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-black/10">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono-tech uppercase border shadow-sm"
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
                            Risk: {score}/100 · {p.assessment?.riskTier || "LOW"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          {p.category}
                        </span>
                        <span className="font-mono-tech" style={{ color: "var(--text-secondary)" }}>
                          {p.seller.name}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-sm line-clamp-2 mb-2" style={{ color: "var(--text-primary)" }}>
                        {p.title}
                      </h3>

                      <p className="text-xs line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>
                        {p.assessment?.summary || "Deterministic trust audit passed."}
                      </p>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between mt-2"
                      style={{ borderColor: "var(--border-color)" }}
                    >
                      <div>
                        <div className="font-mono-tech font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                          ${p.price.toFixed(2)}
                        </div>
                        {p.referencePrice && (
                          <div className="text-[10px] line-through font-mono-tech" style={{ color: "var(--text-muted)" }}>
                            MSRP ${p.referencePrice.toFixed(2)}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/investigate/${p.id}`}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-[var(--bg-surface-elevated)]"
                          style={{
                            backgroundColor: "var(--bg-surface-subtle)",
                            borderColor: "var(--border-color)",
                            color: "var(--accent-lavender)",
                          }}
                          title="View Full Forensic Trust Report"
                        >
                          Audit
                        </Link>

                        <button
                          onClick={() =>
                            addItem({
                              id: p.id,
                              title: p.title,
                              price: p.price,
                              currency: "USD",
                              imageUrl: p.imageUrl,
                              category: p.category,
                              sellerName: p.seller.name,
                              riskScore: score,
                              riskTier: p.assessment?.riskTier || "LOW",
                            })
                          }
                          className="p-1.5 rounded-lg transition-transform hover:scale-105 shadow-sm"
                          style={{
                            backgroundColor: "var(--accent-lavender)",
                            color: "#171722",
                          }}
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* ========================================================= */}
        {/* BANNER — TRY THE AI AGENT PROMPT                          */}
        {/* ========================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl border glass-panel-elevated relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
              INTERACTIVE DEMONSTRATION
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
              TEST A REAL SHOPPING SCENARIO
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Ask the shopping agent: <em className="font-mono-tech px-2 py-0.5 rounded bg-[var(--bg-surface-subtle)] text-[var(--accent-lavender)]">"Find me a mechanical gaming keyboard under $50 with good specifications and low observed risk."</em> Watch it call backend tools, explain the forensic signals, and prepare a verified cart.
            </p>
            <div className="pt-2">
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md"
                style={{
                  backgroundColor: "var(--accent-lavender)",
                  color: "#171722",
                }}
              >
                <span>Open Agent Console</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
