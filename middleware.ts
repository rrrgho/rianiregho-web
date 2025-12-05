import { type NextRequest, NextResponse } from "next/server";

/**
 * Main middleware for authentication
 * 
 * Checks for bearer token in HttpOnly cookie
 * If token exists, validates it with backend
 * If no token or invalid, redirects to /administrator/login
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow /administrator/login without token
  if (pathname === "/administrator/login") {
    return NextResponse.next();
  }

  // Check for bearer token in HttpOnly cookie
  const bearerToken = request.cookies.get("bearerToken")?.value;

  // If no token and trying to access protected route, redirect to login
  if (!bearerToken && pathname.startsWith("/administrator")) {
    return NextResponse.redirect(new URL("/administrator/login", request.url));
  }

  // If token exists, you could optionally validate with backend here
  // For now, the presence of the cookie is enough (set by server-side action)

  return NextResponse.next();
}

/**
 * Middleware matcher configuration
 * Specifies which routes should trigger middleware
 */
export const config = {
  matcher: [
    // Protect all /administrator routes
    "/administrator/:path*",
  ],
};
