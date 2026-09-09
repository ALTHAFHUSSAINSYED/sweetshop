import React from "react";
import { Link } from "react-router-dom";
import { Candy, Mail, Phone, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { DELIVERY_CONFIG, SHOP } from "@/lib/shopConfig";

export default function Header() {
  const { count, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-accent text-accent-foreground text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
          <p className="font-medium truncate">{DELIVERY_CONFIG.bannerText}</p>
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

      <div className="bg-card/90 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Candy className="w-5 h-5 text-primary" />
            </span>
            <span>
              <span className="font-heading font-bold text-xl block leading-tight">{SHOP.name}</span>
              <span className="text-xs text-muted-foreground">Since 1985 · Pure Ghee Sweets</span>
            </span>
          </Link>

          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-primary text-primary-foreground rounded-full px-4 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}