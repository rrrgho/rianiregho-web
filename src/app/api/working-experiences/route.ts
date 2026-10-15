import { requireUser } from "@/lib/server/auth";
import { query, queryOne, nowUtc, serializeRow } from "@/lib/server/db";
import {
  handleError, json, paginated,
  parsePagination, readBody, toDateOnly, HttpError,
} from "@/lib/server/http";
import {
  experienceSchema, EXPERIENCE_DATES as DATES, EXPERIENCE_FILE_FIELDS as FILE_FIELDS,
} from "@/lib/server/schemas";
import { isFile, storeImage, validateImage } from "@/lib/server/storage";

export const runtime = "nodejs";


export async function GET(req: Request) {
  try {
    const { perPage, page, offset } = parsePagination(new URL(req.url));
    const [rows, count] = await Promise.all([
      query(
        `SELECT id, icon, title, subtitle, start_date, end_date, is_present, location
         FROM working_experiences WHERE deleted_at IS NULL
         ORDER BY start_date DESC NULLS FIRST LIMIT $1 OFFSET $2`,
        [perPage, offset]
      ),
      queryOne<{ n: number }>(
        `SELECT count(*)::int AS n FROM working_experiences WHERE deleted_at IS NULL`
      ),
    ]);
    return json(
      paginated(
        "Working experiences retrieved successfully",
        rows.map((r) => serializeRow(r, DATES)),
        count!.n, perPage, page
      )
    );
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: Request) {
  try {
    const { user } = await requireUser(req);
    const body = await readBody(req);
    const data = experienceSchema.parse(body);

    const paths: Record<string, string | null> = { icon: null, company_logo: null, banner: null };
    for (const [field, dir] of Object.entries(FILE_FIELDS)) {
      const file = body[field];
      if (isFile(file)) {
        const bad = validateImage(file, field === "icon");
        if (bad) throw new HttpError(422, "Validation failed", { [field]: [bad] });
        paths[field] = await storeImage(file, dir);
      }
    }

    const now = nowUtc();
    const row = await queryOne(
      `INSERT INTO working_experiences
        (id, user_id, title, subtitle, description, start_date, end_date, is_present,
         location, icon, company_logo, banner, created_at, updated_at)
       VALUES (gen_random_uuid(),$1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$12) RETURNING *`,
      [
        user.id, data.title, data.subtitle ?? null, data.description ?? null,
        toDateOnly(data.start_date), toDateOnly(data.end_date), data.is_present ?? false,
        data.location ?? null, paths.icon, paths.company_logo, paths.banner, now,
      ]
    );
    return json({ message: "Working experience created successfully", data: serializeRow(row!, DATES) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
