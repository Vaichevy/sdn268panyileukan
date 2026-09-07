import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  AppWindow,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseApps, useSiteSettings } from "@/lib/cms";
import logoAsset from "@/assets/logo-sdn268.png.asset.json";

const LINKS: { href?: string; to?: string; label: string }[] = [
  { href: "#beranda", label: "Beranda" },
  { href: "#profil", label: "Profil" },
  { href: "#sambutan", label: "Sambutan" },
  { href: "#galeri", label: "Galeri" },
  { href: "#berita", label: "Berita" },
  { href: "#kontak", label: "Kontak" },
];

type MenuItem = {
  href?: string;
  to?: string;
  label: string;
  description: string;
  icon: typeof AppWindow;
};

const KURIKULUM: MenuItem[] = [
  {
    href: "https://heyzine.com/flip-book/f62b91d864.html",
    label: "Buku Saku Kurikulum",
    description: "Flipbook buku saku KSP sekolah",
    icon: BookOpen,
  },
  {
    to: "/pembelajaran",
    label: "Pembelajaran",
    description: "Pengorganisasian belajar & fase",
    icon: GraduationCap,
  },
  {
    to: "/pembelajaran-penilaian",
    label: "Pembelajaran & Penilaian",
    description: "Alur rencana, asesmen & syarat lulus",
    icon: ClipboardCheck,
  },
  {
    to: "/evaluasi-kalender",
    label: "Evaluasi & Kalender",
    description: "Siklus evaluasi & kalender pendidikan",
    icon: CalendarDays,
  },
];


function DropdownMenu({
  label,
  items,
}: {
  label: string;
  items: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-full right-0 mt-2 w-64 rounded-2xl border border-border bg-card/95 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
        >
          {items.map((item) => {
            const body = (
              <>
                <item.icon className="mt-0.5 h-4 w-4 text-primary" />
                <span>
                  <span className="block text-sm font-semibold text-foreground">{item.label}</span>
                  <span className="block text-xs text-muted-foreground">{item.description}</span>
                </span>
              </>
            );
            const cls =
              "flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary";
            return item.to ? (
              <Link key={item.to} role="menuitem" to={item.to} onClick={() => setOpen(false)} className={cls}>
                {body}
              </Link>
            ) : (
              <a
                key={item.href}
                role="menuitem"
                href={item.href!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={cls}
              >
                {body}
              </a>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function SiteNav({ schoolName }: { schoolName: string }) {
  const { data: settings } = useSiteSettings();
  const APPS: MenuItem[] = parseApps((settings as { apps_items?: string } | null)?.apps_items).map(
    (app) => ({ href: app.href, label: app.label, description: app.description, icon: AppWindow }),
  );
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "backdrop-blur-xl" : "",
      )}
    >
      <div
        className={cn(
          "section-shell mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border px-4 py-2.5 transition-all duration-500 lg:flex lg:justify-between",
          scrolled
            ? "border-border bg-card/85 shadow-[var(--shadow-soft)]"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#beranda" className="flex min-w-0 items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo SDN 268 Panyileukan"
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />
          <span className="min-w-0 truncate font-display text-sm leading-tight font-semibold text-foreground sm:text-base lg:text-lg">
            {schoolName}
          </span>
        </a>


        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) =>
            link.to ? (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                {link.label}
              </Link>
            ) : (
            <a
              key={link.href}
              href={link.href!}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {link.label}
            </a>
            ),
          )}
          <Link
            to="/ppdb"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
          >
            PPDB
          </Link>
          <DropdownMenu label="Kurikulum" items={KURIKULUM} />
          <DropdownMenu label="Aplikasi" items={APPS} />
          <Link
            to="/admin"
            className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
          className="shrink-0 rounded-full border border-border bg-card p-2 text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="section-shell lg:hidden">
          <div className="mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-border bg-card/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            {LINKS.map((link) =>
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-3 text-center text-sm font-medium break-words text-foreground transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ) : (
              <a
                key={link.href}
                href={link.href!}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-3 py-3 text-center text-sm font-medium break-words text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
              ),
            )}
            </div>
            <Link
              to="/ppdb"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl bg-secondary/50 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              PPDB
            </Link>
            <div className="mt-1 rounded-2xl bg-secondary/50 p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Kurikulum
              </p>
              {KURIKULUM.map((item) =>
                item.to ? (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 rounded-xl px-2 py-2.5 text-sm font-medium break-words text-foreground transition-colors hover:bg-card"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.href}
                    href={item.href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-2 rounded-xl px-2 py-2.5 text-sm font-medium break-words text-foreground transition-colors hover:bg-card"
                  >
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item.label}
                  </a>
                ),
              )}
            </div>
            <div className="mt-1 rounded-2xl bg-secondary/50 p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Aplikasi
              </p>
              {APPS.map((app) => (
                <a
                  key={app.href}
                  href={app.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-2 rounded-xl px-2 py-2.5 text-sm font-medium break-words text-foreground transition-colors hover:bg-card"
                >
                  <app.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {app.label}
                </a>
              ))}
            </div>
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Panel Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
