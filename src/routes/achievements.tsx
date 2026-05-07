import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Achievements — Efata Special School" },
      { name: "description", content: "Celebrating results and milestones from Efata Special School learners." },
      { property: "og:title", content: "Achievements — Efata Special School" },
      { property: "og:description", content: "Past results and proud moments from our learners." },
    ],
  }),
  component: Achievements,
});

type Row = { id: string; year: number; event: string; position: string | null; description: string | null; category: string | null; image_url: string | null };

function Achievements() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.from("achievements").select("*").order("year", { ascending: false }).order("sort_order")
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const grouped = rows.reduce<Record<number, Row[]>>((acc, r) => { (acc[r.year] ??= []).push(r); return acc; }, {});
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  return (
    <>
      <PageHeader eyebrow="Our pride" title="Achievements" subtitle="Results, awards and proud milestones from across the Blind and Deaf sections." />
      <section className="mx-auto max-w-6xl px-6 py-16 space-y-12">
        {years.length === 0 && <p className="text-center text-muted-foreground">No achievements published yet.</p>}
        {years.map((y) => (
          <div key={y}>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-secondary" /> {y}
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Event</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">Position / Result</th>
                    <th className="px-4 py-3 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped[y].map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium text-primary">{r.event}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.category ?? "—"}</td>
                      <td className="px-4 py-3"><span className="rounded-full bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">{r.position ?? "—"}</span></td>
                      <td className="px-4 py-3 text-muted-foreground">{r.description ?? ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
