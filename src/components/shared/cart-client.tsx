"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    stock: number;
  };
};

export function CartClient({ initialItems }: { initialItems: CartItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
    await fetch(`/api/cart/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });
    startTransition(() => router.refresh());
  };

  const removeItem = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center text-slate-500">
        Your cart is empty.{" "}
        <Link href="/" className="font-medium text-indigo-600 hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.product.imageUrl}
              alt={item.product.title}
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <Link
                href={`/products/${item.product.id}`}
                className="font-medium text-slate-900 hover:underline"
              >
                {item.product.title}
              </Link>
              <p className="text-sm text-slate-500">{formatPrice(item.product.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
                disabled={isPending}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50"
                disabled={isPending || item.quantity >= item.product.stock}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="w-20 text-right font-semibold text-slate-900">
              {formatPrice(item.product.price * item.quantity)}
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-slate-400 hover:text-red-600"
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Order summary</h2>
        <div className="flex justify-between text-sm text-slate-600">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="my-4 border-t border-slate-100" />
        <div className="flex justify-between font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Button size="lg" className="mt-6 w-full" onClick={() => router.push("/checkout")}>
          Proceed to checkout
        </Button>
      </div>
    </div>
  );
}
