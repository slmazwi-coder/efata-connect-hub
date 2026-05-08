import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import grad from "@/assets/efata-graduation.jpg";
import hall from "@/assets/efata-hall.jpg";
import freedom from "@/assets/efata-freedom.jpg";

type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  desc: string;
  ctaLabel: string;
  ctaHref: string;
};

const fallback: Slide[] = [
  { 
    image: grad, 
    eyebrow: "Admissions 2026", 
    title: "Start Your Journey With Us", 
    desc: "Applications for the Class of 2026 are now open for both Blind and Deaf sections.", 
    ctaLabel: "Begin Application", 
    ctaHref: "/apply" 
  },
  { 
    image: hall, 
    eyebrow: "School Life", 
    title: "Inclusive Learning Environment", 
    desc: "Explore our specialized programs and facilities for our learners.", 
    ctaLabel: "View Programs", 
    ctaHref: "/about" 
  },
  { 
    image: freedom, 
    eyebrow: "Boarding & Residence", 
    title: "A Home Away From Home", 
    desc: "Learn more about our boarding facilities and student support services.", 
    ctaLabel: "Boarding Info", 
    ctaHref: "/boarding" 
  },
];

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(fallback);
  const [i, setI] = useState(0);

  useEffect(() => {
    supabase.from("hero_slides").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      if (data && data.length > 0) {
        const fallbackImages = [grad, hall, freedom];
        setSlides(data.map((s, idx) => ({
          image: s.image_url || fallbackImages[idx % fallbackImages.length],
          eyebrow: "Latest",
          title: s.title,
          desc: s.subtitle ?? "",
          ctaLabel: s.cta_label || "Learn more",
          ctaHref: s.cta_href || "/apply",
        })));
      }
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const go = (d: number) => setI((p) => (p + d + slides.length) % slides.length);

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
      {slides.map((s, idx) => (
        <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <img src={s.image} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
            <div className="max-w-2xl text-primary-foreground">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-foreground">{s.eyebrow}</span>
              <h1 className="mt-4 font-display text-4xl md:text-6xl font-bold text-shadow-hero leading-tight">{s.title}</h1>
              <p className="mt-4 text-base md:text-lg text-primary-foreground/90 max-w-xl">{s.desc}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {/* Fixed: This button now correctly points to the ctaHref which defaults to /apply */}
                <Link to={s.ctaHref} className="inline-flex items-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground hover:brightness-95 transition">
                  {s.ctaLabel}
                </Link>
                {/* Fixed: Standardized to go to the primary application route */}
                <Link to="/apply" className="inline-flex items-center rounded-md border border-primary-foreground/40 bg-primary-foreground/10 px-5 py-3 text-sm font-semibold backdrop-blur hover:bg-primary-foreground/20 transition">
                  General Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 p-2 text-primary-foreground backdrop-blur"><ChevronLeft className="h-6 w-6" /></button>
      <button onClick={() => go(1)} aria-label="Next slide" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/30 hover:bg-background/50 p-2 text-primary-foreground backdrop-blur"><ChevronRight className="h-6 w-6" /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} className={`h-2 rounded-full transition-all ${idx === i ? "w-8 bg-accent" : "w-2 bg-primary-foreground/50"}`} />
        ))}
      </div>
    </section>
  );
}
