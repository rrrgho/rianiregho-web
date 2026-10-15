import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { HttpError } from "./http";

/**
 * Replacement for Laravel's `public` disk. Paths stored in the DB
 * (e.g. `projects/images/abc.png`) are relative to this directory.
 */
export const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR ?? path.join(process.cwd(), "storage", "public")
);

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

const DEFAULT_MAX_KB = 2048; // Laravel `max:2048` (KB)

export function isFile(v: unknown): v is File {
  return typeof v === "object" && v !== null && typeof (v as File).arrayBuffer === "function" && "size" in (v as File);
}

/** Validate an uploaded image; returns an error message or null. */
export function validateImage(
  file: File,
  allowSvg = false,
  maxKb = DEFAULT_MAX_KB
): string | null {
  const allowed = allowSvg
    ? Object.keys(MIME_TO_EXT)
    : Object.keys(MIME_TO_EXT).filter((m) => m !== "image/svg+xml");
  if (!allowed.includes(file.type)) {
    return `Must be an image of type: ${allowed.map((m) => MIME_TO_EXT[m]).join(", ")}.`;
  }
  if (file.size > maxKb * 1024) {
    return `May not be greater than ${maxKb} kilobytes.`;
  }
  return null;
}

/** Resolve a stored relative path safely inside UPLOAD_DIR (blocks traversal). */
export function resolveUploadPath(relPath: string): string | null {
  const full = path.resolve(UPLOAD_DIR, relPath);
  return full.startsWith(UPLOAD_DIR + path.sep) ? full : null;
}

/** Store an image under `dir`, returning the relative path to save in the DB. */
export async function storeImage(file: File, dir: string): Promise<string> {
  const ext = MIME_TO_EXT[file.type];
  if (!ext) throw new HttpError(422, "Unsupported image type");
  const name = `${randomBytes(20).toString("hex")}.${ext}`;
  const rel = `${dir}/${name}`;
  const full = resolveUploadPath(rel)!;
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, Buffer.from(await file.arrayBuffer()));
  return rel;
}

export async function deleteStored(relPath: string | null | undefined) {
  if (!relPath) return;
  const full = resolveUploadPath(relPath);
  if (!full) return;
  await unlink(full).catch(() => {});
}
