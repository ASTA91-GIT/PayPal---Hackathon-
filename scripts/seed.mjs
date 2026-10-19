import { PrismaClient } from "@prisma/client";
import { SEED_PRODUCTS, SEED_SELLERS } from "../src/lib/catalogData.js";
import { evaluateProductRisk } from "../src/lib/riskEngine.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting TrustCart AI Database Seed...");

  // 1. Clean existing records
  await prisma.paymentCapture.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.riskSignal.deleteMany({});
  await prisma.riskAssessment.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.seller.deleteMany({});
  await prisma.agentMessage.deleteMany({});
  await prisma.agentSession.deleteMany({});

  // 2. Upsert Sellers
  const sellerMap = new Map();
  for (const key of Object.keys(SEED_SELLERS)) {
    const s = SEED_SELLERS[key];
    const createdSeller = await prisma.seller.create({
      data: {
        handle: s.handle,
        name: s.name,
        rating: s.rating,
        reviewCount: s.reviewCount,
        accountAgeDays: s.accountAgeDays,
        country: s.country,
        isVerified: s.isVerified,
        disputeRate: s.disputeRate,
        orderCount: s.orderCount,
      },
    });
    sellerMap.set(s.handle, createdSeller.id);
  }
  console.log(`✅ Seeded ${sellerMap.size} merchant seller records.`);

  // 3. Upsert Products & Compute Risk Assessments
  let count = 0;
  const createdProducts = [];
  for (const p of SEED_PRODUCTS) {
    const sellerId = sellerMap.get(p.seller.handle);
    const product = await prisma.product.create({
      data: {
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
        specifications: JSON.stringify(p.specifications),
        tags: p.tags.join(","),
        sellerId: sellerId,
      },
    });
    createdProducts.push(product);

    // Run deterministic risk scoring engine
    const evaluation = evaluateProductRisk({
      title: p.title,
      price: p.price,
      referencePrice: p.referencePrice,
      category: p.category,
      stock: p.stock,
      specifications: p.specifications,
      seller: p.seller,
    });

    const assessment = await prisma.riskAssessment.create({
      data: {
        productId: product.id,
        overallScore: evaluation.overallScore,
        confidenceScore: evaluation.confidenceScore,
        riskTier: evaluation.riskTier,
        summary: evaluation.summary,
        verdict: evaluation.verdict,
        priceAnomalyScore: evaluation.vectorScores.priceAnomaly,
        sellerRepScore: evaluation.vectorScores.sellerRep,
        listingScore: evaluation.vectorScores.listingIntegrity,
        velocityScore: evaluation.vectorScores.velocityBiometrics,
        evidenceScore: evaluation.vectorScores.evidenceCoverage,
        isInsufficientData: evaluation.isInsufficientData,
      },
    });

    for (const sig of evaluation.signals) {
      await prisma.riskSignal.create({
        data: {
          assessmentId: assessment.id,
          name: sig.name,
          category: sig.category,
          score: sig.score,
          severity: sig.severity,
          evidence: sig.evidence,
          provenance: sig.provenance,
          confidence: sig.confidence,
        },
      });
    }

    count++;
  }
  console.log(`✅ Seeded ${count} products with evaluated risk assessments and forensic signals.`);

  // 4. Seed an initial demo completed order with PayPal capture
  if (createdProducts.length >= 2) {
    const p1 = createdProducts[0];
    const p2 = createdProducts[1];
    const subtotal = p1.price + p2.price;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const total = subtotal + tax;

    const demoOrder = await prisma.order.create({
      data: {
        orderNumber: "TC-2026-99481-CC21",
        status: "COMPLETED",
        currency: "USD",
        subtotal: subtotal,
        shippingFee: 0.0,
        taxFee: tax,
        totalAmount: total,
        buyerName: "Olivia Vance",
        buyerEmail: "olivia.vance@techcorp.io",
        shippingAddress: JSON.stringify({
          line1: "420 Silicon Boulevard",
          city: "San Jose",
          state: "CA",
          postalCode: "95113",
          country: "US",
        }),
        paypalOrderId: "PAYPAL-ORD-99481CC",
        riskSummary: JSON.stringify({
          overallRisk: 8,
          verdict: "SAFE_CLEARANCE",
          tier: "LOW",
          inspectedAt: new Date().toISOString(),
        }),
      },
    });

    await prisma.orderItem.createMany({
      data: [
        {
          orderId: demoOrder.id,
          productId: p1.id,
          quantity: 1,
          unitPrice: p1.price,
          title: p1.title,
          imageUrl: p1.imageUrl,
        },
        {
          orderId: demoOrder.id,
          productId: p2.id,
          quantity: 1,
          unitPrice: p2.price,
          title: p2.title,
          imageUrl: p2.imageUrl,
        },
      ],
    });

    await prisma.paymentCapture.create({
      data: {
        orderId: demoOrder.id,
        paypalCaptureId: "CAPTURE-99481-VERIFIED",
        paypalOrderId: "PAYPAL-ORD-99481CC",
        status: "COMPLETED",
        amount: total,
        currency: "USD",
        rawResponse: JSON.stringify({
          status: "COMPLETED",
          id: "CAPTURE-99481-VERIFIED",
          seller_protection: { status: "ELIGIBLE" },
        }),
      },
    });

    console.log(`✅ Seeded demo completed PayPal order: ${demoOrder.orderNumber}`);
  }

  console.log("🚀 TrustCart AI Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
