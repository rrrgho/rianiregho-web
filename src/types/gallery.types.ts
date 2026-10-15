export type GalleryPhoto = {
  id: string;
  gallery_id?: string;
  image_path: string;
  position: number;
};

export type Gallery = {
  id: string;
  user_id: string;
  title: string;
  story: string | null;
  taken_date: string | null;
  created_at: string;
  updated_at: string;
  photos: GalleryPhoto[];
};
