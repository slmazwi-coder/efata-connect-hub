import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/hero")({ component: HeroAdmin });

function HeroAdmin() {
  return (
    <CrudManager
      table="hero_slides"
      title="Hero Slides"
      orderBy={{ column: "sort_order", ascending: true }}
      defaults={{ active: true, sort_order: 0 } as Record<string, unknown>}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "subtitle", label: "Subtitle / description", type: "textarea" },
        { name: "image_url", label: "Background image", type: "image" },
        { name: "cta_label", label: "Button label", type: "text" },
        { name: "cta_href", label: "Button link (e.g. /apply)", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "active", label: "Active", type: "checkbox" },
      ]}
      renderRow={(r) => (
        <div className="flex gap-3">
          {r.image_url ? <img src={r.image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
          <div>
            <div className="font-semibold text-primary">{r.title as string}</div>
            <div className="text-xs text-muted-foreground">Order {r.sort_order as number} · {r.active ? "Active" : "Hidden"}</div>
          </div>
        </div>
      )}
    />
  );
}
