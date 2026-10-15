import { json } from "@/lib/server/http";

export function GET() {
  return json({ message: "Unauthorized" }, 401);
}
