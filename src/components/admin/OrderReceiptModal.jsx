import React, { useState } from "react";
import { Candy, CheckCircle, Printer, Receipt, Store, Truck, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SHOP, STATUS_LABELS, formatINR } from "@/lib/shopConfig";

export default function OrderReceiptModal({ order, items = [], isOpen, onClose }) {
  const [format, setFormat] = useState("standard"); // 'standard' (A4/Invoice) or 'thermal' (POS 80mm)

  if (!order) return null;

  const handlePrint = () => {
    const root = document.getElementById("root");
    if (root) {
      root.classList.add("no-print");
    }
    window.print();
  };

  const formattedDate = order.created_date
    ? new Date(order.created_date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "N/A";

  const isDelivery = order.delivery_type === "Home Delivery";
  const statusText = STATUS_LABELS[order.status] || order.status;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl w-[95vw] max-h-[92vh] overflow-y-auto p-0 gap-0 border border-border shadow-2xl bg-card">
        {/* Modal Top Bar - Hidden when printing */}
        <div className="no-print sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            <DialogTitle className="text-base font-bold font-heading">
              Print Order Bill #{order.order_number}
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2">
            {/* Format Switcher */}
            <div className="bg-muted p-0.5 rounded-lg flex items-center text-xs font-medium">
              <button
                type="button"
                onClick={() => setFormat("standard")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  format === "standard"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Standard Bill
              </button>
              <button
                type="button"
                onClick={() => setFormat("thermal")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  format === "thermal"
                    ? "bg-card text-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                POS Thermal Slip
              </button>
            </div>

            <Button
              onClick={handlePrint}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Bill
            </Button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-4 sm:p-8 flex justify-center bg-muted/30 print:bg-white print:p-0">
          {format === "standard" ? (
            /* STANDARD A4 / INVOICE VIEW */
            <div className="printable-order-receipt w-full max-w-2xl bg-white text-slate-900 border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:max-w-none">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-lg">
                        PS
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-heading">
                        {SHOP.name}
                      </h1>
                    </div>
                    <p className="text-xs text-slate-600 font-medium italic">{SHOP.tagline}</p>
                    <p className="text-xs text-slate-600 max-w-md mt-1 leading-relaxed">
                      {SHOP.address}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-700 font-medium pt-1">
                      <span>📞 Phone / WhatsApp: {SHOP.phone}</span>
                      <span>💳 UPI ID: {SHOP.upiId}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block bg-slate-900 text-white text-xs uppercase tracking-wider font-bold px-3 py-1 rounded">
                      TAX INVOICE / BILL
                    </span>
                    <p className="font-mono font-bold text-lg text-slate-900 mt-2">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{formattedDate}</p>
                    <span
                      className={`inline-block mt-2 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        order.status === "PAID"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                          : "bg-amber-50 text-amber-800 border-amber-300"
                      }`}
                    >
                      {statusText}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer & Fulfillment Info */}
              <div className="grid grid-cols-2 gap-6 py-5 border-b border-slate-200 text-xs">
                <div>
                  <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1.5">
                    CUSTOMER DETAILS
                  </h3>
                  <p className="font-bold text-slate-900 text-sm">{order.customer_name}</p>
                  <p className="text-slate-700 font-medium mt-0.5">📞 +91 {order.customer_phone}</p>
                  {order.upi_utr_number && (
                    <p className="text-slate-600 font-mono mt-1">
                      UPI Ref (UTR): <span className="font-semibold text-slate-900">{order.upi_utr_number}</span>
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1.5">
                    FULFILLMENT DETAILS
                  </h3>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    {isDelivery ? (
                      <>
                        <Truck className="w-4 h-4 text-amber-600" /> Doorstep Delivery
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4 text-emerald-600" /> Store Counter Pickup
                      </>
                    )}
                  </div>
                  {isDelivery ? (
                    <div className="mt-1 text-slate-700 leading-relaxed">
                      <p>{order.delivery_address}</p>
                      <p className="font-medium text-slate-900 mt-0.5">Pincode: {order.pincode}</p>
                    </div>
                  ) : (
                    <p className="mt-1 text-slate-600">
                      Collect directly at {SHOP.name}, Maya Bazar, Piduguralla.
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="py-4">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-slate-900 uppercase text-[11px] font-bold">
                      <th className="py-2 px-1 w-10 text-center">#</th>
                      <th className="py-2 px-2">Item Description</th>
                      <th className="py-2 px-2 text-center w-20">Weight</th>
                      <th className="py-2 px-2 text-right w-24">Rate</th>
                      <th className="py-2 px-2 text-center w-16">Qty</th>
                      <th className="py-2 px-2 text-right w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {items && items.length > 0 ? (
                      items.map((item, idx) => {
                        const price = item.price_at_purchase ?? item.price ?? item.unit_price ?? 0;
                        const qty = item.quantity || 1;
                        const wt = item.weight_selected || item.weight || "";
                        return (
                          <tr key={idx} className={idx % 2 === 0 ? "bg-slate-50/60" : "bg-white"}>
                            <td className="py-2.5 px-1 text-center font-medium text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-2 font-semibold text-slate-900">
                              {item.product_name}
                            </td>
                            <td className="py-2.5 px-2 text-center font-medium">
                              {wt || "—"}
                            </td>
                            <td className="py-2.5 px-2 text-right font-mono">
                              {formatINR(price)}
                            </td>
                            <td className="py-2.5 px-2 text-center font-bold">
                              {qty}
                            </td>
                            <td className="py-2.5 px-2 text-right font-bold font-mono text-slate-900">
                              {formatINR(price * qty)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-500">
                          Order items list
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Calculations & Summary */}
              <div className="border-t-2 border-slate-900 pt-3 flex justify-between items-start">
                <div className="text-xs text-slate-600 max-w-xs space-y-1">
                  <p className="font-semibold text-slate-800">Payment Details:</p>
                  <p>Mode: Direct UPI ({SHOP.upiId})</p>
                  {order.upi_utr_number && <p>UTR Reference: {order.upi_utr_number}</p>}
                  <p className="text-[11px] text-slate-500 italic mt-2">
                    * All items prepared fresh with 100% pure ghee and authentic ingredients.
                  </p>
                </div>

                <div className="w-56 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">{formatINR(order.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge:</span>
                    <span className="font-medium text-emerald-700">FREE</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-slate-900">
                    <span className="font-bold text-sm">Grand Total:</span>
                    <span className="font-mono font-bold text-lg text-slate-900">
                      {formatINR(order.total_amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bill Footer */}
              <div className="border-t border-dashed border-slate-300 mt-6 pt-4 text-center text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  🙏 Thank you for choosing Palnadu Sweets!
                </p>
                <p className="text-[11px]">
                  Maya Bazar, Piduguralla, Palnadu Dist · WhatsApp/Support: {SHOP.phone}
                </p>
                <p className="text-[10px] text-slate-400">
                  This is a computer-generated order receipt.
                </p>
              </div>
            </div>
          ) : (
            /* COMPACT THERMAL POS SLIP (80mm) */
            <div className="printable-order-receipt thermal-mode w-[310px] bg-white text-black font-mono border border-slate-300 p-4 rounded shadow-sm text-xs print:border-none print:shadow-none print:p-1 print:w-[78mm] print:mx-auto">
              {/* Shop Header */}
              <div className="text-center pb-2 border-b border-dashed border-black">
                <p className="text-sm font-black uppercase tracking-wider">{SHOP.name}</p>
                <p className="text-[10px] mt-0.5">Maya Bazar, Piduguralla</p>
                <p className="text-[10px]">Ph: {SHOP.phone}</p>
                <p className="text-[10px] mt-1 font-bold">-- COUNTER &amp; KITCHEN SLIP --</p>
              </div>

              {/* Order Meta */}
              <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-bold">ORDER: #{order.order_number}</span>
                  <span>{statusText}</span>
                </div>
                <div className="text-[10px] text-slate-600">{formattedDate}</div>
                <div className="mt-1 pt-1 border-t border-dotted border-slate-300">
                  <p className="font-bold">{order.customer_name}</p>
                  <p>Ph: {order.customer_phone}</p>
                  <p className="font-bold uppercase mt-0.5">
                    {isDelivery ? ">> HOME DELIVERY <<" : ">> STORE SELF PICKUP <<"}
                  </p>
                  {isDelivery && (
                    <p className="text-[10px] leading-tight mt-0.5">
                      {order.delivery_address} - {order.pincode}
                    </p>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="py-2 border-b border-dashed border-black">
                <div className="flex justify-between font-bold text-[10px] uppercase pb-1 border-b border-dotted border-black">
                  <span>ITEM</span>
                  <span>QTY</span>
                  <span>AMT</span>
                </div>
                <div className="space-y-1 mt-1">
                  {items.map((i, idx) => {
                    const price = i.price_at_purchase ?? i.price ?? i.unit_price ?? 0;
                    const qty = i.quantity || 1;
                    const wt = i.weight_selected || i.weight || "";
                    return (
                      <div key={idx} className="text-[11px]">
                        <div className="font-bold">{i.product_name}</div>
                        <div className="flex justify-between text-[10px] text-slate-700 pl-1">
                          <span>{wt}</span>
                          <span>x {qty}</span>
                          <span className="font-bold text-black font-mono">
                            ₹{price * qty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Totals */}
              <div className="py-2 border-b border-dashed border-black space-y-1 text-[11px]">
                <div className="flex justify-between font-bold text-sm pt-0.5">
                  <span>TOTAL:</span>
                  <span className="font-mono">₹{Number(order.total_amount).toLocaleString("en-IN")}</span>
                </div>
                {order.upi_utr_number && (
                  <p className="text-[10px] mt-1">UTR: {order.upi_utr_number}</p>
                )}
              </div>

              {/* Footer */}
              <div className="text-center pt-2 text-[10px] space-y-0.5">
                <p className="font-bold">THANK YOU FOR VISITING!</p>
                <p>Pure Ghee Sweets &amp; Savouries</p>
                <p className="text-[9px] text-slate-500">***</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
