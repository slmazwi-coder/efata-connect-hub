import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Newspaper, Image, Users, FileText, Trophy, Activity, Inbox, LogOut, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/news", label: "News", icon: Newspaper },
  { to: "/admin/hero", label: "Hero Slides", icon: Image },
  { to: "/admin/staff", label: "Staff", icon: Users },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/activities", label: "Activities", icon: Activity },
  { to: "/admin/applications", label: "Applications", icon: Inbox },
] as const;

function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && (!user || !isAdmin) && path !== "/admin/login") {
      nav({ to: "/admin/login" });
    }
  }, [loading, user, isAdmin, nav, path]);

  if (path === "/admin/login") return <Outlet />;
  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border border-border bg-card p-3 h-fit lg:sticky lg:top-20">
        <nav className="flex flex-col gap-1">
          {items.map((it) => {
            const active = it.exact ? path === it.to : path.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted"}`}>
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
          <button onClick={() => signOut().then(() => nav({ to: "/" }))}
            className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>
      <section><Outlet /></section>
    </div>
  );
}
