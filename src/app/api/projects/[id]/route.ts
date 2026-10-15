import { z } from "zod";
import { requireUser } from "@/lib/server/auth";
import { queryOne, nowUtc, isUuid, serializeRow } from "@/lib/server/db";
import {
  handleError, json, notFound, readBody, toDateOnly, HttpError,
} from "@/lib/server/http";
import { deleteStored, isFile, storeImage, validateImage } from "@/lib/server/storage";
import { projectSchema, PROJECT_DATES as DATES } from "@/lib/server/schemas";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  // Laravel answered 200 + data:null for unknown / malformed ids.
  if (!isUuid(id)) {
    return json({ message: "Invalid project ID", data: null });
  }
  try {
    const row = await queryOne(
      `SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return json({
      message: "Project retrieved successfully",
      data: row ? serializeRow(row, DATES) : null,
    });
  } catch (err) {
    return handleError(err);
  }
}

// POST (multipart-friendly) is used for updates, as in the Laravel API.
export async function POST(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const project = await queryOne<{ image_path: string | null }>(
      `SELECT image_path FROM projects WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, user.id]
    );
    if (!project) return notFound();

    const body = await readBody(req);
    // Only validate/update keys that were actually sent (`sometimes`).
    const data = projectSchema.partial().extend({ name: z.string().min(1).max(255).optional() }).parse(body);

    const sets: string[] = [];
    const values: unknown[] = [];
    const set = (col: string, val: unknown) => {
      values.push(val);
      sets.push(`${col} = $${values.length}`);
    };

    for (const col of ["name", "description", "github_link", "project_link", "tech_stack", "role"] as const) {
      if (col in body) set(col, data[col] ?? null);
    }
    if ("project_date" in body) set("project_date", toDateOnly(data.project_date));

    const image = body.image;
    let newImage: string | null = null;
    if (isFile(image)) {
      const bad = validateImage(image);
      if (bad) throw new HttpError(422, "The given data was invalid.", { image: [bad] });
      newImage = await storeImage(image, "projects/images");
      set("image_path", newImage);
    }
    // A plain `image_path` string only ever came back as an echo of the
    // current value; Laravel ignored empty ones and so do we.

    set("updated_at", nowUtc());
    values.push(id);
    const row = await queryOne(
      `UPDATE projects SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );

    if (newImage) await deleteStored(project.image_path);
    return json({ message: "Project updated successfully", data: serializeRow(row!, DATES) });
  } catch (err) {
    return handleError(err);
  }
}

// Soft delete, like the Laravel SoftDeletes trait.
export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const now = nowUtc();
    const row = await queryOne(
      `UPDATE projects SET deleted_at = $3, updated_at = $3
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
      [id, user.id, now]
    );
    if (!row) return notFound();
    return json({ message: "Project deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}
