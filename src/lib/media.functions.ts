import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MARK = "/object/sign/site-media/";

/** Re-signs stored site-media links so expired tokens never break playback. */
export const refreshMediaUrls = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ urls: z.array(z.string().max(4000)).max(500) }).parse(data))
  .handler(async ({ data }) => {
    const paths = [
      ...new Set(
        data.urls
          .filter((u) => u.includes(MARK))
          .map((u) => decodeURIComponent(u.split(MARK)[1].split("?")[0])),
      ),
    ];
    if (paths.length === 0) return {} as Record<string, string>;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from("site-media")
      .createSignedUrls(paths, 60 * 60 * 24);
    const map: Record<string, string> = {};
    for (const s of signed ?? []) if (s.path && s.signedUrl) map[s.path] = s.signedUrl;
    return map;
  });
