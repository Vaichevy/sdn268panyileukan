import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { SiteFooter } from "@/components/site/SiteFooter";
import { formatDateID, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";
import { useArticles } from "@/lib/articles";

export const Route = createFileRoute("/artikel/")({
  head: () => ({
    meta: [
      { title: "Artikel — SDN 268 Panyileukan" },
      {
        name: "description",
        content: "Kumpulan artikel edukasi dan laporan khusus SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:title", content: "Artikel — SDN 268 Panyileukan" },
      { property: "og:description", content: "Artikel edukasi dan laporan khusus sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArtikelList,
});

function ArtikelList() {
  const { data: settings } = useSiteSettings();
  const { data: items } = useArticles();
  const value = (settings ?? FALLBACK_SETTINGS) as {
    running_text?: string | null;
    running_text_enabled?: boolean | null;
    running_text_speed?: number | null;
  };
  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="sticky top-0 z-40">
        <RunningText
          text={value.running_text}
          enabled={value.running_text_enabled}
          speed={value.running_text_speed}
        />
      </div>
      <main className="py-12">
        <div className="section-shell">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
          <h1 className="mt-6 font-display text-3xl font-semibold text-foreground sm:text-4xl">Artikel</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Artikel edukasi dan laporan khusus dari SDN 268 Panyileukan.
          </p>
          {(items ?? []).length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">Belum ada artikel.</p>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {(items ?? []).map((a) => (
                <article key={a.id} className="surface-card flex flex-col overflow-hidden">
                  {a.cover_url ? (
                    <img src={a.cover_url} alt={a.title} loading="lazy" className="aspect-video w-full object-cover" />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-secondary">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs font-medium text-primary">
                      {formatDateID(a.published_at)}
                      {a.author ? ` • ${a.author}` : ""}
                    </p>
                    <h2 className="mt-1 font-display text-lg font-semibold text-foreground">{a.title}</h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{a.summary}</p>
                    <Link
                      to="/artikel/$id"
                      params={{ id: a.id }}
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
                    >
                      Baca artikel <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}
