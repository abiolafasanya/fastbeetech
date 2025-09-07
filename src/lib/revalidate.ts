// common/utils/revalidate.ts
export async function triggerRevalidate(
  pathOrTag: string,
  type: "path" | "tag" = "path"
) {
  const url = process.env.NEXT_REVALIDATE_URL; // e.g. https://fastbeetech.com/api/revalidate
  const secret = process.env.NEXT_REVALIDATE_SECRET;
  if (!url || !secret) return;

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify({ type, value: pathOrTag }),
    });
  } catch {
    // Silently ignore revalidation errors
  }
}
