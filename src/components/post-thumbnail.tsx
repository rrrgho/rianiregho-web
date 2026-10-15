import { ArrowUpRight } from "lucide-react";
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
  tags?: string[];
  featured?: boolean;
}

const PostThumbnail: FC<IPostThumbnail> = ({
  title,
  description,
  image,
  date,
  link = "/",
  tags = [],
  featured = false,
}) => {
  return (
    <Link
      href={link}
      className={`group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10 ${
        featured ? "lg:grid lg:grid-cols-5" : ""
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-muted ${
          featured
            ? "h-[260px] sm:h-[340px] lg:col-span-3 lg:h-full lg:min-h-[420px]"
            : "h-[220px] sm:h-[260px]"
        }`}
      >
        <Image
          src={process.env.NEXT_PUBLIC_STORAGE_URL + image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      <div
        className={`flex flex-col p-6 ${
          featured ? "lg:col-span-2 lg:justify-center lg:p-10" : ""
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
          {featured && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground">
              Featured
            </span>
          )}
          <span>{moment(date).format("MMMM YYYY")}</span>
        </div>

        <h3
          className={`mt-3 font-extrabold leading-tight ${
            featured ? "text-3xl lg:text-4xl" : "text-xl md:text-2xl"
          }`}
        >
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, featured ? 6 : 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground/80"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
          View project
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
};

export default PostThumbnail;
