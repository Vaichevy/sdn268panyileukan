import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useReels, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "Reels & Stories Instagram — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Kumpulan reels dan stories Instagram kegiatan SDN 268 Panyileukan Kota Bandung, dari pembelajaran hingga prestasi siswa.",
      },
      { property: "og:title", content: "Reels & Stories Instagram — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content: "Postingan Instagram resmi SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReelsPage,
});

function ReelsPage() {
  const { data: settings } = useSiteSettings();
  const { data: reels } = useReels();
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
          <h1 className="sr-only">Reels & Stories Instagram SDN 268 Panyileukan</h1>

          <Link
            to="/"
            hash="reels"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>
        </div>
        <ReelsInstagram items={reels ?? []} />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}
