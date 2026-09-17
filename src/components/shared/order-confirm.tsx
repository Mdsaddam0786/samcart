"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function OrderConfirm({
  orderId,
  sessionId,
  alreadyPaid,
}: {
  orderId: string;
  sessionId: string;
  alreadyPaid: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"confirming" | "done">(
    alreadyPaid ? "done" : "confirming"
  );

  useEffect(() => {
    if (alreadyPaid) return;
    let cancelled = false;

    fetch("/api/checkout/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, orderId }),
    })
      .catch(() => null)
      .finally(() => {
        if (cancelled) return;
        setStatus("done");
        router.refresh();
      });

    return () => {
      cancelled = true;
    };
  }, [alreadyPaid, orderId, sessionId, router]);

  if (status === "confirming") {
    return (
      <div className="mb-6 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
        Confirming your payment...
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      Payment confirmed. Thank you for your order!
    </div>
  );
}
