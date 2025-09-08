// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Middleware invoked for path:", request.nextUrl.pathname);
  console.log("Token from cookies:", token);
  const protectedPaths = ["/dashboard", "/profile", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    console.log("Token not found in cookies, redirecting to login");
    console.log("Attempted path:", request.nextUrl.pathname);

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
