"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BannerImageSlider from "./BannerImageSlider";
import headphone from "@/assets/headphone.jpg"
import smartWatch from "@/assets/smartwatch.jpg"
import airbuds from "@/assets/airbuds.jpg"


const HERO_IMAGES = [
  smartWatch,
  headphone,
  airbuds
];

export default function HeroBanner() {
  return (
    <section className="border-b border-border bg-surface-2">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center md:flex-row px-4 py-36 justify-between">
        {/* Left: text + CTA */}
        <div className="w-full text-center md:w-1/2 md:text-left animate-float-in flex flex-col gap-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">
            New season, small batch
          </p>
          <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            Well-made things,
            <br className="hidden sm:block" /> plainly priced.
          </h1>
          <p className="mx-auto max-w-md text-sm text-muted sm:text-base md:mx-0">
            Every piece in the shop is picked for how it's made, not just how it looks.
            Add what you like — your cart stays saved right here on this device.
          </p>

          <Link href="/shop" className="w-full sm:w-auto">
            <Button size="lg" variant="accent" className="w-full sm:w-auto">
              Explore Collection
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>

        {/* Right: image */}
        <div className="w-full md:w-1/2 animate-float-in">
          <BannerImageSlider images={HERO_IMAGES} alt="Featured products" />
        </div>
      </div>
    </section>
  );
}