const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, Loader2, MessageCircle, RefreshCw } from "lucide-react";

import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABELS, buildWhatsAppStatusLink, formatINR } from "@/lib/shopConfig";

const STATUS_CLASSES = {
  PENDING_APPROVAL: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-800 border-blue-200",
  DELIVERED: "bg-slate-100 text-slate-700 border-slate-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_KEYS = ["PENDING_APPROVAL", "PAID", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

export default function OrdersPanel() {
  const [orders, setOrders] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    try {
      const os = await db.entities.Order.list("-created_date", 200);
      const its = await db.entities.OrderItem.list("-created_date", 1000);
      setOrders(os);
      setItems(its);
    } catch {
      setOrders((prev) => prev || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const unsub = db.entities.Order.subscribe(() => load());
    return unsub;
  }, [load]);

  const itemsFor = (orderId) => items.filter((i) => i.order_id === orderId);

  const updateStatus = async (order, status) => {
    setBusyId(order.id);
    try {
      await db.entities.Order.update(order.id, { status });
      await load();
    } catch {
      /* refresh shows current state */
    }
    setBusyId("");
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Loader2 className="w-7 h-7 animate-spin mx-auto" />
        <p className="mt-2 text-sm">Loading orders…</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {orders?.length || 0} order{orders?.length === 1 ? "" : "s"} · live-updating
        </p>
        <Button variant="outline" size="sm" onClick={load}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <p>No orders yet. They'll appear here in real time as customers check out.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const orderItems = itemsFor(o.id);
            const canApprove = o.status === "PENDING_APPROVAL" && o.upi_utr_number;
            return (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-heading font-bold text-lg">#{o.order_number}</span>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          STATUS_CLASSES[o.status] || STATUS_CLASSES.PENDING_APPROVAL
                        }`}
                      >
                        {STATUS_LABELS[o.status] || o.status}
                      </span>
                      {canApprove && (
                        <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          Verify UTR &amp; approve
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {o.created_date ? new Date(o.created_date).toLocaleString("en-IN") : ""}
                    </p>
                  </div>
                  <span className="font-heading font-bold text-2xl text-primary">
                    {formatINR(o.total_amount)}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-x-8 gap-y-3 mt-4 text-sm">
                  <div>
                    <p className="font-semibold">
                      {o.customer_name}{" "}
                      <span className="text-muted-foreground font-normal">· {o.customer_phone}</span>
                    </p>
                    {o.delivery_type === "Home Delivery" ? (
                      <p className="text-muted-foreground mt-0.5">
                        🏠 {o.delivery_address} — {o.pincode}
                      </p>
                    ) : (
                      <p className="text-muted-foreground mt-0.5">🏪 Self Pickup</p>
                    )}
                  </div>
                  <div>
                    {o.upi_utr_number ? (
                      <p>
                        <span className="text-muted-foreground">UPI UTR:</span>{" "}
                        <span className="font-mono font-semibold">{o.upi_utr_number}</span>
                      </p>
                    ) : (
                      <p className="text-muted-foreground">No UTR submitted yet</p>
                    )}
                    {o.payment_proof_url && (
                      <a
                        href={o.payment_proof_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 mt-1.5 text-primary hover:underline"
                      >
                        <Image
                          src={o.payment_proof_url}
                          alt="Payment screenshot"
                          className="w-14 h-14 rounded-lg border border-border overflow-hidden"
                        />
                        <span className="inline-flex items-center gap-1 text-xs">
                          View screenshot <ExternalLink className="w-3 h-3" />
                        </span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {orderItems.map((i, idx) => (
                    <span key={idx} className="text-xs bg-muted rounded-full px-2.5 py-1">
                      {i.product_name} · {i.weight_selected} × {i.quantity} — {formatINR(i.price_at_purchase * i.quantity)}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-4 border-t border-border">
                  <Select value={o.status} onValueChange={(v) => updateStatus(o, v)} disabled={busyId === o.id}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_KEYS.map((s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {canApprove && (
                    <Button
                      onClick={() => updateStatus(o, "PAID")}
                      disabled={busyId === o.id}
                      className="bg-emerald-600 hover:bg-emerald-600/90 text-white"
                    >
                      {busyId === o.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BadgeCheck className="w-4 h-4" />
                      )}
                      Approve Payment
                    </Button>
                  )}

                  <a
                    href={buildWhatsAppStatusLink(o, STATUS_LABELS[o.status] || o.status)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-[#25D366]/50 text-[#1a7a3a] rounded-md px-3 h-9 text-sm font-medium hover:bg-[#25D366]/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Customer
                  </a>

                  {busyId === o.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}