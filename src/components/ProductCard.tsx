"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group animate-float-in overflow-hidden rounded-lg border border-border bg-surface transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="min-w-0">
          <h3 className="truncate font-medium">{product.name}</h3>
          <span className="price-tag mt-1 inline-block bg-primary text-primary-foreground text-xs font-semibold py-1 pr-2">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Button size="icon" variant="accent" onClick={() => addToCart(product)} title="Add to cart">
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
}
