"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

export default function ProductListItem({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3 sm:gap-5 sm:p-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-2 sm:h-24 sm:w-24">
        {product.featured && (
          <span className="absolute left-1 top-1 z-10 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-primary-foreground">
            Featured
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            {product.category}
          </span>
          {product.rating != null && (
            <span className="flex items-center gap-1 text-xs font-medium text-foreground/80">
              <Star size={12} className="fill-accent text-accent" />
              {product.rating.toFixed(1)}
            </span>
          )}
        </div>
        <h3 className="truncate text-sm font-medium sm:text-base">{product.name}</h3>
        <p className="font-display text-base font-semibold sm:text-lg">${product.price.toFixed(2)}</p>
      </div>

      <Button size="sm" className="shrink-0" onClick={() => addToCart(product)}>
        <ShoppingCart size={15} />
        <span className="hidden sm:inline">Add to Cart</span>
      </Button>
    </div>
  );
}
