"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import drone from "@/assets/camera-drone.png"
import cctv from "@/assets/HIKcctv.png"
import Link from "next/link";


function useInfiniteCountdown(durationMs: number) {
    const [target, setTarget] = useState(() => Date.now() + durationMs);
    const [remaining, setRemaining] = useState(durationMs);

    useEffect(() => {
        const id = setInterval(() => {
            const diff = target - Date.now();

            if (diff <= 0) {
                const newTarget = Date.now() + durationMs;
                setTarget(newTarget);
                setRemaining(durationMs);
                return;
            }

            setRemaining(diff);
        }, 1000);

        return () => clearInterval(id);
    }, [target, durationMs]);

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const seconds = Math.floor((remaining / 1000) % 60);

    return { days, hours, minutes, seconds };
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function CountdownCircle({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center justify-center w-16 h-16 sm:w-16 sm:h-16 rounded-full bg-rose-600 text-white shadow-lg shadow-rose-900/20 shrink-0">
            <AnimatePresence mode="popLayout">
                <motion.span
                    key={value}
                    initial={{ y: 6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -6, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-lg sm:text-xl md:text-2xl font-bold leading-none tabular-nums"
                >
                    {pad(value)}
                </motion.span>
            </AnimatePresence>
            <span className="text-[9px] md:text-[10px] font-medium tracking-wide uppercase mt-1 opacity-90">
                {label}
            </span>
        </div>
    );
}

export default function HeroDealBanner() {
    const { days, hours, minutes, seconds } = useInfiniteCountdown(
        2 * 24 * 60 * 60 * 1000
    );

    return (
        <section className="w-full overflow-hidden bg-slate-100 mb-20">

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between min-h-72 md:min-h-85 lg:min-h-96">
                    {/* Left image — hidden on small devices, bleeds off the left edge from md+ */}
                    <div className="hidden md:flex w-52 md:w-60 lg:w-76 pointer-events-none select-none">
                        <Image
                            src={drone}
                            alt="Drone"
                            width={480}
                            height={420}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>


                    <div className="z-10 flex flex-col items-center justify-center gap-5 px-6 py-10 md:py-0 text-center">
                        <div className="flex items-end gap-3 sm:gap-4">
                            <CountdownCircle value={days} label="Days" />
                            <CountdownCircle value={hours} label="Hours" />
                            <CountdownCircle value={minutes} label="Mins" />
                            <CountdownCircle value={seconds} label="Secs" />
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                                HOT DEAL THIS WEEK
                            </h2>
                            <p className="text-sm md:text-base text-slate-500">
                                New collection up to 50% off
                            </p>
                        </div>

                        <Link href='/shop'>
                            <Button className="rounded-full bg-rose-600 hover:bg-rose-700 text-white px-8 h-11 text-sm font-semibold tracking-wide">
                                SHOP NOW
                            </Button>
                        </Link>
                    </div>


                    <div className="hidden md:flex w-52 md:w-60 lg:w-72 pointer-events-none select-none">
                        <Image
                            src={cctv}
                            alt="CCTV Camera"
                            width={420}
                            height={420}
                            className="w-full h-auto object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}