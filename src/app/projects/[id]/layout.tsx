import type { ReactNode } from "react";

export const metadata = {
  title: "Project Detail",
  description: "Check out my latest projects and work",
};

export default async function ProjectDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
