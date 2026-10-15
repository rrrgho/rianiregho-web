import { z } from "zod";
import { requireUser } from "@/lib/server/auth";
import { queryOne, nowUtc, isUuid, serializeRow } from "@/lib/server/db";
import { handleError, json, notFound, readBody, toDateOnly, HttpError } from "@/lib/server/http";
import { deleteStored, isFile, storeImage, validateImage } from "@/lib/server/storage";
import {
  experienceSchema, EXPERIENCE_DATES as DATES, EXPERIENCE_FILE_FIELDS as FILE_FIELDS,
} from "@/lib/server/schemas";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!isUuid(id)) {
    return json({ message: "Invalid working experience ID", data: null });
  }
  try {
    const row = await queryOne(
      `SELECT * FROM working_experiences WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
    return json({
      message: "Working experience retrieved successfully",
      data: row ? serializeRow(row, DATES) : null,
    });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();

    const existing = await queryOne<Record<string, string | null>>(
      `SELECT icon, company_logo, banner FROM working_experiences
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [id, user.id]
    );
    if (!existing) return notFound();

    const body = await readBody(req);
    const data = experienceSchema
      .partial()
      .extend({ title: z.string().min(1).max(255).optional() })
      .parse(body);

    const sets: string[] = [];
    const values: unknown[] = [];
    const set = (col: string, val: unknown) => {
      values.push(val);
      sets.push(`${col} = $${values.length}`);
    };

    for (const col of ["title", "subtitle", "description", "location"] as const) {
      if (col in body) set(col, data[col] ?? null);
    }
    if ("start_date" in body) set("start_date", toDateOnly(data.start_date));
    if ("end_date" in body) set("end_date", toDateOnly(data.end_date));
    if ("is_present" in body) set("is_present", data.is_present ?? false);

    const replaced: string[] = [];
    for (const [field, dir] of Object.entries(FILE_FIELDS)) {
      const file = body[field];
      if (isFile(file)) {
        const bad = validateImage(file, field === "icon");
        if (bad) throw new HttpError(422, "Validation failed", { [field]: [bad] });
        set(field, await storeImage(file, dir));
        if (existing[field]) replaced.push(existing[field]!);
      }
    }

    set("updated_at", nowUtc());
    values.push(id);
    const row = await queryOne(
      `UPDATE working_experiences SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    await Promise.all(replaced.map(deleteStored));
    return json({ message: "Working experience updated successfully", data: serializeRow(row!, DATES) });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  try {
    const { user } = await requireUser(req);
    const { id } = await params;
    if (!isUuid(id)) return notFound();
    const now = nowUtc();
    const row = await queryOne(
      `UPDATE working_experiences SET deleted_at = $3, updated_at = $3
       WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL RETURNING id`,
      [id, user.id, now]
    );
    if (!row) return notFound();
    return json({ message: "Working experience deleted successfully" });
  } catch (err) {
    return handleError(err);
  }
}
