import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CartClient } from "@/components/shared/cart-client";

export default async function CartPage() {
  const session = await auth();
  const items = await prisma.cartItem.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your cart</h1>
      <CartClient initialItems={items} />
    </div>
  );
}
