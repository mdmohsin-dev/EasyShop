"use client";

import { useMemo } from "react";
import { useProducts } from "@/context/ProductContext";
import ProductCard from "@/components/ProductCard";

export default function LatestProducts() {
  const { products, loading } = useProducts();

  // products are stored newest-first (see ProductContext.addProduct), so the
  // first 3 are always the latest 3 added — no extra sorting needed.
  const latestProducts = useMemo(() => products.slice(0, 3), [products]);

  if (loading || latestProducts.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Just added</p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Latest arrivals</h2>
        </div>
        <a href="#products" className="text-sm font-medium text-primary hover:underline shrink-0">
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {latestProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}