"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function ProjectDetailFormSkeleton() {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <Skeleton className="h-10 w-10 rounded" />
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                {/* Thumbnail Section */}
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>

                {/* Title */}
                <div>
                  <Skeleton className="h-5 w-12 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>

                {/* Description */}
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-20 w-full rounded" />
                </div>

                {/* Category */}
                <div>
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>

                {/* Technologies */}
                <div>
                  <Skeleton className="h-5 w-28 mb-2" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>

                {/* Links/URLs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                  <div>
                    <Skeleton className="h-5 w-20 mb-2" />
                    <Skeleton className="h-10 w-full rounded" />
                  </div>
                </div>

                {/* Content Editor */}
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-40 w-full rounded" />
                </div>
              </div>

              {/* Right Column - Images */}
              <div className="space-y-6">
                {/* Banner Image */}
                <div>
                  <Skeleton className="h-5 w-16 mb-2" />
                  <Skeleton className="h-64 w-full rounded-lg" />
                </div>

                {/* Additional Image */}
                <div>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-48 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end gap-3">
              <Skeleton className="h-10 w-24 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>

            {/* Gallery Section */}
            <div className="mt-10">
              <div className="grid grid-cols-3 flex justify-center items-center">
                <Separator />
                <div className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto" />
                </div>
                <Separator />
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
