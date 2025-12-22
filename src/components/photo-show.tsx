import { CircleX } from "lucide-react";
import { Button } from "./ui/button";
import { FC } from "react";
import Image from "next/image";

interface IPhotoshow {
  image: string;
  onClose: () => void;
}

const PhotoShow: FC<IPhotoshow> = ({ image, onClose }) => {
  return (
    <div
      className="bg-zinc-950/80 fixed top-0 right-0 w-full h-screen z-40"
      onClick={onClose}
    >
      <div className="w-full absolute top-0 right-0 flex justify-end items-center">
        <div className="mr-10 mt-10">
          <CircleX size={30} className="cursor-pointer hover:opacity-50" />
        </div>
      </div>

      <div className="px-5 xl:px-40 h-screen flex justify-center items-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={process.env.NEXT_PUBLIC_STORAGE_URL + image}
            alt="Photoshow"
            width={1920}
            height={1080}
            className="rounded-lg object-contain w-auto h-auto"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoShow;
