import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/documents")({ component: DocsAdmin });

function DocsAdmin() {
  return (
    <CrudManager
      table="school_documents"
      title="Documents"
      orderBy={{ column: "created_at", ascending: false }}
      fields={[
        { name: "title", label: "Title", type: "text", required: true },
        { name: "description", label: "Description", type: "textarea" },
        { name: "category", label: "Category", type: "select", options: ["Policy", "Form", "Newsletter", "Report", "Other"] },
        { name: "file_url", label: "File", type: "file", required: true },
      ]}
      renderRow={(r) => (
        <div>
          <div className="font-semibold text-primary">{r.title as string}</div>
          <div className="text-xs text-muted-foreground">{(r.category as string) || "—"}</div>
        </div>
      )}
    />
  );
}
