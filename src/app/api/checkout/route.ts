import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      return NextResponse.json(
        { error: `Not enough stock for "${item.product.title}"` },
        { status: 400 }
      );
    }
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        buyerId: session.user.id,
        total,
        status: isStripeConfigured ? "PENDING" : "PAID",
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            sellerId: item.product.sellerId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        },
      },
    });

    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    await tx.cartItem.deleteMany({ where: { userId: session.user.id } });

    return created;
  });

  if (isStripeConfigured && stripe) {
    const origin = req.headers.get("origin") ?? process.env.NEXTAUTH_URL;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: item.product.price,
          product_data: { name: item.product.title },
        },
      })),
      success_url: `${origin}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelled=true`,
      metadata: { orderId: order.id },
    });

    return NextResponse.json({ orderId: order.id, url: checkoutSession.url });
  }

  return NextResponse.json({ orderId: order.id, simulated: true });
}
