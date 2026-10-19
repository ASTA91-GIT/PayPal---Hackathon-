import { describe, it, expect } from "vitest";
import { evaluateProductRisk } from "../src/lib/riskEngine";

describe("TrustCart AI Deterministic Risk Engine", () => {
  it("evaluates verified merchant with legitimate pricing as LOW risk", () => {
    const result = evaluateProductRisk({
      title: "Keychron Q1 Pro Mechanical Keyboard",
      price: 198.0,
      referencePrice: 199.0,
      category: "Gaming Accessories",
      stock: 40,
      specifications: {
        "Switch": "Keychron K Pro Red",
        "Layout": "75% ANSI",
        "Connectivity": "Wireless + Type-C",
      },
      seller: {
        handle: "keychron_official",
        name: "Keychron Official Direct",
        rating: 4.9,
        reviewCount: 3800,
        accountAgeDays: 1200,
        country: "US",
        isVerified: true,
        disputeRate: 0.002,
        orderCount: 14000,
      },
    });

    expect(result.overallScore).toBeLessThan(25);
    expect(result.riskTier).toBe("LOW");
    expect(result.verdict).toBe("SAFE_CLEARANCE");
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(result.signals.length).toBeGreaterThan(0);
  });

  it("detects severe price markdown anomaly (counterfeit indicator) as CRITICAL risk", () => {
    const result = evaluateProductRisk({
      title: "GeForce RTX 4090 24GB Founders Edition",
      price: 189.0, // $189 vs $1599 reference price
      referencePrice: 1599.0,
      category: "Computer Peripherals",
      stock: 10,
      specifications: {
        "VRAM": "24GB",
      },
      seller: {
        handle: "suspicious_seller",
        name: "Liquidator Deals",
        rating: 2.1,
        reviewCount: 4,
        accountAgeDays: 10,
        country: "CY",
        isVerified: false,
        disputeRate: 0.12,
        orderCount: 15,
      },
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(75);
    expect(result.riskTier).toBe("CRITICAL");
    expect(result.verdict).toBe("ANOMALY_HALT");
    const severeSignal = result.signals.find((s) => s.name === "SEVERE_PRICE_DISCREPANCY");
    expect(severeSignal).toBeDefined();
    expect(severeSignal?.severity).toBe("CRITICAL");
  });

  it("flags bot review burst velocity when review count outpaces account age", () => {
    const result = evaluateProductRisk({
      title: "Super Gaming Mouse RGB",
      price: 29.99,
      referencePrice: 35.0,
      category: "Gaming Accessories",
      stock: 50,
      specifications: {
        "DPI": "16000",
        "Connection": "USB",
      },
      seller: {
        handle: "bot_cluster",
        name: "Bot Merchant Corp",
        rating: 5.0,
        reviewCount: 950, // 950 reviews in 5 days!
        accountAgeDays: 5,
        country: "HK",
        isVerified: false,
        disputeRate: 0.01,
        orderCount: 50,
      },
    });

    const velocitySignal = result.signals.find((s) => s.name === "ANOMALOUS_REVIEW_BURST");
    expect(velocitySignal).toBeDefined();
    expect(velocitySignal?.severity).toBe("CRITICAL");
  });

  it("handles missing reference price without crashing and flags baseline unindexed", () => {
    const result = evaluateProductRisk({
      title: "Custom Artisan Keycap",
      price: 45.0,
      referencePrice: null, // No reference price
      category: "Gaming Accessories",
      stock: 15,
      specifications: {
        "Material": "Resin",
        "Profile": "Cherry",
      },
      seller: {
        handle: "artisan_crafts",
        name: "Artisan Studio",
        rating: 4.6,
        reviewCount: 45,
        accountAgeDays: 200,
        country: "US",
        isVerified: false,
        disputeRate: 0.01,
        orderCount: 60,
      },
    });

    expect(result.overallScore).toBeDefined();
    const benchmarkSignal = result.signals.find((s) => s.name === "PRICE_BENCHMARK_UNAVAILABLE");
    expect(benchmarkSignal).toBeDefined();
  });
});
