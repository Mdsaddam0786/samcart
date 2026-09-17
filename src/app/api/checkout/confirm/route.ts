import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, orderId } = await req.json();
  if (!sessionId || !orderId) {
    return NextResponse.json({ error: "Missing session or order id" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ status: "PAID" });
  }

  if (!isStripeConfigured || !stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.metadata?.orderId !== orderId) {
    return NextResponse.json({ error: "Session does not match order" }, { status: 400 });
  }

  if (checkoutSession.payment_status === "paid") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "PAID" } });
    return NextResponse.json({ status: "PAID" });
  }

  return NextResponse.json({ status: checkoutSession.payment_status });
}
