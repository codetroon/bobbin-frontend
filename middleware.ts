import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip login page
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next();
    }

    // Check for authentication token in cookies
    const authCookie = request.cookies.get("admin-auth");

    if (!authCookie) {
      // Redirect to login if no auth cookie
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Parse the auth state from cookie
      const authState = JSON.parse(authCookie.value);

      // Check if user is authenticated and has admin role
      if (
        !authState?.state?.isAuthenticated ||
        !["super_admin", "admin"].includes(authState?.state?.user?.role)
      ) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      // Invalid cookie format, redirect to login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
