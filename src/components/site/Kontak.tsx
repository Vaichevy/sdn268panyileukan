import { Hash, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "./Reveal";
import type { SiteSettings } from "@/lib/cms";

export function Kontak({ settings }: { settings: SiteSettings | null }) {
  const rows = [
    { icon: MapPin, label: "Alamat", value: settings?.address },
    { icon: Hash, label: "NPSN", value: settings?.npsn },
    { icon: Phone, label: "Telepon", value: settings?.phone },
    { icon: Mail, label: "Email", value: settings?.email },
  ];

  return (
    <section id="kontak" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Lokasi & Kontak
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Kunjungi dan hubungi kami
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="surface-card h-full p-7">
              <ul className="space-y-5">
                {rows.map((row) => (
                  <li key={row.label} className="flex gap-4">
                    <span className="gradient-hero flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-primary-foreground">
                      <row.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        {row.label}
                      </p>
                      <p className="mt-0.5 text-sm leading-relaxed text-foreground">{row.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="surface-card overflow-hidden p-2">
              <iframe
                title="Peta lokasi SDN 268 Panyileukan"
                src={settings?.maps_embed_url}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[420px] w-full rounded-[1.4rem] border-0"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
