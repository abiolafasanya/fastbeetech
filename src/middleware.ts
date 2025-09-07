// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  const protectedPaths = ["/dashboard", "/profile", "/admin", "/listings/add"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    console.log("token not found", request.cookies);
    console.log("Unauthorized access attempt to:", request.nextUrl.pathname);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply to paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/store", "/listings/add"],
};
