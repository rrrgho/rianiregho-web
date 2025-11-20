"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading skeleton for project detail page
 */
export function ProjectDetailSkeleton() {
  return (
    <div className="w-full min-h-screen px-5 lg:px-40 py-20">
      {/* Breadcrumbs Skeleton */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="bg-primary/20 h-5 w-16" />
        <Skeleton className="bg-primary/20 h-5 w-20" />
        <Skeleton className="bg-primary/20 h-5 w-32" />
      </div>

      {/* Back Button Skeleton */}
      <div className="mb-8">
        <Skeleton className="bg-primary/20 h-6 w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Project Image Skeleton */}
          <div className="rounded-lg overflow-hidden mb-8">
            <Skeleton className="bg-primary/20 w-full h-96" />
          </div>

          {/* Title Skeleton */}
          <div className="mb-4 space-y-2">
            <Skeleton className="bg-primary/20 h-10 w-3/4" />
            <Skeleton className="bg-primary/20 h-8 w-1/2" />
          </div>

          {/* Description Skeleton */}
          <div className="mb-8 space-y-2">
            <Skeleton className="bg-primary/20 h-5 w-full" />
            <Skeleton className="bg-primary/20 h-5 w-full" />
            <Skeleton className="bg-primary/20 h-5 w-2/3" />
          </div>

          {/* Long Description Skeleton */}
          <div className="mb-12 space-y-2">
            <Skeleton className="bg-primary/20 h-5 w-full" />
            <Skeleton className="bg-primary/20 h-5 w-full" />
            <Skeleton className="bg-primary/20 h-5 w-full" />
            <Skeleton className="bg-primary/20 h-5 w-3/4" />
          </div>

          {/* Project Info Grid Skeleton */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-2">
              <Skeleton className="bg-primary/20 h-6 w-20" />
              <Skeleton className="bg-primary/20 h-5 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="bg-primary/20 h-6 w-20" />
              <Skeleton className="bg-primary/20 h-5 w-32" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="flex gap-4 mb-12">
            <Skeleton className="bg-primary/20 h-12 w-32" />
            <Skeleton className="bg-primary/20 h-12 w-32" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Technologies Card Skeleton */}
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <Skeleton className="bg-primary/20 h-6 w-24 mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="bg-primary/20 h-8 w-20 rounded-full" />
              <Skeleton className="bg-primary/20 h-8 w-24 rounded-full" />
              <Skeleton className="bg-primary/20 h-8 w-28 rounded-full" />
              <Skeleton className="bg-primary/20 h-8 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
