import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createPayPalOrder } from "@/lib/paypal";

const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Cart cannot be empty"),
  buyerName: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  shippingAddress: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { items: clientItems, buyerName, buyerEmail, shippingAddress } = parsed.data;

    // Fetch and validate trusted products from DB
    const productIds = clientItems.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        assessments: {
          orderBy: { evaluatedAt: "desc" },
          take: 1,
        },
      },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Authoritative server-side price calculation
    let subtotal = 0;
    const validatedOrderItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      title: string;
      imageUrl: string;
    }> = [];

    let totalRiskWeighted = 0;
    let totalQuantity = 0;

    for (const item of clientItems) {
      const dbProd = productMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found in catalog.` },
          { status: 400 }
        );
      }
      if (item.quantity > dbProd.stock) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${dbProd.title}.` },
          { status: 400 }
        );
      }

      subtotal += dbProd.price * item.quantity;
      const riskScore = dbProd.assessments[0]?.overallScore ?? 15;
      totalRiskWeighted += riskScore * item.quantity;
      totalQuantity += item.quantity;

      validatedOrderItems.push({
        productId: dbProd.id,
        quantity: item.quantity,
        unitPrice: dbProd.price,
        title: dbProd.title,
        imageUrl: dbProd.imageUrl,
      });
    }

    subtotal = Number(subtotal.toFixed(2));
    const shippingFee = subtotal > 100 ? 0.0 : 9.99;
    const taxFee = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = Number((subtotal + shippingFee + taxFee).toFixed(2));
    const avgRisk = totalQuantity > 0 ? Math.round(totalRiskWeighted / totalQuantity) : 10;

    const orderNumber = `TC-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create PayPal order
    const paypalResult = await createPayPalOrder({
      orderNumber,
      totalAmount,
      subtotal,
      shippingFee,
      taxFee,
      currency: "USD",
      items: validatedOrderItems,
    });

    // Create internal Order in DB
    const internalOrder = await prisma.order.create({
      data: {
        orderNumber,
        status: "AWAITING_APPROVAL",
        currency: "USD",
        subtotal,
        shippingFee,
        taxFee,
        totalAmount,
        buyerName: buyerName || "Guest Purchaser",
        buyerEmail: buyerEmail || "shopper@trustcart.ai",
        shippingAddress: JSON.stringify(shippingAddress || { line1: "Standard Express Delivery" }),
        paypalOrderId: paypalResult.id,
        riskSummary: JSON.stringify({
          overallRisk: avgRisk,
          tier: avgRisk < 25 ? "LOW" : avgRisk < 50 ? "MODERATE" : "HIGH",
          itemCount: totalQuantity,
          createdAt: new Date().toISOString(),
        }),
        items: {
          create: validatedOrderItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            title: i.title,
            imageUrl: i.imageUrl,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      orderId: internalOrder.id,
      orderNumber: internalOrder.orderNumber,
      paypalOrderId: paypalResult.id,
      totalAmount,
      isMockSandbox: paypalResult.isMockSandbox,
    });
  } catch (err: any) {
    console.error("POST /api/paypal/create-order error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
