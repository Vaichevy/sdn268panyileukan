import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tiktokVideoId } from "./social-reels";

/** Only official public metadata is fetched; no video files or draft CMS rows. */
export const getTiktokCover = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ url: z.string().url().max(500) }).parse(data))
  .handler(async ({ data }): Promise<string | null> => {
    const id = tiktokVideoId(data.url);
    if (!id) return null;
    const videoUrl = new URL(data.url);
    videoUrl.search = "";
    videoUrl.hash = "";
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl.toString())}`,
        { redirect: "error", signal: AbortSignal.timeout(6000) },
      );
      if (!response.ok) return null;
      const metadata = z.object({ thumbnail_url: z.string().url().max(4096) }).safeParse(await response.json());
      if (!metadata.success) return null;
      const thumbnail = new URL(metadata.data.thumbnail_url);
      const allowed = ["tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "tiktokv.com"];
      if (thumbnail.protocol !== "https:" || thumbnail.username || thumbnail.password || thumbnail.port ||
        !allowed.some((host) => thumbnail.hostname === host || thumbnail.hostname.endsWith(`.${host}`))) return null;
      return thumbnail.toString();
    } catch {
      return null;
    }
  });