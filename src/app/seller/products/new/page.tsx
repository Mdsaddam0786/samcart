import { Card, CardContent } from "@/components/ui/card";
import { ProductForm } from "@/components/shared/product-form";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">List a new product</h1>
      <Card>
        <CardContent className="p-6">
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}
