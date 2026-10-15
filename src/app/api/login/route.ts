import { z } from "zod";
import { createToken } from "@/lib/server/auth";
import { verifyCredentials } from "@/lib/server/credentials";
import { serializeRow } from "@/lib/server/db";
import { handleError, json, readBody } from "@/lib/server/http";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { email, password } = schema.parse(await readBody(req));
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    const result = await verifyCredentials(email, password, ip);
    if (!result.ok) {
      return result.reason === "limited"
        ? json({ message: "Too many login attempts. Please try again later." }, 429)
        : json({ message: "Email or password doesn't exist !" }, 401);
    }

    return json({
      message: "Login successful",
      token: await createToken(result.user.id),
      user: serializeRow(result.user),
    });
  } catch (err) {
    return handleError(err);
  }
}
