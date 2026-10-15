"use client";

import GalleryForm, { GalleryFormData } from "@/components/gallery-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateGallery } from "@/hooks/queries/gallery.query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GalleryAdd() {
  const router = useRouter();
  const { mutate, isPending } = useCreateGallery();

  const onSubmit = (data: GalleryFormData) =>
    mutate(data, {
      onSuccess: () => {
        toast.success("Gallery created successfully!");
        router.push("/administrator/gallery");
      },
    });

  return (
    <div className="w-full pb-10">
      <Card>
        <CardHeader>
          <CardTitle>Add gallery</CardTitle>
          <CardDescription>
            Upload photos and write the story. The photos are shown as a slideshow on the Gallery page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryForm onSubmit={onSubmit} isPending={isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
