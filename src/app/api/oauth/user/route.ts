import { auth } from "@/auth";
import { createToken } from "@/lib/server/auth";
import { queryOne } from "@/lib/server/db";
import { handleError, json } from "@/lib/server/http";

export const runtime = "nodejs";

/**
 * Exchange a signed-in NextAuth session for an API bearer token.
 *
 * The old Laravel endpoint trusted an `email` posted by the client, which let
 * anyone mint a token for a registered email. Here the email always comes from
 * the server-side NextAuth session; any body is ignored.
 */
export async function POST() {
  try {
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return json({ message: "Unauthorized" }, 401);

    const user = await queryOne<{ id: string; email: string; username: string; name: string }>(
      `SELECT id, email, username, name FROM users WHERE email = $1`,
      [email]
    );
    if (!user) {
      return json({ message: "User is not registered to our system !" }, 401);
    }

    return json({
      message: "Success retriving token",
      token: await createToken(user.id),
      user: { email: user.email, username: user.username, name: user.name },
    });
  } catch (err) {
    return handleError(err);
  }
}
