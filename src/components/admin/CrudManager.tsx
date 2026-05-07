import { useEffect, useState, type ReactNode } from "react";
import { supabase as typedSupabase } from "@/integrations/supabase/client";
const supabase = typedSupabase as unknown as {
  from: (t: string) => {
    select: (s: string) => { order: (c: string, o?: { ascending?: boolean }) => Promise<{ data: unknown[] | null; error: { message: string } | null }> } & Promise<{ data: unknown[] | null; error: { message: string } | null }>;
    insert: (v: Record<string, unknown>) => Promise<{ error: { message: string } | null }>;
    update: (v: Record<string, unknown>) => { eq: (c: string, val: string) => Promise<{ error: { message: string } | null }> };
    delete: () => { eq: (c: string, val: string) => Promise<{ error: { message: string } | null }> };
  };
};
import { uploadMedia } from "@/lib/upload";
import { Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "date" | "checkbox" | "image" | "file" | "select";
export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface Props<T extends { id: string }> {
  table: string;
  title: string;
  fields: FieldDef[];
  orderBy?: { column: string; ascending?: boolean };
  renderRow: (row: T) => ReactNode;
  defaults?: Partial<T>;
}

export function CrudManager<T extends { id: string; [k: string]: unknown }>({ table, title, fields, orderBy, renderRow, defaults }: Props<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [editing, setEditing] = useState<T | null>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    let q = supabase.from(table).select("*");
    if (orderBy) q = q.order(orderBy.column, { ascending: orderBy.ascending ?? true }) as typeof q;
    const { data } = await q;
    setRows(((data as unknown) as T[]) ?? []);
  };
  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [table]);

  const startNew = () => { setEditing({ ...(defaults ?? {}) } as T); setOpen(true); };
  const startEdit = (r: T) => { setEditing({ ...r }); setOpen(true); };

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    const payload: Record<string, unknown> = {};
    for (const f of fields) payload[f.name] = (editing as Record<string, unknown>)[f.name] ?? null;
    let res;
    if ((editing as { id?: string }).id) {
      res = await supabase.from(table).update(payload).eq("id", (editing as { id: string }).id);
    } else {
      res = await supabase.from(table).insert(payload);
    }
    setBusy(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Saved");
    setOpen(false); setEditing(null); load();
  };

  const setField = (name: string, value: unknown) => setEditing((p) => ({ ...(p as object), [name]: value }) as T);

  const handleFileUpload = async (name: string, file: File) => {
    try {
      const url = await uploadMedia(file, table);
      setField(name, url);
      toast.success("Uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-primary">{title}</h1>
        <button onClick={startNew} className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground">
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 rounded-lg border border-border bg-card p-4">
            <div className="min-w-0 flex-1">{renderRow(r)}</div>
            <div className="flex shrink-0 gap-1">
              <button onClick={() => startEdit(r)} className="rounded-md p-2 hover:bg-muted" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => remove(r.id)} className="rounded-md p-2 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {open && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{(editing as { id?: string }).id ? "Edit" : "Create"}</h2>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              {fields.map((f) => {
                const val = (editing as Record<string, unknown>)[f.name];
                const common = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";
                return (
                  <label key={f.name} className="block">
                    <span className="mb-1 block text-sm font-medium">{f.label}{f.required && " *"}</span>
                    {f.type === "textarea" ? (
                      <textarea rows={4} value={(val as string) ?? ""} onChange={(e) => setField(f.name, e.target.value)} className={common} />
                    ) : f.type === "checkbox" ? (
                      <input type="checkbox" checked={!!val} onChange={(e) => setField(f.name, e.target.checked)} className="h-4 w-4" />
                    ) : f.type === "number" ? (
                      <input type="number" value={(val as number) ?? ""} onChange={(e) => setField(f.name, e.target.value === "" ? null : Number(e.target.value))} className={common} />
                    ) : f.type === "date" ? (
                      <input type="date" value={(val as string) ?? ""} onChange={(e) => setField(f.name, e.target.value || null)} className={common} />
                    ) : f.type === "select" ? (
                      <select value={(val as string) ?? ""} onChange={(e) => setField(f.name, e.target.value)} className={common}>
                        <option value="">Select…</option>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === "image" || f.type === "file" ? (
                      <div className="space-y-2">
                        <input value={(val as string) ?? ""} onChange={(e) => setField(f.name, e.target.value)} placeholder="URL or upload" className={common} />
                        <label className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-input px-3 py-2 text-xs hover:bg-muted">
                          <Upload className="h-3 w-3" /> Upload {f.type === "image" ? "image" : "file"}
                          <input type="file" accept={f.type === "image" ? "image/*" : undefined} className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(f.name, e.target.files[0])} />
                        </label>
                        {f.type === "image" && typeof val === "string" && val ? <img src={val} alt="" className="h-24 rounded border border-border object-cover" /> : null}
                      </div>
                    ) : (
                      <input type="text" value={(val as string) ?? ""} placeholder={f.placeholder} onChange={(e) => setField(f.name, e.target.value)} className={common} />
                    )}
                  </label>
                );
              })}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-md border border-input px-4 py-2 text-sm">Cancel</button>
              <button onClick={save} disabled={busy} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
