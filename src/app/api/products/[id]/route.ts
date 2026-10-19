import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
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

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const formatted = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price,
      currency: product.currency,
      referencePrice: product.referencePrice,
      stock: product.stock,
      imageUrl: product.imageUrl,
      specifications: JSON.parse(product.specifications || "{}"),
      tags: product.tags ? product.tags.split(",") : [],
      seller: {
        id: product.seller.id,
        name: product.seller.name,
        handle: product.seller.handle,
        rating: product.seller.rating,
        reviewCount: product.seller.reviewCount,
        accountAgeDays: product.seller.accountAgeDays,
        country: product.seller.country,
        isVerified: product.seller.isVerified,
        disputeRate: product.seller.disputeRate,
        orderCount: product.seller.orderCount,
      },
      assessment: product.assessments[0]
        ? {
            id: product.assessments[0].id,
            overallScore: product.assessments[0].overallScore,
            riskTier: product.assessments[0].riskTier,
            verdict: product.assessments[0].verdict,
            summary: product.assessments[0].summary,
            confidenceScore: product.assessments[0].confidenceScore,
            priceAnomalyScore: product.assessments[0].priceAnomalyScore,
            sellerRepScore: product.assessments[0].sellerRepScore,
            listingScore: product.assessments[0].listingScore,
            velocityScore: product.assessments[0].velocityScore,
            evidenceScore: product.assessments[0].evidenceScore,
            isInsufficientData: product.assessments[0].isInsufficientData,
            evaluatedAt: product.assessments[0].evaluatedAt,
            signals: product.assessments[0].signals,
          }
        : null,
    };

    return NextResponse.json({ success: true, product: formatted });
  } catch (err: any) {
    console.error("GET /api/products/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
