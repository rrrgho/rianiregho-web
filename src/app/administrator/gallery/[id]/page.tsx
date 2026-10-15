"use client";

import { ErrorState } from "@/components/error-state";
import { ProjectDetailFormSkeleton } from "@/components/project-detail-form-skeleton";
import GalleryForm, { GalleryFormData } from "@/components/gallery-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGalleryDetail, useUpdateGallery } from "@/hooks/queries/gallery.query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminGalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error, refetch } = useGalleryDetail(id);
  const { mutate, isPending } = useUpdateGallery(id);

  if (isLoading) return <ProjectDetailFormSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data?.data) {
    return (
      <ErrorState
        title="Gallery not found!"
        description="Gallery ID doesn't match with our data!"
      />
    );
  }

  const onSubmit = (values: GalleryFormData) =>
    mutate(values, {
      onSuccess: () => {
        toast.success("Gallery updated successfully!");
        router.push("/administrator/gallery");
      },
    });

  return (
    <div className="w-full py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit gallery</CardTitle>
          <CardDescription>
            New photos are added to the end of the slideshow. Delete a photo with its trash icon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryForm data={data.data} onSubmit={onSubmit} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
