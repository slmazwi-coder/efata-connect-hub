import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff — Efata Special School" },
      { name: "description", content: "Meet the leadership and teaching staff of Efata Special School." },
      { property: "og:title", content: "Staff — Efata Special School" },
      { property: "og:description", content: "Our leadership and dedicated educators." },
    ],
  }),
  component: Staff,
});

const team = [
  { name: "Ms. N. Rasmeni", role: "Principal", section: "Leadership" },
  { name: "Deputy Principal", role: "Deputy Principal", section: "Leadership" },
  { name: "HOD — Blind Section", role: "Head of Department", section: "Blind Section" },
  { name: "HOD — Deaf Section", role: "Head of Department", section: "Deaf Section" },
  { name: "Braille Specialist", role: "Senior Educator", section: "Blind Section" },
  { name: "SASL Educator", role: "Senior Educator", section: "Deaf Section" },
  { name: "Orientation & Mobility", role: "Specialist", section: "Blind Section" },
  { name: "Audiologist", role: "Specialist", section: "Deaf Section" },
];

function Initials({ name }: { name: string }) {
  const init = name.split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-brand text-primary-foreground font-display text-2xl font-bold">
      {init}
    </div>
  );
}

function Staff() {
  return (
    <>
      <PageHeader eyebrow="Our team" title="Staff & Leadership" subtitle="A dedicated team of specialists, educators and support staff serving learners across both sections." />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="rounded-xl border border-border bg-card p-6 text-center hover:border-accent transition">
              <div className="flex justify-center"><Initials name={m.name} /></div>
              <h3 className="mt-4 font-display text-lg font-bold text-primary">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
              <span className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-secondary">{m.section}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
