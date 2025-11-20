"use client";

import { usePathname } from "next/navigation";
import PageHeader from "@/components/page-header";
import { useMemo, type ReactNode } from "react";

interface IPageInfo {
  title: string;
  description: string;
}

function detectPathType(pathname: string) {
  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";

  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      last
    )
  ) {
    return "uuid";
  }
  if (/^[a-f\d]{24}$/i.test(last)) return "mongoid";
  if (/^\d+$/.test(last)) return "numeric-id";
  if (/^[a-z-]+$/i.test(last)) return "word";
  return "unknown";
}

export default function LayoutWrapper({
  children,
  page_info,
}: {
  children: ReactNode;
  page_info: IPageInfo;
}) {
  const pathname = usePathname();

  const pathType = useMemo(() => detectPathType(pathname), [pathname]);

  return (
    <div>
      {pathType === "word" && (
        <PageHeader
          title={page_info.title}
          description={page_info.description}
        />
      )}
      {children}
    </div>
  );
}
