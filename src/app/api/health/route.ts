import { queryOne } from "@/lib/server/db";
import { json } from "@/lib/server/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Liveness + database check, used by the Docker healthcheck. Exposes no data.
export async function GET() {
  try {
    await queryOne("SELECT 1");
    return json({ status: "ok" });
  } catch {
    return json({ status: "error" }, 503);
  }
}
