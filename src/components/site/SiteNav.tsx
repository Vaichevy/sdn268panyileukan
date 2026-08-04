import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShieldCheck, ChevronDown, Mail, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/logo-sdn268.png.asset.json";

const LINKS: { href?: string; to?: string; label: string }[] = [
  { href: "#beranda", label: "Beranda" },
  { href: "#profil", label: "Profil" },
  { href: "#sambutan", label: "Sambutan" },
  { to: "/pembelajaran", label: "Pembelajaran" },
  { href: "#galeri", label: "Galeri" },
  { href: "#berita", label: "Berita" },
  { href: "#kontak", label: "Kontak" },
];

const APPS: { href: string; label: string; description: string; icon: typeof Mail }[] = [
  {
    href: "https://surat268panyileukan.lovable.app",
    label: "Aplikasi Surat",
    description: "Pengelolaan surat masuk & keluar",
    icon: Mail,
  },
  {
    href: "https://perpustakaansdn268.lovable.app/",
    label: "Aplikasi Perpustakaan",
    description: "Katalog & peminjaman buku sekolah",
    icon: BookMarked,
  },
];

export function SiteNav({ schoolName }: { schoolName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) setAppsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
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
          "section-shell mt-3 flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500",
          scrolled
            ? "border-border bg-card/85 shadow-[var(--shadow-soft)]"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#beranda" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="Logo SDN 268 Panyileukan"
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <span className="font-display text-base leading-tight font-semibold text-foreground sm:text-lg">
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
          <div ref={appsRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={appsOpen}
              onClick={() => setAppsOpen((v) => !v)}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              Aplikasi
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", appsOpen && "rotate-180")}
              />
            </button>
            {appsOpen ? (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-card/95 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl"
              >
                {APPS.map((app) => (
                  <a
                    key={app.href}
                    role="menuitem"
                    href={app.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setAppsOpen(false)}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary"
                  >
                    <app.icon className="mt-0.5 h-4 w-4 text-primary" />
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {app.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {app.description}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            ) : null}
          </div>
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
          className="rounded-full border border-border bg-card p-2 text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="section-shell lg:hidden">
          <div className="mt-2 rounded-3xl border border-border bg-card/95 p-3 shadow-[var(--shadow-soft)] backdrop-blur-xl">
            {LINKS.map((link) =>
              link.to ? (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ) : (
              <a
                key={link.href}
                href={link.href!}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
              ),
            )}
            <div className="mt-1 rounded-2xl bg-secondary/50 p-2">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Aplikasi
              </p>
              {APPS.map((app) => (
                <a
                  key={app.href}
                  href={app.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-card"
                >
                  <app.icon className="h-4 w-4 text-primary" /> {app.label}
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
