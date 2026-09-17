"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const ROLES = ["BUYER", "SELLER", "ADMIN"] as const;

export function AdminUserRow({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: (typeof ROLES)[number];
  isSelf: boolean;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(role);
  const [saving, setSaving] = useState(false);

  const onRoleChange = async (value: string) => {
    setCurrent(value as typeof role);
    setSaving(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: value }),
    });
    setSaving(false);
    router.refresh();
  };

  const onDelete = async () => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={current}
        onChange={(e) => onRoleChange(e.target.value)}
        disabled={saving || isSelf}
        className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      {!isSelf && (
        <button
          onClick={onDelete}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
          aria-label="Delete user"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
