"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

// Change this key if you ever want to force the modal to show again for
// everyone (e.g. running a new promo) — a new key means old "seen" flags
// in people's browsers no longer match, so it shows once more.
const STORAGE_KEY = "promo_modal_seen_v1";
const SHOW_DELAY_MS = 1200;

export default function PromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;

    // small delay so it doesn't slam the visitor the instant the page loads
    const timer = setTimeout(() => {
      setOpen(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
          >
            <button
              onClick={handleClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
            >
              <X size={16} />
            </button>

            {/* promo banner */}
            <div className="relative flex flex-col items-center overflow-hidden bg-gradient-to-b from-surface-2 to-surface px-6 pb-6 pt-10 text-center">
              <div
                className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                style={{ background: "var(--primary)" }}
              />
              <span className="relative flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                <Tag size={12} /> LIMITED TIME
              </span>
              <p className="relative mt-4 font-display text-5xl font-extrabold leading-none text-primary">
                30% OFF
              </p>
              <p className="relative mt-2 text-sm text-muted">
                On your first order — use the code below at checkout
              </p>
              <div className="relative mt-4 rounded-lg border border-dashed border-primary bg-surface px-4 py-2 font-mono text-sm font-semibold tracking-widest text-primary">
                SAVE30
              </div>
              <Link href="/shop" onClick={handleClose} className="relative mt-6 w-full">
                <Button size="lg" variant="accent" className="w-full rounded-full font-semibold">
                  Shop Now
                </Button>
              </Link>
              <button onClick={handleClose} className="relative mt-3 text-xs text-muted hover:text-foreground">
                No thanks, maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}