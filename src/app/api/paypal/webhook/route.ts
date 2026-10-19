import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const event = JSON.parse(rawBody);

    const eventType = event.event_type;
    const resource = event.resource;

    console.log(`[PayPal Webhook] Ingested event: ${eventType} (ID: ${event.id})`);

    // Handle Completed Captures
    if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const captureId = resource.id;
      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

      if (paypalOrderId) {
        const order = await prisma.order.findUnique({
          where: { paypalOrderId },
        });

        if (order && order.status !== "COMPLETED") {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "COMPLETED" },
          });

          // Check if capture record already exists
          const existingCap = await prisma.paymentCapture.findUnique({
            where: { paypalCaptureId: captureId },
          });

          if (!existingCap) {
            await prisma.paymentCapture.create({
              data: {
                orderId: order.id,
                paypalCaptureId: captureId,
                paypalOrderId: paypalOrderId,
                status: "COMPLETED",
                amount: parseFloat(resource.amount?.value || String(order.totalAmount)),
                currency: resource.amount?.currency_code || "USD",
                rawResponse: JSON.stringify(resource),
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true, eventId: event.id });
  } catch (err: any) {
    console.error("PayPal Webhook processing error:", err);
    return NextResponse.json(
      { received: false, error: "Webhook parse failed" },
      { status: 400 }
    );
  }
}
