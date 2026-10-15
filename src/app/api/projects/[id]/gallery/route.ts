import { requireUser } from "@/lib/server/auth";
import { query, queryOne, nowUtc, isUuid, serializeRow } from "@/lib/server/db";
import { handleError, json, optionalText, readBody, HttpError, notFound } from "@/lib/server/http";
import { isFile, storeImage, validateImage } from "@/lib/server/storage";
import { z } from "zod";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  try {
    const { id } = await params;
    const rows = isUuid(id)
      ? await query(
          `SELECT * FROM project_galleries WHERE project_id = $1 ORDER BY created_at ASC`,
          [id]
        )
      : [];
    return json({
      message: "Project gallery retrieved successfully",
      data: rows.map((r) => serializeRow(r)),
      total: rows.length,
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    const body = await readBody(req);

    // The frontend sends project_id in the body; fall back to the URL segment.
    const data = z
      .object({ project_id: z.uuid(), description: optionalText() })
      .parse({ project_id: body.project_id ?? id, description: body.description });

    const image = body.image;
    if (!isFile(image)) {
      throw new HttpError(422, "The given data was invalid.", { image: ["The image field is required."] });
    }
    const bad = validateImage(image);
    if (bad) throw new HttpError(422, "The given data was invalid.", { image: [bad] });

    const project = await queryOne(
      `SELECT id FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [data.project_id, user.id]
    );
    if (!project) return notFound();

    const imagePath = await storeImage(image, "project-gallery");
    const now = nowUtc();
    const row = await queryOne(
      `INSERT INTO project_galleries
         (id, user_id, project_id, image_path, description, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $5) RETURNING *`,
      [user.id, data.project_id, imagePath, data.description ?? null, now]
    );
    return json({ message: "Gallery image uploaded successfully", data: serializeRow(row!) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
