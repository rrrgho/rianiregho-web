import { readFile } from "node:fs/promises";
import path from "node:path";
import { EXT_TO_MIME, resolveUploadPath } from "@/lib/server/storage";

export const runtime = "nodejs";

// Public file serving, replacing Laravel's `public/storage` symlink.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const full = resolveUploadPath(segments.join("/"));
  const mime = full ? EXT_TO_MIME[path.extname(full).slice(1).toLowerCase()] : undefined;
  if (!full || !mime) return new Response("Not Found", { status: 404 });

  try {
    const file = await readFile(full);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // Uploaded SVGs must never run scripts when opened directly.
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
