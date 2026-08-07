import { RefreshCw, Users, CalendarDays } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteSettings } from "@/lib/cms";

const toList = (value: string | null | undefined) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

const toPairs = (value: string | null | undefined) =>
  (value ?? "")
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean));

export function EvaluasiKalender() {
  const { data: settings } = useSiteSettings();

  const siklus = toList(settings?.evaluasi_siklus);
  const kalender = toPairs(settings?.evaluasi_kalender);

  return (
    <section className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Kurikulum</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {settings?.evaluasi_heading?.trim() || "Evaluasi & Kalender"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {settings?.evaluasi_intro?.trim() || "Bab V Buku Saku KSP • SDN 268 Panyileukan"}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal delay={80}>
            <div className="surface-card h-full p-7">
              <span className="gradient-hero inline-flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
                <RefreshCw className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                {settings?.evaluasi_siklus_heading?.trim() || "Siklus Evaluasi Kurikulum"}
              </h2>
              {siklus.length ? (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {siklus.map((item) => (
                    <span
                      key={item}
                      className="rounded-xl border border-border bg-card/60 px-3 py-2.5 text-sm font-medium text-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Users className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                {settings?.evaluasi_pendampingan_heading?.trim() || "Pendampingan Guru"}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {settings?.evaluasi_pendampingan?.trim()}
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <div className="surface-card mt-6 p-7">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <CalendarDays className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              {settings?.evaluasi_kalender_heading?.trim() || "Kalender Pendidikan"}
            </h2>
            {kalender.length ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      <th className="py-2 pr-4">Kegiatan</th>
                      <th className="py-2">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kalender.map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-3 pr-4 font-medium text-foreground">{row[0]}</td>
                        <td className="py-3 text-muted-foreground">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {settings?.evaluasi_kalender_note?.trim() ? (
              <p className="mt-5 text-sm font-medium text-primary">
                {settings.evaluasi_kalender_note}
              </p>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}