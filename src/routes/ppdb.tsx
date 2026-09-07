import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ClipboardList,
  FileText,
  Mail,
  MapPin,
  Phone,
  UserPlus,
} from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";

const SITE_URL = "https://sdn268panyileukan.lovable.app";

export const Route = createFileRoute("/ppdb")({
  head: () => ({
    meta: [
      { title: "PPDB — Penerimaan Peserta Didik Baru SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Informasi PPDB (Penerimaan Peserta Didik Baru) SDN 268 Panyileukan Kota Bandung: alur pendaftaran, kontak, dan lokasi sekolah di Cipadung Kidul, Panyileukan.",
      },
      { property: "og:title", content: "PPDB SDN 268 Panyileukan Kota Bandung" },
      {
        property: "og:description",
        content:
          "Informasi pendaftaran peserta didik baru SDN 268 Panyileukan, Kota Bandung. Hubungi sekolah untuk jadwal dan persyaratan terbaru.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/ppdb` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ppdb` }],
  }),
  component: PpdbPage,
});

const STEPS = [
  {
    icon: Phone,
    title: "Hubungi Sekolah",
    desc: "Konfirmasi jadwal dan persyaratan PPDB terbaru melalui telepon atau email resmi sekolah.",
  },
  {
    icon: FileText,
    title: "Siapkan Berkas",
    desc: "Siapkan dokumen calon peserta didik sesuai panduan yang diberikan pihak sekolah.",
  },
  {
    icon: ClipboardList,
    title: "Isi Formulir",
    desc: "Lengkapi formulir pendaftaran sesuai arahan panitia PPDB SDN 268 Panyileukan.",
  },
  {
    icon: UserPlus,
    title: "Daftar Ulang",
    desc: "Selesaikan daftar ulang setelah pengumuman hasil seleksi dari sekolah.",
  },
];

function PpdbPage() {
  const { data: settings } = useSiteSettings();
  const value = settings ?? (FALLBACK_SETTINGS as never);
  const s = (value ?? FALLBACK_SETTINGS) as typeof FALLBACK_SETTINGS;

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
      <main className="py-16">
        <div className="section-shell">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>

          <header className="mt-8 max-w-3xl">
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-5xl">
              PPDB — Penerimaan Peserta Didik Baru
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Selamat datang di halaman informasi PPDB {s.school_name}. Kami
              membuka pendaftaran peserta didik baru untuk keluarga di
              Panyileukan, Kota Bandung, dan sekitarnya.
            </p>
          </header>

          <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="surface-card p-6">
                <div className="flex items-center justify-between">
                  <step.icon className="h-6 w-6 text-primary" />
                  <span className="font-display text-2xl font-semibold text-primary/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </section>

          <section className="surface-card mt-10 p-6 sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Informasi & Kontak PPDB
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Untuk jadwal pendaftaran, persyaratan berkas, dan kuota terbaru,
              silakan hubungi sekolah secara langsung:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <a
                href={`tel:${(s.phone || "").replace(/[^+\d]/g, "")}`}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:bg-secondary"
              >
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Telepon
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">
                    {s.phone}
                  </span>
                </span>
              </a>
              <a
                href={`mailto:${s.email}`}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4 transition-colors hover:bg-secondary"
              >
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Email
                  </span>
                  <span className="mt-1 block text-sm font-medium break-all text-foreground">
                    {s.email}
                  </span>
                </span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card/60 p-4">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Alamat
                  </span>
                  <span className="mt-1 block text-sm font-medium text-foreground">
                    {s.address}
                  </span>
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}
