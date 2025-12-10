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
    <div className="bg-zinc-950/80 fixed top-0 right-0 w-full h-screen z-40">
      <div className="w-full absolute top-0 right-0 flex justify-end items-center">
        <div onClick={onClose} className="mr-10 mt-10">
          <CircleX size={30} className="cursor-pointer hover:opacity-50" />
        </div>
      </div>

      <div className="px-5 xl:px-40 h-screen flex justify-center items-center">
        <div className="w-full h-[300px] md:h-[600px] xl:h-[700px] relative">
          <Image
            src={process.env.NEXT_PUBLIC_STORAGE_URL + image}
            alt="Photoshow"
            fill
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default PhotoShow;
