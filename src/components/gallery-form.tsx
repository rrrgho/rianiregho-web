"use client";

import { DatePicker } from "@/components/date-picker";
import DeleteActionCell from "@/components/delete-action-cell";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDeleteGalleryPhoto } from "@/hooks/queries/gallery.query";
import { Gallery } from "@/types/gallery.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const MAX_MB = 8;
const MAX_PHOTOS = 10;

export const galleryFormSchema = z.object({
  title: z.string().trim().min(1, { message: "Title cannot be empty" }).max(255),
  story: z.string().optional(),
  taken_date: z.date().optional(),
  photos: z
    .array(
      z
        .instanceof(File)
        .refine((f) => f.type.startsWith("image/"), "Only image files are allowed")
        .refine((f) => f.size <= MAX_MB * 1024 * 1024, `Max size ${MAX_MB}MB per photo`)
    )
    .max(MAX_PHOTOS, `Add at most ${MAX_PHOTOS} photos at a time`),
});

export type GalleryFormData = z.infer<typeof galleryFormSchema>;

interface GalleryFormProps {
  onSubmit: (data: GalleryFormData) => void;
  isPending?: boolean;
  /** Existing gallery when editing. */
  data?: Gallery;
}

/** Local-calendar date from `2025-10-15T00:00:00.000000Z` (no timezone shift). */
const parseDate = (v?: string | null) => {
  if (!v) return undefined;
  const [y, m, d] = v.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function GalleryForm({ onSubmit, isPending, data }: GalleryFormProps) {
  const isEdit = !!data;
  const fileInput = useRef<HTMLInputElement>(null);
  const storage = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
  const deletePhoto = useDeleteGalleryPhoto(data?.id ?? "");

  const form = useForm<GalleryFormData>({
    resolver: zodResolver(galleryFormSchema),
    defaultValues: { title: "", story: "", taken_date: undefined, photos: [] },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      title: data.title,
      story: data.story ?? "",
      taken_date: parseDate(data.taken_date),
      photos: [],
    });
  }, [data, form]);

  const watchedPhotos = useWatch({ control: form.control, name: "photos" });
  const photos = useMemo(() => watchedPhotos ?? [], [watchedPhotos]);
  const previews = useMemo(
    () => photos.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [photos]
  );
  useEffect(
    () => () => previews.forEach((p) => URL.revokeObjectURL(p.url)),
    [previews]
  );

  const addFiles = (list: FileList | null) => {
    if (!list?.length) return;
    form.setValue("photos", [...photos, ...Array.from(list)], {
      shouldValidate: true,
    });
    if (fileInput.current) fileInput.current.value = "";
  };

  const removeNew = (index: number) =>
    form.setValue(
      "photos",
      photos.filter((_, i) => i !== index),
      { shouldValidate: true }
    );

  const submit = (values: GalleryFormData) => {
    if (!isEdit && values.photos.length === 0) {
      form.setError("photos", { message: "Add at least one photo" });
      return;
    }
    onSubmit(values);
  };

  const photosError = form.formState.errors.photos;

  return (
    <form id="gallery-form" onSubmit={form.handleSubmit(submit)}>
      <FieldGroup>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-6 content-start">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gallery_title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="gallery_title"
                    placeholder="e.g. Sunrise at Bromo"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="taken_date"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Date</FieldLabel>
                  <DatePicker value={field.value} onChange={field.onChange} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="story"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="gallery_story">Story</FieldLabel>
                  <Textarea
                    {...field}
                    id="gallery_story"
                    rows={10}
                    placeholder="Tell the story behind these photos..."
                  />
                  <FieldDescription>
                    Plain text. Line breaks are kept on the public page.
                  </FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid gap-3 content-start">
            <FieldLabel>Photos</FieldLabel>
            <p className="text-xs text-muted-foreground -mt-1">
              Shown as a slideshow, in the order uploaded. JPG, PNG, GIF or WebP,
              up to {MAX_MB}MB each, {MAX_PHOTOS} at a time.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {data?.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-md border bg-muted"
                >
                  <Image
                    src={storage + photo.image_path}
                    alt="Gallery photo"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <div className="absolute right-1 top-1 rounded-md bg-background/80 backdrop-blur">
                    <DeleteActionCell
                      id={photo.id}
                      title="Delete photo"
                      description="Remove this photo from the gallery? This cannot be undone."
                      onDelete={async (id) => {
                        await deletePhoto.mutateAsync(id);
                      }}
                    />
                  </div>
                </div>
              ))}

              {previews.map((p, i) => (
                <div
                  key={p.url}
                  className="relative aspect-square overflow-hidden rounded-md border border-dashed bg-muted"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={p.file.name} className="h-full w-full object-cover" />
                  <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    New
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${p.file.name}`}
                    onClick={() => removeNew(i)}
                    className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed bg-muted text-sm text-muted-foreground transition hover:bg-muted/70 cursor-pointer"
              >
                <ImagePlus className="size-6" />
                Add photos
              </button>
            </div>

            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
            {photosError && (
              <p className="text-sm text-destructive">
                {photosError.message ??
                  (Array.isArray(photosError)
                    ? photosError.find((e) => e?.message)?.message
                    : undefined)}
              </p>
            )}
          </div>
        </div>

        <Field orientation="horizontal" className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isPending}>
            {isPending ? "Saving..." : isEdit ? "Save changes" : "Create"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
