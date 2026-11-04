import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type LiterasiBook = {
  title: string;
  url: string;
  cover: string;
  pages: number;
};

export type LiterasiBookcase = {
  title: string;
  url: string;
  books: LiterasiBook[];
};

const MAX_BOOKS = 60;

const inputSchema = z
  .string()
  .trim()
  .max(500)
  .url()
  .refine(
    (value) => {
      try {
        const host = new URL(value).hostname.toLowerCase();
        return host === "fliphtml5.com" || host.endsWith(".fliphtml5.com");
      } catch {
        return false;
      }
    },
    { message: "URL harus berasal dari fliphtml5.com" },
  );

/** Extracts a balanced {...} JSON object starting at `start` inside `text`. */
function balancedJson(text: string, start: number): string | null {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function normalizeBook(raw: { title?: string; url?: string; pages?: number }): LiterasiBook | null {
  if (!raw.url || !/^https:\/\/online\.fliphtml5\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+\/?$/.test(raw.url))
    return null;
  const base = raw.url.endsWith("/") ? raw.url : `${raw.url}/`;
  return {
    title: (raw.title ?? "").trim() || "Buku Tanpa Judul",
    url: base,
    cover: `${base}files/shot.jpg`,
    pages: Number(raw.pages) || 0,
  };
}

/**
 * Reads the public FlipHTML5 bookcase and returns its book list.
 * The bookcase page itself blocks iframes, but each book is embeddable.
 */
export const getLiterasiBooks = createServerFn({ method: "GET" })
  .inputValidator((data: string) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<LiterasiBookcase> => {
    const base = data.endsWith("/") ? data : `${data}/`;
    const candidates = [new URL("embed.js", base).toString(), base];
    for (const candidate of candidates) {
      try {
        const res = await fetch(candidate, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; SDN268PanyileukanSite/1.0)" },
          redirect: "follow",
        });
        if (!res.ok) continue;
        const html = await res.text();
        const marker = html.indexOf("bcConfig.bookData=");
        if (marker === -1) continue;
        const json = balancedJson(html, html.indexOf("{", marker));
        if (!json) continue;
        const parsed = JSON.parse(json) as { title?: string; books?: unknown };
        const books = Array.isArray(parsed.books)
          ? parsed.books
              .map((b) => normalizeBook(b as { title?: string; url?: string; pages?: number }))
              .filter((b): b is LiterasiBook => b !== null)
              .slice(0, MAX_BOOKS)
          : [];
        if (books.length > 0) {
          return {
            title: (parsed.title ?? "").trim() || "Literasi Digital",
            url: base,
            books,
          };
        }
      } catch {
        // Try the next candidate URL.
      }
    }
    return { title: "", url: base, books: [] };
  });
