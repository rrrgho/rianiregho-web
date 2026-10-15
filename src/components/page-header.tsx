import { FC } from "react";
import { Breadcrumbs } from "./breadcrumbs";

interface IPageHeader {
  title: string;
  description: string;
  visiting_page?: string;
  show_breadcrumbs?: boolean;
}

const PageHeader: FC<IPageHeader> = ({
  title,
  description,
  visiting_page,
  show_breadcrumbs = true,
}) => {
  return (
    <div className="w-full pt-28 pb-8">
      <div className="max-w-[1920px] mx-auto px-5 lg:px-40">
        {show_breadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs visiting_page={visiting_page} />
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-4xl">
          {title}
        </h1>
        <div className="mt-5 h-1 w-16 rounded-full bg-primary" />
        <p className="mt-5 max-w-2xl text-base lg:text-lg text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
