import { createFileRoute } from "@tanstack/react-router";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { CursorParticles } from "@/components/site/CursorParticles";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Profil } from "@/components/site/Profil";
import { Sekilas } from "@/components/site/Sekilas";
import { Sambutan } from "@/components/site/Sambutan";
import { Galeri } from "@/components/site/Galeri";
import { GaleriVideo } from "@/components/site/GaleriVideo";
import { ReelsInstagram } from "@/components/site/ReelsInstagram";
import { Berita } from "@/components/site/Berita";
import { Kontak } from "@/components/site/Kontak";
import { Komentar } from "@/components/site/Komentar";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  useGallery,
  useNews,
  useVideos,
  useReels,
  useSiteSettings,
  FALLBACK_SETTINGS,
} from "@/lib/cms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SDN 268 Panyileukan Kota Bandung" },
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
      { property: "og:url", content: "https://sdn268panyileukan.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://sdn268panyileukan.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "School",
          name: "SDN 268 Panyileukan",
          url: "https://sdn268panyileukan.lovable.app/",
          telephone: "(022) 87882549",
          email: "sdn268panyileukan@gmail.com",
          identifier: "NPSN 20245726",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Komplek Bumi Panyileukan G.15 No. 23, RT 01 / RW 07, Kelurahan Cipadung Kidul",
            addressLocality: "Kecamatan Panyileukan, Kota Bandung",
            addressRegion: "Jawa Barat",
            addressCountry: "ID",
          },
        }),
      },
    ],
  }),
  component: Beranda,
});

function Beranda() {
  const { data: settings } = useSiteSettings();
  const { data: gallery } = useGallery();
  const { data: news } = useNews();
  const { data: videos } = useVideos();
  const { data: reels } = useReels();

  const value = settings ?? (FALLBACK_SETTINGS as never);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <CursorParticles />
      <SiteNav schoolName={value?.school_name ?? FALLBACK_SETTINGS.school_name} />
      <main>
        <Hero settings={value} />
        <ReelsInstagram items={reels ?? []} limit={4} />
        <GaleriVideo items={videos ?? []} limit={6} />
        <Profil settings={value} />
        <Sekilas />
        <Sambutan settings={value} />
        <Galeri items={gallery ?? []} limit={9} />
        <Berita items={news ?? []} limit={5} />
        <Kontak settings={value} />
        <Komentar />
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}
