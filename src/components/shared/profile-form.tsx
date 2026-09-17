"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [formName, setFormName] = useState(name);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, password: password || undefined }),
    });

    setSaving(false);

    if (res.ok) {
      setMessage("Profile updated.");
      setPassword("");
      router.refresh();
    } else {
      const body = await res.json();
      setMessage(body.error ?? "Failed to update profile");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} disabled />
      </div>
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Leave blank to keep current password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {message && <p className="text-sm text-slate-600">{message}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
