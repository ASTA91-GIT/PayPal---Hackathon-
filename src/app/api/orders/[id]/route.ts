import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: id }, { orderNumber: id }, { paypalOrderId: id }],
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                seller: true,
                assessments: {
                  orderBy: { evaluatedAt: "desc" },
                  take: 1,
                },
              },
            },
          },
        },
        captures: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        currency: order.currency,
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        taxFee: order.taxFee,
        totalAmount: order.totalAmount,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
        paypalOrderId: order.paypalOrderId,
        createdAt: order.createdAt,
        riskSummary: order.riskSummary ? JSON.parse(order.riskSummary) : null,
        items: order.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          title: i.title,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          imageUrl: i.imageUrl,
          sellerName: i.product?.seller?.name || "Verified Merchant",
          riskScore: i.product?.assessments?.[0]?.overallScore ?? 12,
        })),
        captures: order.captures.map((c) => ({
          id: c.id,
          paypalCaptureId: c.paypalCaptureId,
          status: c.status,
          amount: c.amount,
          currency: c.currency,
          capturedAt: c.capturedAt,
          rawResponse: c.rawResponse ? JSON.parse(c.rawResponse) : null,
        })),
      },
    });
  } catch (err: any) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve order" },
      { status: 500 }
    );
  }
}
