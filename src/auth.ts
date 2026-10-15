import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import authConfig from "./auth.config";
import { verifyCredentials } from "@/lib/server/credentials";

class TooManyAttempts extends CredentialsSignin {
  code = "too_many_attempts";
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw, request) {
        const parsed = z
          .object({ email: z.string().min(1), password: z.string().min(1) })
          .safeParse(raw);
        if (!parsed.success) return null;

        const ip =
          request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
        const result = await verifyCredentials(parsed.data.email, parsed.data.password, ip);
        if (!result.ok) {
          if (result.reason === "limited") throw new TooManyAttempts();
          return null;
        }
        return { id: result.user.id, name: result.user.name, email: result.user.email };
      },
    }),
  ],
});
