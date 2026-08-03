import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
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
        <Pembelajaran />
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}