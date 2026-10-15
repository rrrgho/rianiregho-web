"use client";

import { ErrorState } from "@/components/error-state";
import { AmbientGlow } from "@/components/ambient-glow";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProjectDetailSkeleton } from "@/components/project-detail-skeleton";
import WorkingExperienceList from "@/components/working-experience-list";
import { useWorkingExperienceDetail } from "@/hooks/queries/working-experience.query";
import { renderHtmlContent } from "@/lib/html-parser";
import { WorkingExperience } from "@/types/working-experience.types";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const id = useMemo(() => params.id as string, [params.id]);
  const workingExperience = useWorkingExperienceDetail(id);
  const { isLoading, data, error, refetch } = workingExperience;
  const detail: WorkingExperience | any = data?.data;

  // Show loading skeleton
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !detail) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ErrorState
          title="Data Not Found"
          description="Unable to load the details."
          message={
            error instanceof Error
              ? error.message
              : "This data could not be found or is no longer available."
          }
        />
      </div>
    );
  }

  const imageUrl = (path?: string | File) =>
    process.env.NEXT_PUBLIC_STORAGE_URL + (path as string);

  return (
    <div>
      <AmbientGlow />
      <div className="w-full max-w-[1920px] mx-auto px-5 lg:px-40 pt-28 pb-16">
        <Breadcrumbs visiting_page={detail.title} />

        {/* Hero */}
        <div className="mt-8 flex items-start gap-5">
          {detail.icon && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-border bg-card md:h-20 md:w-20">
              <Image
                src={imageUrl(detail.icon)}
                alt={detail.title ?? "Company"}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <CalendarDays size={14} />
                {moment(detail.start_date).format("MMM YYYY")} -{" "}
                {detail.end_date
                  ? moment(detail.end_date).format("MMM YYYY")
                  : "Present"}
              </span>
              {detail.location && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                  <MapPin size={14} />
                  {detail.location}
                </span>
              )}
            </div>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {detail.title}
            </h1>
            {detail.subtitle && (
              <p className="mt-3 text-lg text-muted-foreground">
                {detail.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Banner */}
        {detail.banner && (
          <div className="relative mt-10 w-full overflow-hidden rounded-3xl border border-border bg-muted h-[240px] sm:h-[380px] lg:h-[520px]">
            <Image
              src={imageUrl(detail.banner)}
              alt={detail.title ?? "Banner"}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              What I did here
            </h2>
            {renderHtmlContent(detail.description)}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold">Other experiences</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                More of my career journey
              </p>
              <div className="mt-4">
                <WorkingExperienceList hide_specific_list_by_id={id} />
              </div>
              <Link
                href="/working-experience"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                View all <ArrowUpRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
