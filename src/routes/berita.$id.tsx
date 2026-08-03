import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { SiteFooter } from "@/components/site/SiteFooter";
import { formatDateID, useSiteSettings, FALLBACK_SETTINGS, type NewsItem } from "@/lib/cms";
import { Linkify } from "@/components/site/Linkify";

export const Route = createFileRoute("/berita/$id")({
  head: () => ({
    meta: [
      { title: "Berita Sekolah — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Baca berita dan pengumuman lengkap dari SDN 268 Panyileukan, Kota Bandung.",
      },
      { property: "og:title", content: "Berita Sekolah — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content: "Informasi dan pengumuman terbaru dari SDN 268 Panyileukan.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BeritaDetail,
});

function BeritaDetail() {
  const { id } = Route.useParams();
  const { data: settings } = useSiteSettings();
  const value = settings ?? (FALLBACK_SETTINGS as never);

  const { data: item, isLoading } = useQuery({
    queryKey: ["news_items", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_items")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as NewsItem | null;
    },
  });

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <main className="py-16">
        <div className="section-shell">
          <Link
            to="/"
            hash="berita"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Berita
          </Link>

          {isLoading ? (
            <p className="mt-10 text-sm text-muted-foreground">Memuat berita…</p>
          ) : !item ? (
            <div className="surface-card mt-10 p-8">
              <Newspaper className="h-8 w-8 text-primary" />
              <h1 className="mt-4 font-display text-2xl font-semibold text-foreground">
                Berita tidak ditemukan
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Berita yang Anda cari mungkin sudah dihapus.
              </p>
            </div>
          ) : (
            <article className="surface-card mt-8 overflow-hidden">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="max-h-[420px] w-full object-cover"
                />
              ) : null}
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  {formatDateID(item.published_at)}
                </p>
                <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                  {item.title}
                </h1>
                <div className="mt-6 space-y-4 text-base leading-relaxed whitespace-pre-line text-muted-foreground">
                  <Linkify text={item.content} />
                </div>
              </div>
            </article>
          )}
        </div>
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}