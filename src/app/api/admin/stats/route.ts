import { cookies } from "next/headers";

export async function GET() {
  const API_URL = `${process.env.API_URL}/admin/stats`;
  // e.g. https://api.fastbeetech.com or http://localhost:4000

  const cookieHeader = cookies().toString(); // includes httpOnly cookies
  const upstream = await fetch(API_URL, {
    method: "GET",
    headers: {
      cookie: cookieHeader, // forward user's cookies to API
      // if your API needs JSON:
      // "accept": "application/json",
    },
    cache: "no-store",
    // credentials is not required since we explicitly send Cookie
  });

  const body = await upstream.text();
  return new Response(body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
