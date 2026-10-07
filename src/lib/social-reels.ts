/** TikTok's official player requires the numeric ID from a full video link. */
export function tiktokVideoId(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !["www.tiktok.com", "tiktok.com", "m.tiktok.com"].includes(url.hostname)) return null;
    return url.pathname.match(/^\/@[^/]+\/video\/(\d{15,25})\/?$/)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function tiktokPlayerUrl(id: string, autoplay = false, preview = false): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    controls: preview ? "0" : "1",
    ...(preview ? { muted: "1", loop: "1", description: "0", music_info: "0", rel: "0" } : {}),
  });
  return `https://www.tiktok.com/player/v1/${id}?${params}`;
}