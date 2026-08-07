import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { PembelajaranPenilaian } from "@/components/site/PembelajaranPenilaian";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/pembelajaran-penilaian")({
  head: () => ({
    meta: [
      { title: "Pembelajaran & Penilaian — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Alur rencana pembelajaran, tiga jenis asesmen (diagnostik, formatif, sumatif), serta syarat naik kelas dan kelulusan di SDN 268 Panyileukan.",
      },
      { property: "og:title", content: "Pembelajaran & Penilaian — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content:
          "Alur CP–ATP–Modul Ajar–Asesmen, jenis asesmen, dan syarat naik kelas serta lulus di SDN 268 Panyileukan.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PembelajaranPenilaianPage,
});

function PembelajaranPenilaianPage() {
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
        <PembelajaranPenilaian />
      </main>
      <SiteFooter settings={settings ?? (FALLBACK_SETTINGS as never)} />
    </div>
  );
}