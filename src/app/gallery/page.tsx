"use client";

import { AmbientGlow } from "@/components/ambient-glow";
import { ErrorGrid } from "@/components/error-state";
import PhotoSlider from "@/components/photo-slider";
import { ThumbnailSkeleton } from "@/components/thumbnail-skeleton";
import { formatGalleryDate, useGalleries } from "@/hooks/queries/gallery.query";
import { CalendarDays } from "lucide-react";

export default function GalleryPage() {
  const { isLoading, data, error, refetch } = useGalleries({ per_page: 50 });

  if (isLoading) {
    return (
      <div className="max-w-[1920px] mx-auto px-5 lg:px-40">
        <ThumbnailSkeleton count={2} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1920px] mx-auto px-5 lg:px-40">
        <ErrorGrid
          title="Failed to load gallery"
          description={
            error instanceof Error
              ? error.message
              : "Unable to fetch the gallery. Please try again later."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const items = data?.data ?? [];

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-40 pb-20">
      <AmbientGlow />
      {items.length === 0 && (
        <p className="text-muted-foreground">No stories yet, check back soon.</p>
      )}
      <div className="flex flex-col gap-16 lg:gap-24">
        {items.map((item, i) => (
          <article
            key={item.id}
            className="grid items-center gap-6 lg:gap-12 lg:grid-cols-2"
          >
            <PhotoSlider
              photos={item.photos}
              alt={item.title}
              className={i % 2 === 1 ? "lg:order-2" : undefined}
            />
            <div>
              {item.taken_date && (
                <p className="mb-3 flex items-center gap-2 text-sm text-primary">
                  <CalendarDays className="size-4" />
                  {formatGalleryDate(item.taken_date)}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {item.title}
              </h2>
              {item.story && (
                <p className="mt-5 whitespace-pre-line text-base lg:text-lg leading-relaxed text-muted-foreground">
                  {item.story}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
