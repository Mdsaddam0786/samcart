import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CheckoutClient } from "@/components/shared/checkout-client";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;
  const session = await auth();

  const items = await prisma.cartItem.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
  });

  if (items.length === 0) {
    redirect("/cart");
  }

  return <CheckoutClient items={items} cancelled={cancelled === "true"} />;
}
