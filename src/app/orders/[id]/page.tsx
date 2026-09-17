import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OrderConfirm } from "@/components/shared/order-confirm";

const statusTone = {
  PENDING: "amber",
  PAID: "green",
  FULFILLED: "indigo",
  CANCELLED: "red",
} as const;

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { id } = await params;
  const { session_id } = await searchParams;
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const isOwner = order.buyerId === session!.user.id;
  const isSellerOnOrder = order.items.some((i) => i.sellerId === session!.user.id);
  if (!isOwner && !isSellerOnOrder && session!.user.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {isOwner && session_id && (
        <OrderConfirm orderId={order.id} sessionId={session_id} alreadyPaid={order.status !== "PENDING"} />
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Order details</h1>
          <p className="text-sm text-slate-500">
            Placed {order.createdAt.toLocaleDateString()}
          </p>
        </div>
        <Badge tone={statusTone[order.status]}>{order.status}</Badge>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.product.imageUrl}
                alt={item.product.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.product.title}</p>
                <p className="text-sm text-slate-500">
                  Qty {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <div className="font-semibold text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
        <div className="my-4 border-t border-slate-100" />
        <div className="flex justify-between font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
