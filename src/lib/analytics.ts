// lib/analytics.ts (client)
export async function trackEvent(
  postId: string,
  type: "view" | "like" | "share" | "read_start" | "read_complete"
) {
  try {
    await fetch("/api/v1/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-session-id": getSessionId(),
      },
      body: JSON.stringify({ postId, type }),
      keepalive: true,
    });
  } catch {}
}

function getSessionId() {
  const key = "fb_session_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id!;
}
