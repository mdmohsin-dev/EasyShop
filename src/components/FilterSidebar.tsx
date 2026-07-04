"use client";

import { Category, CATEGORY_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: (Category | "All")[] = ["All", "ELECTRONICS", "ACCESSORIES", "APPAREL"];
const RATING_OPTIONS = [4.5, 4, 3.5];

interface FilterSidebarProps {
  category: Category | "All";
  onCategoryChange: (c: Category | "All") => void;
  maxPrice: number;
  priceCeiling: number;
  onMaxPriceChange: (p: number) => void;
  minRating: number;
  onMinRatingChange: (r: number) => void;
  onReset: () => void;
}

export default function FilterSidebar({
  category,
  onCategoryChange,
  maxPrice,
  priceCeiling,
  onMaxPriceChange,
  minRating,
  onMinRatingChange,
  onReset,
}: FilterSidebarProps) {
  return (
    <aside className="h-fit w-full shrink-0 rounded-lg border border-border bg-surface p-5 sm:w-64">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button onClick={onReset} className="text-xs font-medium text-primary hover:underline">
          Reset all
        </button>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => onCategoryChange(c)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-left text-sm transition-colors",
                category === c ? "bg-primary/10 font-medium text-primary" : "text-foreground/75 hover:bg-surface-2"
              )}
            >
              {c === "All" ? "All" : CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Max price</p>
          <span className="text-sm font-semibold">${maxPrice}</span>
        </div>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={5}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>$0</span>
          <span>${priceCeiling}</span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Minimum rating</p>
        <div className="flex flex-col gap-1.5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="radio"
              name="minRating"
              checked={minRating === 0}
              onChange={() => onMinRatingChange(0)}
              className="accent-[var(--primary)]"
            />
            All ratings
          </label>
          {RATING_OPTIONS.map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="minRating"
                checked={minRating === r}
                onChange={() => onMinRatingChange(r)}
                className="accent-[var(--primary)]"
              />
              {r}+ stars
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
