"use client";

import PostThumbnail from "@/components/post-thumbnail";
import { ThumbnailSkeleton } from "@/components/thumbnail-skeleton";
import { ErrorGrid } from "@/components/error-state";
import { useProjects } from "@/hooks/queries/project.query";
import { Project } from "@/types/project.types";

export default function ProjectsPage() {
  const { isLoading, data, error, refetch } = useProjects();

  if (isLoading) {
    return (
      <div className="px-5 lg:px-40">
        <ThumbnailSkeleton count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 lg:px-40">
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

  return (
    <div className="px-5 lg:px-40">
      <div className="grid md:grid-cols-2 gap-3">
        {data?.data.map((item: Project) => {
          return (
            <div className="p-3" key={item.uid}>
              <PostThumbnail
                link={`/projects/${item.uid}`}
                title={item.name}
                description={""}
                image={item.image}
                date={item.project_date}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
