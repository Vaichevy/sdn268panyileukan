import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#profil", label: "Profil" },
  { href: "#sambutan", label: "Sambutan" },
  { href: "#galeri", label: "Galeri" },
  { href: "#berita", label: "Berita" },
  { href: "#kontak", label: "Kontak" },
];

export function SiteNav({ schoolName }: { schoolName: string }) {
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
          "section-shell mt-3 flex items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-500",
          scrolled
            ? "border-border bg-card/85 shadow-[var(--shadow-soft)]"
            : "border-transparent bg-transparent",
        )}
      >
        <a href="#beranda" className="flex items-center gap-3">
          <span className="gradient-hero flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="font-display text-base leading-tight font-semibold text-foreground sm:text-lg">
            {schoolName}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {link.label}
            </a>
          ))}
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
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {link.label}
              </a>
            ))}
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
