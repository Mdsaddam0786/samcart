import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        published: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(category && category !== "all" ? { category } : {}),
      },
      include: { seller: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { published: true },
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 px-6 py-12 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">
          Buy and sell anything on SamCart
        </h1>
        <p className="mt-2 max-w-xl text-indigo-100">
          A simple marketplace where sellers list products and buyers check out
          securely — no fuss, no middlemen.
        </p>
      </section>

      <form className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search products..."
            className="pl-9"
          />
        </div>
        <select
          name="category"
          defaultValue={category ?? "all"}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Filter
        </button>
      </form>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
          No products found. Try a different search or check back later.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              price={product.price}
              imageUrl={product.imageUrl}
              category={product.category}
              stock={product.stock}
              sellerName={product.seller.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
