import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { FileText, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — Efata Special School" },
      { name: "description", content: "Download forms, policies and prospectus from Efata Special School." },
      { property: "og:title", content: "Documents — Efata Special School" },
      { property: "og:description", content: "Forms, policies, prospectus and more." },
    ],
  }),
  component: Documents,
});

type Doc = { id: string; title: string; description: string | null; file_url: string; category: string | null };

function Documents() {
  const [docs, setDocs] = useState<Doc[]>([]);
  useEffect(() => {
    supabase.from("school_documents").select("*").order("created_at", { ascending: false }).then(({ data }) => setDocs((data as Doc[]) ?? []));
  }, []);

  return (
    <>
      <PageHeader eyebrow="Resources" title="Documents & Downloads" subtitle="Find application forms, school policies and informational documents." />
      <section className="mx-auto max-w-5xl px-6 py-16">
        {docs.length === 0 ? <p className="text-center text-muted-foreground">No documents available yet.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {docs.map((d) => (
              <a key={d.id} href={d.file_url} target="_blank" rel="noopener noreferrer"
                className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent hover:shadow-md transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-secondary"><FileText className="h-6 w-6" /></div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-primary">{d.title}</h3>
                  {d.description && <p className="text-sm text-muted-foreground">{d.description}</p>}
                  {d.category && <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{d.category}</p>}
                </div>
                <Download className="h-5 w-5 text-secondary group-hover:translate-y-0.5 transition" />
              </a>
            ))}
          </div>
        )}
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Need a document that's not listed? <a className="text-secondary font-semibold" href="/contact">Contact the office</a>.
        </p>
      </section>
    </>
  );
}
