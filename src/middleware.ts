// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const allCookies = request.cookies.getAll();

  console.log("=== MIDDLEWARE DEBUG ===");
  console.log("Path:", request.nextUrl.pathname);
  console.log("Origin:", request.headers.get("origin"));
  console.log("Host:", request.headers.get("host"));
  console.log(
    "User-Agent:",
    request.headers.get("user-agent")?.substring(0, 50)
  );
  console.log("All cookies:", allCookies);
  console.log("Token cookie:", token);
  console.log("Cookie header:", request.headers.get("cookie"));
  console.log("========================");

  const protectedPaths = ["/dashboard", "/profile", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    console.log("❌ REDIRECTING: No token found for protected path");
    console.log("Attempted path:", request.nextUrl.pathname);

    // Store the intended destination for redirect after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (isProtected && token) {
    console.log("✅ ALLOWING: Token found for protected path");
  }

  return NextResponse.next();
}

// Apply to paths
export const config = {
  matcher: ["/dashboard/:path*", "/profile", "/admin", "/dashboard"],
};
