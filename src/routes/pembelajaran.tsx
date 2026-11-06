import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { Pembelajaran } from "@/components/site/Pembelajaran";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/pembelajaran")({
  head: () => ({
    meta: [
      { title: "Pembelajaran — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Pengorganisasian belajar SDN 268 Panyileukan: tiga fase Kurikulum Merdeka, pembelajaran mendalam dengan siklus 3M, 8 dimensi profil lulusan, dan sesi belajar pagi–siang.",
      },
      { property: "og:title", content: "Pembelajaran — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content:
          "Tiga fase belajar, pembelajaran mendalam, dan pengaturan sesi belajar di SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PembelajaranPage,
});

function PembelajaranPage() {
  const { data: settings } = useSiteSettings();
  const value = settings ?? (FALLBACK_SETTINGS as never);

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
      <main className="pt-12">
        <div className="section-shell">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
        <Pembelajaran />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}