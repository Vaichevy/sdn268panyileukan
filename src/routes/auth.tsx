import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedBackground } from "@/components/site/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk Admin — SDN 268 Panyileukan" },
      { name: "description", content: "Halaman masuk pengelola konten website SDN 268 Panyileukan." },
      { property: "og:title", content: "Masuk Admin — SDN 268 Panyileukan" },
      { property: "og:description", content: "Halaman masuk pengelola konten website sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: "https://sdn268panyileukan.lovable.app/auth" },
    ],
    links: [{ rel: "canonical", href: "https://sdn268panyileukan.lovable.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/admin" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <AnimatedBackground />
      <div className="surface-card w-full max-w-md p-8">
        <span className="gradient-hero mx-auto flex h-12 w-12 items-center justify-center rounded-2xl text-primary-foreground">
          <GraduationCap className="h-6 w-6" />
        </span>
        <h1 className="mt-5 text-center font-display text-2xl font-semibold text-foreground">
          Masuk Panel Admin
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Pengelolaan konten website SDN 268 Panyileukan
        </p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sekolah.sch.id"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Masuk
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Akun admin hanya dibuat oleh pengelola sekolah. Hubungi pengelola bila
          Anda memerlukan akses.
        </p>
      </div>
    </div>
  );
}
