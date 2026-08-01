import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { formatDateID, useTestimonials } from "@/lib/cms";

const TALLY_FORM_ID = "44R6lO";

function Stars({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`Rating ${value} dari 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= value ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground/40"
          }
        />
      ))}
    </span>
  );
}

export function Komentar() {
  const qc = useQueryClient();
  const { data: items } = useTestimonials();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      if (!event.data.includes("Tally.FormSubmitted")) return;
      toast.success("Terima kasih! Komentar Anda akan tampil setelah diverifikasi admin.");
      void qc.invalidateQueries({ queryKey: ["testimonials"] });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [qc]);

  const list = items ?? [];
  const average =
    list.length > 0 ? list.reduce((sum, i) => sum + i.rating, 0) / list.length : 0;

  return (
    <section id="komentar" className="pb-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Komentar & Penilaian
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Sampaikan kesan dan penilaian Anda
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Isi formulir di bawah untuk memberi rating bintang dan komentar. Komentar tampil di
            halaman ini setelah diverifikasi admin sekolah.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="surface-card overflow-hidden p-2">
              <iframe
                title="Formulir komentar dan rating SDN 268 Panyileukan"
                src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                loading="lazy"
                className="h-[560px] w-full rounded-[1.4rem] border-0"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="surface-card h-full p-7">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Komentar Terverifikasi
                </h3>
                {list.length > 0 ? (
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Stars value={Math.round(average)} />
                    {average.toFixed(1)}
                  </span>
                ) : null}
              </div>

              {list.length === 0 ? (
                <p className="mt-6 text-sm text-muted-foreground">
                  Belum ada komentar yang ditampilkan. Jadilah yang pertama mengisi formulir.
                </p>
              ) : (
                <ul className="mt-6 space-y-5">
                  {list.map((item) => (
                    <li key={item.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-foreground">{item.name}</p>
                        <Stars value={item.rating} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {item.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatDateID(item.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
