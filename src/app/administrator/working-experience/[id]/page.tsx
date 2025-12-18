"use client";

import { ErrorState } from "@/components/error-state";
import { WorkingExperienceDetailSkeleton } from "@/components/working-experience-detail-skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import WorkingExperienceForm, {
  workingExperienceFormSchema,
} from "@/components/working-experience-form";
import {
  useMutateWorkingExperience,
  useWorkingExperienceDetail,
} from "@/hooks/queries/working-experience.query";
import { WorkingExperience } from "@/types/working-experience.types";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import * as z from "zod";

export default function WorkingExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => params.id as string, [params.id]);

  const workingExperience = useWorkingExperienceDetail(id);
  const { data, isLoading, error, refetch } = workingExperience;
  const workingExperienceData: WorkingExperience | any = data?.data;

  const mutateWorkingExperience = useMutateWorkingExperience(id);
  const { mutate, isPending } = mutateWorkingExperience;

  const onSubmit = async (
    data: z.infer<typeof workingExperienceFormSchema>
  ) => {
    try {
      await mutate(data, {
        onSuccess: () => {
          toast.success("Project created successfully!");
          router.push("/administrator/working-experience");
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <WorkingExperienceDetailSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!workingExperienceData) {
    return (
      <ErrorState
        title="Project not found!"
        description="Project ID doesn't match with our data!"
      />
    );
  }

  return (
    <div className="w-full mt-10">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Working Experience Detail</CardTitle>
              <CardDescription className="mt-2">
                Showing what you have done on this place !
              </CardDescription>
            </div>
          </div>
          <CardContent>
            <WorkingExperienceForm
              onSubmit={onSubmit}
              isPending={isPending}
              data={workingExperienceData}
              isDetail
            />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
