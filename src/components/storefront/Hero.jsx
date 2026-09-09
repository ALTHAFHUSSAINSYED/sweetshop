import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { SHOP } from "@/lib/shopConfig";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function Hero() {
  const { t, isTelugu } = useLanguage();

  const waHref = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
    `Hello ${SHOP.name}! \u{1F64F}\nI would like to place an order for fresh sweets \u{1F36C}\u{2728}`
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary/80 via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 pt-8 sm:pt-12 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left Column: Headings, Badge, Actions */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-3.5 py-1.5 rounded-full shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> {t("heroBadge")}
          </span>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.18] mt-4 text-foreground">
            {isTelugu ? (
              <>
                స్వచ్ఛమైన ఆవు నెయ్యితో చేసిన{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  అచ్చమైన ఆంధ్రా స్వీట్లు
                </span>
                .
              </>
            ) : (
              <>
                Every sweet handcrafted with{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  “Amma's Pure Love”
                </span>{" "}
                &amp; authentic tradition.
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base mt-4 max-w-lg leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-7">
            <a
              href="#sweets"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-bold text-sm hover:opacity-95 shadow-md hover:shadow-lg transition-all"
            >
              {t("heroCta")} <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-[#25D366]/40 hover:border-[#25D366] bg-card hover:bg-[#25D366]/10 text-foreground rounded-full px-5 py-3 font-bold text-sm shadow-xs transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" /> WhatsApp Order
            </a>
          </div>

          {/* Quick Shop Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-9 text-sm">
            <div className="bg-card rounded-xl p-3 border border-border shadow-xs">
              <span className="font-heading text-base sm:text-lg font-bold block text-primary">20 KM</span>
              <span className="text-[11px] text-muted-foreground leading-tight block mt-0.5">{t("featureDelivery")}</span>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border shadow-xs">
              <span className="font-heading text-base sm:text-lg font-bold block text-primary">Self Pickup</span>
              <span className="text-[11px] text-muted-foreground leading-tight block mt-0.5">{t("storePickupSub")}</span>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border shadow-xs">
              <span className="font-heading text-base sm:text-lg font-bold block text-foreground">100% Ghee</span>
              <span className="text-[11px] text-muted-foreground leading-tight block mt-0.5">{t("featurePureGhee")}</span>
            </div>
            <div className="bg-card rounded-xl p-3 border border-border shadow-xs">
              <span className="font-heading text-base sm:text-lg font-bold block text-foreground">Direct UPI</span>
              <span className="text-[11px] text-muted-foreground leading-tight block mt-0.5">{t("featureDirectUpi")}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentic Indian Sweets Festival Box Showcase */}
        <div className="relative mt-4 lg:mt-0">
          <div className="relative rounded-3xl overflow-hidden border-4 border-card shadow-2xl group bg-card">
            <img
              src="/images/festival_sweet_box.jpg"
              alt={isTelugu ? "పండుగ స్వీట్ బాక్స్" : "Festive Sweets Gift Box"}
              className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            {/* Ambient vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

            {/* Top Right Pure Ghee badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-amber-200 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-300/30 flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{isTelugu ? "100% ఆవు నెయ్యి" : "100% Pure Cow Ghee"}</span>
            </div>

            {/* Bottom Caption on Image */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                {isTelugu ? "పండుగ స్పెషల్" : "Festival Special"}
              </span>
              <p className="font-heading font-extrabold text-lg sm:text-xl text-white drop-shadow-sm">
                {isTelugu ? "పండుగ గిఫ్ట్ బాక్సులు" : "Festival Sweets Gift Box"}
              </p>
              <p className="text-xs text-white/85 mt-0.5 line-clamp-1">
                {isTelugu
                  ? "నెయ్యి మైసూర్ పాక్ · కాజు కట్లి · మోతీచూర్ లడ్డూ · మడత కాజా"
                  : "Mysore Pak · Kaju Katli · Motichoor Laddu · Kakinada Kaja"}
              </p>
            </div>
          </div>

          {/* Floating Pill Badge */}
          <div className="absolute -bottom-4 -left-2 sm:-left-6 bg-card border border-border rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-lg">
              ✨
            </div>
            <div>
              <p className="font-heading font-bold text-sm text-foreground leading-tight">
                {isTelugu ? "తాజా ప్యాకింగ్ అందుబాటులో ఉంది" : "Fresh Gift Packing Available"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isTelugu ? "రోజూ తాజా తయారీ · ఆర్డర్ చేయండి" : "Handcrafted daily in Piduguralla"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}