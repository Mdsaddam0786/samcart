"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { productSchema, type ProductInput } from "@/lib/validation";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProductFormValues = z.input<typeof productSchema>;

type ProductFormProps = {
  productId?: string;
  defaultValues?: Partial<ProductInput>;
};

export function ProductForm({ productId, defaultValues }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
      imageUrl: "",
      category: "",
      stock: 0,
      published: true,
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    setError(null);
    const res = await fetch(productId ? `/api/products/${productId}` : "/api/products", {
      method: productId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Something went wrong");
      return;
    }

    router.push("/seller/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register("title")} />
        {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && (
          <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" step="0.01" min="0" {...register("price")} />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>}
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" min="0" {...register("stock")} />
          {errors.stock && <p className="mt-1 text-xs text-red-600">{errors.stock.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" placeholder="e.g. Electronics" {...register("category")} />
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="mt-1 text-xs text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register("published")} className="h-4 w-4 rounded border-slate-300" />
        Published (visible to buyers)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : productId ? "Save changes" : "List product"}
      </Button>
    </form>
  );
}
