"use client";

import { ErrorState } from "@/components/error-state";
import PageHeader from "@/components/page-header";
import { ProjectDetailSkeleton } from "@/components/project-detail-skeleton";
import { useWorkingExperienceDetail } from "@/hooks/queries/working-experience.query";
import { renderHtmlContent } from "@/lib/html-parser";
import { Project } from "@/types/project.types";
import { WorkingExperience } from "@/types/working-experience.types";
import { AlertCircle, ExternalLink, FileWarning, Github } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

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

  return (
    <div>
      <PageHeader
        visiting_page={detail?.title}
        title={detail?.title}
        description="See what amazing from this project story"
      />
      <div className="w-full min-h-screen px-5 lg:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="rounded-lg overflow-hidden bg-primary">
              <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[600px]">
                <Image
                  src={process.env.NEXT_PUBLIC_STORAGE_URL + detail?.banner}
                  alt={detail.title ?? "Project Thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary pt-10">
              {detail.title}
            </h1>
            <h2 className="text-md md:text-xl text-primary mt-2">
              {moment(detail.start_date).format("MMMM, YYYY")} -{" "}
              {detail.end_date
                ? moment(detail.end_date).format("MMMM, YYYY")
                : "Present"}
            </h2>

            {/* Long Description */}
            <div className="mb-12 mt-10 ">
              {renderHtmlContent(detail.description)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Technologies */}
            <div className="bg-card border border-border rounded-lg p-6  top-24">
              <h3 className="font-semibold text-primary">Gallery</h3>
              <span className="text-sm">See how amazing working here</span>
              <div className="flex flex-wrap grid grid-cols-1 gap-2 mt-4 py-10">
                <div className="w-full flex justify-center items-center">
                  <AlertCircle />
                </div>
                <span className="text-xs text-primary text-center">
                  Gallery for working experience is still under development, see
                  PROJECTS to see the gallery !
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
