const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  BadgeCheck,
  CheckCircle2,
  Copy,
  Loader2,
  MessageCircle,
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
import { buildWhatsAppOrderLink, formatINR, SHOP } from "@/lib/shopConfig";

export default function Payment() {
  const { orderId } = useParams();
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [uploadingProof, setUploadingProof] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    db.functions
      .invoke("getOrderDetails", { order_id: orderId })
      .then((res) => setData(res?.data || res))
      .catch((err) =>
        setLoadError(
          err?.response?.data?.error || err?.data?.error || err?.message || "Could not load this order."
        )
      );
  }, [orderId]);

  useEffect(() => {
    if (!data || submitted) return;
    const t = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [data, submitted]);

  const copyUpiId = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.upiId);
    } catch {
      /* clipboard unavailable */
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
      setUtrError("Could not upload the screenshot — you can skip it.");
    }
    setUploadingProof(false);
  };

  const submitUtr = async (e) => {
    e.preventDefault();
    setUtrError("");
    if (!/^\d{12}$/.test(utr)) {
      setUtrError("Enter the 12-digit UPI reference number from your payment app.");
      return;
    }
    setSubmitting(true);
    try {
      await db.functions.invoke("submitPaymentUtr", {
        order_id: orderId,
        upi_utr_number: utr,
        payment_proof_url: proofUrl,
      });
      setSubmitted(true);
      setData((d) => ({ ...d, order: { ...d.order, upi_utr_number: utr } }));
    } catch (err) {
      setUtrError(
        err?.response?.data?.error || err?.data?.error || err?.message || "Could not submit. Please try again."
      );
    }
    setSubmitting(false);
  };

  const mmss = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(
    secondsLeft % 60
  ).padStart(2, "0")}`;

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
      <>
        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-4 py-3 flex items-center gap-2.5 mb-8">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">
              Payment reference submitted! We'll confirm your order as soon as we verify the credit — usually within minutes.
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">Order placed successfully 🎉</p>
          <h1 className="font-heading text-3xl font-bold mt-1">
            Pay {formatINR(order.total_amount)} for Order #{order.order_number}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Direct UPI to <span className="font-semibold text-foreground">{SHOP.upiId}</span> — 100% free, zero gateway fees.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Step 1: Pay */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
                Pay via UPI
              </h2>
              <span
                className={`text-sm font-semibold font-mono px-2.5 py-1 rounded-full ${
                  secondsLeft > 0 ? "bg-emerald-50 text-emerald-700" : "bg-destructive/10 text-destructive"
                }`}
              >
                {secondsLeft > 0 ? mmss : "Expired"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 mb-5">
              {items.map((i, idx) => (
                <div key={idx} className="text-xs bg-muted rounded-lg px-2.5 py-2">
                  <span className="font-medium">{i.product_name}</span>
                  <span className="text-muted-foreground"> · {i.weight_selected} × {i.quantity}</span>
                </div>
              ))}
            </div>

            <a
              href={upi_uri}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl px-4 py-3.5 font-semibold hover:opacity-90 transition-opacity"
            >
              <Smartphone className="w-5 h-5" />
              Pay via UPI App (GPay / PhonePe / Paytm)
            </a>

            <div className="mt-6">
              {secondsLeft > 0 ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white p-4 rounded-2xl border-4 border-primary/20 shadow-md">
                    <QRCodeSVG value={upi_uri} size={208} bgColor="#ffffff" fgColor="#241f18" level="M" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scan with any UPI app — amount is pre-filled
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-3">This session expired for hygiene reasons.</p>
                  <Button variant="outline" onClick={() => setSecondsLeft(300)}>
                    <RefreshCw className="w-4 h-4" /> Refresh Payment
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-5 bg-muted rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-muted-foreground">Shop UPI ID</p>
                <p className="font-mono font-semibold text-sm">{SHOP.upiId}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyUpiId}>
                {copied ? (
                  <>
                    <BadgeCheck className="w-4 h-4 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy UPI ID
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Step 2: UTR */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
              Enter Payment Reference (UTR)
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              After paying, find the 12-digit UPI Reference / UTR number in your payment app's history.
            </p>

            <form onSubmit={submitUtr} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="utr">12-digit UPI Reference / UTR Number</Label>
                <Input
                  id="utr"
                  inputMode="numeric"
                  maxLength={12}
                  className="font-mono tracking-widest"
                  placeholder="428901238910"
                  value={submitted ? order.upi_utr_number : utr}
                  onChange={(e) => setUtr(e.target.value.replace(/\D/g, ""))}
                  disabled={submitted}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="proof">Payment Screenshot (optional)</Label>
                {proofUrl ? (
                  <p className="text-sm text-emerald-700 font-medium">Screenshot attached ✓</p>
                ) : (
                  <label
                    className={`flex items-center gap-2 border-2 border-dashed border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-pointer hover:border-primary/50 transition-colors ${
                      submitted ? "pointer-events-none opacity-50" : ""
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingProof ? "Uploading…" : "Attach a screenshot (optional)"}
                    <input id="proof" type="file" accept="image/*" className="hidden" onChange={onProof} disabled={submitted} />
                  </label>
                )}
              </div>

              {utrError && <p className="text-sm text-destructive">{utrError}</p>}

              {!submitted ? (
                <Button type="submit" className="w-full h-11" disabled={submitting || uploadingProof}>
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                    </>
                  ) : (
                    "Submit Payment Reference"
                  )}
                </Button>
              ) : (
                <p className="text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  Reference #{order.upi_utr_number} received — awaiting shop confirmation.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Step 3: WhatsApp */}
        <div className="mt-8 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-lg flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#25D366] text-white text-sm font-bold flex items-center justify-center">3</span>
              Confirm Order on WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send us your order details on WhatsApp so we can start packing right away.
            </p>
          </div>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full px-6 py-3 font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <MessageCircle className="w-5 h-5" /> Confirm on WhatsApp
          </a>
        </div>
      </>
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