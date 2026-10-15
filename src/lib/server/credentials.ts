import bcrypt from "bcryptjs";
import { USER_COLUMNS, type AuthUser } from "./auth";
import { queryOne } from "./db";
import { clearFailures, isLimited, recordFailure } from "./rate-limit";

export type CredentialResult =
  | { ok: true; user: AuthUser }
  | { ok: false; reason: "invalid" | "limited" };

/** Check an email + password against the users table (bcrypt hashes). */
export async function verifyCredentials(
  email: string,
  password: string,
  ip = "unknown"
): Promise<CredentialResult> {
  const key = `${ip}|${email.toLowerCase()}`;
  if (isLimited(key)) return { ok: false, reason: "limited" };

  const user = await queryOne<AuthUser & { password: string | null }>(
    `SELECT ${USER_COLUMNS}, password FROM users WHERE lower(email) = lower($1)`,
    [email]
  );
  const valid = !!user?.password && (await bcrypt.compare(password, user.password));
  if (!user || !valid) {
    recordFailure(key);
    return { ok: false, reason: "invalid" };
  }
  clearFailures(key);
  const { password: _pw, ...safe } = user;
  void _pw;
  return { ok: true, user: safe };
}
