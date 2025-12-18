import { auth } from "@/auth";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Main middleware for authentication
 * Uses NextAuth's auth to protect routes
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/working-experience")
  ) {
    return NextResponse.next();
  }

  // Protect /administrator routes
  if (pathname.startsWith("/administrator")) {
    // If not authenticated, redirect to login
    if (!req.auth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Check for bearer token
    const bearerToken = req.cookies.get("bearerToken")?.value;
    if (!bearerToken) {
      // Token not present, but user is logged in with GitHub
      // This will be validated client-side or through API
      return NextResponse.next();
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/administrator/:path*", "/api/auth/:path*"],
};
