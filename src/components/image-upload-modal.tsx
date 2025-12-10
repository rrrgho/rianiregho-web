"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X, Upload } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "./ui/field";

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File, reset: () => void) => void;
  title?: string;
  description?: string;
  isUploading?: boolean;
}

export const formSchema = z.object({
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 1 * 1024 * 1024, "Max size 1MB"),
    ])
    .optional(),
});

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  title = "Upload Image",
  description = "Choose an image to upload",
  isUploading,
}: ImageUploadModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit, control, watch } = form;
  const imageValue = watch("image");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.image instanceof File) {
      onUpload?.(data.image, resetModal);
      //   resetModal();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetModal = () => {
    clearImage();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center justify-center gap-6 py-8">
            {preview ? (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-input">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white rounded-full p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[300px] border-2 border-dashed border-input rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-muted/50 transition"
              >
                <Upload className="w-12 h-12 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, GIF, WEBP up to 1.5MB
                  </p>
                </div>
              </div>
            )}

            <Controller
              name="image"
              control={control}
              render={({ fieldState }) => {
                return (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="flex flex-col gap-2 w-full"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                );
              }}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={resetModal}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              Choose Image
            </Button>
            <Button type="submit" disabled={!imageValue && !isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
