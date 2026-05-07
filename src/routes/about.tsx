import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import grad from "@/assets/efata-graduation.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Efata Special School" },
      { name: "description", content: "About Efata Special School: a school for the Blind and Deaf in Mthatha, Eastern Cape." },
      { property: "og:title", content: "About Efata Special School" },
      { property: "og:description", content: "Our story, mission and the two sections that make Efata one family." },
      { property: "og:image", content: grad },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader eyebrow="Our story" title="About Efata Special School" subtitle="Ndilindel' Ukhanyo — 'I am waiting for the light.' Inclusive, dignified education for Blind and Deaf learners in the Eastern Cape." />
      <section className="mx-auto max-w-5xl px-6 py-16 space-y-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={grad} alt="Efata graduates" className="rounded-xl shadow-lg" />
          <div>
            <h2 className="font-display text-3xl text-primary font-bold">Who we are</h2>
            <p className="mt-3 text-muted-foreground">
              Efata Special School is located on Queenstown R61 Road, Mthatha (OR Tambo Inland), Eastern Cape.
              The school serves learners with visual and hearing impairments through two dedicated sections —
              the Blind Section and the Deaf Section — under one supportive community.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-border p-6 bg-card">
            <h3 className="font-display text-2xl font-bold text-primary">Mission</h3>
            <p className="mt-2 text-muted-foreground">To deliver quality, specialised education that empowers Blind and Deaf learners to thrive academically, socially and economically.</p>
          </div>
          <div className="rounded-xl border border-border p-6 bg-card">
            <h3 className="font-display text-2xl font-bold text-primary">Vision</h3>
            <p className="mt-2 text-muted-foreground">A community where every visually impaired and Deaf learner is seen, heard and prepared for a future of independence.</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-3xl text-primary font-bold">Specialised programs</h2>
          <ul className="mt-4 grid md:grid-cols-2 gap-3 text-muted-foreground list-disc list-inside">
            <li>Braille literacy and assistive technology</li>
            <li>Orientation & mobility training</li>
            <li>South African Sign Language (SASL) instruction</li>
            <li>Speech and audiology support</li>
            <li>Vocational and life-skills training</li>
            <li>Boarding and pastoral care</li>
          </ul>
        </div>
      </section>
    </>
  );
}
