import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Reveal } from "./Reveal";
import { formatDateID, type GalleryItem } from "@/lib/cms";
import belajar from "@/assets/kegiatan-belajar.jpg";
import upacara from "@/assets/upacara-bendera.jpg";
import ekskul from "@/assets/kegiatan-ekstrakurikuler.jpg";

const FALLBACK: Array<Pick<GalleryItem, "id" | "title" | "description" | "image_url" | "event_date">> = [
  {
    id: "f1",
    title: "Upacara Bendera Senin",
    description: "Menumbuhkan disiplin dan cinta tanah air setiap awal pekan.",
    image_url: upacara,
    event_date: null,
  },
  {
    id: "f2",
    title: "Kegiatan Belajar di Kelas",
    description: "Pembelajaran aktif dan menyenangkan bersama guru kelas.",
    image_url: belajar,
    event_date: null,
  },
  {
    id: "f3",
    title: "Pentas Seni & Ekstrakurikuler",
    description: "Mengembangkan bakat siswa melalui seni, budaya, dan olahraga.",
    image_url: ekskul,
    event_date: null,
  },
];

export function Galeri({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const data = items.length > 0 ? items : FALLBACK;
  const selected = data.find((d) => d.id === active);

  return (
    <section id="galeri" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Galeri Kegiatan
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Momen penting warga sekolah
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Dokumentasi kegiatan pembelajaran, keagamaan, seni, dan olahraga di lingkungan sekolah.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <button
                type="button"
                onClick={() => setActive(item.id)}
                className="surface-card group block w-full overflow-hidden p-0 text-left"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  {item.event_date ? (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDateID(item.event_date)}
                    </p>
                  ) : null}
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.description ? (
                    <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-3xl bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  {selected.title}
                </h3>
                {selected.event_date ? (
                  <p className="text-sm text-muted-foreground">
                    {formatDateID(selected.event_date)}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Tutup"
                onClick={() => setActive(null)}
                className="rounded-full border border-border p-2 text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <img
              src={selected.image_url}
              alt={selected.title}
              className="mt-4 w-full rounded-2xl object-cover"
            />
            {selected.description ? (
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {selected.description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
