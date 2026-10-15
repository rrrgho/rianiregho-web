"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PhotoSliderProps {
  photos: { id: string; image_path: string }[];
  alt: string;
  className?: string;
}

/** Swipeable photo slideshow (scroll-snap) with arrows, dots and keyboard support. */
export default function PhotoSlider({ photos, alt, className }: PhotoSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const storage = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

  const goTo = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(i, track.children.length - 1));
    track.scrollTo({ left: next * track.clientWidth, behavior: "smooth" });
  }, []);

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || !track.clientWidth) return;
    setIndex(Math.round(track.scrollLeft / track.clientWidth));
  };

  if (photos.length === 0) {
    return (
      <div
        className={cn(
          "aspect-[4/3] w-full rounded-2xl bg-muted flex items-center justify-center text-sm text-muted-foreground",
          className
        )}
      >
        No photos yet
      </div>
    );
  }

  const many = photos.length > 1;

  return (
    <div
      className={cn("group relative w-full rounded-2xl overflow-hidden bg-muted", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") goTo(index - 1);
        if (e.key === "ArrowRight") goTo(index + 1);
      }}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="relative aspect-[4/3] w-full shrink-0 snap-center"
            aria-label={`${i + 1} of ${photos.length}`}
          >
            <Image
              src={storage + photo.image_path}
              alt={`${alt} - photo ${i + 1}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {many && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden cursor-pointer"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => goTo(index + 1)}
            disabled={index === photos.length - 1}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-md opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden cursor-pointer"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-md">
            {photos.map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all cursor-pointer",
                  i === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
