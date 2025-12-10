"use client";

import ProjectForm, { formSchema } from "@/components/project-form";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutateProject } from "@/hooks/queries/project.query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";

const ProjectAdd = () => {
  const router = useRouter();
  const projectMutation = useMutateProject();
  const { mutate, isPending } = projectMutation;

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await mutate(data, {
        onSuccess: () => {
          toast.success("Project created successfully!");
          router.push("/administrator/projects");
        },
      });
    } catch (error) {
      console.error("Failed to submit project:", error);
    }
  }
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Add new project</CardTitle>
          <CardDescription>
            Every project you add will be shown on the Website, sorted by ASC
            project date
          </CardDescription>
          <ProjectForm onSubmit={onSubmit} isPending={isPending} />
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProjectAdd;
