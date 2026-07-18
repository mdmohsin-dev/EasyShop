"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Package, Users, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/types";
import banner from "@/assets/bannerHeadphone.webp"
import Image from "next/image";

const floatUp = {
  animate: {
    y: [0, -10, 0],
  },
};

const floatDown = {
  animate: {
    y: [0, 10, 0],
  },
};

const floatTransition = {
  duration: 8,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export default function HeroBanner() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [featured, setFeatured] = useState<Product | null>(null);

  useEffect(() => {
    fetch("/api/products?limit=1&sort=featured")
      .then((res) => res.json())
      .then((data) => {
        setProductCount(data.pagination?.totalItems ?? null);
        setFeatured(data.products?.[0] ?? null);
      })
      .catch(() => { });
  }, []);

  return (
    <section className="relative overflow-hidden bg-background">
      {/* faint background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 xl:py-36">

        <div className="flex flex-col lg:flex-row lg:gap-0 md:gap-10 justify-between items-center w-full ">

          {/* Left: text + CTA */}
          <div className="text-center flex flex-col lg:gap-10 gap-6 animate-float-in lg:text-left">
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-foreground sm:text-5xl lg:text-[2.75rem]">
              Smart Choices for <br className="hidden md:flex" /> Smarter Living
            </h1>
            <p className="mx-auto max-w-sm text-sm text-muted lg:mx-0">
              Every piece in the shop is picked for how it&apos;s made, not just how it looks.
            </p>
            <Link href="/shop" className="inline-block">
              <Button size="lg" variant="accent" className="rounded-full font-semibold">
                Explore Product
              </Button>
            </Link>
          </div>


          {/* middle image */}
          <div className="relative animate-float-in">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl sm:aspect-4/3">

              <Image
                src={banner}
                alt="Featured product"
                className="relative h-full lg:w-[500px] w-[400px] object-cover"
              // style={{ filter: "drop-shadow(0 0 40px rgba(166, 255, 77, 0.15))" }}
              />
            </div>

            <div
              className="pointer-events-none absolute -bottom-2 left-1/2 hidden h-10 w-3/4 -translate-x-1/2 rounded-[50%] sm:block"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(166,255,77,0.35) 0%, rgba(166,255,77,0.12) 45%, transparent 75%)",
              }} />
          </div>


          {/* stats card */}
          <div className="mx-auto hidden lg:flex gap-12 relative animate-float-in lg:mx-0 lg:flex-col">

            <motion.div
              variants={floatUp}
              animate="animate"
              transition={floatTransition}
              className="hidden justify-around items-center p-3 bg-surface/95 w-44 rounded-lg backdrop-blur border border-border sm:flex"
            >
              <div>
                <p className="text-xs text-muted">{featured?.category ?? "Featured"}</p>
                <p className="font-display text-base font-bold text-primary">
                  {featured ? `$${featured.price.toFixed(2)}` : "New arrivals"}
                </p>
              </div>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_16px_rgba(166,255,77,0.5)]"
              >
                <Plus size={16} />
              </div>
            </motion.div>

            <motion.div
              variants={floatDown}
              animate="animate"
              transition={floatTransition}
              className="flex justify-around ml-16 w-44 bg-surface/95 p-3 border border-border rounded-lg lg:flex-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Package size={18} />
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-none text-foreground">
                  {productCount !== null ? `${productCount}+` : "—"}
                </p>
                <p className="mt-1 text-xs text-muted">All Products</p>
              </div>
            </motion.div>

            <motion.div
              variants={floatUp}
              animate="animate"
              transition={floatTransition}
              className="flex justify-around w-44 bg-surface/95 p-3 border border-border rounded-lg lg:flex-none"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Users size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted">Happy Clients</p>
                <p className="font-display text-lg font-bold leading-none text-foreground">752+</p>
              </div>
            </motion.div>
          </div>

        </div>


        <div className="md:mt-16 flex items-center justify-between">
          <div className="flex flex-1 items-center justify-center gap-3 px-6">
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
            <span className="h-px flex-1 max-w-24 bg-border" />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_rgba(166,255,77,0.4)]">
              <ChevronDown size={16} />
            </span>
            <span className="h-px flex-1 max-w-24 bg-border" />
            <span className="h-1.5 w-1.5 rounded-full bg-border" />
          </div>

        </div>
      </div>
    </section>
  );
}