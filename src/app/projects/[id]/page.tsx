"use client";

import { ErrorState } from "@/components/error-state";
import PageHeader from "@/components/page-header";
import PhotoShow from "@/components/photo-show";
import { ProjectDetailSkeleton } from "@/components/project-detail-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjectGaleries } from "@/hooks/queries/project-gallery.query";
import { useProjectDetail } from "@/hooks/queries/project.query";
import { renderHtmlContent } from "@/lib/html-parser";
import { Project, ProjectGallery } from "@/types/project.types";
import { Box, ExternalLink, Github, ImageOff } from "lucide-react";
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

  const hidePhotoGalery = () => setShowPhotoInFullScreen(null);

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
      <PageHeader
        visiting_page={projectData.name}
        title={projectData.name}
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
                  src={
                    process.env.NEXT_PUBLIC_STORAGE_URL + projectData.image_path
                  }
                  alt={projectData.title ?? "Project Thumbnail"}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary py-10">
              {projectData.name}
            </h1>

            {/* Long Description */}
            <div className="mb-12 ">
              {renderHtmlContent(projectData.description)}
            </div>

            {/* Project Info Grid */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Project Date
                </h3>
                <p className="text-muted-foreground">
                  {moment(projectData.project_date).format("MMMM YYYY")}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-2">Role</h3>
                <p className="text-muted-foreground">{projectData.role}</p>
              </div>
            </div>

            {/* Links */}
            {(projectData.github_link || projectData.project_link) && (
              <div className="flex gap-4 mb-12">
                {projectData.github_link && (
                  <a
                    href={projectData.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Github className="h-5 w-5" />
                    View Code
                  </a>
                )}
                {projectData.project_link && (
                  <a
                    href={projectData.project_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Live Demo
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Technologies */}
            <div className="bg-card border border-border rounded-lg p-6  top-24">
              <h3 className="font-semibold text-primary">Technologies</h3>
              <span className="text-sm">
                The tech stack that I use in building this project
              </span>
              <div className="flex flex-wrap gap-2 mt-4">
                {projectData.tech_stack.split(",").map((tech: string) => (
                  <span
                    key={tech}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Galeries */}
            <div className="bg-card border border-border rounded-lg p-6  top-24 mt-5">
              <h3 className="font-semibold text-primary">Project Galery</h3>
              <span className="text-sm">
                Showing the moments how this project benefits my client
              </span>
              {projectGalleryLoading && (
                <div className="grid grid-cols-2 gap-1 mt-4">
                  {new Array(2).fill("").map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="group relative overflow-hidden h-[100px] rounded-lg"
                      >
                        <Skeleton className="bg-primary/40 h-[100px]" />
                      </div>
                    );
                  })}
                </div>
              )}

              {galleries?.length === 0 && (
                <div className="w-full grid text-center grid-cols-1 justify-center items-center p-5">
                  <div className="flex justify-center items-center">
                    <ImageOff className="size-6" />
                  </div>
                  <span className="text-sm mt-3">No Galleries found</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1 mt-4">
                {galleries?.map((item: ProjectGallery) => {
                  return (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden h-[100px] rounded-lg"
                      onClick={() => {
                        showPhotoGalery(item.image_path);
                      }}
                    >
                      <Image
                        src={
                          process.env.NEXT_PUBLIC_STORAGE_URL + item.image_path
                        }
                        alt={"Galleries" + item.id}
                        fill
                        className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105 "
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
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
