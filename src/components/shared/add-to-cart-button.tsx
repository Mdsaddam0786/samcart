"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

export function AddToCartButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleClick = async () => {
    if (status !== "authenticated") {
      router.push(`/login?callbackUrl=/products/${productId}`);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    setLoading(false);

    if (res.ok) {
      setAdded(true);
      router.refresh();
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <Button size="lg" onClick={handleClick} disabled={disabled || loading} className="w-full">
      {added ? (
        <>
          <Check className="h-4 w-4" /> Added to cart
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" />
          {loading ? "Adding..." : "Add to cart"}
        </>
      )}
    </Button>
  );
}
