export const metadata = {
  title: "Project Detail",
  description: "Showing you the details of a specific project",
};

export default async function AdminProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
