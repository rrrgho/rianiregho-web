import moment from "moment";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FC } from "react";

interface IPostThumbnail {
  title: string;
  description: string;
  image: StaticImageData | string | any;
  date: string;
  link?: string;
}

const PostThumbnail: FC<IPostThumbnail> = ({
  title,
  description,
  image,
  date,
  link = "/",
}) => {
  return (
    <Link href={link}>
      <div className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
        <div className="relative w-full h-[300px] lg:h-[400px] bg-muted">
          <Image
            src={process.env.NEXT_PUBLIC_STORAGE_URL + image}
            alt="Post Image"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="bg-slate/20 absolute top-0 w-full h-full flex flex-column items-end">
            <div className="p-5 w-full bg-background/30">
              <span className="text-xl md:text-3xl font-extrabold">
                {title}
              </span>
              <br />
              <span className="font-bold">
                {moment(date).format("MMMM YYYY")}
              </span>
              <p className="mt-2 text-sm md:text-base">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostThumbnail;
