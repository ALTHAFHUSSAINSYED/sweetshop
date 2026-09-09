const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import AddProductDialog from "@/components/admin/AddProductDialog";
import { formatINR } from "@/lib/shopConfig";

export default function InventoryPanel() {
  const [products, setProducts] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const ps = await db.entities.Product.list();
      setProducts(ps);
    } catch {
      setProducts((prev) => prev || []);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startEdit = (p) => {
    setEditingId(p.id);
    setDraft({
      name: p.name,
      description: p.description || "",
      price_250g: String(p.price_250g),
      price_500g: String(p.price_500g),
      price_1kg: String(p.price_1kg),
    });
  };

  const saveEdit = async (p) => {
    if (!draft.name.trim() || !draft.price_250g || !draft.price_500g || !draft.price_1kg) return;
    setSaving(true);
    try {
      await db.entities.Product.update(p.id, {
        name: draft.name.trim(),
        description: draft.description.trim(),
        price_250g: Number(draft.price_250g),
        price_500g: Number(draft.price_500g),
        price_1kg: Number(draft.price_1kg),
      });
      setEditingId(null);
      await load();
    } catch {
      /* retry available */
    }
    setSaving(false);
  };

  const toggleStock = async (p) => {
    await db.entities.Product.update(p.id, { in_stock: !p.in_stock });
    await load();
  };

  const remove = async (id) => {
    await db.entities.Product.delete(id);
    setConfirmDelete(null);
    await load();
  };

  if (!products) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Loader2 className="w-7 h-7 animate-spin mx-auto" />
        <p className="mt-2 text-sm">Loading inventory…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {products.length} sweet{products.length === 1 ? "" : "s"} on the menu
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" /> Add New Sweet
        </Button>
      </div>

      <div className="space-y-4">
        {products.map((p) =>
          editingId === p.id ? (
            <div key={p.id} className="bg-primary/5 border border-primary/30 rounded-2xl p-4">
              <div className="flex flex-wrap items-start gap-4">
                <Image src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0" />
                <div className="flex-1 min-w-[220px] grid sm:grid-cols-2 gap-3">
                  <Input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Sweet name" />
                  <Input
                    value={draft.description}
                    onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Description"
                    className="sm:col-span-1"
                  />
                  <div className="flex gap-2">
                    <Input inputMode="numeric" value={draft.price_250g} onChange={(e) => setDraft((d) => ({ ...d, price_250g: e.target.value }))} placeholder="250g ₹" />
                    <Input inputMode="numeric" value={draft.price_500g} onChange={(e) => setDraft((d) => ({ ...d, price_500g: e.target.value }))} placeholder="500g ₹" />
                    <Input inputMode="numeric" value={draft.price_1kg} onChange={(e) => setDraft((d) => ({ ...d, price_1kg: e.target.value }))} placeholder="1kg ₹" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => saveEdit(p)} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" /> Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-4 flex flex-wrap items-center gap-4">
              <Image src={p.image_url} alt={p.name} className="w-20 h-20 rounded-xl overflow-hidden border border-border shrink-0" />
              <div className="flex-1 min-w-[180px]">
                <p className="font-semibold">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{p.description}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  250g: <span className="font-semibold text-foreground">{formatINR(p.price_250g)}</span>
                </p>
                <p>
                  500g: <span className="font-semibold text-foreground">{formatINR(p.price_500g)}</span>
                </p>
                <p>
                  1kg: <span className="font-semibold text-foreground">{formatINR(p.price_1kg)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={!!p.in_stock} onCheckedChange={() => toggleStock(p)} />
                <span className={`text-xs font-semibold ${p.in_stock ? "text-emerald-700" : "text-destructive"}`}>
                  {p.in_stock ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                  onClick={() => setConfirmDelete(p)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-foreground/40 flex items-center justify-center px-4">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-heading font-bold text-lg">Delete "{confirmDelete.name}"?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This removes the sweet from your catalog permanently. Customers with it in their cart won't be able to order it.
            </p>
            <div className="flex gap-2.5 mt-5">
              <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
                Keep
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => remove(confirmDelete.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <AddProductDialog open={dialogOpen} onOpenChange={setDialogOpen} onSaved={load} />
    </div>
  );
}