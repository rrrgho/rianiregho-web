import { Pool, types, type QueryResultRow } from "pg";

// Return DATE / TIMESTAMP columns as raw strings (no JS Date timezone shifting).
// Both Laravel columns are stored in UTC without a time zone.
types.setTypeParser(types.builtins.DATE, (v) => v);
types.setTypeParser(types.builtins.TIMESTAMP, (v) => v);
// BIGINT (personal_access_tokens.id) fits safely in a JS number here.
types.setTypeParser(types.builtins.INT8, (v) => Number(v));

const globalForPg = globalThis as unknown as { __pgPool?: Pool };

function createPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });
}

// Lazy + cached on globalThis so dev hot-reload doesn't leak connections.
export function getPool(): Pool {
  if (!globalForPg.__pgPool) globalForPg.__pgPool = createPool();
  return globalForPg.__pgPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: string) => UUID_RE.test(v);

const pad = (n: number, w = 2) => String(n).padStart(w, "0");

/** Current UTC time as a Postgres `timestamp without time zone` literal. */
export function nowUtc(): string {
  const d = new Date();
  return (
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
  );
}

/**
 * Serialize a row the way Laravel did: DATE/TIMESTAMP values become
 * `YYYY-MM-DDTHH:mm:ss.000000Z`, so the existing frontend keeps working.
 */
export function serializeRow<T extends Record<string, unknown>>(
  row: T,
  dateColumns: string[] = []
): T {
  const out: Record<string, unknown> = { ...row };
  for (const key of Object.keys(out)) {
    const v = out[key];
    if (typeof v !== "string") continue;
    if (
      dateColumns.includes(key) ||
      key === "created_at" ||
      key === "updated_at" ||
      key === "deleted_at" ||
      key === "email_verified_at"
    ) {
      const m = v.match(/^(\d{4}-\d{2}-\d{2})(?:[ T](\d{2}:\d{2}:\d{2}))?/);
      if (m) out[key] = `${m[1]}T${m[2] ?? "00:00:00"}.000000Z`;
    }
  }
  return out as T;
}
