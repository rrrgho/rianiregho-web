export const metadata = {
  title: "Gallery",
  description: "Manage photos and the stories behind them",
};

export default function LayoutAdminGallery({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
