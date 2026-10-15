import { query, serializeRow } from "./db";
import { HttpError } from "./http";
import {
  GALLERY_MAX_PHOTOS_PER_REQUEST, GALLERY_PHOTO_DIR, GALLERY_PHOTO_MAX_KB,
} from "./schemas";
import { deleteStored, storeImage, validateImage } from "./storage";

export type GalleryPhoto = { id: string; image_path: string; position: number };

/** Attach `photos` (slide order) to each gallery row. */
export async function withPhotos<T extends { id: string }>(rows: T[]) {
  if (rows.length === 0) return [];
  const photos = await query<GalleryPhoto & { gallery_id: string; created_at: string }>(
    `SELECT id, gallery_id, image_path, position, created_at FROM gallery_photos
     WHERE gallery_id = ANY($1::uuid[]) ORDER BY position ASC, created_at ASC`,
    [rows.map((r) => r.id)]
  );
  const byGallery = new Map<string, unknown[]>();
  for (const p of photos) {
    const list = byGallery.get(p.gallery_id) ?? [];
    list.push(serializeRow(p));
    byGallery.set(p.gallery_id, list);
  }
  return rows.map((r) => ({ ...r, photos: byGallery.get(r.id) ?? [] }));
}

/** Validate every uploaded photo up-front (nothing is written if one is bad). */
export function validatePhotos(files: File[]) {
  if (files.length > GALLERY_MAX_PHOTOS_PER_REQUEST) {
    throw new HttpError(422, "The given data was invalid.", {
      photos: [`You can upload at most ${GALLERY_MAX_PHOTOS_PER_REQUEST} photos at a time.`],
    });
  }
  files.forEach((file, i) => {
    const bad = validateImage(file, false, GALLERY_PHOTO_MAX_KB);
    if (bad) {
      throw new HttpError(422, "The given data was invalid.", {
        [`photos.${i}`]: [`${file.name}: ${bad}`],
      });
    }
  });
}

export const storeGalleryPhotos = (files: File[]) =>
  Promise.all(files.map((f) => storeImage(f, GALLERY_PHOTO_DIR)));

export const removeStored = (paths: string[]) =>
  Promise.all(paths.map(deleteStored));
