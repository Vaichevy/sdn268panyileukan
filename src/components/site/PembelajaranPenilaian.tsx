import { Route as RouteIcon, ClipboardCheck, GraduationCap, CheckCircle2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteSettings } from "@/lib/cms";

const toList = (value: string | null | undefined) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•✔]\s*/, "").trim())
    .filter(Boolean);

const toPairs = (value: string | null | undefined) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean));

export function PembelajaranPenilaian() {
  const { data: settings } = useSiteSettings();

  const alur = toList(settings?.penilaian_alur);
  const asesmen = toPairs(settings?.penilaian_asesmen);
  const syarat = toList(settings?.penilaian_syarat);

  return (
    <section className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Kurikulum</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {settings?.penilaian_heading?.trim() || "Pembelajaran & Penilaian"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {settings?.penilaian_intro?.trim() || "Buku Saku KSP • SDN 268 Panyileukan"}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-card mt-10 p-7">
            <span className="gradient-hero inline-flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
              <RouteIcon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              {settings?.penilaian_alur_heading?.trim() || "Alur Rencana Pembelajaran"}
            </h2>
            {alur.length ? (
              <ol className="mt-5 flex flex-wrap items-center gap-3">
                {alur.map((item, i) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground">
                      {item}
                    </span>
                    {i < alur.length - 1 ? <span className="text-primary">→</span> : null}
                  </li>
                ))}
              </ol>
            ) : null}
            {settings?.penilaian_alur_note?.trim() ? (
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {settings.penilaian_alur_note}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal delay={140}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                {settings?.penilaian_asesmen_heading?.trim() || "Tiga Jenis Asesmen"}
              </h2>
              {asesmen.length ? (
                <ul className="mt-4 space-y-3 text-sm">
                  {asesmen.map((row, i) => (
                    <li key={i} className="rounded-2xl border border-border bg-card/60 p-4">
                      <p className="font-semibold text-primary">{row[0]}</p>
                      <p className="mt-1 text-muted-foreground">{row[1]}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <GraduationCap className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                {settings?.penilaian_syarat_heading?.trim() || "Syarat Naik Kelas & Lulus"}
              </h2>
              {syarat.length ? (
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  {syarat.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}