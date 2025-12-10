import UpinIpin from "@/assets/images/upinipin.jpeg";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import ImageUploadModal from "./image-upload-modal";
import { useState } from "react";
import { ProjectGallery } from "@/types/project.types";
import {
  useMutateProjectGallery,
  useProjectGaleries,
} from "@/hooks/queries/project-gallery.query";
import { ErrorState } from "./error-state";
import TableSkeleton from "./table-skeleton";
import { toast } from "sonner";

interface ProjectGalleryProps {
  projectId: string;
}

interface GalleryShowCaseProps {
  galeries?: ProjectGallery[];
  openUploadModal: () => void;
}

const GalleryShowcase = ({
  galeries,
  openUploadModal,
}: GalleryShowCaseProps) => {
  const data = galeries ?? [];
  const maxShowcase = 6;

  const ShowCaseWithItem = (path: string) => {
    return (
      <div className="relative h-[270px]">
        <Image
          src={process.env.NEXT_PUBLIC_STORAGE_URL + path}
          alt="Gallery"
          fill
          className="rounded"
        />
        <div className="absolute top-0 left-0 bg-background/30 w-full h-full"></div>
      </div>
    );
  };

  const AddNewShowCaseComponent = (
    <div
      onClick={openUploadModal}
      className="cursor-pointer group relative w-full h-[270px] border border-dashed rounded-md flex items-center justify-center bg-muted transition"
    >
      <PlusIcon className="size-[80px] opacity-50 group-hover:opacity-80" />
    </div>
  );

  const AvailableShowCaseComponent = (
    <div className="relative w-full h-[270px] border border-dashed rounded-md flex items-center justify-center bg-muted/20 transition"></div>
  );

  // Generate the gallery items
  const galleryItems = [];

  // Add existing showcase items (ShowCaseWithItem)
  for (let i = 0; i < data.length; i++) {
    galleryItems.push(ShowCaseWithItem(data[i].image_path));
  }

  // Add AddNewShowCaseComponent if we haven't reached the limit
  if (galleryItems.length < maxShowcase) {
    galleryItems.push(AddNewShowCaseComponent);
  }

  // Add AvailableShowCaseComponent for remaining slots (if any)
  while (galleryItems.length < maxShowcase) {
    galleryItems.push(AvailableShowCaseComponent);
  }

  return galleryItems.map((item, index) => <div key={index}>{item}</div>);
};

export default function ProjectGalleryForm({ projectId }: ProjectGalleryProps) {
  const [showModalUploadGallery, setShowModalUploadGallery] = useState(false);

  const projectGalleries = useProjectGaleries(projectId);
  const { data: responseData, isLoading, error, refetch } = projectGalleries;
  const galeries = responseData?.data;

  const mutateGallery = useMutateProjectGallery();
  const { isPending, mutate } = mutateGallery;

  const uploadImage = (file: File, reset: Function) => {
    const data = { image: file, project_id: projectId };
    try {
      mutate(data, {
        onSuccess: () => {
          toast.success("New image added to gallery!");
          reset();
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      <GalleryShowcase
        galeries={galeries}
        openUploadModal={() => {
          setShowModalUploadGallery(true);
        }}
      />

      <ImageUploadModal
        title="Upload image"
        description="Add new photo to this project gallery !"
        isOpen={showModalUploadGallery}
        onUpload={(file, reset) => {
          uploadImage(file, reset);
        }}
        onClose={() => {
          setShowModalUploadGallery(false);
        }}
        isUploading={isPending}
      />
    </div>
  );
}
