import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/activities")({ component: ActAdmin });

function ActAdmin() {
  return (
    <CrudManager
      table="activities"
      title="Activities (Music & Sport)"
      orderBy={{ column: "event_date", ascending: false }}
      defaults={{ category: "music" } as Record<string, unknown>}
      fields={[
        { name: "category", label: "Category", type: "select", options: ["music", "sport"], required: true },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "cover_image_url", label: "Cover image", type: "image" },
        { name: "youtube_url", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/watch?v=..." },
        { name: "event_date", label: "Event date", type: "date" },
      ]}
      renderRow={(r) => (
        <div className="flex gap-3">
          {r.cover_image_url ? <img src={r.cover_image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
          <div>
            <div className="font-semibold text-primary">{r.title as string}</div>
            <div className="text-xs uppercase tracking-widest text-secondary">{r.category as string}</div>
            {r.event_date ? <div className="text-xs text-muted-foreground">{new Date(r.event_date as string).toLocaleDateString()}</div> : null}
          </div>
        </div>
      )}
    />
  );
}
