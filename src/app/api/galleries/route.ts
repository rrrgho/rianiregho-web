import { requireUser } from "@/lib/server/auth";
import { query, queryOne, nowUtc, serializeRow } from "@/lib/server/db";
import { removeStored, storeGalleryPhotos, validatePhotos, withPhotos } from "@/lib/server/galleries";
import {
  handleError, json, paginated, parsePagination, readMultipart, toDateOnly,
} from "@/lib/server/http";
import { GALLERY_DATES as DATES, gallerySchema } from "@/lib/server/schemas";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { perPage, page, offset } = parsePagination(new URL(req.url));
    const [rows, count] = await Promise.all([
      query(
        `SELECT * FROM galleries WHERE deleted_at IS NULL
         ORDER BY taken_date DESC NULLS LAST, created_at DESC LIMIT $1 OFFSET $2`,
        [perPage, offset]
      ),
      queryOne<{ n: number }>(`SELECT count(*)::int AS n FROM galleries WHERE deleted_at IS NULL`),
    ]);
    const data = (await withPhotos(rows as { id: string }[])).map((r) => serializeRow(r, DATES));
    return json(paginated("Galleries retrieved successfully", data, count!.n, perPage, page));
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  let stored: string[] = [];
  try {
    const { user } = await requireUser(req);
    const { fields, files } = await readMultipart(req);
    const data = gallerySchema.parse(fields);
    const photos = files.photos ?? [];
    validatePhotos(photos);

    stored = await storeGalleryPhotos(photos);
    const now = nowUtc();
    const gallery = await queryOne<{ id: string }>(
      `INSERT INTO galleries (id, user_id, title, story, taken_date, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $5) RETURNING *`,
      [user.id, data.title, data.story ?? null, toDateOnly(data.taken_date), now]
    );
    for (const [i, path] of stored.entries()) {
      await query(
        `INSERT INTO gallery_photos (id, gallery_id, image_path, position, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4)`,
        [gallery!.id, path, i, now]
      );
    }
    const [result] = await withPhotos([gallery!]);
    return json({ message: "Gallery created successfully", data: serializeRow(result, DATES) }, 201);
  } catch (err) {
    await removeStored(stored); // don't leave orphaned files behind
    return handleError(err);
  }
}
