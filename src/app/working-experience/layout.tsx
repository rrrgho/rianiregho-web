import LayoutWrapper from "@/components/layout-wrapper";
import type { ReactNode } from "react";

export const metadata = {
  title: "Working Experience",
  description: "A look at the companies and teams I have worked with",
};

export default function WorkingExperienceLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LayoutWrapper page_info={metadata}>{children}</LayoutWrapper>;
}
