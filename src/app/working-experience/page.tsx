"use client";

import { AmbientGlow } from "@/components/ambient-glow";
import { ErrorGrid } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkingExperiences } from "@/hooks/queries/working-experience.query";
import { WorkingExperience } from "@/types/working-experience.types";
import { ArrowUpRight, MapPin } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";

export default function WorkingExperiencePage() {
  const { data, isLoading, error, refetch } = useWorkingExperiences();
  const items: WorkingExperience[] = data?.data ?? [];

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-40 pb-16">
      <AmbientGlow />

      {isLoading && (
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      )}

      {error && (
        <ErrorGrid
          title="Failed to load working experiences"
          description={
            error instanceof Error ? error.message : "Please try again later."
          }
          onRetry={() => refetch()}
        />
      )}

      <ol className="relative ml-3 border-l border-primary/30 md:ml-6">
        {items.map((item) => (
          <li key={item.id} className="relative pb-10 pl-8 last:pb-0 md:pl-12">
            <span className="absolute -left-[7px] top-8 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary ring-4 ring-primary/20" />
            <Link
              href={`/working-experience/${item.id}`}
              className="group flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 sm:flex-row sm:items-center"
            >
              {item.icon && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                  <Image
                    src={process.env.NEXT_PUBLIC_STORAGE_URL + (item.icon as string)}
                    alt={item.title ?? "Company"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {moment(item.start_date).format("MMM YYYY")} -{" "}
                  {item.end_date
                    ? moment(item.end_date).format("MMM YYYY")
                    : "Present"}
                </p>
                <h3 className="mt-1 text-xl font-extrabold md:text-2xl">
                  {item.title}
                </h3>
                {item.subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                )}
                {item.location && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-foreground/60">
                    <MapPin size={12} />
                    {item.location}
                  </p>
                )}
              </div>
              <ArrowUpRight className="hidden shrink-0 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:block" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
