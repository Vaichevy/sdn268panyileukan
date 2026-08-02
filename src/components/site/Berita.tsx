import { ArrowRight, Newspaper } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { formatDateID, type NewsItem } from "@/lib/cms";

export function Berita({ items }: { items: NewsItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="berita" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Berita & Pengumuman
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Informasi terbaru dari sekolah
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <article className="surface-card flex h-full gap-5 p-5">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="hidden h-32 w-32 shrink-0 rounded-2xl object-cover sm:block"
                  />
                ) : (
                  <span className="hidden h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground sm:flex">
                    <Newspaper className="h-7 w-7" />
                  </span>
                )}
                <div className="flex min-w-0 flex-col">
                  <p className="text-xs font-medium text-primary">
                    {formatDateID(item.published_at)}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                    {item.content}
                  </p>
                  <Link
                    to="/berita/$id"
                    params={{ id: item.id }}
                    className="mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                  >
                    Selengkapnya
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
