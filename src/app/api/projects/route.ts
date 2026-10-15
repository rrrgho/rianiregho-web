import { requireUser } from "@/lib/server/auth";
import { query, queryOne, nowUtc, serializeRow } from "@/lib/server/db";
import {
  handleError, json,
  paginated, parsePagination, readBody, toDateOnly, HttpError,
} from "@/lib/server/http";
import { projectSchema, PROJECT_DATES as DATES } from "@/lib/server/schemas";
import { isFile, storeImage, validateImage } from "@/lib/server/storage";

export const runtime = "nodejs";


export async function GET(req: Request) {
  try {
    const { perPage, page, offset } = parsePagination(new URL(req.url));
    const [rows, count] = await Promise.all([
      query(
        `SELECT * FROM projects WHERE deleted_at IS NULL
         ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [perPage, offset]
      ),
      queryOne<{ n: number }>(
        `SELECT count(*)::int AS n FROM projects WHERE deleted_at IS NULL`
      ),
    ]);
    return json(
      paginated(
        "Projects retrieved successfully",
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
    const data = projectSchema.parse(body);

    const image = body.image;
    let imagePath: string | null = null;
    if (isFile(image)) {
      const bad = validateImage(image);
      if (bad) throw new HttpError(422, "The given data was invalid.", { image: [bad] });
      imagePath = await storeImage(image, "projects/images");
    }

    const now = nowUtc();
    const row = await queryOne(
      `INSERT INTO projects
        (id, user_id, name, description, image_path, project_date, github_link,
         project_link, tech_stack, role, created_at, updated_at)
       VALUES (gen_random_uuid(), $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$10) RETURNING *`,
      [
        user.id, data.name, data.description ?? null, imagePath,
        toDateOnly(data.project_date), data.github_link ?? null,
        data.project_link ?? null, data.tech_stack ?? null, data.role ?? null, now,
      ]
    );
    return json({ message: "Project created successfully", data: serializeRow(row!, DATES) }, 201);
  } catch (err) {
    return handleError(err);
  }
}
