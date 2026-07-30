import { Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteSettings } from "@/lib/cms";

export function Sambutan({ settings }: { settings: SiteSettings | null }) {
  const paragraphs = (settings?.headmaster_speech ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const initials = (settings?.headmaster_name ?? "K S")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <section id="sambutan" className="py-20">
      <div className="section-shell">
        <Reveal>
          <div className="gradient-hero overflow-hidden rounded-[2.5rem] p-8 text-primary-foreground shadow-[var(--shadow-lift)] sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
              <div className="text-center lg:text-left">
                {settings?.headmaster_photo_url ? (
                  <img
                    src={settings.headmaster_photo_url}
                    alt={settings.headmaster_name}
                    loading="lazy"
                    className="mx-auto aspect-[3/4] w-56 rounded-[1.75rem] border border-white/25 object-cover lg:mx-0"
                  />
                ) : (
                  <div className="mx-auto flex aspect-[3/4] w-56 items-center justify-center rounded-[1.75rem] border border-white/25 bg-white/10 font-display text-5xl font-semibold lg:mx-0">
                    {initials}
                  </div>
                )}
                <p className="mt-5 font-display text-xl font-semibold">
                  {settings?.headmaster_name}
                </p>
                <p className="text-sm opacity-80">{settings?.headmaster_title}</p>
              </div>

              <div>
                <Quote className="h-9 w-9 opacity-60" />
                <h2 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                  Sambutan Kepala Sekolah
                </h2>
                <div className="mt-5 space-y-4 text-sm leading-relaxed opacity-90 sm:text-base">
                  {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
