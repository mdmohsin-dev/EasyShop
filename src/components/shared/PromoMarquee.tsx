"use client";

import Marquee from "react-fast-marquee";
import { Tag } from "lucide-react";

const PROMO_ITEMS = [
    "🔥 30% OFF everything — use code SAVE30",
    "Free shipping on orders over $50",
    "🔥 30% OFF everything — use code SAVE30",
    "New arrivals dropping every week",
    "Free shipping on orders over $50",
    "Limited stock on featured items",
    "New arrivals dropping every week",
    "🔥 30% OFF everything — use code SAVE30",
    "Limited stock on featured items",
];

export default function PromoMarquee() {
    return (
        <div className="fixed inset-x-0 top-0 z-50 flex h-9 items-center overflow-hidden bg-primary text-primary-foreground">
            <Marquee speed={45} pauseOnHover gradient={false} className="text-xs font-medium sm:text-sm">
                {PROMO_ITEMS.map((item, i) => (
                    <span key={i} className="mx-6 flex items-center gap-2">
                        <Tag size={13} className="shrink-0" />
                        {item}
                    </span>
                ))}
            </Marquee>
        </div>
    );
}