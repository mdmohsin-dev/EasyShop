"use client";

import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { Category, Product, Pagination as PaginationType } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductListItem from "@/components/ProductListItem";
import FilterSidebar from "@/components/FilterSidebar";
import Pagination from "@/components/Pagination";
import { cn } from "@/lib/utils";

type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc";

const SORT_LABELS: Record<SortOption, string> = {
  featured: "Sort by: Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "rating-desc": "Rating: High to Low",
};

const PRICE_CEILING = 1000; // sensible static ceiling for the slider

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationType | null>(null);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<Category | "All">("All");
  const [maxPrice, setMaxPrice] = useState(PRICE_CEILING);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<SortOption>("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), sort });
    if (category !== "All") params.set("category", category);
    if (maxPrice < PRICE_CEILING) params.set("maxPrice", String(maxPrice));
    if (minRating > 0) params.set("minRating", String(minRating));

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setPagination(data.pagination);
      })
      .finally(() => setLoading(false));
  }, [page, category, maxPrice, minRating, sort]);

  // whenever a filter changes, jump back to page 1
  function updateFilter<T>(setter: (v: T) => void) {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  }

  function handleReset() {
    setCategory("All");
    setMaxPrice(PRICE_CEILING);
    setMinRating(0);
    setSort("featured");
    setPage(1);
  }

  function handleProductDeleted(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">Product Catalog</h1>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border p-0.5">
            <button
              onClick={() => setView("grid")}
              className={cn("flex h-8 w-8 items-center justify-center rounded", view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-surface-2")}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn("flex h-8 w-8 items-center justify-center rounded", view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-surface-2")}
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
                      updateFilter(setSort)(opt);
                      setSortMenuOpen(false);
                    }}
                    className={cn("block w-full rounded px-2.5 py-1.5 text-left text-sm hover:bg-surface-2", sort === opt && "font-medium text-primary")}
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
          onCategoryChange={updateFilter(setCategory)}
          maxPrice={maxPrice}
          priceCeiling={PRICE_CEILING}
          onMaxPriceChange={updateFilter(setMaxPrice)}
          minRating={minRating}
          onMinRatingChange={updateFilter(setMinRating)}
          onReset={handleReset}
        />

        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-muted">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted">
              No products match these filters.{" "}
              <button onClick={handleReset} className="font-medium text-primary hover:underline">
                Reset filters
              </button>
            </div>
          ) : (
            <>
              {view === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} onDeleted={handleProductDeleted} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {products.map((product) => (
                    <ProductListItem key={product.id} product={product} onDeleted={handleProductDeleted} />
                  ))}
                </div>
              )}

              {pagination && (
                <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}