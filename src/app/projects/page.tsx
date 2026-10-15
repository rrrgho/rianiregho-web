"use client";

import PostThumbnail from "@/components/post-thumbnail";
import { ThumbnailSkeleton } from "@/components/thumbnail-skeleton";
import { ErrorGrid } from "@/components/error-state";
import { useProjects } from "@/hooks/queries/project.query";
import { AmbientGlow } from "@/components/ambient-glow";
import { Project } from "@/types/project.types";

export default function ProjectsPage() {
  const { isLoading, data, error, refetch } = useProjects();

  if (isLoading) {
    return (
      <div className="max-w-[1920px] mx-auto px-5 lg:px-40">
        <ThumbnailSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1920px] mx-auto px-5 lg:px-40">
        <ErrorGrid
          title="Failed to load projects"
          description={
            error instanceof Error
              ? error.message
              : "Unable to fetch projects. Please try again later."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const [featured, ...rest] = data?.data ?? [];
  const toTags = (p: Project) =>
    p.tech_stack ? p.tech_stack.split(",").filter(Boolean) : [];

  return (
    <div className="max-w-[1920px] mx-auto px-5 lg:px-40 pb-16">
      <AmbientGlow />
      {featured && (
        <div className="mb-8">
          <PostThumbnail
            featured
            link={`/projects/${featured.id}`}
            title={featured.name}
            description=""
            image={featured.image_path}
            date={featured.project_date}
            tags={toTags(featured)}
          />
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {rest.map((item: Project) => (
          <PostThumbnail
            key={item.id}
            link={`/projects/${item.id}`}
            title={item.name}
            description=""
            image={item.image_path}
            date={item.project_date}
            tags={toTags(item)}
          />
        ))}
      </div>
    </div>
  );
}
