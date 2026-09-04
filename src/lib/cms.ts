import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SiteSettings = Tables<"site_settings">;
export type GalleryItem = Tables<"gallery_items">;
export type NewsItem = Tables<"news_items">;
export type Testimonial = Tables<"testimonials">;
export type VideoItem = Tables<"video_items">;
export type ReelItem = Tables<"reel_items">;

/** Extracts the Instagram shortcode from post, reel, or tv URLs. */
export function instagramCode(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (m?.[1]) return m[1];
  return /^[A-Za-z0-9_-]{5,}$/.test(url.trim()) ? url.trim() : null;
}

export function useReels() {
  return useQuery({
    queryKey: ["reel_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reel_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReelItem[];
    },
  });
}

/** Sorts reels newest-first by event date, falling back to created_at. */
export function sortReels(items: ReelItem[]): ReelItem[] {
  return [...items].sort((a, b) => {
    const ta = new Date(a.event_date ?? a.created_at).getTime();
    const tb = new Date(b.event_date ?? b.created_at).getTime();
    return tb - ta;
  });
}

/** Extracts the YouTube video id from watch, youtu.be, shorts, or embed URLs. */
export function youtubeId(url?: string | null): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m?.[1]) return m[1];
  }
  return /^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export function youtubeThumb(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function useVideos() {
  return useQuery({
    queryKey: ["video_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("video_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as VideoItem[];
    },
  });
}

/** Sorts videos newest-first by event date, falling back to created_at. */
export function sortVideos(items: VideoItem[]): VideoItem[] {
  return [...items].sort((a, b) => {
    const ta = new Date(a.event_date ?? a.created_at).getTime();
    const tb = new Date(b.event_date ?? b.created_at).getTime();
    return tb - ta;
  });
}

export const FALLBACK_SETTINGS = {
  school_name: "SDN 268 Panyileukan",
  tagline: "Sekolah Dasar Negeri yang Unggul, Berkarakter, dan Berprestasi",
  address:
    "Komplek Bumi Panyileukan G.15 No. 23, RT 01 / RW 07, Kelurahan Cipadung Kidul, Kecamatan Panyileukan, Kota Bandung",
  npsn: "20245726",
  phone: "(022) 87882549",
  email: "sdn268panyileukan@gmail.com",
};

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as SiteSettings | null;
    },
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GalleryItem[];
    },
  });
}

export function useNews() {
  return useQuery({
    queryKey: ["news_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_items")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as NewsItem[];
    },
  });
}

/** Uploads a file to the private media bucket and returns a long-lived signed URL. */
export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
}

export function useAllTestimonials() {
  return useQuery({
    queryKey: ["testimonials", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Testimonial[];
    },
  });
}

export async function uploadMedia(file: File, folder = "umum") {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signError } = await supabase.storage
    .from("site-media")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signError || !data?.signedUrl) throw signError ?? new Error("Gagal membuat tautan foto");
  return data.signedUrl;
}

export function formatDateID(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** All photos for a card: cover first, then extra uploads, de-duplicated. */
export function mediaList(item: {
  image_url?: string | null;
  images?: string[] | null;
}): string[] {
  const list = [item.image_url, ...(item.images ?? [])].filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );
  return [...new Set(list)];
}

/** Sorts gallery items newest-first by event date, falling back to created_at. */
export function sortGallery(items: GalleryItem[]): GalleryItem[] {
  return [...items].sort((a, b) => {
    const ta = new Date(a.event_date ?? a.created_at).getTime();
    const tb = new Date(b.event_date ?? b.created_at).getTime();
    return tb - ta;
  });
}

/** Groups news items into month-year buckets, newest first. */
export function groupNewsByMonth(items: NewsItem[]) {
  const map = new Map<string, { key: string; label: string; items: NewsItem[] }>();
  for (const item of [...items].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
  )) {
    const date = new Date(item.published_at);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const label = date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    if (!map.has(key)) map.set(key, { key, label, items: [] });
    map.get(key)!.items.push(item);
  }
  return [...map.values()];
}
