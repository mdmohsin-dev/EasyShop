"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, ChevronLeft, Trash2 } from "lucide-react";
import { Product, CATEGORY_LABELS } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [added, setAdded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => setProduct(data.product))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-6xl px-4 py-16 text-center text-sm text-muted">Loading…</p>;
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-sm text-muted">Product not found.</p>
        <Link href="/shop" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  function handleAdd() {
    addToCart(product!);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product!.name}"? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/products/${product!.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/shop");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Could not delete this product.");
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronLeft size={15} /> Back to shop
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-2">
          {product.featured && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Featured
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {CATEGORY_LABELS[product.category]}
          </span>
          <h1 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{product.name}</h1>

          <div className="mt-2 flex items-center gap-1.5">
            <Star size={16} className="fill-accent text-accent" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>

          <p className="mt-4 font-display text-3xl font-semibold">${product.price.toFixed(2)}</p>

          <p className="mt-5 text-sm leading-relaxed text-muted">{product.description}</p>

          {isAdmin ? (
            <Button size="lg" variant="danger" className="mt-6 w-full sm:w-auto" onClick={handleDelete} disabled={deleting}>
              <Trash2 size={17} />
              {deleting ? "Deleting…" : "Delete Product"}
            </Button>
          ) : (
            <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={handleAdd}>
              <ShoppingCart size={17} />
              {added ? "Added!" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}