"use client";

import Marquee from "react-fast-marquee";
import { Star } from "lucide-react";

interface Review {
    id: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    text: string;
}

const reviews: Review[] = [
    {
        id: "1",
        name: "Ayesha Rahman",
        role: "Product Designer",
        avatar: "https://i.pravatar.cc/100?img=1",
        rating: 5,
        text: "The backpack held up through three months of daily commuting and still looks brand new. Genuinely well made.",
    },
    {
        id: "2",
        name: "Tanvir Hossain",
        role: "Frontend Engineer",
        avatar: "https://i.pravatar.cc/100?img=2",
        rating: 4,
        text: "Ordered the running shoes on a Monday, had them by Wednesday. Comfortable straight out of the box.",
    },
    {
        id: "3",
        name: "Nusrat Jahan",
        role: "Founder, ShopEasy",
        avatar: "https://i.pravatar.cc/100?img=3",
        rating: 5,
        text: "Love that the site shows exactly what's in stock — no surprise cancellations like other shops I've tried.",
    },
    {
        id: "4",
        name: "Shakib Ahmed",
        role: "Marketing Lead",
        avatar: "https://i.pravatar.cc/100?img=4",
        rating: 5,
        text: "Fast checkout, and the headphones sound way better than the price suggests. Will be back for more.",
    },
    {
        id: "5",
        name: "Farhana Akter",
        role: "Operations Manager",
        avatar: "https://i.pravatar.cc/100?img=5",
        rating: 4,
        text: "Customer support actually replied within an hour when I had a sizing question. Rare these days.",
    },
];

function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="mx-3 flex w-[320px] shrink-0 flex-col gap-4 rounded-2xl
        border border-slate-200 bg-white p-6 shadow-sm
        transition-shadow duration-300 hover:shadow-lg text-black">
            <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={
                            i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"} />))}
            </div>

            <p className="text-sm leading-relaxed text-black">
                “{review.text}”
            </p>

            <div className="mt-auto flex items-center gap-3 pt-2">
                <img
                    src={review.avatar}
                    alt={review.name}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                    <p className="text-sm font-semibold text-black">
                        {review.name}
                    </p>
                    <p className="text-xs text-black/60">
                        {review.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ReviewMarquee() {
    return (
        <div className="max-w-7xl mx-auto overflow-hidden relative text-black">
            <div
                className="absolute inset-y-0 left-0 md:w-20 w-9 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to right, #F7F5F0, transparent)' }}
            />
            {/* Right fade mask */}
            <div
                className="absolute inset-y-0 right-0 md:w-20 w-9 z-10 pointer-events-none"
                style={{ background: 'linear-gradient(to left, #F7F5F0, transparent)' }}
            />
            <Marquee speed={35} pauseOnHover gradient gradientColor="#ffffff" gradientWidth={80}>
                {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                ))}
            </Marquee>
        </div>
    );
}