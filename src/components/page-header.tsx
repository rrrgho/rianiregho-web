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
    <div className="w-full px-5 lg:px-40 pt-20 pb-5 sticky top-0 z-30 bg-background">
      <div className="lg:flex lg:flex-row lg:justify-between items-end mb-8 bg-background">
        <div className="">
          <h1 className="text-4xl font-bold text-primary mb-4">{title}</h1>
          <p className="text-muted-foreground mb-12">{description}</p>
        </div>
        <div className="flex items-end">
          {show_breadcrumbs && <Breadcrumbs visiting_page={visiting_page} />}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
