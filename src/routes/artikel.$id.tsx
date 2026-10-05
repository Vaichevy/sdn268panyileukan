import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArticleBody } from "@/components/site/ArticleBody";
import { formatDateID, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";
import { useArticle } from "@/lib/articles";

export const Route = createFileRoute("/artikel/$id")({
  head: () => ({
    meta: [
      { title: "Artikel — SDN 268 Panyileukan" },
      { name: "description", content: "Baca artikel lengkap dari SDN 268 Panyileukan Kota Bandung." },
      { property: "og:title", content: "Artikel — SDN 268 Panyileukan" },
      { property: "og:description", content: "Artikel lengkap dari SDN 268 Panyileukan." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArtikelDetail,
});

function ArtikelDetail() {
  const { id } = Route.useParams();
  const { data: a, isLoading } = useArticle(id);
  const { data: settings } = useSiteSettings();
  const value = (settings ?? FALLBACK_SETTINGS) as {
    running_text?: string | null;
    running_text_enabled?: boolean | null;
    running_text_speed?: number | null;
  };
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="sticky top-0 z-40">
        <RunningText text={value.running_text} enabled={value.running_text_enabled} speed={value.running_text_speed} />
      </div>
      <main className="py-12">
        <div className="section-shell max-w-4xl">
          <Link to="/artikel" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Semua Artikel
          </Link>
          {isLoading ? (
            <p className="mt-10 text-muted-foreground">Memuat…</p>
          ) : !a ? (
            <p className="mt-10 text-muted-foreground">Artikel tidak ditemukan.</p>
          ) : (
            <article className="surface-card mt-6 p-6 sm:p-10">
              <p className="text-sm font-medium text-primary">
                {formatDateID(a.published_at)}
                {a.author ? ` • Penulis: ${a.author}` : ""}
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">{a.title}</h1>
              {a.summary ? <p className="mt-3 text-lg text-muted-foreground">{a.summary}</p> : null}
              {a.cover_url ? (
                <img src={a.cover_url} alt={a.title} className="mt-6 w-full rounded-2xl object-cover" />
              ) : null}
              <div className="mt-8">
                <ArticleBody text={a.content} />
              </div>
              {a.pdf_url ? (
                <div className="mt-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-xl font-semibold text-foreground">Versi PDF</h2>
                    <a
                      href={a.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      <Download className="h-4 w-4" /> Buka / Unduh PDF
                    </a>
                  </div>
                  <iframe
                    src={a.pdf_url}
                    title={`PDF ${a.title}`}
                    className="mt-4 h-[80vh] w-full rounded-2xl border border-border bg-card"
                  />
                </div>
              ) : null}
            </article>
          )}
        </div>
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}
