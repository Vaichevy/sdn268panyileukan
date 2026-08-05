import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** Cover image that auto-slides through all photos while the mouse hovers the card. */
export function HoverCoverSlider({
  images,
  alt,
  className,
  interval = 1200,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (!hover || images.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(id);
  }, [hover, images.length, interval]);

  useEffect(() => {
    if (!hover) setIndex(0);
  }, [hover]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          loading={i === 0 ? "eager" : "lazy"}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-500",
            i === index ? "opacity-100" : "absolute inset-0 opacity-0",
          )}
        />
      ))}
      {images.length > 1 ? (
        <span className="absolute right-2 bottom-2 flex gap-1 rounded-full bg-foreground/50 px-2 py-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === index ? "bg-background" : "bg-background/40",
              )}
            />
          ))}
        </span>
      ) : null}
    </div>
  );
}

/** Full slideshow with automatic playback plus manual prev/next and dot controls. */
export function PhotoCarousel({
  images,
  alt,
  className,
  interval = 3500,
  autoStart = true,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  autoStart?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoStart && images.length > 1);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || images.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(id);
  }, [playing, images.length, interval]);

  if (images.length === 0) return null;
  const go = (dir: number) => setIndex((i) => (i + dir + images.length) % images.length);

  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", className)}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt={alt}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700",
            i === index ? "opacity-100" : "absolute inset-0 opacity-0",
          )}
        />
      ))}

      {images.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow transition-transform hover:scale-110"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={() => go(1)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow transition-transform hover:scale-110"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-2">
            <button
              type="button"
              aria-label={playing ? "Hentikan slide otomatis" : "Putar slide otomatis"}
              onClick={() => setPlaying((p) => !p)}
              className="rounded-full bg-background/80 p-1.5 text-foreground shadow"
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <span className="flex gap-1.5 rounded-full bg-background/80 px-2.5 py-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Foto ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === index ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                />
              ))}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}