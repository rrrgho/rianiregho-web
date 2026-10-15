import LayoutWrapper from "@/components/layout-wrapper";
import type { ReactNode } from "react";

export const metadata = {
  title: "Gallery",
  description: "Moments I captured, and the stories behind them.",
};

export default function GalleryLayout({ children }: { children: ReactNode }) {
  return <LayoutWrapper page_info={metadata}>{children}</LayoutWrapper>;
}
