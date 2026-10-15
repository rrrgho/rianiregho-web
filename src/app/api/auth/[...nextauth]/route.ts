import { handlers } from "@/auth";
import { NextRequest } from "next/server";

/**
 * In the Docker (standalone) build Next.js reports the request URL with the
 * server's bind address (0.0.0.0:3000), which would end up in NextAuth's
 * redirects (e.g. client-side signOut). Rebuild the public origin from the
 * headers set by the reverse proxy. Host handling is already trusted via
 * AUTH_TRUST_HOST.
 */
function withPublicOrigin(req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return req;
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0].trim() ??
    req.nextUrl.protocol.replace(":", "");
  // Build from scratch: assigning `url.host` would keep the old :3000 port.
  const { pathname, search } = new URL(req.url);
  return new NextRequest(`${proto}://${host}${pathname}${search}`, req);
}

export const GET = (req: NextRequest) => handlers.GET(withPublicOrigin(req));
export const POST = (req: NextRequest) => handlers.POST(withPublicOrigin(req));
