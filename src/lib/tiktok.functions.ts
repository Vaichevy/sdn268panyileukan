import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SHORT_HOSTS = ["vt.tiktok.com", "vm.tiktok.com"];

/** Resolves TikTok short links (vt./vm.tiktok.com) to the full video URL. */
export const resolveTiktokUrl = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ url: z.string().url().max(500) }).parse(d))
  .handler(async ({ data }) => {
    const start = new URL(data.url.trim());
    if (start.protocol !== "https:" || !SHORT_HOSTS.includes(start.hostname)) return { url: data.url };
    let current = start.toString();
    for (let i = 0; i < 5; i++) {
      const res = await fetch(current, { method: "GET", redirect: "manual", headers: { "User-Agent": "Mozilla/5.0" } });
      const loc = res.headers.get("location");
      if (!loc) break;
      const next = new URL(loc, current);
      if (!next.hostname.endsWith("tiktok.com")) break;
      next.search = "";
      current = next.toString();
      if (/\/@[^/]+\/video\/\d{15,25}\/?$/.test(next.pathname)) return { url: current };
    }
    return { url: null as string | null };
  });
