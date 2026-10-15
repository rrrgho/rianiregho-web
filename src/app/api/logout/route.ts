import { requireUser, revokeToken } from "@/lib/server/auth";
import { handleError, json } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { tokenId } = await requireUser(req);
    await revokeToken(tokenId);
    return json({ message: "Logout successful" });
  } catch (err) {
    return handleError(err);
  }
}
