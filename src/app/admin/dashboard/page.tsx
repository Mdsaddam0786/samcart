import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AdminUserRow } from "@/components/shared/admin-user-row";

const statusTone = {
  PENDING: "amber",
  PAID: "green",
  FULFILLED: "indigo",
  CANCELLED: "red",
} as const;

export default async function AdminDashboardPage() {
  const session = await auth();

  const [users, orders, productCount] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      include: { buyer: { select: { name: true } }, items: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.product.count(),
  ]);

  const revenue = orders
    .filter((o) => o.status === "PAID" || o.status === "FULFILLED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">Admin dashboard</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Users</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{users.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Products</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{productCount}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Orders</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{orders.length}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{formatPrice(revenue)}</p>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Users</h2>
      <div className="mb-10 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{user.name}</td>
                <td className="px-4 py-3 text-slate-500">{user.email}</td>
                <td className="px-4 py-3">
                  <AdminUserRow
                    userId={user.id}
                    role={user.role}
                    isSelf={user.id === session!.user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent orders</h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{order.buyer.name}</td>
                <td className="px-4 py-3">{order.items.length}</td>
                <td className="px-4 py-3">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge tone={statusTone[order.status]}>{order.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
