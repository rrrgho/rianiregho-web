import type { NextAuthConfig } from "next-auth";

// Edge-safe part of the auth config (no database / bcrypt), used by middleware.
export default {
  providers: [],
  pages: { signIn: "/login" },
} satisfies NextAuthConfig;
