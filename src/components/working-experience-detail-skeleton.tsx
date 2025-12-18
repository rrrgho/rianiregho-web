"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkingExperienceDetailSkeleton() {
  return (
    <div className="w-full mt-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-6">
            <div>
              <Skeleton className="bg-primary/5 h-8 w-48 mb-2" />
              <Skeleton className="bg-primary/5 h-5 w-96" />
            </div>
            <Skeleton className="bg-primary/5 h-10 w-10 rounded" />
          </div>

          <CardContent className="p-0">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Icon Section */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-12 mb-3" />
                  <Skeleton className="bg-primary/5 h-48 w-full rounded-lg" />
                </div>

                {/* Title */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-12 mb-2" />
                  <Skeleton className="bg-primary/5 h-10 w-full rounded" />
                </div>

                {/* Subtitle */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-16 mb-2" />
                  <Skeleton className="bg-primary/5 h-20 w-full rounded" />
                </div>

                {/* Location */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-16 mb-2" />
                  <Skeleton className="bg-primary/5 h-10 w-full rounded" />
                </div>

                {/* Description/Story */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-48 mb-2" />
                  <Skeleton className="bg-primary/5 h-32 w-full rounded" />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="bg-primary/5 h-5 w-20 mb-2" />
                    <Skeleton className="bg-primary/5 h-10 w-full rounded" />
                  </div>
                  <div>
                    <Skeleton className="bg-primary/5 h-5 w-20 mb-2" />
                    <Skeleton className="bg-primary/5 h-10 w-full rounded" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Banner Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="bg-primary/5 h-5 w-16" />
                    <Skeleton className="bg-primary/5 h-4 w-96" />
                  </div>
                  <Skeleton className="bg-primary/5 h-64 w-full rounded-lg" />
                </div>

                {/* Company Logo */}
                <div>
                  <Skeleton className="bg-primary/5 h-5 w-24 mb-3" />
                  <Skeleton className="bg-primary/5 h-48 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <Skeleton className="bg-primary/5 h-10 w-32 rounded" />
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
