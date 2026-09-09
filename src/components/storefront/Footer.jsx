import React from "react";
import { Link } from "react-router-dom";
import { SHOP } from "@/lib/shopConfig";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t, isTelugu } = useLanguage();

  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-heading font-bold text-lg">
            {isTelugu ? SHOP.nameTe : SHOP.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {t("footerAbout")}
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("contactTitle")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>
              <a className="hover:text-primary transition-colors font-medium" href={`tel:${SHOP.phone}`}>
                📞 {SHOP.phone}
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href={`mailto:${SHOP.email}`}>
                ✉️ {SHOP.email}
              </a>
            </li>
            <li>📍 {isTelugu ? SHOP.addressTe : SHOP.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("quickLinksTitle")}</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>
              <Link className="hover:text-primary transition-colors inline-flex items-center gap-1.5" to="/">
                <span>🍬</span> {t("sweetsCatalogLink")}
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent("Namaste! I would like to inquire about sweets from Palnadu Sweets.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
              >
                <span>💬</span> WhatsApp Store
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 {isTelugu ? SHOP.nameTe : SHOP.name} · {t("copyright")}
      </div>
    </footer>
  );
}