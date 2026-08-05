import { Link } from "@tanstack/react-router";
import { GraduationCap, Instagram } from "lucide-react";
import type { SiteSettings } from "@/lib/cms";

export function SiteFooter({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="mt-10 border-t border-border bg-card/60 py-12 backdrop-blur">
      <div className="section-shell grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="gradient-hero flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-foreground">
              {settings?.school_name}
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{settings?.address}</p>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Kontak</p>
          <p className="mt-3">NPSN {settings?.npsn}</p>
          <p>{settings?.phone}</p>
          <p>{settings?.email}</p>
          <a
            href="https://www.instagram.com/bdg.sdn268panyileukan/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <span className="gradient-hero flex h-8 w-8 items-center justify-center rounded-xl text-primary-foreground">
              <Instagram className="h-4 w-4" />
            </span>
            @bdg.sdn268panyileukan
          </a>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Tautan</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link to="/" className="hover:text-primary">
              Beranda
            </Link>
            <Link to="/" hash="profil" className="hover:text-primary">
              Profil Sekolah
            </Link>
            <Link to="/pembelajaran" className="hover:text-primary">
              Pembelajaran
            </Link>
            <Link to="/galeri" className="hover:text-primary">
              Galeri Kegiatan
            </Link>
            <Link to="/berita" className="hover:text-primary">
              Arsip Berita
            </Link>
            <Link to="/" hash="kontak" className="hover:text-primary">
              Kontak
            </Link>
            <Link to="/admin" className="hover:text-primary">
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
        © Cepi Kunaefi - {new Date().getFullYear()} {settings?.school_name}. Seluruh hak cipta
        dilindungi.
      </div>
    </footer>
  );
}
