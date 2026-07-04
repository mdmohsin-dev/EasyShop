"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RequireAdmin from "@/components/RequireAdmin";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "ELECTRONICS", label: "Electronics" },
  { value: "ACCESSORIES", label: "Accessories" },
  { value: "APPAREL", label: "Apparel" },
];

function AddProductForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("ELECTRONICS");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const priceNum = parseFloat(price);
    if (!name.trim()) return setError("Product name is required.");
    if (!description.trim()) return setError("Add a short description.");
    if (!priceNum || priceNum <= 0) return setError("Enter a valid price.");
    if (!imageFile) return setError("Please select an image.");

    setSubmitting(true);

    // 1. Upload the image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageFile);
    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    if (!uploadRes.ok) {
      const data = await uploadRes.json().catch(() => ({}));
      setError(data.error || "Image upload failed.");
      setSubmitting(false);
      return;
    }
    const { url: imageUrl } = await uploadRes.json();

    // 2. Create the product with the uploaded image URL
    const createRes = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        price: priceNum,
        image: imageUrl,
        category,
      }),
    });

    if (!createRes.ok) {
      const data = await createRes.json().catch(() => ({}));
      setError(data.error?.formErrors?.[0] || "Could not create the product.");
      setSubmitting(false);
      return;
    }

    router.push("/dashboard/products");
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            <div>
              <Label htmlFor="name">Product name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="flex w-full rounded-md border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div>
              <Label>Category</Label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "rounded-md border px-2 py-2 text-xs font-medium transition-colors sm:text-sm",
                      category === c.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface hover:bg-surface-2"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" variant="accent" className="mt-1" disabled={submitting}>
              {submitting ? "Adding…" : "Add product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <RequireAdmin>
      <AddProductForm />
    </RequireAdmin>
  );
}
