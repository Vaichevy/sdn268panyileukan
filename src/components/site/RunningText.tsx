import { Megaphone } from "lucide-react";

/**
 * Modern marquee strip shown directly below the site header.
 * Content, visibility and speed are managed from the admin panel.
 */
export function RunningText({
  text,
  enabled = true,
  speed = 30,
}: {
  text?: string | null;
  enabled?: boolean | null;
  speed?: number | null;
}) {
  const value = (text ?? "").trim();
  if (!value || enabled === false) return null;

  const duration = Math.min(Math.max(Number(speed) || 30, 8), 120);
  const items = value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  const track = items.length ? items : [value];

  return (
    <div className="section-shell">
      <div className="relative z-30 overflow-hidden rounded-full border border-primary/25 bg-card/85 shadow-[var(--shadow-soft)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15" />


      <div className="flex items-center gap-3 py-2">
        <span className="ml-4 hidden shrink-0 items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm sm:inline-flex">
          <Megaphone className="h-3.5 w-3.5 animate-pulse" />
          Info
        </span>

        <div className="marquee-viewport group flex-1">
          <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="marquee-group" aria-hidden={copy === 1}>
                {track.map((item, i) => (
                  <span key={`${copy}-${i}`} className="marquee-item">
                    <span className="marquee-dot" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
