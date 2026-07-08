"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

const MotionImage = motion(Image);

interface BannerImageSliderProps {
  images: (string | StaticImageData)[];
  alt: string;
  intervalMs?: number;
}

export default function BannerImageSlider({ images, alt, intervalMs = 3000 }: BannerImageSliderProps) {
  const [index, setIndex] = useState(0);

  // setInterval only decides WHEN to advance to the next slide — the actual
  // fade animation itself is handled by Framer Motion's AnimatePresence below.
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className=" aspect-4/3 w-full overflow-hidden bg-surface rounded-xl shadow-sm sm:aspect-16/10">
      <AnimatePresence>
        <MotionImage
          key={index}
          src={images[index]}
          alt={`${alt} ${index + 1}`}
          className="absolute inset-0 h-full w-full object-cover rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          width={500}
          height={500}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? "1.25rem" : "0.375rem",
                backgroundColor: i === index ? "var(--accent)" : "rgba(255,255,255,0.6)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}