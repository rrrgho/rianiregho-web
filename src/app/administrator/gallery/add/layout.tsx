export const metadata = {
  title: "Add gallery",
  description: "Add photos and a story to the Gallery page",
};

export default function GalleryAddLayout({ children }: { children: React.ReactNode }) {
  return <div className="mt-10">{children}</div>;
}
