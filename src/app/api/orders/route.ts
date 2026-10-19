import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        captures: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount,
        currency: o.currency,
        buyerName: o.buyerName,
        buyerEmail: o.buyerEmail,
        paypalOrderId: o.paypalOrderId,
        createdAt: o.createdAt,
        itemCount: o.items.reduce((acc, i) => acc + i.quantity, 0),
        items: o.items,
        captures: o.captures.map((c) => ({
          captureId: c.paypalCaptureId,
          status: c.status,
          amount: c.amount,
          capturedAt: c.capturedAt,
        })),
        riskSummary: o.riskSummary ? JSON.parse(o.riskSummary) : null,
      })),
    });
  } catch (err: any) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
