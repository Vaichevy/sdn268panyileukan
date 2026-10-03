import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MARK = "/object/sign/site-media/";

/** Extracts site-media object paths from arbitrary text (URLs, arrays, JSON). */
function extractPaths(value: unknown, out: Set<string>) {
  if (typeof value === "string") {
    if (value.includes(MARK)) {
      out.add(decodeURIComponent(value.split(MARK)[1].split("?")[0]));
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const v of value) extractPaths(v, out);
    return;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value as Record<string, unknown>)) extractPaths(v, out);
  }
}

/**
 * Re-signs stored site-media links so expired tokens never break playback.
 * Only signs paths that are referenced by publicly visible content
 * (is_public rows / site settings), so private admin-only files in the
 * restricted bucket can never be signed through this public endpoint.
 */
export const refreshMediaUrls = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ urls: z.array(z.string().max(4000)).max(500) }).parse(data))
  .handler(async ({ data }) => {
    const requested = [
      ...new Set(
        data.urls
          .filter((u) => u.includes(MARK))
          .map((u) => decodeURIComponent(u.split(MARK)[1].split("?")[0])),
      ),
    ];
    if (requested.length === 0) return {} as Record<string, string>;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Build the allowlist of media paths referenced by public content.
    const allowed = new Set<string>();
    const [gallery, news, reels, videos, settings] = await Promise.all([
      supabaseAdmin.from("gallery_items").select("*").eq("is_public", true),
      supabaseAdmin.from("news_items").select("*").eq("is_public", true),
      supabaseAdmin.from("reel_items").select("*").eq("is_public", true),
      supabaseAdmin.from("video_items").select("*").eq("is_public", true),
      supabaseAdmin.from("site_settings").select("*"),
    ]);
    for (const row of [
      ...(gallery.data ?? []),
      ...(news.data ?? []),
      ...(reels.data ?? []),
      ...(videos.data ?? []),
      ...(settings.data ?? []),
    ]) {
      extractPaths(row, allowed);
    }

    const paths = requested.filter((p) => allowed.has(p));
    if (paths.length === 0) return {} as Record<string, string>;

    const { data: signed } = await supabaseAdmin.storage
      .from("site-media")
      .createSignedUrls(paths, 60 * 60 * 24);
    const map: Record<string, string> = {};
    for (const s of signed ?? []) if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
    return map;
  });
