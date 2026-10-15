import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status });

export const notFound = () => json({ message: "Not Found" }, 404);

export class HttpError extends Error {
  constructor(public status: number, message: string, public errors?: unknown) {
    super(message);
  }
}

/** Convert a thrown error into the JSON shape Laravel used. */
export function handleError(err: unknown) {
  if (err instanceof HttpError) {
    return json(
      err.errors ? { message: err.message, errors: err.errors } : { message: err.message },
      err.status
    );
  }
  if (err instanceof ZodError) {
    return json(
      { message: "The given data was invalid.", errors: zodErrors(err) },
      422
    );
  }
  console.error("API error:", err);
  return json({ message: "Server Error" }, 500);
}

function zodErrors(err: ZodError) {
  const errors: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_";
    (errors[key] ??= []).push(issue.message);
  }
  return errors;
}

/**
 * Read a JSON or multipart body into a plain object. Like Laravel's
 * ConvertEmptyStringsToNull, empty strings become null. Files stay as File.
 */
export async function readBody(
  req: Request
): Promise<Record<string, FormDataEntryValue | null>> {
  const type = req.headers.get("content-type") ?? "";
  const out: Record<string, FormDataEntryValue | null> = {};
  if (type.includes("multipart/form-data") || type.includes("urlencoded")) {
    const form = await req.formData();
    for (const [k, v] of form.entries()) {
      out[k] = typeof v === "string" ? (v.trim() === "" ? null : v) : v;
    }
  } else if (type.includes("application/json")) {
    const data = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    for (const [k, v] of Object.entries(data ?? {})) {
      out[k] = typeof v === "string" ? (v.trim() === "" ? null : v) : (v as never);
    }
  }
  return out;
}

/**
 * Multipart reader that keeps repeated keys (e.g. several `photos` files).
 * Text fields: empty strings become null, like readBody.
 */
export async function readMultipart(req: Request) {
  const fields: Record<string, string | null> = {};
  const files: Record<string, File[]> = {};
  const form = await req.formData();
  for (const [k, v] of form.entries()) {
    if (typeof v === "string") fields[k] = v.trim() === "" ? null : v;
    else if (v.size > 0) (files[k] ??= []).push(v);
  }
  return { fields, files };
}

export function parsePagination(url: URL) {
  const perPage = Math.min(
    Math.max(parseInt(url.searchParams.get("per_page") ?? "10", 10) || 10, 1),
    100
  );
  const page = Math.max(parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1);
  return { perPage, page, offset: (page - 1) * perPage };
}

export function paginated<T>(
  message: string,
  data: T[],
  total: number,
  perPage: number,
  page: number
) {
  return {
    message,
    data,
    total,
    per_page: perPage,
    current_page: page,
    last_page: Math.max(Math.ceil(total / perPage), 1),
  };
}

// ---- shared zod field helpers -------------------------------------------------

export const optionalText = (max?: number) => {
  let s = z.string();
  if (max) s = s.max(max);
  return s.nullish();
};

export const optionalUrl = z
  .string()
  .max(255)
  .refine((v) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL.")
  .nullish();

export const optionalDate = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date.")
  .nullish();

/** Laravel `boolean` rule: true, false, 1, 0, "1", "0", "true", "false". */
export const laravelBoolean = z
  .union([z.boolean(), z.number(), z.string()])
  .transform((v, ctx) => {
    if (v === true || v === 1 || v === "1" || v === "true") return true;
    if (v === false || v === 0 || v === "0" || v === "false") return false;
    ctx.addIssue({ code: "custom", message: "Must be true or false." });
    return z.NEVER;
  })
  .nullish();

/** Normalize an ISO/date string to `YYYY-MM-DD` for DATE columns. */
export function toDateOnly(v: string | null | undefined): string | null {
  if (!v) return null;
  const m = v.match(/^\d{4}-\d{2}-\d{2}/);
  if (m) return m[0];
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
