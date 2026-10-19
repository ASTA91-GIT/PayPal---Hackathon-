import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const maxRisk = searchParams.get("maxRisk");
    const sort = searchParams.get("sort") || "featured";

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    if (category && category !== "All") {
      where.category = category;
    }

    let products = await prisma.product.findMany({
      where,
      include: {
        seller: true,
        assessments: {
          include: {
            signals: true,
          },
          orderBy: { evaluatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (maxRisk) {
      const riskNum = parseInt(maxRisk, 10);
      products = products.filter((p) => {
        const score = p.assessments[0]?.overallScore ?? 10;
        return score <= riskNum;
      });
    }

    // Sorting
    if (sort === "price-low") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "trust-highest") {
      products.sort((a, b) => {
        const scoreA = a.assessments[0]?.overallScore ?? 50;
        const scoreB = b.assessments[0]?.overallScore ?? 50;
        return scoreA - scoreB; // Lower score is higher trust
      });
    }

    const formatted = products.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      description: p.description,
      category: p.category,
      price: p.price,
      currency: p.currency,
      referencePrice: p.referencePrice,
      stock: p.stock,
      imageUrl: p.imageUrl,
      specifications: JSON.parse(p.specifications || "{}"),
      tags: p.tags ? p.tags.split(",") : [],
      seller: {
        id: p.seller.id,
        name: p.seller.name,
        handle: p.seller.handle,
        rating: p.seller.rating,
        reviewCount: p.seller.reviewCount,
        isVerified: p.seller.isVerified,
        country: p.seller.country,
      },
      assessment: p.assessments[0]
        ? {
            overallScore: p.assessments[0].overallScore,
            riskTier: p.assessments[0].riskTier,
            verdict: p.assessments[0].verdict,
            summary: p.assessments[0].summary,
            confidenceScore: p.assessments[0].confidenceScore,
            isInsufficientData: p.assessments[0].isInsufficientData,
            signals: p.assessments[0].signals,
          }
        : null,
    }));

    return NextResponse.json({ success: true, count: formatted.length, products: formatted });
  } catch (err: any) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
