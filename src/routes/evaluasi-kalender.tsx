import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { EvaluasiKalender } from "@/components/site/EvaluasiKalender";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/evaluasi-kalender")({
  head: () => ({
    meta: [
      { title: "Evaluasi & Kalender — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Siklus evaluasi kurikulum, pendampingan guru melalui coaching & Super Learning Team, dan kalender pendidikan 2026/2027 SDN 268 Panyileukan.",
      },
      { property: "og:title", content: "Evaluasi & Kalender — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content:
          "Siklus evaluasi kurikulum, pendampingan guru, dan ringkasan kalender pendidikan SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EvaluasiKalenderPage,
});

function EvaluasiKalenderPage() {
  const { data: settings } = useSiteSettings();

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <main className="pt-10">
        <div className="section-shell">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
        <EvaluasiKalender />
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}