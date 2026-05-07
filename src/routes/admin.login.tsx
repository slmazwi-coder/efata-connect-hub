import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: Login,
});

function Login() {
  const { signIn, user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) nav({ to: "/admin" });
  }, [loading, user, isAdmin, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await signIn(email, password);
    setBusy(false);
    if (error) setErr(error);
  };

  return (
    <>
      <PageHeader eyebrow="Restricted" title="Admin Login" />
      <section className="mx-auto max-w-md px-6 py-16">
        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4">
          <div className="flex justify-center"><Lock className="h-10 w-10 text-secondary" /></div>
          {err && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{err}</p>}
          {user && !isAdmin && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">This account is not an admin.</p>}
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-input bg-background px-3 py-2" />
          </label>
          <button disabled={busy} className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground disabled:opacity-60">
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </>
  );
}
