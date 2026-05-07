import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Efata Special School" },
      { name: "description", content: "Get in touch with Efata Special School in Mthatha." },
      { property: "og:title", content: "Contact Efata Special School" },
      { property: "og:description", content: "Phone, email and address for Efata Special School in Mthatha." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHeader eyebrow="Reach us" title="Contact Us" subtitle="We'd love to hear from prospective families, partners and supporters." />
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <Item icon={MapPin} title="Address" lines={["Queenstown R61 Road", "Mthatha, 5099", "OR Tambo Inland · Eastern Cape"]} />
          <Item icon={Phone} title="Telephone" lines={["047 536 0527", "082 776 1513"]} />
          <Item icon={Mail} title="Email" lines={["efatablinddeaf@gmail.com"]} />
          <Item icon={Clock} title="Office Hours" lines={["Mon – Fri: 07:30 – 16:00", "Sat – Sun: Closed"]} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
          <iframe
            title="Efata Special School map"
            src="https://www.google.com/maps?q=Efata+School+for+the+Blind+Mthatha&output=embed"
            className="w-full h-full min-h-[400px]"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}

function Item({ icon: Icon, title, lines }: { icon: React.ElementType; title: string; lines: string[] }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg gradient-brand text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-display text-lg font-bold text-primary">{title}</h3>
        {lines.map((l) => <p key={l} className="text-muted-foreground">{l}</p>)}
      </div>
    </div>
  );
}
