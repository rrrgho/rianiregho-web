import { requireUser } from "@/lib/server/auth";
import { query, queryOne, nowUtc, isUuid, serializeRow } from "@/lib/server/db";
import { removeStored, storeGalleryPhotos, validatePhotos, withPhotos } from "@/lib/server/galleries";
import { handleError, json, notFound, readMultipart, toDateOnly } from "@/lib/server/http";
import { GALLERY_DATES as DATES, gallerySchema } from "@/lib/server/schemas";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isUuid(id)) return json({ message: "Invalid gallery ID", data: null });
  try {
    const row = await queryOne<{ id: string }>(
      `SELECT * FROM galleries WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    const [data] = row ? await withPhotos([row]) : [null];
    return json({
      message: "Gallery retrieved successfully",
      data: data ? serializeRow(data, DATES) : null,
    });
  } catch (err) {
    return handleError(err);
  }
}

// Update fields and/or append new photos (POST + multipart, like projects).
export async function POST(req: Request, { params }: Ctx) {
  let stored: string[] = [];
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const existing = await queryOne(
      `SELECT id FROM galleries WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, user.id]
    );
    if (!existing) return notFound();

    const { fields, files } = await readMultipart(req);
    const data = gallerySchema.partial().parse(fields);
    const photos = files.photos ?? [];
    validatePhotos(photos);

    const sets: string[] = [];
    const values: unknown[] = [];
    const set = (col: string, val: unknown) => {
      values.push(val);
      sets.push(`${col} = $${values.length}`);
    };
    if ("title" in fields) set("title", data.title);
    if ("story" in fields) set("story", data.story ?? null);
    if ("taken_date" in fields) set("taken_date", toDateOnly(data.taken_date));
    const now = nowUtc();
    set("updated_at", now);
    values.push(id);
    const row = await queryOne<{ id: string }>(
      `UPDATE galleries SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (photos.length) {
      stored = await storeGalleryPhotos(photos);
      const last = await queryOne<{ p: number }>(
        `SELECT coalesce(max(position), -1)::int AS p FROM gallery_photos WHERE gallery_id = $1`,
        [id]
      );
      for (const [i, path] of stored.entries()) {
        await query(
          `INSERT INTO gallery_photos (id, gallery_id, image_path, position, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
          [id, path, last!.p + 1 + i, now]
        );
      }
    }

    const [result] = await withPhotos([row!]);
    return json({ message: "Gallery updated successfully", data: serializeRow(result, DATES) });
  } catch (err) {
    await removeStored(stored);
    return handleError(err);
  }
}

// Soft delete; photo files are kept so the entry could be restored.
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const now = nowUtc();
    const row = await queryOne(
      `UPDATE galleries SET deleted_at = $3, updated_at = $3
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
      [id, user.id, now]
    );
    if (!row) return notFound();
    return json({ message: "Gallery deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}
