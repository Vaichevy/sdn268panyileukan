import type { CSSProperties } from "react";

export type ImageEffect = {
  tone?: "none" | "white" | "black";
  toneType?: "horizontal" | "vertical" | "radial" | "solid";
  toneReverse?: boolean;
  toneOpacity?: number; // 0-100
  toneX?: number; // radial center %
  toneY?: number;
  grad?: boolean;
  gradType?: "horizontal" | "vertical" | "radial";
  gradFrom?: string;
  gradTo?: string;
  gradOpacity?: number;
  gradX?: number;
  gradY?: number;
};

const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

function build(type: string, from: string, to: string, x: number, y: number, reverse = false) {
  const [a, b] = reverse ? [to, from] : [from, to];
  if (type === "solid") return a;
  if (type === "radial") return `radial-gradient(circle at ${x}% ${y}%, ${b} 0%, ${a} 100%)`;
  return `linear-gradient(${type === "vertical" ? "to bottom" : "to right"}, ${a}, ${b})`;
}

export function effectLayers(e: ImageEffect | null | undefined): CSSProperties[] {
  const out: CSSProperties[] = [];
  if (!e) return out;
  if (e.tone && e.tone !== "none") {
    const c = e.tone === "white" ? "#ffffff" : "#000000";
    out.push({
      background: build(e.toneType ?? "vertical", hexA(c, 1), hexA(c, 0), e.toneX ?? 50, e.toneY ?? 50, e.toneReverse),
      opacity: (e.toneOpacity ?? 50) / 100,
    });
  }
  if (e.grad) {
    out.push({
      background: build(e.gradType ?? "horizontal", e.gradFrom ?? "#1d4ed8", e.gradTo ?? "#f59e0b", e.gradX ?? 50, e.gradY ?? 50),
      opacity: (e.gradOpacity ?? 40) / 100,
    });
  }
  return out;
}

export function ImageEffectOverlay({ effect, className = "" }: { effect?: ImageEffect | null; className?: string }) {
  return (
    <>
      {effectLayers(effect).map((s, i) => (
        <div key={i} aria-hidden className={`pointer-events-none absolute inset-0 ${className}`} style={s} />
      ))}
    </>
  );
}

export function ImageEffectEditor({ value, onChange }: { value: ImageEffect | null | undefined; onChange: (v: ImageEffect) => void }) {
  const e = value ?? {};
  const up = (p: Partial<ImageEffect>) => onChange({ ...e, ...p });
  const sel = "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm";
  const range = (label: string, val: number, k: keyof ImageEffect) => (
    <label className="block text-sm">
      <span className="flex justify-between text-muted-foreground">
        {label} <b className="text-foreground">{val}%</b>
      </span>
      <input type="range" min={0} max={100} value={val} onChange={(ev) => up({ [k]: Number(ev.target.value) })} className="w-full accent-[var(--primary)]" />
    </label>
  );
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold">Efek Tilt Putih / Hitam</p>
        <div className="grid grid-cols-2 gap-2">
          <select className={sel} value={e.tone ?? "none"} onChange={(ev) => up({ tone: ev.target.value as ImageEffect["tone"] })}>
            <option value="none">Tanpa efek</option>
            <option value="white">Putih</option>
            <option value="black">Hitam</option>
          </select>
          <select className={sel} value={e.toneType ?? "vertical"} onChange={(ev) => up({ toneType: ev.target.value as ImageEffect["toneType"] })}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertikal</option>
            <option value="radial">Radial</option>
            <option value="solid">Rata (penuh)</option>
          </select>
        </div>
        {e.tone && e.tone !== "none" ? (
          <>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!e.toneReverse} onChange={(ev) => up({ toneReverse: ev.target.checked })} />
              Balik arah
            </label>
            {range("Intensitas", e.toneOpacity ?? 50, "toneOpacity")}
            {e.toneType === "radial" ? (
              <>
                {range("Posisi radial horizontal", e.toneX ?? 50, "toneX")}
                {range("Posisi radial vertikal", e.toneY ?? 50, "toneY")}
              </>
            ) : null}
          </>
        ) : null}
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={!!e.grad} onChange={(ev) => up({ grad: ev.target.checked })} />
          Efek Gradasi Warna
        </label>
        {e.grad ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <select className={sel} value={e.gradType ?? "horizontal"} onChange={(ev) => up({ gradType: ev.target.value as ImageEffect["gradType"] })}>
                <option value="horizontal">Horizontal</option>
                <option value="vertical">Vertikal</option>
                <option value="radial">Radial</option>
              </select>
              <input type="color" aria-label="Warna awal" value={e.gradFrom ?? "#1d4ed8"} onChange={(ev) => up({ gradFrom: ev.target.value })} className="h-9 w-full rounded-lg border border-border" />
              <input type="color" aria-label="Warna akhir" value={e.gradTo ?? "#f59e0b"} onChange={(ev) => up({ gradTo: ev.target.value })} className="h-9 w-full rounded-lg border border-border" />
            </div>
            {range("Intensitas", e.gradOpacity ?? 40, "gradOpacity")}
            {e.gradType === "radial" ? (
              <>
                {range("Posisi radial horizontal", e.gradX ?? 50, "gradX")}
                {range("Posisi radial vertikal", e.gradY ?? 50, "gradY")}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
