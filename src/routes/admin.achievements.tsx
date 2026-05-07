import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/achievements")({ component: AchAdmin });

function AchAdmin() {
  return (
    <CrudManager
      table="achievements"
      title="Achievements"
      orderBy={{ column: "year", ascending: false }}
      defaults={{ year: new Date().getFullYear() } as Record<string, unknown>}
      fields={[
        { name: "year", label: "Year", type: "number", required: true },
        { name: "event", label: "Event / award", type: "text", required: true },
        { name: "category", label: "Category", type: "select", options: ["Academic", "Sport", "Music", "Arts", "Other"] },
        { name: "position", label: "Position / result", type: "text", placeholder: "e.g. 1st, Gold, Bachelor pass" },
        { name: "description", label: "Notes", type: "textarea" },
        { name: "image_url", label: "Image", type: "image" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
      renderRow={(r) => (
        <div>
          <div className="font-semibold text-primary">{r.year as number} — {r.event as string}</div>
          <div className="text-xs text-muted-foreground">{(r.category as string) || "—"} · {(r.position as string) || "—"}</div>
        </div>
      )}
    />
  );
}
