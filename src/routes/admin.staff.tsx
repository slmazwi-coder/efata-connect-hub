import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/admin/staff")({ component: StaffAdmin });

function StaffAdmin() {
  return (
    <CrudManager
      table="staff_members"
      title="Staff"
      orderBy={{ column: "sort_order", ascending: true }}
      defaults={{ sort_order: 0 } as Record<string, unknown>}
      fields={[
        { name: "name", label: "Name", type: "text", required: true },
        { name: "role", label: "Role / position", type: "text", required: true },
        { name: "section", label: "Section", type: "select", options: ["Leadership", "Blind Section", "Deaf Section", "Support"] },
        { name: "bio", label: "Short bio", type: "textarea" },
        { name: "photo_url", label: "Photo", type: "image" },
        { name: "email", label: "Email", type: "text" },
        { name: "sort_order", label: "Sort order", type: "number" },
      ]}
      renderRow={(r) => (
        <div className="flex gap-3">
          {r.photo_url ? <img src={r.photo_url as string} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" /> : null}
          <div>
            <div className="font-semibold text-primary">{r.name as string}</div>
            <div className="text-xs text-muted-foreground">{r.role as string} · {(r.section as string) || "—"}</div>
          </div>
        </div>
      )}
    />
  );
}
