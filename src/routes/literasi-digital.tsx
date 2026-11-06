import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { RunningText } from "@/components/site/RunningText";
import { SiteFooter } from "@/components/site/SiteFooter";
import { useSiteSettings, FALLBACK_SETTINGS } from "@/lib/cms";
import { getLiterasiBooks, type LiterasiBook } from "@/lib/literasi.functions";

export const Route = createFileRoute("/literasi-digital")({
  head: () => ({
    meta: [
      { title: "Literasi Digital — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Rak buku digital (FlipHTML5) SDN 268 Panyileukan Kota Bandung: koleksi bacaan dan literasi digital untuk warga sekolah.",
      },
      { property: "og:title", content: "Literasi Digital — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content:
          "Rak buku digital SDN 268 Panyileukan: koleksi bacaan dan literasi digital untuk murid dan guru.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LiterasiDigitalPage,
});

function LiterasiDigitalPage() {
  const { data: settings } = useSiteSettings();
  const value = settings ?? (FALLBACK_SETTINGS as never);
  const heading =
    settings?.literasi_digital_heading?.trim() || "Literasi Digital";
  const embedUrl =
    settings?.literasi_digital_url?.trim() ||
    "https://fliphtml5.com/bookcase/blozj/";

  const [active, setActive] = useState<LiterasiBook | null>(null);

  const booksQuery = useQuery({
    queryKey: ["literasi-books", embedUrl],
    queryFn: () => getLiterasiBooks({ data: embedUrl }),
    staleTime: 1000 * 60 * 30,
  });

  const books = booksQuery.data?.books ?? [];

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <div className="sticky top-0 z-40">
        <RunningText
          text={(value as { running_text?: string | null })?.running_text}
          enabled={(value as { running_text_enabled?: boolean | null })?.running_text_enabled}
          speed={(value as { running_text_speed?: number | null })?.running_text_speed}
        />
      </div>
      <main className="pt-12">
        <div className="section-shell">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </a>
          <div className="mt-4 mb-6 flex flex-wrap items-end justify-between gap-3">
            <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">
              {heading}
            </h1>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" /> Buka rak buku di tab baru
            </a>
          </div>

          {booksQuery.isPending ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card/60 text-muted-foreground backdrop-blur-xl">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Memuat daftar buku…</p>
            </div>
          ) : books.length === 0 ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-card/60 p-6 text-center backdrop-blur-xl">
              <BookOpen className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Daftar buku tidak dapat dimuat saat ini. Coba lagi nanti atau
                buka rak buku lengkap di tab baru.
              </p>
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                <ExternalLink className="h-4 w-4" /> Buka di tab baru
              </a>
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-muted-foreground">
                {books.length} buku bacaan — klik sampul untuk membaca langsung
                di halaman ini.
              </p>
              <ul className="mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
                {books.map((book) => (
                  <li key={book.url}>
                    <button
                      type="button"
                      onClick={() => setActive(book)}
                      className="group block w-full text-left focus-visible:outline-none"
                      aria-label={`Baca ${book.title}`}
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-lift)] group-active:scale-[0.98]">
                        <img
                          src={book.cover}
                          alt={`Sampul buku ${book.title}`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[3/4] w-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <BookOpen className="h-3.5 w-3.5" /> Baca buku
                        </div>
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
                        {book.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {book.pages > 0 ? `${book.pages} halaman` : "Buku cerita"}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>

      <Dialog open={Boolean(active)} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="media-dialog flex h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-2xl border-border/70 bg-card p-0 shadow-2xl sm:w-[calc(100%-2rem)]">
          <div className="flex items-start justify-between gap-3 border-b border-border/60 py-3 pl-4 pr-14">
            <div className="min-w-0">
              <DialogTitle className="truncate font-display text-lg leading-snug text-foreground">
                {active?.title ?? "Buku"}
              </DialogTitle>
              <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                {active && active.pages > 0
                  ? `${active.pages} halaman — gunakan tombol di dalam buku untuk membalik halaman`
                  : "Gunakan tombol di dalam buku untuk membalik halaman"}
              </DialogDescription>
            </div>
            {active && (
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Buka di tab baru
              </a>
            )}
          </div>
          {active && (
            <iframe
              key={active.url}
              src={active.url}
              title={`Pembaca buku ${active.title}`}
              className="min-h-0 w-full flex-1 border-0 bg-white"
              allow="fullscreen"
              allowFullScreen
            />
          )}
        </DialogContent>
      </Dialog>

      <SiteFooter settings={value} />
    </div>
  );
}
