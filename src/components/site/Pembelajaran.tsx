import { Layers, Sparkles, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteSettings } from "@/lib/cms";

const DEFAULT_FASE = [
  ["A", "I–II", "Literasi & numerasi dasar"],
  ["B", "III–IV", "Perluasan konsep + IPAS mulai wajib"],
  ["C", "V–VI", "Pemantapan menuju jenjang berikutnya"],
];
const DEFAULT_DEEP = ["Berkesadaran", "Bermakna", "Menggembirakan"];
const DEFAULT_SIKLUS =
  "Siklus belajar 3M: Memahami → Mengaplikasikan → Merefleksikan";
const DEFAULT_DIMENSI = [
  "iman-takwa",
  "kewargaan",
  "penalaran kritis",
  "kreativitas",
  "kolaborasi",
  "kemandirian",
  "kesehatan",
  "komunikasi",
];
const DEFAULT_SESI =
  "18 rombel dengan 12 ruang kelas → pembelajaran dibagi Sesi Pagi & Sesi Siang, pukul 07.00–17.00 WIB. 1 JP = 35 menit.";

const toList = (value: string | null | undefined, fallback: string[]) => {
  const items = (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  return items.length ? items : fallback;
};

const toRows = (value: string | null | undefined) => {
  const rows = (value ?? "")
    .split("\n")
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .filter((cells) => cells.some(Boolean));
  return rows.length ? rows : DEFAULT_FASE;
};

export function Pembelajaran() {
  const { data: settings } = useSiteSettings();

  const fase = toRows(settings?.pembelajaran_fase);
  const deep = toList(settings?.pembelajaran_deep, DEFAULT_DEEP);
  const dimensi = toList(settings?.pembelajaran_dimensi, DEFAULT_DIMENSI);

  return (
    <section id="pembelajaran" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {settings?.pembelajaran_eyebrow?.trim() || "Pengorganisasian Belajar"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {settings?.pembelajaran_heading?.trim() || "Pembelajaran di SDN 268 Panyileukan"}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {settings?.pembelajaran_intro?.trim() || "Buku Saku KSP • SDN 268 Panyileukan"}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <div className="surface-card mt-10 p-7">
            <span className="gradient-hero inline-flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground">
              <Layers className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
              Tiga Fase Belajar (Kurikulum Merdeka)
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    <th className="py-2 pr-4">Fase</th>
                    <th className="py-2 pr-4">Kelas</th>
                    <th className="py-2">Fokus</th>
                  </tr>
                </thead>
                <tbody>
                  {fase.map((row, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="py-3 pr-4 font-semibold text-primary">{row[0]}</td>
                      <td className="py-3 pr-4 font-medium text-foreground">{row[1]}</td>
                      <td className="py-3 text-muted-foreground">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal delay={140}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Sparkles className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                Pembelajaran Mendalam (Deep Learning)
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {deep.map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {settings?.pembelajaran_siklus?.trim() || DEFAULT_SIKLUS}
              </p>
              <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                8 Dimensi Profil Lulusan
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {dimensi.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Clock className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                Sesi Belajar
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {settings?.pembelajaran_sesi?.trim() || DEFAULT_SESI}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}