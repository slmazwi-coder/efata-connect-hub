import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply Online — Efata Special School" },
      { name: "description", content: "Submit an online application for admission to Efata Special School." },
      { property: "og:title", content: "Apply Online — Efata Special School" },
      { property: "og:description", content: "Online admission application for the Blind or Deaf section." },
    ],
  }),
  component: Apply,
});

function Apply() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Application" title="Application received" />
        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-secondary" />
          <p className="mt-4 text-muted-foreground">Thank you. Our admissions office will be in touch shortly to confirm next steps.</p>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow="Admissions" title="Online Application" subtitle="Complete the form below to apply for admission. Required fields are marked with *." />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
          className="rounded-2xl border border-border bg-card p-8 shadow-sm space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Learner's full name *" name="name" required />
            <Field label="Date of birth *" name="dob" type="date" required />
            <Field label="ID / Birth certificate no." name="id" />
            <Field label="Gender" name="gender" />
            <SelectField label="Section applied for *" name="section" options={["Blind Section", "Deaf Section"]} required />
            <SelectField label="Grade applied for *" name="grade" options={["Grade R", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"]} required />
          </div>

          <h3 className="font-display text-xl font-bold text-primary pt-4">Parent / Guardian</h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Parent / Guardian name *" name="parent" required />
            <Field label="Relationship" name="relationship" />
            <Field label="Phone *" name="phone" type="tel" required />
            <Field label="Email" name="email" type="email" />
            <Field label="Home address" name="address" full />
          </div>

          <Field label="Tell us about the learner (medical, support needs)" name="notes" textarea full />

          <div className="flex justify-end">
            <button type="submit" className="rounded-md bg-secondary px-8 py-3 font-semibold text-secondary-foreground hover:brightness-95">
              Submit application
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", required, textarea, full }: { label: string; name: string; type?: string; required?: boolean; textarea?: boolean; full?: boolean }) {
  return (
    <label className={`block text-sm ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block font-medium text-foreground">{label}</span>
      {textarea ? (
        <textarea name={name} required={required} rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
      ) : (
        <input name={name} type={type} required={required}
          className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring" />
      )}
    </label>
  );
}

function SelectField({ label, name, options, required }: { label: string; name: string; options: string[]; required?: boolean }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-foreground">{label}</span>
      <select name={name} required={required}
        className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring">
        <option value="">Select…</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}
