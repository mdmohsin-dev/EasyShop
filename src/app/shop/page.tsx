"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { useProducts } from "@/context/ProductContext";
import { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import FilterSidebar from "@/components/FilterSidebar";
import { cn } from "@/lib/utils";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Sort by: Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
};

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return copy.sort((a, b) => b.rating - a.rating);
    case "featured":
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

export default function ShopPage() {
  const { products, loading } = useProducts();

  const priceCeiling = useMemo(() => {
    const highest = products.reduce((max, p) => Math.max(max, p.price), 0);
    return Math.max(50, Math.ceil(highest / 50) * 50);
  }, [products]);

  const [category, setCategory] = useState<Category | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // null means "not touched yet" — fall back to the computed ceiling so
  // every product shows until the user actually drags the slider
  const effectiveMaxPrice = maxPrice ?? priceCeiling;

  const filtered = useMemo(() => {
    const byFilters = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (p.price > effectiveMaxPrice) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    return sortProducts(byFilters, sort);
  }, [products, category, effectiveMaxPrice, minRating, sort]);

  function handleReset() {
    setCategory("All");
    setMaxPrice(null);
    setMinRating(0);
    setSort("featured");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Product Catalog</h1>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded",
                view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-surface-2"
              )}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded",
                view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-surface-2"
              )}
              title="List view"
            >
              <List size={15} />
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setSortMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm font-medium hover:bg-surface-2"
            >
              {SORT_LABELS[sort]}
            </button>
            {sortMenuOpen && (
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-border bg-surface p-1 shadow-md">
                {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setSortMenuOpen(false);
                    }}
                    className={cn(
                      "block w-full rounded px-2.5 py-1.5 text-left text-sm hover:bg-surface-2",
                      sort === opt && "font-medium text-primary"
                    )}
                  >
                    {SORT_LABELS[opt]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row">
        <FilterSidebar
          category={category}
          onCategoryChange={setCategory}
          maxPrice={effectiveMaxPrice}
          priceCeiling={priceCeiling}
          onMaxPriceChange={setMaxPrice}
          minRating={minRating}
          onMinRatingChange={setMinRating}
          onReset={handleReset}
        />

        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-muted">Loading products…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted">
              No products match these filters.{" "}
              <button onClick={handleReset} className="font-medium text-primary hover:underline">
                Reset filters
              </button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}