import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { Galeri } from "@/components/site/Galeri";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useGallery, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/galeri")({
  head: () => ({
    meta: [
      { title: "Galeri Kegiatan — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Seluruh dokumentasi foto kegiatan pembelajaran, keagamaan, seni, dan olahraga di SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:title", content: "Galeri Kegiatan — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content: "Kumpulan foto momen penting warga SDN 268 Panyileukan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GaleriPage,
});

function GaleriPage() {
  const { data: settings } = useSiteSettings();
  const { data: gallery } = useGallery();
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
          <h1 className="sr-only">Galeri Kegiatan SDN 268 Panyileukan Kota Bandung</h1>

          <Link
            to="/"
            hash="galeri"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
        <Galeri items={gallery ?? []} />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}