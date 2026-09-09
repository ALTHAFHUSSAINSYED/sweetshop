import React from "react";
import { MessageCircle } from "lucide-react";
import { SHOP } from "@/lib/shopConfig";

export default function WhatsAppFloat() {
  const href = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
    `Hello ${SHOP.name}! I would like to place an order 🍬`
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}