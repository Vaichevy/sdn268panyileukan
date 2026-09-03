import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { GaleriVideo } from "@/components/site/GaleriVideo";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useVideos, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/video")({
  head: () => ({
    meta: [
      { title: "Galeri Video — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Kumpulan video kegiatan pembelajaran, keagamaan, seni, dan olahraga SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:title", content: "Galeri Video — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content: "Cuplikan video momen kegiatan warga SDN 268 Panyileukan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VideoPage,
});

function VideoPage() {
  const { data: settings } = useSiteSettings();
  const { data: videos } = useVideos();
  const value = settings ?? (FALLBACK_SETTINGS as never);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <main className="pt-12">
        <div className="section-shell">
          <Link
            to="/"
            hash="video"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
        <GaleriVideo items={videos ?? []} />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}
