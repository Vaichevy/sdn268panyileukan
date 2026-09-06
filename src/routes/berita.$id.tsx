import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  formatDateID,
  mediaList,
  useSiteSettings,
  FALLBACK_SETTINGS,
  type NewsItem,
} from "@/lib/cms";
import { Linkify } from "@/components/site/Linkify";
import { PhotoCarousel } from "@/components/site/PhotoSlider";

const SITE_URL = "https://sdn268panyileukan.lovable.app";

function summarize(text: string | null | undefined, fallback: string): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  return clean.length > 155 ? `${clean.slice(0, 152)}…` : clean;
}

export const Route = createFileRoute("/berita/$id")({
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("news_items")
      .select("id,title,content,image_url,images,published_at,created_at")
      .eq("id", params.id)
      .maybeSingle();
    return { item: (data as NewsItem | null) ?? null };
  },
  head: ({ params, loaderData }) => {
    const item = loaderData?.item ?? null;
    const url = `${SITE_URL}/berita/${params.id}`;
    const title = item
      ? `${item.title} — SDN 268 Panyileukan`
      : "Berita Sekolah — SDN 268 Panyileukan";
    const description = item
      ? summarize(
          item.content,
          `Berita ${item.title} dari SDN 268 Panyileukan, Kota Bandung.`,
        )
      : "Baca berita dan pengumuman lengkap dari SDN 268 Panyileukan, Kota Bandung.";
    const image = item ? mediaList(item)[0] : undefined;
    const absoluteImage =
      image && image.startsWith("https://") ? image : undefined;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(absoluteImage
          ? [
              { property: "og:image", content: absoluteImage },
              { name: "twitter:image", content: absoluteImage },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: item
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsArticle",
                headline: item.title,
                description,
                datePublished: item.published_at ?? item.created_at,
                mainEntityOfPage: url,
                ...(absoluteImage ? { image: [absoluteImage] } : {}),
                publisher: {
                  "@type": "Organization",
                  name: "SDN 268 Panyileukan",
                },
              }),
            },
          ]
        : undefined,
    };
  },
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
      <div className="sticky top-0 z-40">
        <RunningText
          text={(value as { running_text?: string | null })?.running_text}
          enabled={(value as { running_text_enabled?: boolean | null })?.running_text_enabled}
          speed={(value as { running_text_speed?: number | null })?.running_text_speed}
        />
      </div>
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
              {mediaList(item).length > 0 ? (
                <PhotoCarousel
                  images={mediaList(item)}
                  alt={item.title}
                  className="h-[300px] w-full sm:h-[420px]"
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