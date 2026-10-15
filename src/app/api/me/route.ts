import { requireUser } from "@/lib/server/auth";
import { serializeRow } from "@/lib/server/db";
import { handleError, json } from "@/lib/server/http";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { user } = await requireUser(req);
    return json({ user: serializeRow(user) });
  } catch (err) {
    return handleError(err);
  }
}
