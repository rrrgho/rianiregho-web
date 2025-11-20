"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface ThumbnailSkeletonProps {
  count?: number;
}

/**
 * Reusable skeleton component for thumbnail cards
 * Use for projects, posts, or any grid-based content
 */
export function ThumbnailSkeleton({ count = 4 }: ThumbnailSkeletonProps) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-3">
          <div className="rounded-lg overflow-hidden">
            <div className="relative w-full h-64">
              <Skeleton className="bg-primary/10 w-full h-full" />
            </div>

            {/* Overlay skeleton */}
            <div className="relative -mt-16 z-10">
              <div className="p-5 bg-background/30 backdrop-blur-sm">
                {/* Title skeleton */}
                <div className="space-y-2 mb-3">
                  <Skeleton className="bg-primary/10 h-6 w-3/4" />
                  <Skeleton className="bg-primary/10 h-5 w-1/2" />
                </div>

                {/* Date skeleton */}
                <Skeleton className="bg-primary/10 h-4 w-32 mb-2" />

                {/* Description skeleton */}
                <div className="space-y-2">
                  <Skeleton className="bg-primary/10 h-4 w-full" />
                  <Skeleton className="bg-primary/10 h-4 w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Horizontal skeleton variant (useful for different layouts)
 */
export function ThumbnailSkeletonHorizontal({
  count = 3,
}: ThumbnailSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          {/* Image */}
          <Skeleton className="w-40 h-40 rounded-lg flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Minimal skeleton variant (compact version)
 */
export function ThumbnailSkeletonMinimal({
  count = 6,
}: ThumbnailSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-2">
          <Skeleton className="w-full h-32 rounded-lg" />
          <Skeleton className="h-4 w-3/4 mt-2" />
          <Skeleton className="h-3 w-1/2 mt-1" />
        </div>
      ))}
    </div>
  );
}
