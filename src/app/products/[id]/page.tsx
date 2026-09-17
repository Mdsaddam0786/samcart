import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import { Badge } from "@/components/ui/badge";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { seller: { select: { name: true } } },
  });

  if (!product || !product.published) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {product.category}
          </span>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.title}</h1>
          <p className="mt-1 text-sm text-slate-500">Sold by {product.seller.name}</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.stock === 0 ? (
              <Badge tone="red">Out of stock</Badge>
            ) : product.stock < 10 ? (
              <Badge tone="amber">Only {product.stock} left</Badge>
            ) : (
              <Badge tone="green">In stock</Badge>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-slate-600">{product.description}</p>

          <div className="mt-8">
            <AddToCartButton productId={product.id} disabled={product.stock === 0} />
          </div>
        </div>
      </div>
    </div>
  );
}
