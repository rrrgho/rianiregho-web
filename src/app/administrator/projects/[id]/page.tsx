"use client";
import { ErrorState } from "@/components/error-state";
import { ProjectDetailFormSkeleton } from "@/components/project-detail-form-skeleton";
import ProjectForm, { projectFormSchema } from "@/components/project-form";
import ProjectGalleryForm from "@/components/project-gallery-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useProjectDetail,
  useUpdateMutationProject,
} from "@/hooks/queries/project.query";
import { Project } from "@/types/project.types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import * as z from "zod";

const AdminProjectsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => params.id as string, [params.id]);

  const { data, isLoading, refetch, error } = useProjectDetail(id);
  const projectData: Project | any = data?.data;

  const projectUpdateMutation = useUpdateMutationProject(id);
  const { mutate, isPending } = projectUpdateMutation;

  const onSubmitUpdate = (data: z.infer<typeof projectFormSchema>) => {
    try {
      mutate(data, {
        onSuccess: () => {
          toast.success("Project created successfully!");
          router.push("/administrator/projects");
        },
      });
    } catch (error) {
      console.error("Failed updating project", error);
    }
  };

  if (isLoading) {
    return <ProjectDetailFormSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!projectData) {
    return (
      <ErrorState
        title="Project not found!"
        description="Project ID doesn't match with our data!"
      />
    );
  }

  return (
    <div className="w-full py-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Project Detail</CardTitle>
              <CardDescription className="mt-2">
                Showing what you have made for this project!
              </CardDescription>
            </div>
          </div>
          <CardContent>
            <ProjectForm
              isDetail
              data={projectData}
              onSubmit={onSubmitUpdate}
              isPending={isPending}
            />

            <div className="grid grid-cols-3 flex justify-center items-center mt-10">
              <Separator />
              <div className="text-center">
                <CardTitle>Project Gallery</CardTitle>
              </div>
              <Separator />
            </div>

            <div className="mt-10">
              <ProjectGalleryForm projectId={id} />
            </div>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AdminProjectsPage;
