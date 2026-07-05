"use client";

import Link from "next/link";
import { Product, CATEGORY_LABELS } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onDeleted?: (id: string) => void;
}

export default function ProductCard({ product, onDeleted }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "ADMIN";

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (res.ok) {
      onDeleted?.(product.id);
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Could not delete this product.");
    }
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-md">
      <Link href={`/shop/${product.id}`} className="relative block aspect-square w-full overflow-hidden bg-surface-2">
        {product.featured && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
            Featured
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <Image
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={300}
          height={300}
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-foreground/80 shrink-0">
            <Star size={12} className="fill-accent text-accent" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link href={`/shop/${product.id}`}>
          <h3 className="mb-1 line-clamp-2 text-md lg:text-lg font-medium leading-snug hover:underline ">
            {product.name}
          </h3>
        </Link>

        <p className="mb-3 font-display text-lg font-semibold">${product.price.toFixed(2)}</p>

        {isAdmin ? (
          <Button className="mt-auto w-full" size="sm" variant="danger" onClick={handleDelete}>
            <Trash2 size={15} />
            Delete Product
          </Button>
        ) : (
          <Button className="mt-auto w-full" size="sm" onClick={() => addToCart(product)}>
            <ShoppingCart size={15} />
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}