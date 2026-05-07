import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/applications")({ component: AppsAdmin });

interface App {
  id: string; learner_name: string; date_of_birth: string | null; section: string; grade: string;
  parent_name: string; phone: string; email: string | null; address: string | null; notes: string | null;
  status: string; created_at: string; relationship: string | null; gender: string | null; id_number: string | null;
}

function AppsAdmin() {
  const [rows, setRows] = useState<App[]>([]);
  const [open, setOpen] = useState<App | null>(null);

  const load = async () => {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    setRows((data as App[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete application?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); setOpen(null); }
  };

  const exportCsv = () => {
    const headers = ["Date","Learner","DOB","Section","Grade","Parent","Phone","Email","Status"];
    const csv = [headers.join(",")].concat(rows.map(r => [
      new Date(r.created_at).toLocaleDateString(), r.learner_name, r.date_of_birth ?? "", r.section, r.grade, r.parent_name, r.phone, r.email ?? "", r.status
    ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(","))).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "applications.csv"; a.click();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-primary">Applications</h1>
        <button onClick={exportCsv} className="rounded-md border border-input px-4 py-2 text-sm">Export CSV</button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-3 py-2">Date</th><th className="px-3 py-2">Learner</th>
              <th className="px-3 py-2">Section</th><th className="px-3 py-2">Grade</th>
              <th className="px-3 py-2">Parent</th><th className="px-3 py-2">Phone</th>
              <th className="px-3 py-2">Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">No applications yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => setOpen(r)}>
                <td className="px-3 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-2 font-medium">{r.learner_name}</td>
                <td className="px-3 py-2">{r.section}</td>
                <td className="px-3 py-2">{r.grade}</td>
                <td className="px-3 py-2">{r.parent_name}</td>
                <td className="px-3 py-2">{r.phone}</td>
                <td className="px-3 py-2">
                  <select value={r.status} onClick={(e) => e.stopPropagation()} onChange={(e) => setStatus(r.id, e.target.value)}
                    className="rounded border border-input bg-background px-2 py-1 text-xs">
                    <option value="new">new</option><option value="reviewed">reviewed</option>
                    <option value="accepted">accepted</option><option value="rejected">rejected</option>
                  </select>
                </td>
                <td className="px-3 py-2"><button onClick={(e) => { e.stopPropagation(); remove(r.id); }} className="text-destructive p-1"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-background p-6 shadow-xl space-y-2 text-sm">
            <h2 className="font-display text-xl font-bold mb-2">{open.learner_name}</h2>
            <p><b>Section:</b> {open.section} · <b>Grade:</b> {open.grade}</p>
            <p><b>DOB:</b> {open.date_of_birth ?? "—"} · <b>Gender:</b> {open.gender ?? "—"}</p>
            <p><b>ID:</b> {open.id_number ?? "—"}</p>
            <hr className="my-2" />
            <p><b>Parent:</b> {open.parent_name} ({open.relationship ?? "—"})</p>
            <p><b>Phone:</b> {open.phone} · <b>Email:</b> {open.email ?? "—"}</p>
            <p><b>Address:</b> {open.address ?? "—"}</p>
            <p><b>Notes:</b> {open.notes ?? "—"}</p>
            <div className="pt-3 text-right"><button onClick={() => setOpen(null)} className="rounded-md border px-4 py-2">Close</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
