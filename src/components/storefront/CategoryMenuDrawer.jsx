import React, { useState } from "react";
import {
  Candy,
  ChevronDown,
  ChevronRight,
  Globe,
  MapPin,
  Phone,
  Sparkles,
  X,
} from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { CATEGORY_TAXONOMY, SHOP } from "@/lib/shopConfig";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function CategoryMenuDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
}) {
  const { language, toggleLanguage, isTelugu, t } = useLanguage();
  const [expandedCategories, setExpandedCategories] = useState({
    "ghee-specials": true,
    "traditional-andhra": true,
  });

  if (!isOpen) return null;

  const toggleExpand = (catId, e) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleSelect = (categoryName, keyword = "") => {
    onSelectCategory(categoryName, keyword);
    onClose();

    // Smooth scroll to catalog section
    setTimeout(() => {
      const el = document.getElementById("sweets");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dark Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
      />

      {/* Drawer Panel - Left Slide In */}
      <div className="relative w-full max-w-sm bg-card text-foreground h-full shadow-2xl z-10 flex flex-col border-r border-border animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Candy className="w-5 h-5 text-primary" />
            </span>
            <div>
              <span className="font-heading font-bold text-lg block leading-tight">
                {SHOP.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {t("categoryMenu")}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Switch Bar Inside Drawer */}
        <div className="px-4 py-3 bg-muted/40 border-b border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-primary" />
            Language / భాష:
          </span>
          <button
            type="button"
            onClick={toggleLanguage}
            className="inline-flex items-center gap-1.5 bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm hover:border-primary transition-all"
          >
            <span className={language === "en" ? "text-primary font-bold" : "text-muted-foreground"}>
              EN
            </span>
            <span className="text-border">|</span>
            <span className={language === "te" ? "text-primary font-bold" : "text-muted-foreground"}>
              తెలుగు
            </span>
          </button>
        </div>

        {/* Categories & Subcategories Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {/* All Sweets Button */}
          <button
            type="button"
            onClick={() => handleSelect("All Sweets", "")}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
              selectedCategory === "All Sweets"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "hover:bg-muted text-foreground"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>{t("allSweets")}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>

          <div className="pt-2 pb-1 px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            {t("allCategories")}
          </div>

          {/* Taxonomy Categories */}
          {CATEGORY_TAXONOMY.map((cat) => {
            const isExpanded = Boolean(expandedCategories[cat.id]);
            const isCatActive = selectedCategory === cat.categoryName;
            const categoryTitle = isTelugu ? cat.name_te : cat.name_en;

            return (
              <div
                key={cat.id}
                className="rounded-2xl border border-border/70 overflow-hidden bg-card/60 transition-all"
              >
                {/* Category Header Row */}
                <div
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isCatActive ? "bg-primary/10 border-primary" : "hover:bg-muted/60"
                  }`}
                  onClick={() => handleSelect(cat.categoryName, "")}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{cat.icon}</span>
                    <span className="text-sm font-bold text-foreground">
                      {categoryTitle}
                    </span>
                  </div>

                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <button
                      type="button"
                      onClick={(e) => toggleExpand(cat.id, e)}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80"
                      aria-label="Toggle subcategories"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Subcategories List */}
                {isExpanded && cat.subcategories && (
                  <div className="bg-muted/30 border-t border-border/50 py-1 px-2 space-y-0.5">
                    {cat.subcategories.map((sub) => {
                      const subTitle = isTelugu ? sub.name_te : sub.name_en;
                      const keyword = sub.keywords?.[0] || sub.name_en;

                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => handleSelect(cat.categoryName, keyword)}
                          className="w-full text-left flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-foreground/85 hover:bg-card hover:text-primary transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {subTitle}
                          </span>
                          <ChevronRight className="w-3 h-3 text-muted-foreground opacity-60" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Drawer Footer Contact Info */}
        <div className="p-4 border-t border-border bg-card space-y-3">
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-snug">{SHOP.address}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`tel:${SHOP.phone}`}
              className="inline-flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-primary" /> {t("callUs")}
            </a>
            <a
              href={`https://wa.me/${SHOP.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
