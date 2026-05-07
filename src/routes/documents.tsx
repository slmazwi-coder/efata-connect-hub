import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { FileText, Download } from "lucide-react";

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

const docs = [
  { title: "School Prospectus", desc: "Overview of the school, sections and programs.", size: "PDF · 2.1 MB" },
  { title: "Application Form (Blind Section)", desc: "Printable admission form for the Blind Section.", size: "PDF · 480 KB" },
  { title: "Application Form (Deaf Section)", desc: "Printable admission form for the Deaf Section.", size: "PDF · 480 KB" },
  { title: "School Code of Conduct", desc: "Rules and expectations for learners.", size: "PDF · 320 KB" },
  { title: "Annual Calendar", desc: "Term dates, events and holidays.", size: "PDF · 210 KB" },
  { title: "Hostel Information", desc: "Boarding facilities and arrangements.", size: "PDF · 290 KB" },
];

function Documents() {
  return (
    <>
      <PageHeader eyebrow="Resources" title="Documents & Downloads" subtitle="Find application forms, school policies and informational documents." />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {docs.map((d) => (
            <a key={d.title} href="#" onClick={(e) => e.preventDefault()}
              className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-accent hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-secondary">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-primary">{d.title}</h3>
                <p className="text-sm text-muted-foreground">{d.desc}</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{d.size}</p>
              </div>
              <Download className="h-5 w-5 text-secondary group-hover:translate-y-0.5 transition" />
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Need a document that's not listed? <a className="text-secondary font-semibold" href="/contact">Contact the office</a>.
        </p>
      </section>
    </>
  );
}
