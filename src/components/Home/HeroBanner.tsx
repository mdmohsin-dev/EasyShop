"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BannerImageSlider from "./BannerImageSlider";

// TODO: replace these with real product photos when ready — the slider
// itself needs no changes, just swap the URLs in this array.
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
];

export default function HeroBanner() {
  return (
    <section className="border-b border-border bg-surface-2">
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-8 px-4 py-10 sm:px-6 md:flex-row md:gap-10 md:py-16">
        {/* Left: text + CTA */}
        <div className="w-full text-center md:w-1/2 md:text-left animate-float-in">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            New season, small batch
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Well-made things,
            <br className="hidden sm:block" /> plainly priced.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted sm:text-base md:mx-0">
            Every piece in the shop is picked for how it's made, not just how it looks.
            Add what you like — your cart stays saved right here on this device.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" variant="accent" className="w-full sm:w-auto">
                Shop the collection
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Create an account
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="w-full md:w-1/2 animate-float-in">
          <BannerImageSlider images={HERO_IMAGES} alt="Featured products" />
        </div>
      </div>
    </section>
  );
}