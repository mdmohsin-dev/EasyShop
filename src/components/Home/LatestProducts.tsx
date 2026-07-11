"use client";

import ProductCard from "@/components/Product/ProductCard";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

export default function LatestProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=4&sort=featured")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  }, []);

  if (loading || products.length === 0) return null;

  function handleProductDeleted(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 mb-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Just added</p>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Latest arrivals</h2>
        </div>
        <a href="/shop" className="text-sm font-medium text-primary hover:underline shrink-0">
          View all
        </a>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onDeleted={handleProductDeleted} />
        ))}
      </div>
    </div>
  );
}