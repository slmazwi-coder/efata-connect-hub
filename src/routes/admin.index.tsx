import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Image, Users, FileText, Trophy, Activity, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const cards = [
  { table: "news_posts", label: "News posts", icon: Newspaper },
  { table: "hero_slides", label: "Hero slides", icon: Image },
  { table: "staff_members", label: "Staff", icon: Users },
  { table: "school_documents", label: "Documents", icon: FileText },
  { table: "achievements", label: "Achievements", icon: Trophy },
  { table: "activities", label: "Activities", icon: Activity },
  { table: "applications", label: "Applications", icon: Inbox },
] as const;

function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    Promise.all(cards.map(async (c) => {
      const { count } = await supabase.from(c.table).select("*", { count: "exact", head: true });
      return [c.table, count ?? 0] as const;
    })).then((entries) => setCounts(Object.fromEntries(entries)));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-primary mb-6">Welcome back</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.table} className="rounded-xl border border-border bg-card p-5">
            <c.icon className="h-6 w-6 text-secondary" />
            <div className="mt-3 text-3xl font-bold text-primary">{counts[c.table] ?? "—"}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
