import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { query, queryOne, nowUtc } from "./db";
import { HttpError } from "./http";

/**
 * Laravel Sanctum-compatible personal access tokens. Tokens already issued by
 * the old Laravel API (`{id}|{plain}`, sha256(plain) stored in
 * personal_access_tokens.token) keep working, and new ones use the same format.
 */
const TOKENABLE_TYPE = "App\\Models\\User";

export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  email_verified_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  github_id: string | null;
};

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

// users columns that are safe to expose (never password / remember_token)
export const USER_COLUMNS =
  "id, name, username, email, email_verified_at, created_at, updated_at, github_id";

export async function createToken(userId: string, name = "api-token") {
  const plain = randomBytes(30).toString("base64url").slice(0, 40);
  const now = nowUtc();
  const row = await queryOne<{ id: number }>(
    `INSERT INTO personal_access_tokens
       (tokenable_type, tokenable_id, name, token, abilities, created_at, updated_at)
     VALUES ($1, $2, $3, $4, '["*"]', $5, $5) RETURNING id`,
    [TOKENABLE_TYPE, userId, name, sha256(plain), now]
  );
  return `${row!.id}|${plain}`;
}

function parseBearer(req: Request) {
  const header = req.headers.get("authorization") ?? "";
  const m = header.match(/^Bearer\s+(\d+)\|(.+)$/i);
  return m ? { id: Number(m[1]), plain: m[2] } : null;
}

/** Resolve the user for a Bearer token, or null. */
export async function authenticate(
  req: Request
): Promise<{ user: AuthUser; tokenId: number } | null> {
  const parsed = parseBearer(req);
  if (!parsed) return null;

  const row = await queryOne<{ token: string; tokenable_id: string; expires_at: string | null }>(
    `SELECT token, tokenable_id, expires_at FROM personal_access_tokens
     WHERE id = $1 AND tokenable_type = $2`,
    [parsed.id, TOKENABLE_TYPE]
  );
  if (!row) return null;

  const a = Buffer.from(row.token);
  const b = Buffer.from(sha256(parsed.plain));
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (row.expires_at && new Date(row.expires_at.replace(" ", "T") + "Z") < new Date()) {
    return null;
  }

  const user = await queryOne<AuthUser>(
    `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
    [row.tokenable_id]
  );
  if (!user) return null;

  await query(`UPDATE personal_access_tokens SET last_used_at = $2 WHERE id = $1`, [
    parsed.id,
    nowUtc(),
  ]).catch(() => {});

  return { user, tokenId: parsed.id };
}

/** Throws a 401 (same body as Laravel's /unauthorized) when not authenticated. */
export async function requireUser(req: Request) {
  const result = await authenticate(req);
  if (!result) throw new HttpError(401, "Unauthorized");
  return result;
}

export async function revokeToken(tokenId: number) {
  await query(`DELETE FROM personal_access_tokens WHERE id = $1`, [tokenId]);
}
