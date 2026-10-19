import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { evaluateProductRisk } from "@/lib/riskEngine";

// -------------------------------------------------------------
// TOOL SCHEMAS & DEFINITIONS
// -------------------------------------------------------------

export const SearchProductsSchema = z.object({
  query: z.string().optional().describe("Search term or keywords (e.g., 'keyboard', 'mechanical')"),
  category: z.string().optional().describe("Product category (e.g., 'Gaming Accessories', 'Electronics')"),
  maxPrice: z.number().positive().optional().describe("Maximum budget limit in USD"),
  maxRiskScore: z.number().min(0).max(100).optional().describe("Maximum acceptable observed risk (0-100)"),
});

export const GetProductDetailsSchema = z.object({
  productId: z.string().min(1).describe("Valid Product ID (e.g., 'prod-kb-001')"),
});

export const AssessListingSchema = z.object({
  productId: z.string().min(1).describe("Valid Product ID to evaluate for fraud risk"),
});

export const CompareProductsSchema = z.object({
  productIds: z.array(z.string().min(1)).min(2).max(4).describe("List of 2 to 4 product IDs to compare"),
});

export const PrepareCartSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive().default(1),
    })
  ).min(1).describe("Products and quantities to prepare for checkout"),
});

export const GetCheckoutSummarySchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

// -------------------------------------------------------------
// TOOL EXECUTION LOGIC
// -------------------------------------------------------------

export async function executeSearchProducts(args: z.infer<typeof SearchProductsSchema>) {
  const where: any = {};

  if (args.query) {
    where.OR = [
      { title: { contains: args.query } },
      { description: { contains: args.query } },
      { tags: { contains: args.query } },
    ];
  }

  if (args.category && args.category !== "All") {
    where.category = args.category;
  }

  if (args.maxPrice) {
    where.price = { lte: args.maxPrice };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: true,
      assessments: {
        orderBy: { evaluatedAt: "desc" },
        take: 1,
      },
    },
    take: 10,
  });

  let filtered = products;
  if (args.maxRiskScore !== undefined) {
    filtered = products.filter((p) => {
      const score = p.assessments[0]?.overallScore ?? 15;
      return score <= args.maxRiskScore!;
    });
  }

  return filtered.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    referencePrice: p.referencePrice,
    category: p.category,
    stock: p.stock,
    sellerName: p.seller.name,
    sellerRating: p.seller.rating,
    riskScore: p.assessments[0]?.overallScore ?? 15,
    riskTier: p.assessments[0]?.riskTier ?? "LOW",
    verdict: p.assessments[0]?.verdict ?? "SAFE_CLEARANCE",
  }));
}

export async function executeGetProductDetails(args: z.infer<typeof GetProductDetailsSchema>) {
  const product = await prisma.product.findUnique({
    where: { id: args.productId },
    include: {
      seller: true,
      assessments: {
        include: { signals: true },
        orderBy: { evaluatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (!product) {
    throw new Error(`Product ${args.productId} not found in catalog.`);
  }

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    referencePrice: product.referencePrice,
    category: product.category,
    stock: product.stock,
    specifications: JSON.parse(product.specifications || "{}"),
    seller: {
      name: product.seller.name,
      rating: product.seller.rating,
      reviewCount: product.seller.reviewCount,
      accountAgeDays: product.seller.accountAgeDays,
      isVerified: product.seller.isVerified,
      disputeRate: product.seller.disputeRate,
    },
    assessment: product.assessments[0]
      ? {
          overallScore: product.assessments[0].overallScore,
          riskTier: product.assessments[0].riskTier,
          verdict: product.assessments[0].verdict,
          summary: product.assessments[0].summary,
          signals: product.assessments[0].signals.map((s) => ({
            name: s.name,
            severity: s.severity,
            evidence: s.evidence,
          })),
        }
      : null,
  };
}

export async function executeAssessListing(args: z.infer<typeof AssessListingSchema>) {
  const product = await prisma.product.findUnique({
    where: { id: args.productId },
    include: {
      seller: true,
    },
  });

  if (!product) {
    throw new Error(`Product with ID ${args.productId} was not found.`);
  }

  const evaluation = evaluateProductRisk({
    title: product.title,
    price: product.price,
    referencePrice: product.referencePrice,
    category: product.category,
    stock: product.stock,
    specifications: JSON.parse(product.specifications || "{}"),
    seller: product.seller,
  });

  return {
    productId: product.id,
    productTitle: product.title,
    overallScore: evaluation.overallScore,
    riskTier: evaluation.riskTier,
    verdict: evaluation.verdict,
    confidenceScore: evaluation.confidenceScore,
    summary: evaluation.summary,
    signalsCount: evaluation.signals.length,
    signals: evaluation.signals,
    recommendedAction: evaluation.recommendedAction,
  };
}

export async function executeCompareProducts(args: z.infer<typeof CompareProductsSchema>) {
  const products = await prisma.product.findMany({
    where: { id: { in: args.productIds } },
    include: {
      seller: true,
      assessments: {
        include: { signals: true },
        orderBy: { evaluatedAt: "desc" },
        take: 1,
      },
    },
  });

  if (products.length < 2) {
    throw new Error("At least two valid products are required for comparison.");
  }

  return products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    referencePrice: p.referencePrice,
    specs: JSON.parse(p.specifications || "{}"),
    seller: {
      name: p.seller.name,
      rating: p.seller.rating,
      isVerified: p.seller.isVerified,
    },
    riskScore: p.assessments[0]?.overallScore ?? 15,
    riskTier: p.assessments[0]?.riskTier ?? "LOW",
    verdict: p.assessments[0]?.verdict ?? "SAFE_CLEARANCE",
  }));
}

export async function executePrepareCart(args: z.infer<typeof PrepareCartSchema>) {
  const productIds = args.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: {
      assessments: {
        orderBy: { evaluatedAt: "desc" },
        take: 1,
      },
    },
  });

  const map = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  let totalRisk = 0;
  let totalQty = 0;

  const validatedItems = [];

  for (const item of args.items) {
    const prod = map.get(item.productId);
    if (!prod) {
      throw new Error(`Invalid product ID in cart: ${item.productId}`);
    }
    const itemSub = prod.price * item.quantity;
    subtotal += itemSub;
    totalRisk += (prod.assessments[0]?.overallScore ?? 15) * item.quantity;
    totalQty += item.quantity;

    validatedItems.push({
      productId: prod.id,
      title: prod.title,
      unitPrice: prod.price,
      quantity: item.quantity,
      imageUrl: prod.imageUrl,
      riskScore: prod.assessments[0]?.overallScore ?? 15,
      riskTier: prod.assessments[0]?.riskTier ?? "LOW",
    });
  }

  subtotal = Number(subtotal.toFixed(2));
  const shippingFee = subtotal > 100 ? 0 : 9.99;
  const taxFee = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + shippingFee + taxFee).toFixed(2));
  const avgRisk = totalQty > 0 ? Math.round(totalRisk / totalQty) : 10;

  return {
    items: validatedItems,
    itemCount: totalQty,
    subtotal,
    shippingFee,
    taxFee,
    total,
    avgRiskScore: avgRisk,
    cartRiskTier: avgRisk < 25 ? "LOW" : avgRisk < 50 ? "MODERATE" : "HIGH",
    checkoutReady: true,
  };
}
