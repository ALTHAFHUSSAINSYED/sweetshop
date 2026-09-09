import db from "@/lib/db";

import React, { useCallback, useEffect, useState } from "react";
import { BadgeCheck, ExternalLink, Loader2, MessageCircle, Printer, RefreshCw } from "lucide-react";

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
import OrderReceiptModal from "./OrderReceiptModal";

const STATUS_CLASSES = {
  PENDING_APPROVAL: "bg-amber-100 text-amber-800 border-amber-200",
  PAID: "bg-emerald-100 text-emerald-800 border-emerald-200",
  OUT_FOR_DELIVERY: "bg-blue-100 text-blue-800 border-blue-200",
  DELIVERED: "bg-slate-100 text-slate-700 border-slate-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_KEYS = ["PENDING_APPROVAL", "PAID", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const SAMPLE_ORDER = {
  id: "sample-1",
  order_number: "ORD-1001",
  customer_name: "Ramesh Reddy",
  customer_phone: "9876543210",
  delivery_type: "Home Delivery",
  delivery_address: "Near Ramalayam Temple, Main Road, Janapadu Village",
  pincode: "522413",
  status: "PAID",
  total_amount: 1450,
  upi_utr_number: "428901238910",
  created_date: new Date().toISOString(),
};

const SAMPLE_ITEMS = [
  {
    product_name: "Palnadu Pure Ghee Kaju Katli",
    weight_selected: "500g",
    price_at_purchase: 450,
    quantity: 2,
  },
  {
    product_name: "Special Bandar Laddu",
    weight_selected: "1kg",
    price_at_purchase: 550,
    quantity: 1,
  },
];

export default function OrdersPanel() {
  const [orders, setOrders] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [printingOrder, setPrintingOrder] = useState(null);

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

  const itemsFor = (orderId) => {
    if (orderId === "sample-1") return SAMPLE_ITEMS;
    return items.filter((i) => i.order_id === orderId);
  };

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
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-muted-foreground">
          {orders?.length || 0} order{orders?.length === 1 ? "" : "s"} · live-updating
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPrintingOrder(SAMPLE_ORDER)}
            className="gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
          >
            <Printer className="w-4 h-4" /> Preview Sample Bill
          </Button>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 px-4 text-muted-foreground border border-dashed border-border rounded-2xl space-y-4">
          <p className="text-base">No orders yet. They'll appear here in real time as customers check out.</p>
          <div>
            <Button
              variant="outline"
              onClick={() => setPrintingOrder(SAMPLE_ORDER)}
              className="gap-2 bg-card border-primary/50 text-primary hover:bg-primary/10"
            >
              <Printer className="w-4 h-4" /> Test / Preview Order Printout
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const orderItems = itemsFor(o.id);
            const canApprove = o.status === "PENDING_APPROVAL" && o.upi_utr_number;
            return (
              <div key={o.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/30 transition-colors">
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
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold text-2xl text-primary">
                      {formatINR(o.total_amount)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setPrintingOrder(o)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-sm"
                    >
                      <Printer className="w-4 h-4" /> Print Bill
                    </Button>
                  </div>
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
                  {orderItems.map((i, idx) => {
                    const price = i.price_at_purchase ?? i.price ?? i.unit_price ?? 0;
                    const qty = i.quantity || 1;
                    const wt = i.weight_selected || i.weight || "";
                    return (
                      <span key={idx} className="text-xs bg-muted rounded-full px-2.5 py-1">
                        {i.product_name} {wt ? `· ${wt}` : ""} × {qty} — {formatINR(price * qty)}
                      </span>
                    );
                  })}
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

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrintingOrder(o)}
                    className="gap-1.5 h-9"
                  >
                    <Printer className="w-4 h-4 text-primary" /> Print Bill
                  </Button>

                  {busyId === o.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {printingOrder && (
        <OrderReceiptModal
          order={printingOrder}
          items={itemsFor(printingOrder.id)}
          isOpen={Boolean(printingOrder)}
          onClose={() => setPrintingOrder(null)}
        />
      )}
    </div>
  );
}