import React from "react";
import { Link } from "react-router-dom";
import { Candy, Globe, Mail, Menu, Phone, ShoppingBag } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { SHOP } from "@/lib/shopConfig";

export default function Header({ onOpenMenu }) {
  const { count, setIsOpen } = useCart();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40">
      {/* Top Banner with Delivery Notice and Phone */}
      <div className="bg-accent text-accent-foreground text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
          <p className="font-medium truncate">{t("bannerText")}</p>
          <div className="flex items-center gap-4 shrink-0">
            <a href={`tel:${SHOP.phone}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
              <Phone className="w-3.5 h-3.5" />
              <span>{SHOP.phone}</span>
            </a>
            <a
              href={`mailto:${SHOP.email}`}
              className="hidden sm:flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{SHOP.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Left: Menu Hamburger + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {onOpenMenu && (
              <button
                type="button"
                onClick={onOpenMenu}
                className="inline-flex items-center gap-1.5 bg-secondary/60 hover:bg-secondary border border-border px-2.5 sm:px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                aria-label="Open category menu"
              >
                <Menu className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">{t("menu")}</span>
              </button>
            )}

            <Link to="/" className="flex items-center gap-2.5">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Candy className="w-5 h-5 text-primary" />
              </span>
              <span>
                <span className="font-heading font-bold text-lg sm:text-xl block leading-tight">
                  {SHOP.name}
                </span>
                <span className="text-[11px] sm:text-xs text-muted-foreground block">
                  {t("shopTagline")}
                </span>
              </span>
            </Link>
          </div>

          {/* Right: Language Switcher (EN / తెలుగు) + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* EN / Telugu Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1.5 bg-secondary/80 hover:bg-secondary text-secondary-foreground px-2.5 sm:px-3.5 py-2 rounded-full text-xs font-bold border border-border shadow-xs transition-all cursor-pointer hover:border-primary/50"
              title="Toggle English / తెలుగు"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className={language === "en" ? "text-primary font-black" : "text-muted-foreground"}>
                EN
              </span>
              <span className="text-border">/</span>
              <span className={language === "te" ? "text-primary font-black" : "text-muted-foreground"}>
                తెలుగు
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">{t("cart")}</span>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[11px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center shadow-xs">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}