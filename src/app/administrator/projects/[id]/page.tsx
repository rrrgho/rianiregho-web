"use client";
import { ErrorState } from "@/components/error-state";
import ProjectForm, { formSchema } from "@/components/project-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const AdminProjectsPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => params.id as string, [params.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = form;

  /**
   * Part of Populating Form from
   * the Project Detail API
   */

  const { data, isLoading, refetch, error } = useProjectDetail(id);
  const projectData: Project | any = data?.data;

  const populateForm = useCallback(
    (project: Project) => {
      const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "";

      form.setValue("name", project.name || "");
      form.setValue("description", project.description || "");
      form.setValue("tech_stack", project.tech_stack || "");
      form.setValue("role", project.role || "");
      form.setValue("github_link", project.github_link || "");
      form.setValue("project_link", project.project_link || "");
      form.setValue("image", storageUrl + project.image_path || "");

      if (project.project_date) {
        form.setValue("project_date", new Date(project.project_date));
      }
    },
    [form]
  );

  useEffect(() => {
    if (projectData) {
      populateForm(projectData);
    }
  }, [projectData, populateForm]);

  /**
   * Part of Updating Project data
   * by doing mutation to Project Update API
   */

  const projectUpdateMutation = useUpdateMutationProject(id);
  const { mutate, isPending } = projectUpdateMutation;

  const onSubmitUpdate = (data: z.infer<typeof formSchema>) => {
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
    return <div className="text-center py-10">Loading...</div>;
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
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Project Detail</CardTitle>
          <CardDescription>
            Showing what you have made for this project!
          </CardDescription>
          <CardContent>
            <ProjectForm
              isDetail
              form={form}
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
