import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CalendarDays, Search } from "lucide-react";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { SiteFooter } from "@/components/site/SiteFooter";
import {
  formatDateID,
  groupNewsByMonth,
  useNews,
  useSiteSettings,
  FALLBACK_SETTINGS,
} from "@/lib/cms";

export const Route = createFileRoute("/berita/")({
  head: () => ({
    meta: [
      { title: "Arsip Berita — SDN 268 Panyileukan" },
      {
        name: "description",
        content:
          "Arsip lengkap berita dan pengumuman SDN 268 Panyileukan, dikelompokkan per bulan dan tahun serta dapat dicari.",
      },
      { property: "og:title", content: "Arsip Berita — SDN 268 Panyileukan" },
      {
        property: "og:description",
        content: "Telusuri seluruh berita dan pengumuman sekolah per bulan dan tahun.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArsipBerita,
});

function ArsipBerita() {
  const { data: settings } = useSiteSettings();
  const { data: news } = useNews();
  const value = settings ?? (FALLBACK_SETTINGS as never);

  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("all");

  const groups = useMemo(() => groupNewsByMonth(news ?? []), [news]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .filter((g) => month === "all" || g.key === month)
      .map((g) => ({
        ...g,
        items: g.items.filter(
          (i) =>
            !q ||
            i.title.toLowerCase().includes(q) ||
            (i.content ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, month, query]);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <main className="py-12">
        <div className="section-shell">
          <Link
            to="/"
            hash="berita"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
          </Link>

          <h1 className="mt-6 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            Arsip Berita & Pengumuman
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Cari berita berdasarkan kata kunci atau pilih arsip bulan dan tahun.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="surface-card flex flex-1 items-center gap-2 px-4 py-3">
              <Search className="h-4 w-4 text-primary" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari judul atau isi berita…"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Cari berita"
              />
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              aria-label="Pilih arsip bulan"
              className="surface-card px-4 py-3 text-sm text-foreground"
            >
              <option value="all">Semua bulan</option>
              {groups.map((g) => (
                <option key={g.key} value={g.key}>
                  {g.label} ({g.items.length})
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              Tidak ada berita yang cocok dengan pencarian Anda.
            </p>
          ) : (
            <div className="mt-10 space-y-10">
              {filtered.map((group) => (
                <section key={group.key}>
                  <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                    <CalendarDays className="h-5 w-5 text-primary" />
                    {group.label}
                  </h2>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    {group.items.map((item) => (
                      <article key={item.id} className="surface-card p-5">
                        <p className="text-xs font-medium text-primary">
                          {formatDateID(item.published_at)}
                        </p>
                        <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {item.content}
                        </p>
                        <Link
                          to="/berita/$id"
                          params={{ id: item.id }}
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent"
                        >
                          Selengkapnya
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter settings={value} />
    </div>
  );
}