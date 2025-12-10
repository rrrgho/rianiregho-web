"use client";

import { ErrorState } from "@/components/error-state";
import PageHeader from "@/components/page-header";
import PhotoShow from "@/components/photo-show";
import { ProjectDetailSkeleton } from "@/components/project-detail-skeleton";
import { useProjectDetail } from "@/hooks/queries/project.query";
import { renderHtmlContent } from "@/lib/html-parser";
import { Project } from "@/types/project.types";
import { ExternalLink, Github } from "lucide-react";
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

  const showPhotoGalery = (image: string) => {
    setShowPhotoInFullScreen(image);
  };

  const hidePhotoGalery = () => setShowPhotoInFullScreen(null);

  // Show loading skeleton
  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Project Not Found"
        description="Unable to load the project details."
        message={
          error instanceof Error
            ? error.message
            : "This project could not be found or is no longer available."
        }
        onRetry={() => refetch()}
        backLink="/projects"
        backLinkText="Back to Projects"
      />
    );
  }

  return (
    <div>
      <PageHeader
        visiting_page={projectData.name}
        title={projectData.name}
        description="See what amazing from this project story"
      />
      <div className="w-full min-h-screen px-5 lg:px-40 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <div className="rounded-lg overflow-hidden mb-8">
              <div className="relative w-full h-96">
                <Image
                  src={
                    process.env.NEXT_PUBLIC_STORAGE_URL + projectData.image_path
                  }
                  alt={projectData.title ?? "Project Thumbnail"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {projectData.name}
            </h1>

            {/* Long Description */}
            <div className="mb-12">
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
                Showing the moments of this project benefits my client
              </span>
              <div className="grid grid-cols-3 gap-1 mt-4">
                <div
                  className="group relative overflow-hidden rounded-lg"
                  onClick={() => {
                    showPhotoGalery(projectData.image_path);
                  }}
                >
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_STORAGE_URL +
                      projectData.image_path
                    }
                    alt={projectData.title}
                    width={100}
                    height={100}
                    className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-105 "
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"></div>
                </div>
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
