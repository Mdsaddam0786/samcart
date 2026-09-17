import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/components/shared/delete-product-button";
import { OrderStatusSelect } from "@/components/shared/order-status-select";
import { Pencil, Plus } from "lucide-react";

export default async function SellerDashboardPage() {
  const session = await auth();
  const sellerId = session!.user.id;

  const [products, orderItems] = await Promise.all([
    prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderItem.findMany({
      where: { sellerId },
      include: { order: true, product: true },
      orderBy: { order: { createdAt: "desc" } },
    }),
  ]);

  const revenue = orderItems
    .filter((i) => i.order.status === "PAID" || i.order.status === "FULFILLED")
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Seller dashboard</h1>
        <Link href="/seller/products/new">
          <Button>
            <Plus className="h-4 w-4" /> List a product
          </Button>
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Products listed</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{products.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Orders received</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{orderItems.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatPrice(revenue)}</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Your products</h2>
      {products.length === 0 ? (
        <p className="mb-10 text-sm text-slate-500">
          You haven&apos;t listed any products yet.
        </p>
      ) : (
        <div className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="flex items-center gap-3 px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                    <span className="font-medium text-slate-900">{product.title}</span>
                  </td>
                  <td className="px-4 py-3">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    <Badge tone={product.published ? "green" : "slate"}>
                      {product.published ? "Published" : "Draft"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Orders</h2>
      {orderItems.length === 0 ? (
        <p className="text-sm text-slate-500">No orders yet.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <Link href={`/orders/${item.orderId}`} className="font-medium text-slate-900 hover:underline">
                      {item.product.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatPrice(item.price * item.quantity)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={item.orderId} status={item.order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
