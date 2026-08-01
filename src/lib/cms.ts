import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SiteSettings = Tables<"site_settings">;
export type GalleryItem = Tables<"gallery_items">;
export type NewsItem = Tables<"news_items">;
export type Testimonial = Tables<"testimonials">;

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
