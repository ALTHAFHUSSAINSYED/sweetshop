import React from "react";
import { ArrowDown, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import { SHOP } from "@/lib/shopConfig";
import { useLanguage } from "@/context/LanguageContext";
import WhatsAppIcon from "@/components/WhatsAppIcon";

const GIFT_IMG =
  "https://media.db.com/images/public/6aa112672ab451127a3ae617/a6f16ae48_generated_f9154c16.jpg";

export default function Hero() {
  const { t, isTelugu } = useLanguage();

  const waHref = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
    `Hello ${SHOP.name}! \u{1F64F}\nI would like to place an order for fresh sweets \u{1F36C}\u{2728}`
  )}`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-background to-primary/5">
      <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-12 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> {t("heroBadge")}
          </span>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-4 text-foreground">
            {isTelugu ? (
              <>
                స్వచ్ఛమైన ఆవు నెయ్యితో చేసిన{" "}
                <span className="text-primary italic">అచ్చమైన ఆంధ్రా స్వీట్లు</span>.
              </>
            ) : (
              <>
                Every sweet crafted with{" "}
                <span className="text-primary italic">Amma's pure love</span> &amp; tradition.
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg mt-4 max-w-md leading-relaxed">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="#sweets"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-6 py-3 font-semibold hover:opacity-90 shadow-sm transition-all"
            >
              {t("heroCta")} <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border-2 border-primary/40 text-primary rounded-full px-5 py-3 font-semibold hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" /> WhatsApp
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 text-sm">
            <div className="bg-card/70 rounded-xl p-3 border border-border shadow-2xs">
              <span className="font-heading text-lg sm:text-xl font-bold block text-primary">20 KM</span>
              <span className="text-xs text-muted-foreground">{t("featureDelivery")}</span>
            </div>
            <div className="bg-card/70 rounded-xl p-3 border border-border shadow-2xs">
              <span className="font-heading text-lg sm:text-xl font-bold block text-primary">Self Pickup</span>
              <span className="text-xs text-muted-foreground">{t("storePickupSub")}</span>
            </div>
            <div className="bg-card/70 rounded-xl p-3 border border-border shadow-2xs">
              <span className="font-heading text-lg sm:text-xl font-bold block">100% Ghee</span>
              <span className="text-xs text-muted-foreground">{t("featurePureGhee")}</span>
            </div>
            <div className="bg-card/70 rounded-xl p-3 border border-border shadow-2xs">
              <span className="font-heading text-lg sm:text-xl font-bold block">Direct UPI</span>
              <span className="text-xs text-muted-foreground">{t("featureDirectUpi")}</span>
            </div>
          </div>
        </div>

        <div className="relative max-lg:hidden">
          <div className="rounded-3xl overflow-hidden border-4 border-card shadow-2xl rotate-1">
            <Image src={GIFT_IMG} alt="Festive sweet gift box" className="w-full aspect-[4/3]" />
          </div>
          <div className="absolute -bottom-4 -left-6 bg-card border border-border rounded-2xl shadow-lg px-4 py-3 -rotate-2">
            <p className="font-heading font-bold text-sm sm:text-base">
              {isTelugu ? "పండుగ గిఫ్ట్ బాక్సులు" : "Festival Gift Boxes"}
            </p>
            <p className="text-xs text-muted-foreground">
              {isTelugu ? "తాజా ప్యాకింగ్ అందుబాటులో ఉంది" : "Now available · Fresh packing"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}