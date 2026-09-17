"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"] as const;

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: (typeof STATUSES)[number];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(status);
  const [saving, setSaving] = useState(false);

  const onChange = async (value: string) => {
    setCurrent(value as typeof status);
    setSaving(true);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      disabled={saving}
      className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
