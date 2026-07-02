"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProducts } from "@/context/ProductContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";

function AddProductForm() {
  const { addProduct } = useProducts();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (!name.trim()) return setError("Product name is required.");
    if (!priceNum || priceNum <= 0) return setError("Enter a valid price.");
    if (!imagePreview) return setError("Please select an image.");

    addProduct(name.trim(), priceNum, imagePreview, "Electronics", false, 0);
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Card className="animate-float-in">
        <CardHeader>
          <CardTitle>Add a new product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label>Product image</Label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-surface-2 hover:bg-surface-2/70"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-sm text-muted">
                    <ImagePlus size={22} />
                    Select from your computer
                  </span>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            <div>
              <Label htmlFor="name">Product name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" variant="accent" className="mt-1">
              Add product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute allow={["admin"]}>
      <AddProductForm />
    </ProtectedRoute>
  );
}
