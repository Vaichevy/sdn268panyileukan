import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FileUp, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadMedia, formatDateID } from "@/lib/cms";
import { articlesTable, useArticles, type ArticleItem } from "@/lib/articles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type Draft = {
  title: string;
  summary: string;
  content: string;
  author: string;
  cover_url: string;
  pdf_url: string;
  is_public: boolean;
  published_at: string;
};

const empty: Draft = {
  title: "",
  summary: "",
  content: "",
  author: "",
  cover_url: "",
  pdf_url: "",
  is_public: true,
  published_at: "",
};

function FileButton({ label, accept, folder, onDone }: { label: string; accept: string; folder: string; onDone: (u: string) => void }) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
      {label}
      <input
        type="file"
        accept={accept}
        className="hidden"
        disabled={busy}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            onDone(await uploadMedia(f, folder));
            toast.success("File berhasil diunggah");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Gagal mengunggah file");
          } finally {
            setBusy(false);
            e.target.value = "";
          }
        }}
      />
    </label>
  );
}

function ArticleForm({ value, onChange }: { value: Draft; onChange: (d: Draft) => void }) {
  const set = (k: keyof Draft, v: string | boolean) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Judul</Label>
        <Input value={value.title} onChange={(e) => set("title", e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Penulis</Label>
          <Input value={value.author} onChange={(e) => set("author", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Tanggal terbit</Label>
          <Input type="date" value={value.published_at} onChange={(e) => set("published_at", e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <Label>Ringkasan</Label>
        <Textarea rows={2} value={value.summary} onChange={(e) => set("summary", e.target.value)} />
      </div>
      <div className="grid gap-2">
        <Label>Isi artikel</Label>
        <p className="text-xs text-muted-foreground">
          Awali baris dengan "## " untuk subjudul, "- " atau "1. " untuk daftar. Pisahkan paragraf dengan baris kosong.
        </p>
        <Textarea rows={14} value={value.content} onChange={(e) => set("content", e.target.value)} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FileButton label="Unggah File PDF" accept="application/pdf" folder="artikel" onDone={(u) => set("pdf_url", u)} />
        {value.pdf_url ? (
          <>
            <a href={value.pdf_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
              Lihat PDF
            </a>
            <Button type="button" variant="ghost" size="sm" onClick={() => set("pdf_url", "")}>
              <X className="h-4 w-4" /> Hapus PDF
            </Button>
          </>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <FileButton label="Unggah Sampul" accept="image/*" folder="artikel" onDone={(u) => set("cover_url", u)} />
        {value.cover_url ? (
          <>
            <img src={value.cover_url} alt="Sampul" className="h-14 w-24 rounded-lg object-cover" />
            <Button type="button" variant="ghost" size="sm" onClick={() => set("cover_url", "")}>
              <X className="h-4 w-4" /> Hapus
            </Button>
          </>
        ) : null}
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Switch checked={value.is_public} onCheckedChange={(v) => set("is_public", v)} /> Tampilkan ke publik
      </label>
    </div>
  );
}

function toRow(d: Draft) {
  return {
    title: d.title.trim(),
    summary: d.summary.trim() || null,
    content: d.content,
    author: d.author.trim() || null,
    cover_url: d.cover_url || null,
    pdf_url: d.pdf_url || null,
    is_public: d.is_public,
    ...(d.published_at ? { published_at: new Date(d.published_at).toISOString() } : {}),
  };
}

function fromItem(a: ArticleItem): Draft {
  return {
    title: a.title,
    summary: a.summary ?? "",
    content: a.content ?? "",
    author: a.author ?? "",
    cover_url: a.cover_url ?? "",
    pdf_url: a.pdf_url ?? "",
    is_public: a.is_public,
    published_at: a.published_at.slice(0, 10),
  };
}

export function ArticleManager() {
  const qc = useQueryClient();
  const { data: items } = useArticles();
  const [draft, setDraft] = useState<Draft>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Draft>(empty);
  const [busy, setBusy] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["article_items"] });

  const add = async () => {
    if (!draft.title.trim()) return toast.error("Judul wajib diisi");
    if (!draft.content.trim() && !draft.pdf_url) return toast.error("Isi artikel atau file PDF wajib diisi");
    setBusy(true);
    const { error } = await articlesTable().insert(toRow(draft));
    setBusy(false);
    if (error) return toast.error(error.message);
    setDraft(empty);
    toast.success("Artikel ditambahkan");
    void refresh();
  };

  const save = async () => {
    if (!editId) return;
    setBusy(true);
    const { error } = await articlesTable().update(toRow(edit)).eq("id", editId);
    setBusy(false);
    if (error) return toast.error(error.message);
    setEditId(null);
    toast.success("Artikel diperbarui");
    void refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    const { error } = await articlesTable().delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Artikel dihapus");
    void refresh();
  };

  return (
    <div className="grid gap-6">
      <div className="surface-card p-6">
        <h2 className="font-display text-xl font-semibold text-foreground">Tambah Artikel</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tulis isi artikel dan/atau lampirkan file PDF.</p>
        <div className="mt-4">
          <ArticleForm value={draft} onChange={setDraft} />
        </div>
        <Button className="mt-4" onClick={add} disabled={busy}>
          <Plus className="h-4 w-4" /> Tambah Artikel
        </Button>
      </div>

      <div className="grid gap-4">
        {(items ?? []).map((a) => (
          <div key={a.id} className="surface-card p-5">
            {editId === a.id ? (
              <>
                <ArticleForm value={edit} onChange={setEdit} />
                <div className="mt-4 flex gap-2">
                  <Button onClick={save} disabled={busy}>
                    <Save className="h-4 w-4" /> Simpan
                  </Button>
                  <Button variant="outline" onClick={() => setEditId(null)}>
                    Batal
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-primary">
                    {formatDateID(a.published_at)} {a.is_public ? "" : "• Draf"} {a.pdf_url ? "• PDF" : ""}
                  </p>
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => { setEditId(a.id); setEdit(fromItem(a)); }}>
                    <Pencil className="h-4 w-4" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(a.id)}>
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
