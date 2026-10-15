"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

const SWIPE_THRESHOLD = 100;
// Drag distance at which the cards behind have fully moved up one place
const PULL_DISTANCE = 220;
const EXIT_MS = 280;
// Cards behind the top one fan out to alternating sides so each layer peeks out
const BEHIND = [
  { x: 0, y: 0, rotate: 0, scale: 1 },
  { x: 34, y: 10, rotate: 6, scale: 0.96 },
  { x: -34, y: 18, rotate: -6, scale: 0.92 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Props = {
  images: { src: StaticImageData; alt: string }[];
};

export function PhotoStack({ images }: Props) {
  const [order, setOrder] = useState(() => images.map((_, i) => i));
  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // Card that just went to the back: skip its transition for one frame
  const [snapped, setSnapped] = useState<number | null>(null);
  const startX = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    if (snapped === null) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setSnapped(null)),
    );
    return () => cancelAnimationFrame(id);
  }, [snapped]);

  const sendAway = (dir: 1 | -1) => {
    if (leaving || images.length < 2) return;
    setLeaving(true);
    setDragging(false);
    setDx(dir * (window.innerWidth + 200));
    timer.current = setTimeout(() => {
      setOrder((o) => {
        setSnapped(o[0]);
        return [...o.slice(1), o[0]];
      });
      setDx(0);
      setLeaving(false);
    }, EXIT_MS);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (leaving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDx(e.clientX - startX.current);
  };

  const onPointerUp = () => {
    if (!dragging) return;
    if (Math.abs(dx) > SWIPE_THRESHOLD) sendAway(dx > 0 ? 1 : -1);
    else {
      setDragging(false);
      setDx(0);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") sendAway(1);
    if (e.key === "ArrowLeft") sendAway(-1);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Photos of Rian Iregho. Swipe or use arrow keys."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative aspect-[4/5] w-full select-none outline-none"
      >
        {order.map((imgIndex, rank) => {
          const isTop = rank === 0;
          const depth = Math.min(rank, 2);
          // 0 = at rest, 1 = top card fully swiped away. The cards behind are
          // pulled forward in step with the finger.
          const progress = Math.min(Math.abs(dx) / PULL_DISTANCE, 1);

          let transform: string;
          let brightness = 1;
          let opacity = 1;
          if (isTop) {
            transform = `translateX(${dx}px) translateY(0px) rotate(${dx / 25}deg) scale(1)`;
          } else {
            const from = BEHIND[depth];
            const to = BEHIND[Math.min(rank - 1, 2)];
            transform = `translateX(${lerp(from.x, to.x, progress)}px) translateY(${lerp(from.y, to.y, progress)}px) rotate(${lerp(from.rotate, to.rotate, progress)}deg) scale(${lerp(from.scale, to.scale, progress)})`;
            brightness = lerp(1 - depth * 0.2, 1 - Math.min(rank - 1, 2) * 0.2, progress);
            // a 4th+ card fades in as it becomes visible
            opacity = rank > 2 ? progress : 1;
          }
          // Follow the finger exactly while dragging; ease when released
          const animate = !dragging && snapped !== imgIndex;

          return (
            <div
              key={imgIndex}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
              onPointerCancel={isTop ? onPointerUp : undefined}
              aria-hidden={!isTop}
              className={`absolute inset-0 overflow-hidden rounded-[2rem] border border-foreground/10 shadow-2xl will-change-transform ${
                isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
              style={{
                transform,
                zIndex: images.length - rank,
                opacity,
                filter: isTop ? "none" : `brightness(${brightness})`,
                touchAction: "pan-y",
                transition: animate
                  ? `transform ${EXIT_MS}ms ease-out, filter ${EXIT_MS}ms, opacity ${EXIT_MS}ms`
                  : "none",
              }}
            >
              <Image
                src={images[imgIndex].src}
                alt={images[imgIndex].alt}
                fill
                priority={imgIndex === 0}
                draggable={false}
                sizes="(min-width: 1024px) 500px, 320px"
                className="pointer-events-none object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                order[0] === i ? "w-5 bg-primary" : "w-1.5 bg-foreground/25"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-foreground/50">Swipe to see more</span>
      </div>
    </div>
  );
}
