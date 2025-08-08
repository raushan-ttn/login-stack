// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";

// List of public paths that do not require authentication
const PUBLIC_PATHS = ["/", "/login", "/about", "/api/public"];

/**
 * Helper to check if pathname is public
 */
function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );
}

/**
 * Middleware function to protect routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // If no token found, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify JWT token (throws if invalid)
    jwt.verify(token, JWT_SECRET);

    // Prevent authenticated users from accessing login/auth routes
    if (pathname === "/login" || pathname.startsWith("/auth")) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }

    // Token is valid - continue processing the request
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired - redirect to login and clear token cookie
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("token");
    return response;
  }
}

/**
 * Specify matcher for middleware to run on
 */
export const config = {
  matcher: [
    // All routes except some static/public files and explicitly public API
    "/((?!api/public|_next/static|_next/image|favicon.ico).*)",
  ],
};
