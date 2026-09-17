import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/components/shared/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) notFound();
  if (product.sellerId !== session!.user.id && session!.user.role !== "ADMIN") {
    notFound();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Edit product</h1>
      <Card>
        <CardContent className="p-6">
          <ProductForm
            productId={product.id}
            defaultValues={{
              title: product.title,
              description: product.description,
              price: product.price / 100,
              imageUrl: product.imageUrl,
              category: product.category,
              stock: product.stock,
              published: product.published,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
