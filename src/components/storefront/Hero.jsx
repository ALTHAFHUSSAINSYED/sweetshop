const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from "react";
import { ArrowDown, MessageCircle, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { SHOP } from "@/lib/shopConfig";

const GIFT_IMG =
  "https://media.db.com/images/public/6aa112672ab451127a3ae617/a6f16ae48_generated_f9154c16.jpg";

export default function Hero() {
  const waHref = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
    `Hello ${SHOP.name}! I would like to place an order 🍬`
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Fresh batch every morning
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-4">
            Sweets made the <span className="text-primary italic">grandmother's</span> way.
          </h1>
          <p className="text-muted-foreground text-lg mt-4 max-w-md">
            Pure desi ghee, premium dry fruits, zero compromises. Order online and pay
            directly via UPI — no gateway fees, ever.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#sweets"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Sweets <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-primary/40 text-primary rounded-full px-6 py-3 font-semibold hover:border-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Order on WhatsApp
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 text-sm">
            <div className="bg-card/60 rounded-xl p-2.5 border border-border">
              <span className="font-heading text-xl font-bold block text-primary">20 KM</span>
              <span className="text-xs text-muted-foreground">Village &amp; town delivery</span>
            </div>
            <div className="bg-card/60 rounded-xl p-2.5 border border-border">
              <span className="font-heading text-xl font-bold block text-primary">Self Pick</span>
              <span className="text-xs text-muted-foreground">At Maya Bazar shop</span>
            </div>
            <div className="bg-card/60 rounded-xl p-2.5 border border-border">
              <span className="font-heading text-xl font-bold block">100%</span>
              <span className="text-xs text-muted-foreground">Pure desi ghee</span>
            </div>
            <div className="bg-card/60 rounded-xl p-2.5 border border-border">
              <span className="font-heading text-xl font-bold block">Direct UPI</span>
              <span className="text-xs text-muted-foreground">Zero gateway fees</span>
            </div>
          </div>
        </div>

        <div className="relative max-lg:hidden">
          <div className="rounded-3xl overflow-hidden border-4 border-card shadow-2xl rotate-1">
            <Image src={GIFT_IMG} alt="Festive sweet gift box" className="w-full aspect-[4/3]" />
          </div>
          <div className="absolute -bottom-4 -left-6 bg-card border border-border rounded-2xl shadow-lg px-4 py-3 -rotate-2">
            <p className="font-heading font-bold">Festival Gift Boxes</p>
            <p className="text-xs text-muted-foreground">Now available · Free packing</p>
          </div>
        </div>
      </div>
    </section>
  );
}