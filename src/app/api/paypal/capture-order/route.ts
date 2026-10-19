import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { capturePayPalOrder } from "@/lib/paypal";

const CaptureSchema = z.object({
  orderId: z.string().optional(),
  paypalOrderId: z.string().min(1, "PayPal Order ID required"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CaptureSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { orderId, paypalOrderId } = parsed.data;

    // Locate internal order by ID or PayPal Order ID
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          orderId ? { id: orderId } : {},
          { paypalOrderId: paypalOrderId },
        ],
      },
      include: {
        captures: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order record not found" },
        { status: 404 }
      );
    }

    // Idempotency: if already completed, return existing capture
    if (order.status === "COMPLETED" && order.captures.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyCaptured: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        captureId: order.captures[0].paypalCaptureId,
        status: "COMPLETED",
        amount: order.totalAmount,
      });
    }

    // Execute capture via PayPal API
    const captureResult = await capturePayPalOrder(paypalOrderId);

    if (captureResult.status !== "COMPLETED") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Payment capture status is ${captureResult.status}`,
          status: captureResult.status,
        },
        { status: 402 }
      );
    }

    // Save capture & update order
    const paymentCapture = await prisma.paymentCapture.create({
      data: {
        orderId: order.id,
        paypalCaptureId: captureResult.captureId,
        paypalOrderId: paypalOrderId,
        status: "COMPLETED",
        amount: order.totalAmount,
        currency: order.currency,
        rawResponse: JSON.stringify(captureResult.raw),
      },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      captureId: paymentCapture.paypalCaptureId,
      status: "COMPLETED",
      amount: updatedOrder.totalAmount,
      currency: updatedOrder.currency,
    });
  } catch (err: any) {
    console.error("POST /api/paypal/capture-order error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to capture payment" },
      { status: 500 }
    );
  }
}
