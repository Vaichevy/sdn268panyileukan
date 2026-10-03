import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, BadgeCheck, MapPin, Phone, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-sekolah.jpg";
import bannerAsset from "@/assets/banner-sekolah.jpeg.asset.json";
import { RunningText } from "@/components/site/RunningText";
import type { SiteSettings } from "@/lib/cms";
import { ImageEffectOverlay, type ImageEffect } from "@/components/site/ImageEffect";

export function Hero({ settings }: { settings: SiteSettings | null }) {
  const stats = [
    { label: "Peserta Didik", value: settings?.stat_students },
    { label: "Guru & Tenaga", value: settings?.stat_teachers },
    { label: "Ruang Kelas", value: settings?.stat_classrooms },
    { label: "Akreditasi", value: settings?.stat_accreditation },
  ].filter((s) => s.value);

  const accreditation = (settings?.stat_accreditation ?? "").trim();

  const b = (settings ?? {}) as Partial<{ banner_height: number; banner_zoom: number; banner_pos_x: number; banner_pos_y: number }>;
  const h = b.banner_height ?? 420;
  const pos = `${b.banner_pos_x ?? 50}% ${b.banner_pos_y ?? 50}%`;

  const ticker = (settings?.running_text ?? "").trim();
  const tickerOn = settings?.running_text_enabled !== false && ticker.length > 0;

  return (
    <section id="beranda" className="relative pt-28 pb-16 sm:pt-32 sm:pb-24">
      {tickerOn ? (
        <div className="section-shell mb-4">
          <div className="overflow-hidden rounded-2xl border border-border/60">
            <RunningText
              text={settings?.running_text}
              enabled={settings?.running_text_enabled}
              speed={settings?.running_text_speed}
            />
          </div>
        </div>
      ) : null}
      <div className="section-shell mb-12">
        <div
          className="relative w-full overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]"
          style={{ height: `clamp(160px, 45vw, ${h}px)` }}
        >
          <img
            src={settings?.hero_image_url || bannerAsset.url}
            alt={`Banner ${settings?.school_name || "SDN 268 Panyileukan"}`}
            loading="eager"
            fetchPriority="high"
            className="h-full w-full object-cover"
            style={{ objectPosition: pos, transform: `scale(${(b.banner_zoom ?? 100) / 100})`, transformOrigin: pos }}
          />
          <ImageEffectOverlay effect={(settings as { banner_effect?: ImageEffect } | null)?.banner_effect} />
        </div>
      </div>
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-rise">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              NPSN {settings?.npsn || "20245726"} · Kota Bandung
            </span>
            {accreditation ? (
              <span className="gradient-hero inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-wide text-primary-foreground uppercase shadow-[var(--shadow-soft)]">
                <BadgeCheck className="h-3.5 w-3.5" />
                Terakreditasi {accreditation}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-semibold text-foreground sm:text-6xl">
            {settings?.school_name || "SDN 268 Panyileukan"}
            <span className="mt-2 block text-xl font-semibold text-muted-foreground sm:text-2xl">
              "Menjadikan murid yang beriman dan bertakwa, sehat, bernalar kritis, kreatif dan komunikatif"
            </span>
          </h1>


          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {settings?.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/ppdb"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-[1.03]"
            >
              Info PPDB <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#profil"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Profil Sekolah
            </a>
            <a
              href="#galeri"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Momen Kegiatan
            </a>
          </div>

          <div className="mt-8 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{settings?.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <span>{settings?.phone}</span>
            </p>
          </div>
        </div>

        <div className="animate-rise relative" style={{ animationDelay: "150ms" }}>
          <div className="gradient-hero absolute -inset-4 rounded-[2.5rem] opacity-20 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-lift)]">
            <img
              src={settings?.profile_image_url || heroImage}
              alt={`Foto profil ${settings?.school_name || "SDN 268 Panyileukan"}`}
              width={1600}
              height={1008}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              className="aspect-[4/3] w-full object-cover"
            />
            <ImageEffectOverlay effect={(settings as { profile_effect?: ImageEffect } | null)?.profile_effect} />
            {accreditation ? (
              <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/90 px-3.5 py-2 text-xs font-bold tracking-wide text-primary uppercase shadow-[var(--shadow-soft)] backdrop-blur">
                <Award className="h-4 w-4" />
                Akreditasi {accreditation}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {stats.length > 0 ? (
        <div className="section-shell mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="surface-card px-6 py-5 text-center">
                <p className="font-display text-3xl font-semibold text-primary">{stat.value}</p>
                <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
