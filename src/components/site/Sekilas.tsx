import { Users, GraduationCap, Trees, Building2 } from "lucide-react";
import { Reveal } from "./Reveal";
import { useSiteSettings } from "@/lib/cms";

const DEFAULT_MURID =
  "Latar belakang keluarga beragam secara ekonomi & sosial — pekerja formal (UMR–subprofesional) 62,77%, profesional/wirausaha 12,77%, sektor informal 12,77%, keluarga prasejahtera 11,70%. Mayoritas beragama Islam (99%). Minat dan bakat murid sangat beragam: akademik, seni, olahraga, hingga IT.";
const DEFAULT_PTK =
  "25 guru (termasuk Kepala Sekolah) dan 7 tenaga kependidikan. Terdiri atas PNS, PPPK, dan Guru Honor — mayoritas berkualifikasi S-1, sebagian S-2, dan bersertifikat pendidik.";
const DEFAULT_LINGKUNGAN = [
  "Lokasi strategis: dekat kelurahan, Puskesmas, terminal, stasiun, GBLA, tempat ibadah, dan pasar.",
  "Kawasan Tanpa Rokok (KTR) & Rumah Mijel (daur ulang minyak jelantah).",
  "Masyarakat Sunda yang menjunjung gotong royong dan kepedulian lingkungan.",
];
const DEFAULT_SARANA = [
  "Lab Komputer",
  "Perpustakaan",
  "Ruang Multimedia",
  "Mushola",
  "UKS",
  "14 CCTV",
];

const toList = (value: string | null | undefined, fallback: string[]) => {
  const items = (value ?? "")
    .split("\n")
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
  return items.length ? items : fallback;
};

export function Sekilas() {
  const { data: settings } = useSiteSettings();

  const cards = [
    {
      icon: Users,
      title: "Karakteristik Murid",
      body: settings?.sekilas_murid?.trim() || DEFAULT_MURID,
    },
    {
      icon: GraduationCap,
      title: "Pendidik & Tenaga Kependidikan",
      body: settings?.sekilas_ptk?.trim() || DEFAULT_PTK,
    },
  ];
  const lingkungan = toList(settings?.sekilas_lingkungan, DEFAULT_LINGKUNGAN);
  const sarana = toList(settings?.sekilas_sarana, DEFAULT_SARANA);

  return (
    <section id="sekilas" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            {settings?.sekilas_eyebrow?.trim() || "Sekilas Tentang Kami"}
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            {settings?.sekilas_heading?.trim() || "Potret singkat warga dan lingkungan sekolah"}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80}>
              <div className="surface-card flex h-full items-start gap-4 p-7">
                <span className="gradient-hero inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-primary-foreground">
                  <card.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Reveal delay={160}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                <Trees className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Sosial Budaya & Lingkungan
              </h3>
              <ul className="mt-3 space-y-2.5">
                {lingkungan.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="surface-card h-full p-7">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                <Building2 className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                Sarana & Prasarana
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {sarana.map((item) => (
                  <span
                    key={item}
                    className="rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}