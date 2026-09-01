import { useRef, useState } from "react";
import { ArrowRight, CalendarDays, Play, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { formatDateID, sortVideos, youtubeId, youtubeThumb, type VideoItem } from "@/lib/cms";

function posterOf(item: VideoItem) {
  if (item.thumbnail_url) return item.thumbnail_url;
  const yid = youtubeId(item.youtube_url);
  return yid ? youtubeThumb(yid) : null;
}

/** Card media: shows a poster, and plays a muted clip preview on mouse over. */
function VideoPreview({ item }: { item: VideoItem }) {
  const [hover, setHover] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const yid = youtubeId(item.youtube_url);
  const poster = posterOf(item);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden bg-secondary"
      onMouseEnter={() => {
        setHover(true);
        const v = videoRef.current;
        if (v) void v.play().catch(() => undefined);
      }}
      onMouseLeave={() => {
        setHover(false);
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.currentTime = 0;
        }
      }}
    >
      {item.video_url ? (
        <video
          ref={videoRef}
          src={item.video_url}
          poster={poster ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : hover && yid ? (
        <iframe
          src={`https://www.youtube.com/embed/${yid}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yid}&modestbranding=1&rel=0`}
          title={item.title}
          allow="autoplay; encrypted-media; picture-in-picture"
          className="pointer-events-none h-full w-full"
        />
      ) : poster ? (
        <img
          src={poster}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : null}

      {!hover ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="gradient-hero inline-flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg">
            <Play className="h-6 w-6 translate-x-[1px]" />
          </span>
        </span>
      ) : null}
    </div>
  );
}

function VideoPlayer({ item }: { item: VideoItem }) {
  const yid = youtubeId(item.youtube_url);
  if (item.video_url) {
    return (
      <video
        src={item.video_url}
        poster={posterOf(item) ?? undefined}
        controls
        autoPlay
        className="aspect-video w-full rounded-2xl bg-black"
      />
    );
  }
  if (yid) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${yid}?autoplay=1&rel=0`}
        title={item.title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full rounded-2xl bg-black"
      />
    );
  }
  return null;
}

export function GaleriVideo({ items, limit }: { items: VideoItem[]; limit?: number }) {
  const [active, setActive] = useState<string | null>(null);
  const all = sortVideos(items);
  const data = typeof limit === "number" ? all.slice(0, limit) : all;
  const selected = data.find((d) => d.id === active);

  if (all.length === 0) return null;

  return (
    <section id="video" className="py-20">
      <div className="section-shell">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Galeri Video
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Cuplikan kegiatan sekolah
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Arahkan kursor ke kartu untuk memutar cuplikan, klik untuk menonton video penuh.
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
                <VideoPreview item={item} />
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

        {typeof limit === "number" && all.length > limit ? (
          <div className="mt-10 flex justify-center">
            <Link
              to="/video"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Selengkapnya
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
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
            <div className="mt-4">
              <VideoPlayer item={selected} />
            </div>
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
