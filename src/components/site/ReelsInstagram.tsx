import { useRef, useState } from "react";
import { ArrowRight, CalendarDays, Instagram, Play, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { formatDateID, instagramCode, sortReels, type ReelItem } from "@/lib/cms";

type ReelMedia = ReelItem & { video_url?: string | null; thumbnail_url?: string | null };

/** Card media: plays the uploaded clip muted on hover, falls back to the Instagram embed. */
function ReelMediaBox({ item, onOpen }: { item: ReelMedia; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const code = instagramCode(item.instagram_url);
  const video = item.video_url || "";
  const poster = item.thumbnail_url || "";

  if (video) {
    return (
      <button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => {
          setHover(true);
          void videoRef.current?.play().catch(() => undefined);
        }}
        onMouseLeave={() => {
          setHover(false);
          const v = videoRef.current;
          if (v) {
            v.pause();
            v.currentTime = 0;
          }
        }}
        className="relative block w-full overflow-hidden bg-secondary"
        style={{ aspectRatio: "9 / 14" }}
        aria-label={`Putar ${item.title}`}
      >
        <video
          ref={videoRef}
          src={video}
          poster={poster || undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
        {!hover ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="gradient-hero inline-flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg">
              <Play className="h-6 w-6 translate-x-[1px]" />
            </span>
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-secondary" style={{ aspectRatio: "9 / 14" }}>
      {code ? (
        <iframe
          src={`https://www.instagram.com/p/${code}/embed/captioned/`}
          title={item.title}
          loading="lazy"
          scrolling="no"
          allow="encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Tautan Instagram belum valid.
        </div>
      )}
    </div>
  );
}

function ReelCard({ item, onOpen }: { item: ReelMedia; onOpen: () => void }) {
  return (
    <article className="surface-card group overflow-hidden p-0">
      <ReelMediaBox item={item} onOpen={onOpen} />
      <div className="space-y-1.5 p-5">
        {item.event_date ? (
          <p className="flex items-center gap-1.5 text-xs font-medium text-primary">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDateID(item.event_date)}
          </p>
        ) : null}
        <h3 className="font-display text-lg font-semibold text-foreground">{item.title}</h3>
        {item.caption ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.caption}</p>
        ) : null}
        <a
          href={item.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary hover:underline"
        >
          <Instagram className="h-4 w-4" /> Lihat di Instagram
        </a>
      </div>
    </article>
  );
}


export function ReelsInstagram({ items, limit }: { items: ReelItem[]; limit?: number }) {
  const [active, setActive] = useState<string | null>(null);
  const all = sortReels(items) as ReelMedia[];
  const data = typeof limit === "number" ? all.slice(0, limit) : all;
  const selected = data.find((d) => d.id === active);

  if (all.length === 0) return null;

  return (
    <section id="reels" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Reels &amp; Stories
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Cerita terkini dari Instagram sekolah
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Postingan pilihan dari akun Instagram resmi SDN 268 Panyileukan Kota Bandung. Arahkan
            kursor untuk melihat cuplikan, klik untuk memutar penuh.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((item, index) => (
            <Reveal key={item.id} delay={index * 70}>
              <ReelCard item={item} onOpen={() => setActive(item.id)} />
            </Reveal>
          ))}
        </div>


        {typeof limit === "number" && all.length > limit ? (
          <div className="mt-10 flex justify-center">
            <Link
              to="/reels"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Selengkapnya
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>

      {selected?.video_url ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-sm overflow-auto rounded-3xl bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
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
            <video
              src={selected.video_url}
              poster={selected.thumbnail_url || undefined}
              controls
              autoPlay
              playsInline
              className="mt-4 w-full rounded-2xl bg-black"
              style={{ aspectRatio: "9 / 16" }}
            />
            {selected.caption ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {selected.caption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>

  );
}
