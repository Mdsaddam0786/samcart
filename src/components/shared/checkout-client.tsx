"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CartItem = {
  id: string;
  quantity: number;
  product: { id: string; title: string; price: number; imageUrl: string };
};

export function CheckoutClient({
  items,
  cancelled,
}: {
  items: CartItem[];
  cancelled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    setError(null);
    setLoading(true);
    const res = await fetch("/api/checkout", { method: "POST" });
    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Checkout failed");
      return;
    }

    if (body.url) {
      window.location.href = body.url;
    } else {
      router.push(`/orders/${body.orderId}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Checkout</h1>

      {cancelled && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Payment was cancelled. Your cart items are still saved — try again below.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-slate-700">
                {item.product.title} × {item.quantity}
              </span>
              <span className="font-medium text-slate-900">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="my-4 border-t border-slate-100" />
        <div className="flex justify-between font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <Button size="lg" className="mt-6 w-full" onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing order..." : "Place order"}
        </Button>
      </div>
    </div>
  );
}
