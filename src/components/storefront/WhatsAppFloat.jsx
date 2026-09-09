import React from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { SHOP } from "@/lib/shopConfig";

export default function WhatsAppFloat() {
  const message = `Hello ${SHOP.name}! \u{1F64F}\nI would like to place an order for fresh sweets \u{1F36C}\u{2728}`;
  const href = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <aside aria-label="WhatsApp Chat Widget" className="fixed bottom-5 right-5 z-40 group">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
        className="relative flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
      >
        {/* Subtle Pulse Effect */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping pointer-events-none" />

        {/* 3D WhatsApp Button */}
        <WhatsAppIcon is3D={true} />

        {/* Tooltip on Hover */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-card text-foreground text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Order on WhatsApp 💬
        </span>
      </a>
    </aside>
  );
}