// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = ["/dashboard", "/profile", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    // Store the intended destination for redirect after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Apply to paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/admin", "/dashboard"],
};
