import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ProductCardProps = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  sellerName?: string;
};

export function ProductCard({
  id,
  title,
  price,
  imageUrl,
  category,
  stock,
  sellerName,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Badge tone="red">Out of stock</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-indigo-600">
          {category}
        </span>
        <h3 className="line-clamp-2 font-semibold text-slate-900">{title}</h3>
        {sellerName && <p className="text-xs text-slate-500">by {sellerName}</p>}
        <div className="mt-auto pt-2 text-lg font-bold text-slate-900">
          {formatPrice(price)}
        </div>
      </div>
    </Link>
  );
}
