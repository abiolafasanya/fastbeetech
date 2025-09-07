import { NextResponse } from "next/server";

const API_BASE = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";
  const search = searchParams.get("search") || "";
  const url = `${API_BASE}/internships?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch data from backend" },
      { status: res.status }
    );
  }
  let data;
  try {
    data = await res.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON from backend" },
      { status: 500 }
    );
  }
  return NextResponse.json(data);
}
