import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/literasi-digital")({
  head: () => ({
    meta: [
      { title: "Literasi Digital — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Rak buku digital (FlipHTML5) SDN 268 Panyileukan Kota Bandung: koleksi bacaan dan literasi digital untuk warga sekolah.",
      },
      { property: "og:title", content: "Literasi Digital — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content:
          "Rak buku digital SDN 268 Panyileukan: koleksi bacaan dan literasi digital untuk murid dan guru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LiterasiDigitalPage,
});

function LiterasiDigitalPage() {
  const { data: settings } = useSiteSettings();
  const heading =
    settings?.literasi_digital_heading?.trim() || "Literasi Digital";
  const embedUrl =
    settings?.literasi_digital_url?.trim() ||
    "https://fliphtml5.com/bookcase/blozj/";

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <main className="pt-10">
        <div className="section-shell">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </a>
          <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {heading}
            </h1>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> Buka di tab baru
            </a>
          </div>
          <div className="section-shell mb-12">
            <div className="overflow-hidden rounded-3xl border border-border bg-card/60 shadow-[var(--shadow-soft)] backdrop-blur-xl">
              <iframe
                src={embedUrl}
                title={heading}
                loading="lazy"
                className="block h-[calc(100dvh-18rem)] min-h-[560px] w-full border-0"
                allow="fullscreen"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Jika rak buku tidak tampil,{" "}
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                buka di tab baru
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}
