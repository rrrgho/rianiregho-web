"use client";

import { ErrorState } from "@/components/error-state";
import { AmbientGlow } from "@/components/ambient-glow";
import { Breadcrumbs } from "@/components/breadcrumbs";
import PhotoShow from "@/components/photo-show";
import { ProjectDetailSkeleton } from "@/components/project-detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectGaleries } from "@/hooks/queries/project-gallery.query";
import { useProjectDetail } from "@/hooks/queries/project.query";
import { renderHtmlContent } from "@/lib/html-parser";
import { Project, ProjectGallery } from "@/types/project.types";
import { CalendarDays, ExternalLink, Github, ImageOff, UserRound } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = useMemo(() => params.id as string, [params.id]);
  const project = useProjectDetail(projectId);
  const { isLoading, data, error, refetch } = project;
  const projectData: Project | any = data?.data;
  const [showPhotoInFullScreen, setShowPhotoInFullScreen] = useState<any>(null);

  const projectGallery = useProjectGaleries(projectId);
  const { data: projectGalleryData, isLoading: projectGalleryLoading } =
    projectGallery;
  const galleries = projectGalleryData?.data;

  const showPhotoGalery = (image: string) => {
    setShowPhotoInFullScreen(image);
  };

  const hidePhotoGalery = () => {
    setShowPhotoInFullScreen(null);
  };

  // Show loading skeleton
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !projectData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ErrorState
          title="Project Not Found"
          description="Unable to load the project details."
          message={
            error instanceof Error
              ? error.message
              : "This project could not be found or is no longer available."
          }
        />
      </div>
    );
  }

  return (
    <div>
      <AmbientGlow />
      <div className="w-full max-w-[1920px] mx-auto px-5 lg:px-40 pt-28 pb-16">
        <Breadcrumbs visiting_page={projectData.name} />

        {/* Hero */}
        <div className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
              <CalendarDays size={14} />
              {moment(projectData.project_date).format("MMMM YYYY")}
            </span>
            {projectData.role && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
                <UserRound size={14} />
                {projectData.role}
              </span>
            )}
          </div>
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
            {projectData.name}
          </h1>
          {(projectData.github_link || projectData.project_link) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {projectData.project_link && (
                <a
                  href={projectData.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90"
                >
                  <ExternalLink className="h-5 w-5" />
                  Live Demo
                </a>
              )}
              {projectData.github_link && (
                <a
                  href={projectData.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 font-semibold transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                >
                  <Github className="h-5 w-5" />
                  View Code
                </a>
              )}
            </div>
          )}
        </div>

        {/* Cover */}
        <div className="relative mt-10 w-full overflow-hidden rounded-3xl border border-border bg-muted h-[260px] sm:h-[420px] lg:h-[620px]">
          <Image
            src={process.env.NEXT_PUBLIC_STORAGE_URL + projectData.image_path}
            alt={projectData.name ?? "Project Thumbnail"}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Story */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-primary">
              About this project
            </h2>
            {renderHtmlContent(projectData.description)}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold">Technologies</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The tech stack used to build this project
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {projectData.tech_stack.split(",").map((tech: string) => (
                  <span
                    key={tech}
                    className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-bold">Gallery</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Moments of how this project benefits the client
              </p>
              {projectGalleryLoading && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {new Array(2).fill("").map((_, idx) => (
                    <Skeleton key={idx} className="h-[100px] rounded-xl" />
                  ))}
                </div>
              )}

              {galleries?.length === 0 && (
                <div className="grid justify-center p-5 text-center">
                  <ImageOff className="mx-auto size-6" />
                  <span className="mt-3 text-sm">No Galleries found</span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-2">
                {galleries?.map((item: ProjectGallery) => (
                  <div
                    key={item.id}
                    className="group relative h-[100px] cursor-pointer overflow-hidden rounded-xl"
                    onClick={() => showPhotoGalery(item.image_path)}
                  >
                    <Image
                      src={process.env.NEXT_PUBLIC_STORAGE_URL + item.image_path}
                      alt={"Galleries" + item.id}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Photoshow
        Showing photo in fullscreen
      */}
      {showPhotoInFullScreen && (
        <PhotoShow image={showPhotoInFullScreen} onClose={hidePhotoGalery} />
      )}
    </div>
  );
}
