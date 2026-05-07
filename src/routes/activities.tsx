import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Music, Trophy } from "lucide-react";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — Efata Special School" },
      { name: "description", content: "Music and sports activities at Efata Special School." },
      { property: "og:title", content: "Activities — Efata Special School" },
      { property: "og:description", content: "Discover music and sport activities at Efata." },
    ],
  }),
  component: Activities,
});

type Row = { id: string; category: "music" | "sport"; title: string; description: string | null; cover_image_url: string | null; youtube_url: string | null; event_date: string | null };

function ytEmbed(url: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function Activities() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    supabase.from("activities").select("*").order("event_date", { ascending: false, nullsFirst: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);

  const list = (cat: "music" | "sport") => rows.filter((r) => r.category === cat);

  const Card = ({ r }: { r: Row }) => {
    const embed = ytEmbed(r.youtube_url);
    return (
      <article className="overflow-hidden rounded-xl border border-border bg-card">
        {embed ? (
          <div className="aspect-video w-full"><iframe src={embed} title={r.title} className="h-full w-full" allowFullScreen /></div>
        ) : r.cover_image_url ? (
          <img src={r.cover_image_url} alt={r.title} className="aspect-video w-full object-cover" />
        ) : null}
        <div className="p-5">
          <h3 className="font-display text-xl font-bold text-primary">{r.title}</h3>
          {r.event_date && <p className="text-xs uppercase tracking-widest text-secondary mt-1">{new Date(r.event_date).toLocaleDateString()}</p>}
          {r.description && <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>}
        </div>
      </article>
    );
  };

  return (
    <>
      <PageHeader eyebrow="School life" title="Activities" subtitle="Music and sport — where our learners shine beyond the classroom." />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="music"><Music className="h-4 w-4 mr-2" />Music</TabsTrigger>
            <TabsTrigger value="sport"><Trophy className="h-4 w-4 mr-2" />Sport</TabsTrigger>
          </TabsList>
          {(["music", "sport"] as const).map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-8">
              {list(cat).length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Nothing posted yet.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {list(cat).map((r) => <Card key={r.id} r={r} />)}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </>
  );
}
