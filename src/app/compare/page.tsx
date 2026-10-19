"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Scale, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  ShoppingCart, 
  ExternalLink,
  Plus
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface CompareItem {
  id: string;
  title: string;
  price: number;
  referencePrice: number | null;
  category: string;
  imageUrl: string;
  specifications: Record<string, string>;
  seller: {
    name: string;
    rating: number;
    isVerified: boolean;
    disputeRate: number;
  };
  assessment: {
    overallScore: number;
    riskTier: string;
    verdict: string;
    summary: string;
  } | null;
}

function CompareContent() {
  const searchParams = useSearchParams();
  const id1 = searchParams.get("id1") || "prod-kb-001";
  const id2 = searchParams.get("id2") || "prod-kb-003";

  const [allProducts, setAllProducts] = useState<CompareItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([id1, id2]);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCart();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setAllProducts(data.products);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const comparedProducts = allProducts.filter((p) => selectedIds.includes(p.id));

  const updateSelectedId = (index: number, newId: string) => {
    const updated = [...selectedIds];
    updated[index] = newId;
    setSelectedIds(updated);
  };

  const addSlot = () => {
    if (selectedIds.length >= 4) return;
    const remaining = allProducts.find((p) => !selectedIds.includes(p.id));
    if (remaining) {
      setSelectedIds([...selectedIds, remaining.id]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
            MULTI-PRODUCT VALUE-TO-SAFETY MATRIX
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            PRODUCT RISK &amp; SPEC COMPARISON
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Cross-evaluate specifications, price deltas, and forensic risk signals side by side.
          </p>
        </div>

        {selectedIds.length < 4 && (
          <button
            onClick={addSlot}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border glass-panel transition-all hover:bg-[var(--bg-surface-elevated)]"
            style={{ color: "var(--accent-lavender)" }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Comparison Slot</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-24 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
          Loading comparison candidate telemetry...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Matrix Table */}
          <div className="rounded-2xl border glass-panel overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface-subtle)" }}>
                  <th className="p-4 w-44 font-mono-tech text-[11px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Attribute
                  </th>
                  {selectedIds.map((sid, idx) => (
                    <th key={idx} className="p-4 min-w-[240px]">
                      <select
                        value={sid}
                        onChange={(e) => updateSelectedId(idx, e.target.value)}
                        className="w-full py-1.5 px-2 rounded-lg border text-xs font-bold glass-panel focus:outline-none"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title.substring(0, 32)}... (${p.price})
                          </option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                {/* Product Header & Image */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Product Snapshot
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 space-y-2">
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-black/10">
                        <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-heading font-bold text-xs line-clamp-2" style={{ color: "var(--text-primary)" }}>
                        {p.title}
                      </h4>
                    </td>
                  ))}
                </tr>

                {/* Price & MSRP */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Price / MSRP
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="font-mono-tech font-bold text-base" style={{ color: "var(--text-primary)" }}>
                        ${p.price.toFixed(2)}
                      </div>
                      {p.referencePrice && (
                        <span className="text-[10px] line-through font-mono-tech" style={{ color: "var(--text-muted)" }}>
                          MSRP ${p.referencePrice.toFixed(2)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Risk Score */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Observed Risk Score
                  </td>
                  {comparedProducts.map((p) => {
                    const score = p.assessment?.overallScore ?? 15;
                    const isSafe = score < 25;
                    const isHigh = score >= 50;
                    return (
                      <td key={p.id} className="p-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono-tech uppercase border inline-block"
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
                          {score}/100 · {p.assessment?.riskTier || "LOW"}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Merchant Reputation */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Merchant Record
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 space-y-1 font-mono-tech text-[11px]">
                      <div className="font-bold" style={{ color: "var(--text-primary)" }}>
                        {p.seller.name}
                      </div>
                      <div style={{ color: "var(--accent-lavender)" }}>
                        Rating: {p.seller.rating} ★ {p.seller.isVerified ? "· (Verified)" : ""}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Summary / Verdict */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Trust Verdict
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4 text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {p.assessment?.summary || "Passed baseline checks."}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr>
                  <td className="p-4 font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Purchase Action
                  </td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-4">
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
                            riskScore: p.assessment?.overallScore ?? 15,
                          })
                        }
                        className="w-full py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-105"
                        style={{
                          backgroundColor: "var(--accent-lavender)",
                          color: "#171722",
                        }}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-mono-tech">Loading comparison matrix...</div>}>
      <CompareContent />
    </Suspense>
  );
}
