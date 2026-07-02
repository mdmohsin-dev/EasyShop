"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const TRUST_ITEMS = [
  { icon: Truck, label: "Free shipping", detail: "On orders over $50" },
  { icon: RotateCcw, label: "Easy returns", detail: "30-day return window" },
  { icon: ShieldCheck, label: "Secure checkout", detail: "256-bit SSL encryption" },
  { icon: Headphones, label: "Support 7 days a week", detail: "Avg. reply under 2 hrs" },
];

const LINK_GROUPS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New arrivals", href: "/shop?sort=featured" },
      { label: "Best sellers", href: "/shop?sort=rating-desc" },
      { label: "Sale", href: "/shop?category=Sale" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track your order", href: "/orders/track" },
      { label: "Shipping & returns", href: "/help/shipping-returns" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

// const SOCIALS = [
//   { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
//   { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
//   { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
//   { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
// ];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // TODO: wire up to your newsletter provider
    setSubmitted(true);
    setEmail("");
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <footer className="mt-16 border-t border-border bg-surface">
      {/* Trust strip */}
      <div className="border-b border-border">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {TRUST_ITEMS.map(({ icon: Icon, label, detail }) => (
            <div key={label} className="flex items-start gap-2.5">
              <Icon size={18} className="mt-0.5 shrink-0 " />
              <div className="min-w-0">
                <p className="text-xs font-medium leading-tight sm:text-sm">{label}</p>
                <p className="text-[11px] leading-tight  sm:text-xs">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.4fr_1fr]">
          {/* Brand + newsletter */}
          <div className="max-w-sm">
            <span className="font-display text-lg font-semibold">Your Store</span>
            <p className="mt-2 text-sm">
              Thoughtfully made goods, shipped fast. Join the list for early access to new
              drops and member-only pricing.
            </p>

            {submitted ? (
              <p className="mt-4 text-sm font-medium">
                You&apos;re on the list — check your inbox to confirm.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="mt-4 flex max-w-xs gap-2">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 bg-background text-sm"
                />
                <Button type="submit" size="sm" className="h-9 shrink-0 px-3">
                  <ArrowRight size={15} />
                </Button>
              </form>
            )}
          </div>

          {/* Link columns — desktop */}
          <div className="hidden grid-cols-3 gap-6 sm:grid">
            {LINK_GROUPS.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-black">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Link columns — mobile accordion */}
          <Accordion className="sm:hidden">
            {LINK_GROUPS.map((group) => (
              <AccordionItem key={group.title} value={group.title} className="border-border">
                <AccordionTrigger className="py-3 text-xs font-semibold uppercase tracking-wide text-black hover:no-underline">
                  {group.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pb-2">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Bottom bar */}
      <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-4 px-4 py-5 sm:flex-row sm:justify-between sm:px-6">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Your Store. All rights reserved.
        </p>

        {/* <div className="flex items-center gap-4">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="text-muted transition-colors hover:text-foreground"
            >
              <Icon size={16} />
            </a>
          ))}

          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className={cn(
              "ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-border",
              "text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            )}
          >
            <ArrowUp size={14} />
          </button>
        </div> */}
      </div>
    </footer>
  );
}