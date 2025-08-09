// lib/reading-time.ts
export function readingTime(text: string, wpm = 200) {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / wpm));
  return { words, minutes };
}
