import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Music2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTiktokCover } from "@/lib/tiktok-cover.functions";
import { tiktokPlayerUrl } from "@/lib/social-reels";

const PLAYER_ORIGIN = "https://www.tiktok.com";

export function TiktokReelPreview({ id, url, title, poster, suspended, onOpen }: {
  id: string; url: string; title: string; poster?: string | null;
  suspended: boolean; onOpen: () => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failedPoster, setFailedPoster] = useState<string | null>(null);
  const { data: autoPoster } = useQuery({
    queryKey: ["tiktok-cover", url],
    queryFn: () => getTiktokCover({ data: { url } }),
    enabled: visible && !poster,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    retry: false,
  });
  const cover = poster || autoPoster;
  const hasCover = Boolean(cover && cover !== failedPoster);
  const send = (type: "play" | "pause" | "mute" | "seekTo", value?: number) => {
    frame.current?.contentWindow?.postMessage({ type, value, "x-tiktok-player": true }, PLAYER_ORIGIN);
  };
  const stop = () => {
    hovering.current = false;
    send("pause");
    send("seekTo", 0);
    setPlaying(false);
  };

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
      if (!entry.isIntersecting) {
        hovering.current = false;
        frame.current?.contentWindow?.postMessage({ type: "pause", "x-tiktok-player": true }, PLAYER_ORIGIN);
        setPlaying(false);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!suspended) return;
    hovering.current = false;
    frame.current?.contentWindow?.postMessage({ type: "pause", "x-tiktok-player": true }, PLAYER_ORIGIN);
    setPlaying(false);
  }, [suspended]);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== PLAYER_ORIGIN || event.source !== frame.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object" || data["x-tiktok-player"] !== true) return;
      if (data.type === "onPlayerReady" && hovering.current) {
        frame.current?.contentWindow?.postMessage({ type: "mute", "x-tiktok-player": true }, PLAYER_ORIGIN);
        frame.current?.contentWindow?.postMessage({ type: "play", "x-tiktok-player": true }, PLAYER_ORIGIN);
      }
      if (data.type === "onStateChange") {
        setPlaying(hovering.current && data.value === 1);
        if (!hovering.current && data.value === 1) {
          frame.current?.contentWindow?.postMessage({ type: "pause", "x-tiktok-player": true }, PLAYER_ORIGIN);
        }
      }
      if (data.type === "onError" || data.type === "onPlayerError") setPlaying(false);
    };
    window.addEventListener("message", receive);
    const onVisibility = () => {
      if (document.hidden) {
        hovering.current = false;
        frame.current?.contentWindow?.postMessage({ type: "pause", "x-tiktok-player": true }, PLAYER_ORIGIN);
        setPlaying(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("message", receive);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={container} className="relative aspect-[9/14] w-full overflow-hidden bg-secondary">
      {(loaded || (visible && !hasCover)) && <iframe
        ref={frame}
        src={tiktokPlayerUrl(id, false, true)}
        title={`Cuplikan TikTok — ${title}`}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        tabIndex={-1}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full border-0"
      />}
      {hasCover && cover && !playing && <img src={cover} alt={title} loading="lazy"
        referrerPolicy="no-referrer" onError={() => setFailedPoster(cover)}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover" />}
      <Button variant="ghost" aria-label={`Putar ${title}`} onClick={() => { stop(); onOpen(); }}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse" || suspended || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          hovering.current = true;
          setLoaded(true);
          send("mute");
          send("play");
        }}
        onPointerLeave={stop}
        className="absolute inset-0 h-full w-full rounded-none p-0 hover:bg-transparent">
        {!playing && <span className="gradient-hero inline-flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg"><Play className="h-6 w-6" /></span>}
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-md bg-background/90 px-2 py-1 text-sm font-semibold text-foreground"><Music2 className="h-4 w-4" />TikTok</span>
      </Button>
    </div>
  );
}