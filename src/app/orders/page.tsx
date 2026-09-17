import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const statusTone = {
  PENDING: "amber",
  PAID: "green",
  FULFILLED: "indigo",
  CANCELLED: "red",
} as const;

export default async function OrdersPage() {
  const session = await auth();

  const orders = await prisma.order.findMany({
    where: { buyerId: session!.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Your orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          You haven&apos;t placed any orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Order placed {order.createdAt.toLocaleDateString()}
                  </p>
                  <p className="font-semibold text-slate-900">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
                    {formatPrice(order.total)}
                  </p>
                </div>
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
