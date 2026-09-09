import db from "@/lib/db";

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Loader2,
  Printer,
  QrCode,
  RefreshCw,
  Smartphone,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import WhatsAppFloat from "@/components/storefront/WhatsAppFloat";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { buildWhatsAppOrderLink, formatINR, SHOP } from "@/lib/shopConfig";
import OrderReceiptModal from "@/components/admin/OrderReceiptModal";

export default function Payment() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Optional manual UTR details
  const [showManualUtr, setShowManualUtr] = useState(false);
  const [utr, setUtr] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [utrError, setUtrError] = useState("");

  useEffect(() => {
    db.functions
      .invoke("getOrderDetails", { order_id: orderId })
      .then((res) => {
        const orderData = res?.data || res;
        setData(orderData);
        if (orderData?.order?.upi_utr_number) {
          setSubmitted(true);
        }
      })
      .catch((err) =>
        setLoadError(
          err?.response?.data?.error || err?.data?.error || err?.message || "Could not load this order."
        )
      );
  }, [orderId]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.upiId);
    } catch {
      /* clipboard fallback */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onProof = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const { file_url } = await db.integrations.Core.UploadFile({ file });
      setProofUrl(file_url);
    } catch {
      setUtrError("Could not upload screenshot — you can skip it.");
    }
    setUploadingProof(false);
  };

  // Simple 1-click confirmation
  const handlePaymentConfirmed = async (manualUtr = "") => {
    setSubmitting(true);
    setUtrError("");
    const finalUtr = manualUtr || utr || "Paid via UPI QR";

    try {
      await db.functions.invoke("submitPaymentUtr", {
        order_id: orderId,
        upi_utr_number: finalUtr,
        payment_proof_url: proofUrl,
      });
      setSubmitted(true);
      setData((d) => ({
        ...d,
        order: { ...d.order, upi_utr_number: finalUtr },
      }));
    } catch (err) {
      setUtrError(
        err?.response?.data?.error || err?.data?.error || err?.message || "Could not confirm. Please try again."
      );
    }
    setSubmitting(false);
  };

  let content;
  if (loadError) {
    content = (
      <div className="text-center py-20">
        <p className="text-destructive font-medium">{loadError}</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Sweets</Link>
        </Button>
      </div>
    );
  } else if (!data) {
    content = (
      <div className="text-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        <p className="mt-3">Loading your order…</p>
      </div>
    );
  } else {
    const { order, items, upi_uri } = data;
    const waLink = buildWhatsAppOrderLink(order, items);

    content = (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Order Success Title & Print Bill */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
            🎉 Order Placed Successfully
          </span>
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Order #{order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground">
            Direct UPI to <span className="font-semibold text-foreground">{SHOP.upiId}</span> · 100% Free, Zero Fees
          </p>
          <div className="pt-2 flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowReceipt(true)}
              className="gap-2 bg-card hover:bg-secondary border-border shadow-sm text-xs font-semibold"
            >
              <Printer className="w-4 h-4 text-primary" /> Print / Save Order Bill
            </Button>
          </div>
        </div>

        {/* Payment Completed Status Banner */}
        {submitted ? (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 text-center space-y-4 shadow-sm animate-in fade-in">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-emerald-900 font-heading">
                Payment Reported Successfully!
              </h2>
              <p className="text-sm text-emerald-800">
                Thank you, <span className="font-semibold">{order.customer_name}</span>! We received your payment notification for{" "}
                <span className="font-bold">{formatINR(order.total_amount)}</span>.
              </p>
              <p className="text-xs text-emerald-700">
                Our team is verifying and preparing your fresh sweets now.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" /> Message Us on WhatsApp
              </a>
              <Button asChild variant="outline" className="w-full sm:w-auto text-sm">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-1.5" /> Order More Sweets
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Simple QR Code Payment Card */
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Scan to Pay
              </p>
              <div className="font-heading font-extrabold text-3xl text-primary">
                {formatINR(order.total_amount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Works with PhonePe, Google Pay, Paytm, BHIM or any UPI app
              </p>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="bg-white p-4 rounded-2xl border-4 border-primary/20 shadow-md">
                <QRCodeSVG
                  value={upi_uri}
                  size={220}
                  bgColor="#ffffff"
                  fgColor="#1a1a1a"
                  level="M"
                />
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-primary" /> Amount {formatINR(order.total_amount)} is pre-filled
              </span>
            </div>

            {/* Mobile Direct Pay Button */}
            <a
              href={upi_uri}
              className="w-full inline-flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl py-3.5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Smartphone className="w-5 h-5" />
              Pay via UPI App (PhonePe / GPay / Paytm)
            </a>

            {/* Shop UPI ID & Copy */}
            <div className="flex items-center justify-between bg-muted/60 rounded-xl px-4 py-3 border border-border/50 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Shop UPI ID</span>
                <span className="font-mono font-bold text-sm text-foreground">{SHOP.upiId}</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyUpiId} className="h-8 gap-1.5">
                {copied ? (
                  <>
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy ID
                  </>
                )}
              </Button>
            </div>

            {/* One-Click Done Button */}
            <div className="pt-2">
              <Button
                onClick={() => handlePaymentConfirmed()}
                disabled={submitting}
                className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Confirming…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> I Have Paid {formatINR(order.total_amount)}
                  </>
                )}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Click above after paying via QR code to complete your order.
              </p>
            </div>

            {/* Optional Manual UTR Toggle */}
            <div className="border-t border-border pt-3">
              <button
                type="button"
                onClick={() => setShowManualUtr((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs text-muted-foreground hover:text-foreground py-1 font-medium"
              >
                <span>Have a 12-digit UTR Reference or Screenshot? (Optional)</span>
                {showManualUtr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showManualUtr && (
                <div className="mt-3 space-y-3 p-3.5 bg-muted/40 rounded-xl border border-border/60 text-xs">
                  <div className="space-y-1">
                    <Label htmlFor="manual-utr" className="text-xs">
                      12-digit UPI Reference / UTR Number (optional)
                    </Label>
                    <Input
                      id="manual-utr"
                      inputMode="numeric"
                      maxLength={12}
                      placeholder="e.g. 428901238910"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value.replace(/\D/g, ""))}
                      className="font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Payment Screenshot (optional)</Label>
                    {proofUrl ? (
                      <p className="text-xs text-emerald-700 font-semibold">Screenshot uploaded ✓</p>
                    ) : (
                      <label className="flex items-center gap-2 border border-dashed border-border rounded-lg p-2.5 text-muted-foreground cursor-pointer hover:border-primary/50">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingProof ? "Uploading…" : "Upload screenshot (optional)"}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={onProof} />
                      </label>
                    )}
                  </div>

                  {utrError && <p className="text-xs text-destructive">{utrError}</p>}

                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handlePaymentConfirmed(utr)}
                    disabled={submitting}
                    className="w-full text-xs"
                  >
                    Submit Reference
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WhatsApp Help & Order Items Summary */}
        <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-semibold text-foreground">Need help with your payment?</p>
            <p className="text-muted-foreground mt-0.5">Chat with our Maya Bazar shop team directly</p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <WhatsAppIcon className="w-4 h-4" /> WhatsApp
          </a>
        </div>

        {/* Printable Modal */}
        {showReceipt && (
          <OrderReceiptModal
            order={order}
            items={items}
            isOpen={showReceipt}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">{content}</div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}