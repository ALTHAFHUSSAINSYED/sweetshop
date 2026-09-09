const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/shopConfig";

const EMPTY = {
  name: "",
  category: "Ghee Specials",
  description: "",
  price_250g: "",
  price_500g: "",
  price_1kg: "",
  image_url: "",
  in_stock: true,
};

export default function AddProductDialog({ open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
    } catch {
      setError("Image upload failed. Please try again.");
    }
    setUploading(false);
  };

  const save = async () => {
    setError("");
    if (!form.name.trim()) {
      setError("Please enter the sweet's name.");
      return;
    }
    if (!form.price_250g || !form.price_500g || !form.price_1kg) {
      setError("All three prices (250g / 500g / 1kg) are required.");
      return;
    }
    setSaving(true);
    try {
      await db.entities.Product.create({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price_250g: Number(form.price_250g),
        price_500g: Number(form.price_500g),
        price_1kg: Number(form.price_1kg),
        image_url: form.image_url,
        in_stock: form.in_stock,
      });
      setForm(EMPTY);
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || "Could not save the sweet.");
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add New Sweet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="np-name">Sweet Name</Label>
            <Input id="np-name" value={form.name} onChange={set("name")} placeholder="Kaju Katli" />
          </div>

          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter((c) => c !== "All Sweets").map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="np-desc">Description</Label>
            <Input id="np-desc" value={form.description} onChange={set("description")} placeholder="Short, tasty description…" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="np-p1">Price · 250g (₹)</Label>
              <Input id="np-p1" inputMode="numeric" value={form.price_250g} onChange={(e) => setForm((f) => ({ ...f, price_250g: e.target.value.replace(/[^\d.]/g, "") }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="np-p2">Price · 500g (₹)</Label>
              <Input id="np-p2" inputMode="numeric" value={form.price_500g} onChange={(e) => setForm((f) => ({ ...f, price_500g: e.target.value.replace(/[^\d.]/g, "") }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="np-p3">Price · 1kg (₹)</Label>
              <Input id="np-p3" inputMode="numeric" value={form.price_1kg} onChange={(e) => setForm((f) => ({ ...f, price_1kg: e.target.value.replace(/[^\d.]/g, "") }))} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Sweet Image</Label>
            {form.image_url ? (
              <div className="flex items-center gap-3">
                <Image src={form.image_url} alt="New sweet" className="w-16 h-16 rounded-xl overflow-hidden border border-border" />
                <Button variant="outline" size="sm" onClick={() => setForm((f) => ({ ...f, image_url: "" }))}>
                  Replace
                </Button>
              </div>
            ) : (
              <label className="flex items-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-5 text-sm text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" /> Upload a photo
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
              </label>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted px-4 py-3">
            <div>
              <p className="text-sm font-semibold">In Stock</p>
              <p className="text-xs text-muted-foreground">Hide from ordering when sold out</p>
            </div>
            <Switch checked={form.in_stock} onCheckedChange={(v) => setForm((f) => ({ ...f, in_stock: v }))} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving || uploading}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : (
              "Add Sweet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}