import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR, priceForWeight, WEIGHTS } from "@/lib/shopConfig";

// Product card with weight selector and bilingual support
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { t, isTelugu } = useLanguage();
  const [weight, setWeight] = useState("500g");
  const [justAdded, setJustAdded] = useState(false);
  const price = priceForWeight(product, weight);

  const isAvailable = product.in_stock !== false && product.is_in_stock !== false;

  const add = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      image_url: product.image_url,
      weight,
      quantity: 1,
      unit_price: price,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="relative">
        <Image
          src={product.image_url || "/images/andhra_pure_ghee_sweets.jpg"}
          alt={product.name}
          className="w-full aspect-square object-cover"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs ${
            isAvailable ? "bg-emerald-600 text-white" : "bg-destructive text-destructive-foreground"
          }`}
        >
          {isAvailable ? (isTelugu ? "స్టాక్ ఉంది" : "In Stock") : (isTelugu ? "అయిపోయింది" : "Sold Out")}
        </span>
        {product.badge && (
          <span className="absolute top-3 right-3 text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-heading font-bold text-lg leading-snug">{product.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex gap-1.5 pt-1">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeight(w)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                weight === w
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-auto pt-3 border-t border-border/50 flex items-center justify-between gap-2">
          <span className="font-heading font-bold text-xl text-primary">{formatINR(price)}</span>
          <Button
            onClick={add}
            disabled={!isAvailable}
            size="sm"
            className={`rounded-full gap-1.5 transition-all ${
              justAdded ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> {t("addedToCart")}
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> {t("addToCart")}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}