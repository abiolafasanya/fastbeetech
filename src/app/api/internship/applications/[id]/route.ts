import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;
  // Forward cookies for authentication/session
  const cookieHeader = cookies().toString();
  const res = await fetch(`${API_BASE}/internship/${id}/send-mail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    body: JSON.stringify({ sendMail: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Failed to send mail" },
      { status: res.status }
    );
  }
  return NextResponse.json(data);
}

// Update status
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;
  const { status } = await request.json();
  const res = await fetch(`${API_BASE}/internship/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Failed to update status" },
      { status: res.status }
    );
  }
  return NextResponse.json(data);
}
