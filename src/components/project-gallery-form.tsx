import UpinIpin from "@/assets/images/upinipin.jpeg";
import { PlusIcon } from "lucide-react";
import Image from "next/image";
import ImageUploadModal from "./image-upload-modal";
import { useState } from "react";

interface ProjectGalleryProps {
  projectId: string;
}

interface GalleryShowCaseProps {
  openUploadModal: () => void;
}

const GalleryShowcase = ({ openUploadModal }: GalleryShowCaseProps) => {
  const fakeShowcase = new Array(1).fill(""); // Example: 3 items
  const maxShowcase = 6;

  const ShowCaseWithItem = (
    <div className="relative h-[270px]">
      <Image src={UpinIpin} alt="Gallery" fill className="rounded" />
      <div className="absolute top-0 left-0 bg-background/30 w-full h-full"></div>
    </div>
  );

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
  for (let i = 0; i < fakeShowcase.length; i++) {
    galleryItems.push(ShowCaseWithItem);
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

  const uploadImage = (file: File, reset: Function) => {
    const data = { image: file };
    console.log("DATA: ", data);
    reset();
  };
  return (
    <div className="grid grid-cols-3 gap-3">
      <GalleryShowcase
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
      />
    </div>
  );
}
