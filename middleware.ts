import { type NextRequest } from "next/server";
import { adminMiddleware } from "@/middleware/admin";

/**
 * Main middleware router
 * Routes requests to appropriate middleware based on path
 */
export function middleware(request: NextRequest) {
  // Admin routes protection
  if (request.nextUrl.pathname.startsWith("/administrator")) {
    return adminMiddleware(request);
  }

  return undefined;
}

/**
 * Middleware matcher configuration
 * Specifies which routes should trigger middleware
 */
export const config = {
  matcher: [
    // Administrator routes
    "/administrator/:path*",
  ],
};
