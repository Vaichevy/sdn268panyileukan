import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Profil } from "@/components/site/Profil";
import { Sambutan } from "@/components/site/Sambutan";
import { Galeri } from "@/components/site/Galeri";
import { Berita } from "@/components/site/Berita";
import { Kontak } from "@/components/site/Kontak";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useGallery, useNews, useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SDN 268 Panyileukan — Sekolah Dasar Negeri Kota Bandung" },
      {
        name: "description",
        content:
          "Website resmi SDN 268 Panyileukan, Cipadung Kidul, Panyileukan, Kota Bandung. Profil sekolah, sambutan kepala sekolah, galeri kegiatan, dan informasi kontak.",
      },
      { property: "og:title", content: "SDN 268 Panyileukan — Website Resmi Sekolah" },
      {
        property: "og:description",
        content:
          "Profil sekolah, sambutan kepala sekolah Maria Rosa, S.Pd., M.M., galeri momen kegiatan, dan lokasi SDN 268 Panyileukan Kota Bandung.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Beranda,
});

function Beranda() {
  const { data: settings } = useSiteSettings();
  const { data: gallery } = useGallery();
  const { data: news } = useNews();

  const value = settings ?? (FALLBACK_SETTINGS as never);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <SiteNav schoolName={value?.school_name ?? FALLBACK_SETTINGS.school_name} />
      <main>
        <Hero settings={value} />
        <Profil settings={value} />
        <Sambutan settings={value} />
        <Galeri items={gallery ?? []} />
        <Berita items={news ?? []} />
        <Kontak settings={value} />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}
