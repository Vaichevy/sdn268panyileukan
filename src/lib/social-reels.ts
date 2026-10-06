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

export function tiktokPlayerUrl(id: string, autoplay = false): string {
  return `https://www.tiktok.com/player/v1/${id}?autoplay=${autoplay ? 1 : 0}&controls=1`;
}