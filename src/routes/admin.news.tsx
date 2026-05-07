import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/news")({ component: NewsAdmin });

function NewsAdmin() {
  return (
    <CrudManager
      table="news_posts"
      title="News & Updates"
      orderBy={{ column: "published_at", ascending: false }}
      defaults={{ published: true } as Record<string, unknown>}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "excerpt", label: "Excerpt", type: "textarea" },
        { name: "body", label: "Body", type: "textarea" },
        { name: "cover_image_url", label: "Cover image", type: "image" },
        { name: "published", label: "Published", type: "checkbox" },
      ]}
      renderRow={(r) => (
        <div className="flex gap-3">
          {r.cover_image_url ? <img src={r.cover_image_url as string} alt="" className="h-16 w-24 shrink-0 rounded object-cover" /> : null}
          <div>
            <div className="font-semibold text-primary">{r.title as string}</div>
            <div className="text-xs text-muted-foreground">{r.published ? "Published" : "Draft"} · {new Date(r.published_at as string).toLocaleDateString()}</div>
            {r.excerpt ? <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.excerpt as string}</p> : null}
          </div>
        </div>
      )}
    />
  );
}
