import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import grad from "@/assets/efata-graduation.jpg";
import hall from "@/assets/efata-hall.jpg";
import freedom from "@/assets/efata-freedom.jpg";

const slides = [
  {
    img: grad,
    eyebrow: "News & Updates",
    title: "Class of 2026 Graduation",
    desc: "Celebrating our matriculants from both the Blind and Deaf sections — a proud milestone for the Efata family.",
    cta: { to: "/about", label: "Read more" },
  },
  {
    img: hall,
    eyebrow: "School Life",
    title: "Inclusive Learning, Every Day",
    desc: "Specialised teaching for visually impaired and Deaf learners — Braille, South African Sign Language and more.",
    cta: { to: "/about", label: "Our programs" },
  },
  {
    img: freedom,
    eyebrow: "Latest Event",
    title: "Happy Freedom Day — Unity in Diversity",
    desc: "Honouring 27 April with our learners, staff and community.",
    cta: { to: "/contact", label: "Get involved" },
  },
] as const;

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);
  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <img src={s.img} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="max-w-2xl text-primary-foreground">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">
                {s.eyebrow}
              </span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-shadow-hero leading-tight">
                {s.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/90 max-w-xl">{s.desc}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={s.cta.to} className="inline-flex items-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-95 transition">
                  {s.cta.label}
                </Link>
                <Link to="/apply" className="inline-flex items-center rounded-md border border-primary-foreground/40 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/20 transition">
                  Apply Online
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => go(-1)} aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 p-2 text-primary-foreground backdrop-blur">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button onClick={() => go(1)} aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 p-2 text-primary-foreground backdrop-blur">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/50"}`} />
        ))}
      </div>
    </section>
  );
}
