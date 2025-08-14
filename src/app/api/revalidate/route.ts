// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-revalidate-secret");
  if (secret !== process.env.NEXT_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { type, value } = await req.json(); // { type: 'path'|'tag', value: string }

  if (type === "path") {
    revalidatePath(value, "page");
  } else if (type === "tag") {
    revalidateTag(value);
  }

  return NextResponse.json({ revalidated: true });
}
  