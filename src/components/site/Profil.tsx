import { BookOpenCheck, Compass, HeartHandshake, Target } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteSettings } from "@/lib/cms";

export function Profil({ settings }: { settings: SiteSettings | null }) {
  const missions = (settings?.mission ?? "")
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <section id="profil" className="py-20">
      <div className="section-shell">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Profil Sekolah
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Mengenal lebih dekat {settings?.school_name || "SDN 268 Panyileukan"}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {settings?.about_text}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="surface-card h-full p-7">
              <span className="gradient-hero inline-flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
                <Compass className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Visi</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{settings?.vision}</p>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Target className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold text-foreground">Misi</h3>
              <ul className="mt-3 space-y-2.5">
                {missions.map((m) => (
                  <li key={m} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <Reveal delay={220}>
            <div className="surface-card flex h-full items-start gap-4 p-7">
              <BookOpenCheck className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Pembelajaran Bermakna
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Kurikulum Merdeka dengan pembelajaran aktif, projek penguatan Profil Pelajar
                  Pancasila, dan pendampingan belajar yang personal.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="surface-card flex h-full items-start gap-4 p-7">
              <HeartHandshake className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Sekolah Ramah Anak
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Lingkungan yang aman, bersih, dan inklusif, dengan kolaborasi erat antara guru,
                  orang tua, dan masyarakat sekitar.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
