import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatINR, priceForWeight, WEIGHTS } from "@/lib/shopConfig";

// Product card with weight selector
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [weight, setWeight] = useState("500g");
  const price = priceForWeight(product, weight);

  const add = () =>
    addItem({
      product_id: product.id,
      product_name: product.name,
      image_url: product.image_url,
      weight,
      quantity: 1,
      unit_price: price,
    });

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col"
    >
      <div className="relative">
        <Image src={product.image_url} alt={product.name} className="w-full aspect-square" />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
            product.in_stock ? "bg-emerald-600 text-white" : "bg-destructive text-destructive-foreground"
          }`}
        >
          {product.in_stock ? "In Stock" : "Sold Out"}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-heading font-bold text-lg leading-snug">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{product.description}</p>
        </div>

        <div className="flex gap-1.5">
          {WEIGHTS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeight(w)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                weight === w
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="font-heading font-bold text-xl text-primary">{formatINR(price)}</span>
          <Button onClick={add} disabled={!product.in_stock} className="rounded-full">
            <Plus className="w-4 h-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}