import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import {
  formatDateID,
  useAllTestimonials,
  useGallery,
  useNews,
  useSiteSettings,
  uploadMedia,
  mediaList,
  type SiteSettings,
} from "@/lib/cms";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { PhotoCarousel } from "@/components/site/PhotoSlider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — SDN 268 Panyileukan" },
      { name: "description", content: "Kelola konten website SDN 268 Panyileukan." },
      { property: "og:title", content: "Panel Admin — SDN 268 Panyileukan" },
      { property: "og:description", content: "Kelola konten website sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function UploadButton({
  label,
  folder,
  onDone,
}: {
  label: string;
  folder: string;
  onDone: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      {label}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={busy}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          setBusy(true);
          try {
            onDone(await uploadMedia(file, folder));
            toast.success("Foto berhasil diunggah");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal mengunggah foto");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}

function MultiUploadButton({
  label,
  folder,
  onDone,
}: {
  label: string;
  folder: string;
  onDone: (urls: string[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      {label}
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={busy}
        onChange={async (e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length === 0) return;
          setBusy(true);
          try {
            const urls: string[] = [];
            for (const file of files) urls.push(await uploadMedia(file, folder));
            onDone(urls);
            toast.success(`${urls.length} foto berhasil diunggah`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal mengunggah foto");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}

function PhotoStrip({
  urls,
  onRemove,
  onCover,
}: {
  urls: string[];
  onRemove: (url: string) => void;
  onCover?: (url: string) => void;
}) {
  if (urls.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((url, i) => (
        <div key={`${url}-${i}`} className="relative">
          <img src={url} alt={`Foto ${i + 1}`} className="h-16 w-24 rounded-xl object-cover" />
          {i === 0 ? (
            <span className="absolute bottom-1 left-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
              Cover
            </span>
          ) : onCover ? (
            <button
              type="button"
              onClick={() => onCover(url)}
              className="absolute bottom-1 left-1 rounded-full bg-card/90 px-1.5 py-0.5 text-[10px] font-semibold text-foreground"
            >
              Jadikan cover
            </button>
          ) : null}
          <button
            type="button"
            aria-label="Hapus foto"
            onClick={() => onRemove(url)}
            className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive p-1 text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {textarea ? (
        <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAdmin, loading: roleLoading } = useAdmin();
  const { data: settings } = useSiteSettings();
  const { data: gallery } = useGallery();
  const { data: news } = useNews();

  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const set = (key: keyof SiteSettings, value: string) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const saveSettings = async () => {
    if (!form) return;
    setSaving(true);
    const { id, created_at, updated_at, ...payload } = form;
    void created_at;
    void updated_at;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Perubahan tersimpan");
    void qc.invalidateQueries({ queryKey: ["site_settings"] });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (roleLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <AnimatedBackground />
        <div className="surface-card max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-foreground">Akses ditolak</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Akun ini belum memiliki hak admin. Hubungi pengelola website sekolah.
          </p>
          <Button className="mt-6" onClick={signOut}>
            Keluar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-20">
      <AnimatedBackground />
      <div className="section-shell pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" /> Lihat website
            </Link>
            <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
              Panel Admin Sekolah
            </h1>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4" /> Keluar
          </Button>
        </div>

        <Tabs defaultValue="identitas" className="mt-8">
          <TabsList>
            <TabsTrigger value="identitas">Identitas & Profil</TabsTrigger>
            <TabsTrigger value="pembelajaran">Pembelajaran</TabsTrigger>
            <TabsTrigger value="galeri">Galeri Kegiatan</TabsTrigger>
            <TabsTrigger value="berita">Berita</TabsTrigger>
            <TabsTrigger value="komentar">Komentar</TabsTrigger>
          </TabsList>

          <TabsContent value="identitas" className="mt-6">
            {form ? (
              <div className="space-y-6">
                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Header & Identitas</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nama Sekolah (judul header)"
                      value={form.school_name}
                      onChange={(v) => set("school_name", v)}
                    />
                    <Field label="Tagline" value={form.tagline} onChange={(v) => set("tagline", v)} />
                  </div>
                  <Field
                    label="Alamat"
                    textarea
                    rows={3}
                    value={form.address}
                    onChange={(v) => set("address", v)}
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="NPSN" value={form.npsn} onChange={(v) => set("npsn", v)} />
                    <Field label="Telepon" value={form.phone} onChange={(v) => set("phone", v)} />
                    <Field label="Email" value={form.email} onChange={(v) => set("email", v)} />
                  </div>
                  <Field
                    label="URL Embed Google Maps"
                    value={form.maps_embed_url}
                    onChange={(v) => set("maps_embed_url", v)}
                    hint="Gunakan tautan embed dari Google Maps (Bagikan → Sematkan peta → salin URL di dalam src)."
                  />
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Field
                      label="Jumlah Siswa"
                      value={form.stat_students}
                      onChange={(v) => set("stat_students", v)}
                    />
                    <Field
                      label="Jumlah Guru"
                      value={form.stat_teachers}
                      onChange={(v) => set("stat_teachers", v)}
                    />
                    <Field
                      label="Ruang Kelas"
                      value={form.stat_classrooms}
                      onChange={(v) => set("stat_classrooms", v)}
                    />
                    <Field
                      label="Akreditasi"
                      value={form.stat_accreditation}
                      onChange={(v) => set("stat_accreditation", v)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <UploadButton
                      label="Ganti Foto Hero"
                      folder="hero"
                      onDone={(url) => set("hero_image_url", url)}
                    />
                    {form.hero_image_url ? (
                      <img
                        src={form.hero_image_url}
                        alt="Pratinjau hero"
                        className="h-16 w-24 rounded-xl object-cover"
                      />
                    ) : null}
                  </div>
                </section>

                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Profil Sekolah</h2>
                  <Field
                    label="Tentang Sekolah"
                    textarea
                    value={form.about_text}
                    onChange={(v) => set("about_text", v)}
                  />
                  <Field
                    label="Visi"
                    textarea
                    rows={3}
                    value={form.vision}
                    onChange={(v) => set("vision", v)}
                  />
                  <Field
                    label="Misi"
                    textarea
                    rows={6}
                    value={form.mission}
                    onChange={(v) => set("mission", v)}
                    hint="Satu baris = satu poin misi."
                  />
                </section>

                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Kepala Sekolah</h2>
                </section>

                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Sekilas Tentang Kami</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Label Kecil"
                      value={form.sekilas_eyebrow}
                      onChange={(v) => set("sekilas_eyebrow", v)}
                    />
                    <Field
                      label="Judul Bagian"
                      value={form.sekilas_heading}
                      onChange={(v) => set("sekilas_heading", v)}
                    />
                  </div>
                  <Field
                    label="Karakteristik Murid"
                    textarea
                    rows={5}
                    value={form.sekilas_murid}
                    onChange={(v) => set("sekilas_murid", v)}
                  />
                  <Field
                    label="Pendidik & Tenaga Kependidikan"
                    textarea
                    rows={4}
                    value={form.sekilas_ptk}
                    onChange={(v) => set("sekilas_ptk", v)}
                  />
                  <Field
                    label="Sosial Budaya & Lingkungan"
                    textarea
                    rows={5}
                    value={form.sekilas_lingkungan}
                    onChange={(v) => set("sekilas_lingkungan", v)}
                    hint="Satu baris = satu poin."
                  />
                  <Field
                    label="Sarana & Prasarana"
                    textarea
                    rows={6}
                    value={form.sekilas_sarana}
                    onChange={(v) => set("sekilas_sarana", v)}
                    hint="Satu baris = satu sarana."
                  />
                </section>

                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Kepala Sekolah</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Nama Kepala Sekolah"
                      value={form.headmaster_name}
                      onChange={(v) => set("headmaster_name", v)}
                    />
                    <Field
                      label="Jabatan"
                      value={form.headmaster_title}
                      onChange={(v) => set("headmaster_title", v)}
                    />
                  </div>
                  <Field
                    label="Pidato / Sambutan Pembukaan"
                    textarea
                    rows={10}
                    value={form.headmaster_speech}
                    onChange={(v) => set("headmaster_speech", v)}
                    hint="Pisahkan paragraf dengan baris baru."
                  />
                  <div className="flex flex-wrap items-center gap-3">
                    <UploadButton
                      label="Unggah Foto Kepala Sekolah"
                      folder="kepala-sekolah"
                      onDone={(url) => set("headmaster_photo_url", url)}
                    />
                    {form.headmaster_photo_url ? (
                      <img
                        src={form.headmaster_photo_url}
                        alt="Pratinjau kepala sekolah"
                        className="h-20 w-16 rounded-xl object-cover"
                      />
                    ) : null}
                  </div>
                </section>

                <Button onClick={saveSettings} disabled={saving} size="lg">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </TabsContent>

          <TabsContent value="pembelajaran" className="mt-6">
            {form ? (
              <div className="space-y-6">
                <section className="surface-card space-y-4 p-6">
                  <h2 className="font-display text-xl font-semibold">Halaman Pembelajaran</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Label Kecil"
                      value={form.pembelajaran_eyebrow}
                      onChange={(v) => set("pembelajaran_eyebrow", v)}
                    />
                    <Field
                      label="Judul Halaman"
                      value={form.pembelajaran_heading}
                      onChange={(v) => set("pembelajaran_heading", v)}
                    />
                  </div>
                  <Field
                    label="Keterangan / Sumber"
                    value={form.pembelajaran_intro}
                    onChange={(v) => set("pembelajaran_intro", v)}
                  />
                  <Field
                    label="Tiga Fase Belajar"
                    textarea
                    rows={4}
                    value={form.pembelajaran_fase}
                    onChange={(v) => set("pembelajaran_fase", v)}
                    hint="Satu baris = satu fase, format: Fase | Kelas | Fokus"
                  />
                  <Field
                    label="Pembelajaran Mendalam"
                    textarea
                    rows={4}
                    value={form.pembelajaran_deep}
                    onChange={(v) => set("pembelajaran_deep", v)}
                    hint="Satu baris = satu prinsip."
                  />
                  <Field
                    label="Siklus Belajar 3M"
                    textarea
                    rows={3}
                    value={form.pembelajaran_siklus}
                    onChange={(v) => set("pembelajaran_siklus", v)}
                  />
                  <Field
                    label="8 Dimensi Profil Lulusan"
                    textarea
                    rows={8}
                    value={form.pembelajaran_dimensi}
                    onChange={(v) => set("pembelajaran_dimensi", v)}
                    hint="Satu baris = satu dimensi."
                  />
                  <Field
                    label="Sesi Belajar"
                    textarea
                    rows={4}
                    value={form.pembelajaran_sesi}
                    onChange={(v) => set("pembelajaran_sesi", v)}
                  />
                </section>

                <Button onClick={saveSettings} disabled={saving} size="lg">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </TabsContent>

          <TabsContent value="galeri" className="mt-6">
            <GalleryManager items={gallery ?? []} />
          </TabsContent>

          <TabsContent value="berita" className="mt-6">
            <NewsManager items={news ?? []} />
          </TabsContent>

          <TabsContent value="komentar" className="mt-6">
            <TestimonialManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TestimonialManager() {
  const qc = useQueryClient();
  const { data: items, isLoading } = useAllTestimonials();
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = () => qc.invalidateQueries({ queryKey: ["testimonials"] });

  const setApproved = async (id: string, value: boolean) => {
    setBusyId(id);
    const { error } = await supabase
      .from("testimonials")
      .update({ is_approved: value })
      .eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success(value ? "Komentar ditampilkan di beranda" : "Komentar disembunyikan");
    void refresh();
  };

  const remove = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    setBusyId(null);
    if (error) return toast.error(error.message);
    toast.success("Komentar dihapus");
    void refresh();
  };

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  const list = items ?? [];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Komentar dari formulir Tally masuk sebagai belum terverifikasi. Verifikasi agar tampil di
        beranda.
      </p>

      {list.length === 0 ? (
        <p className="surface-card p-6 text-sm text-muted-foreground">Belum ada komentar masuk.</p>
      ) : (
        <div className="surface-card overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-secondary/60 text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3">No</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Komentar</th>
                <th className="px-4 py-3">Sumber</th>
                <th className="px-4 py-3">ID Formulir</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={item.id} className="border-t border-border align-top">
                  <td className="px-4 py-3 text-muted-foreground">{index + 1}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateID(item.created_at)}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={
                            i <= item.rating
                              ? "h-3.5 w-3.5 fill-primary text-primary"
                              : "h-3.5 w-3.5 text-muted-foreground/40"
                          }
                        />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">{item.rating}/5</span>
                    </span>
                  </td>
                  <td className="max-w-sm px-4 py-3 leading-relaxed text-foreground">
                    {item.message}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.source}</td>
                  <td className="px-4 py-3 text-xs break-all text-muted-foreground">
                    {item.external_id ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
                        item.is_approved
                          ? "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {item.is_approved ? "Terverifikasi" : "Menunggu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant={item.is_approved ? "outline" : "default"}
                        disabled={busyId === item.id}
                        onClick={() => void setApproved(item.id, !item.is_approved)}
                      >
                        {item.is_approved ? (
                          <>
                            <X className="mr-1 h-4 w-4" /> Sembunyikan
                          </>
                        ) : (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Verifikasi
                          </>
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={busyId === item.id}
                        onClick={() => void remove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GalleryManager({ items }: { items: NonNullable<ReturnType<typeof useGallery>["data"]> }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery_items"] });

  const add = async () => {
    if (!title.trim() || !imageUrl) return toast.error("Judul dan foto wajib diisi");
    setBusy(true);
    const { error } = await supabase.from("gallery_items").insert({
      title: title.trim(),
      description: description.trim(),
      image_url: imageUrl,
      event_date: eventDate || null,
      sort_order: items.length,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle("");
    setDescription("");
    setEventDate("");
    setImageUrl("");
    toast.success("Momen kegiatan ditambahkan");
    void refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Foto dihapus");
    void refresh();
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ title: "", description: "", event_date: "", image_url: "" });
  const [editBusy, setEditBusy] = useState(false);

  const startEdit = (item: (typeof items)[number]) => {
    setEditId(item.id);
    setEdit({
      title: item.title,
      description: item.description,
      event_date: item.event_date ?? "",
      image_url: item.image_url,
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!edit.title.trim() || !edit.image_url) return toast.error("Judul dan foto wajib diisi");
    setEditBusy(true);
    const { error } = await supabase
      .from("gallery_items")
      .update({
        title: edit.title.trim(),
        description: edit.description.trim(),
        event_date: edit.event_date || null,
        image_url: edit.image_url,
      })
      .eq("id", editId);
    setEditBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Foto kegiatan diperbarui");
    setEditId(null);
    void refresh();
  };

  return (
    <div className="space-y-6">
      <section className="surface-card space-y-4 p-6">
        <h2 className="font-display text-xl font-semibold">Tambah Momen Kegiatan</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Judul Kegiatan</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tanggal Kegiatan</Label>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton label="Unggah Foto" folder="galeri" onDone={setImageUrl} />
          {imageUrl ? (
            <img src={imageUrl} alt="Pratinjau" className="h-16 w-24 rounded-xl object-cover" />
          ) : null}
        </div>
        <Button onClick={add} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Tambahkan
        </Button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="surface-card overflow-hidden">
            {editId === item.id ? (
              <div className="space-y-3 p-4">
                <div className="space-y-2">
                  <Label>Judul Kegiatan</Label>
                  <Input
                    value={edit.title}
                    onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Kegiatan</Label>
                  <Input
                    type="date"
                    value={edit.event_date}
                    onChange={(e) => setEdit((p) => ({ ...p, event_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    rows={3}
                    value={edit.description}
                    onChange={(e) => setEdit((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <UploadButton
                    label="Ganti Foto"
                    folder="galeri"
                    onDone={(url) => setEdit((p) => ({ ...p, image_url: url }))}
                  />
                  {edit.image_url ? (
                    <img
                      src={edit.image_url}
                      alt="Pratinjau"
                      className="h-16 w-24 rounded-xl object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={saveEdit} disabled={editBusy}>
                    {editBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Simpan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateID(item.event_date ?? item.created_at)}
                    </p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button variant="outline" size="icon" onClick={() => startEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => remove(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsManager({ items }: { items: NonNullable<ReturnType<typeof useNews>["data"]> }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["news_items"] });

  const add = async () => {
    if (!title.trim()) return toast.error("Judul wajib diisi");
    setBusy(true);
    const { error } = await supabase.from("news_items").insert({
      title: title.trim(),
      content: content.trim(),
      image_url: imageUrl || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setTitle("");
    setContent("");
    setImageUrl("");
    toast.success("Berita dipublikasikan");
    void refresh();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("news_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Berita dihapus");
    void refresh();
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState({ title: "", content: "", image_url: "", published_at: "" });
  const [editBusy, setEditBusy] = useState(false);

  const startEdit = (item: (typeof items)[number]) => {
    setEditId(item.id);
    setEdit({
      title: item.title,
      content: item.content,
      image_url: item.image_url ?? "",
      published_at: item.published_at ?? "",
    });
  };

  const saveEdit = async () => {
    if (!editId) return;
    if (!edit.title.trim()) return toast.error("Judul wajib diisi");
    setEditBusy(true);
    const { error } = await supabase
      .from("news_items")
      .update({
        title: edit.title.trim(),
        content: edit.content.trim(),
        image_url: edit.image_url || null,
        ...(edit.published_at ? { published_at: edit.published_at } : {}),
      })
      .eq("id", editId);
    setEditBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Berita diperbarui");
    setEditId(null);
    void refresh();
  };

  return (
    <div className="space-y-6">
      <section className="surface-card space-y-4 p-6">
        <h2 className="font-display text-xl font-semibold">Tulis Berita / Pengumuman</h2>
        <div className="space-y-2">
          <Label>Judul</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Isi Berita</Label>
          <Textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton label="Unggah Foto" folder="berita" onDone={setImageUrl} />
          {imageUrl ? (
            <img src={imageUrl} alt="Pratinjau" className="h-16 w-24 rounded-xl object-cover" />
          ) : null}
        </div>
        <Button onClick={add} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Publikasikan
        </Button>
      </section>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="surface-card p-5">
            {editId === item.id ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Judul</Label>
                  <Input
                    value={edit.title}
                    onChange={(e) => setEdit((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Publikasi</Label>
                  <Input
                    type="date"
                    value={edit.published_at}
                    onChange={(e) => setEdit((p) => ({ ...p, published_at: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Isi Berita</Label>
                  <Textarea
                    rows={8}
                    value={edit.content}
                    onChange={(e) => setEdit((p) => ({ ...p, content: e.target.value }))}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <UploadButton
                    label="Ganti Foto"
                    folder="berita"
                    onDone={(url) => setEdit((p) => ({ ...p, image_url: url }))}
                  />
                  {edit.image_url ? (
                    <img
                      src={edit.image_url}
                      alt="Pratinjau"
                      className="h-16 w-24 rounded-xl object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={saveEdit} disabled={editBusy}>
                    {editBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Simpan
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                    Batal
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDateID(item.published_at)}</p>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.content}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button variant="outline" size="icon" onClick={() => startEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => remove(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
