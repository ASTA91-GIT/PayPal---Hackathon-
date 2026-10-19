"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  ShoppingCart, 
  SlidersHorizontal, 
  ExternalLink,
  ChevronRight,
  ArrowUpDown
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  referencePrice: number | null;
  stock: number;
  imageUrl: string;
  specifications: Record<string, string>;
  seller: {
    name: string;
    handle: string;
    rating: number;
    isVerified: boolean;
  };
  assessment: {
    overallScore: number;
    riskTier: string;
    verdict: string;
    summary: string;
  } | null;
}

const CATEGORIES = ["All", "Gaming Accessories", "Computer Peripherals", "Electronics", "Lifestyle Accessories"];

export default function DiscoverPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxRisk, setMaxRisk] = useState<number>(100);
  const [sort, setSort] = useState("featured");

  const { addItem } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category !== "All") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (maxRisk < 100) params.set("maxRisk", String(maxRisk));

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((err) => console.error("Error fetching discover products:", err))
      .finally(() => setLoading(false));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
            CATALOG DISCOVERY ENGINE
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            SEARCH &amp; VERIFY PRODUCTS
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Browse verified listings, check real-time risk scores, or inspect sellers prior to adding to cart.
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search keyboards, GPUs, headsets, audio..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs glass-panel focus:outline-none focus:ring-1 focus:ring-[var(--accent-lavender)]"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            style={{
              backgroundColor: "var(--accent-lavender)",
              color: "#171722",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Filter & Sorting Strip */}
      <div className="p-4 rounded-xl border glass-panel flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                category === cat ? "shadow-sm font-bold" : "hover:bg-[var(--bg-surface-subtle)]"
              }`}
              style={{
                backgroundColor: category === cat ? "var(--accent-lavender)" : "transparent",
                color: category === cat ? "#171722" : "var(--text-secondary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Max Risk Slider & Sorting Dropdown */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono-tech text-[11px]" style={{ color: "var(--text-secondary)" }}>
              Max Risk: {maxRisk}
            </span>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={maxRisk}
              onChange={(e) => setMaxRisk(Number(e.target.value))}
              onMouseUp={fetchProducts}
              onTouchEnd={fetchProducts}
              className="w-24 accent-[var(--accent-lavender)] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="py-1 px-2.5 rounded-lg border text-xs glass-subtle focus:outline-none"
              style={{ color: "var(--text-primary)" }}
            >
              <option value="featured">Sort: Featured</option>
              <option value="trust-highest">Sort: Highest Trust</option>
              <option value="price-low">Sort: Price: Low to High</option>
              <option value="price-high">Sort: Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
            Scanning catalog items and risk signals...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-3">
            <p className="font-heading font-semibold text-base" style={{ color: "var(--text-primary)" }}>
              No products match the selected criteria.
            </p>
            <button
              onClick={() => {
                setCategory("All");
                setSearch("");
                setMaxRisk(100);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold"
              style={{
                backgroundColor: "var(--accent-lavender)",
                color: "#171722",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          products.map((p) => {
            const risk = p.assessment?.overallScore ?? 15;
            const isSafe = risk < 25;
            const isHigh = risk >= 50;

            return (
              <div
                key={p.id}
                className="p-4 rounded-2xl border glass-panel flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-lg group"
              >
                <div>
                  <div className="relative w-full h-40 rounded-xl overflow-hidden mb-3 bg-black/10">
                    <img
                      src={p.imageUrl}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono-tech uppercase border shadow-sm"
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
                        Risk: {risk}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold uppercase tracking-wider text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {p.category}
                    </span>
                    <span className="font-mono-tech" style={{ color: "var(--text-secondary)" }}>
                      {p.seller.name.substring(0, 18)}
                    </span>
                  </div>

                  <Link href={`/products/${p.id}`} className="group-hover:text-[var(--accent-lavender)] transition-colors">
                    <h3 className="font-heading font-bold text-xs line-clamp-2 mb-2" style={{ color: "var(--text-primary)" }}>
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-[11px] line-clamp-2 mb-2" style={{ color: "var(--text-secondary)" }}>
                    {p.assessment?.summary || p.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t flex items-center justify-between mt-2"
                  style={{ borderColor: "var(--border-color)" }}
                >
                  <div>
                    <div className="font-mono-tech font-bold text-base" style={{ color: "var(--text-primary)" }}>
                      ${p.price.toFixed(2)}
                    </div>
                    {p.referencePrice && (
                      <div className="text-[9px] line-through font-mono-tech" style={{ color: "var(--text-muted)" }}>
                        MSRP ${p.referencePrice.toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/investigate/${p.id}`}
                      className="px-2 py-1 rounded-md text-[11px] font-semibold border"
                      style={{
                        backgroundColor: "var(--bg-surface-subtle)",
                        borderColor: "var(--border-color)",
                        color: "var(--accent-lavender)",
                      }}
                      title="Forensic Audit"
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
                          riskScore: risk,
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
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
