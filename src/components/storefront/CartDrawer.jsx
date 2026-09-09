import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/shopConfig";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQty, removeItem, total, count } = useCart();
  const navigate = useNavigate();

  const goCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-foreground/40 z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Your Cart {count > 0 && <span className="text-muted-foreground font-body text-sm">({count})</span>}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((i) => (
                  <div key={`${i.product_id}-${i.weight}`} className="flex gap-3">
                    <Image
                      src={i.image_url}
                      alt={i.product_name}
                      className="w-20 h-20 rounded-xl shrink-0 overflow-hidden border border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <p className="font-semibold truncate">{i.product_name}</p>
                        <button
                          onClick={() => removeItem(i.product_id, i.weight)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {i.weight} · {formatINR(i.unit_price)}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2 border border-border rounded-full px-1 py-0.5">
                          <button
                            onClick={() => updateQty(i.product_id, i.weight, -1)}
                            aria-label="Decrease quantity"
                            className="p-1 rounded-full hover:bg-secondary transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{i.quantity}</span>
                          <button
                            onClick={() => updateQty(i.product_id, i.weight, 1)}
                            aria-label="Increase quantity"
                            className="p-1 rounded-full hover:bg-secondary transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-semibold text-sm">{formatINR(i.unit_price * i.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="font-heading font-bold text-2xl text-primary">{formatINR(total)}</span>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-center text-xs text-foreground">
                  🛵 Delivery up to 20 km (Piduguralla &amp; villages) · 🛍️ Self Pickup
                </div>
                <Button onClick={goCheckout} className="w-full h-11 text-base">
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Pay via direct UPI after checkout — zero gateway fees
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}