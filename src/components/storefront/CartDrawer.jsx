import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { formatINR } from "@/lib/shopConfig";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, updateQty, removeItem, total, count } = useCart();
  const { t, isTelugu } = useLanguage();
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
            className="fixed inset-0 bg-foreground/40 z-50 backdrop-blur-xs"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card z-50 flex flex-col shadow-2xl border-l border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {t("yourCart")} {count > 0 && <span className="text-muted-foreground font-body text-sm font-semibold">({count})</span>}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close cart"
                className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground space-y-3">
                  <ShoppingBag className="w-12 h-12 mx-auto opacity-40 text-muted-foreground" />
                  <p className="font-heading font-bold text-base text-foreground">
                    {t("emptyCartTitle")}
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                    {t("emptyCartSubtitle")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="mt-2 rounded-full"
                  >
                    {t("browseSweets")}
                  </Button>
                </div>
              ) : (
                cart.map((i) => (
                  <div key={`${i.product_id}-${i.weight}`} className="flex gap-3 bg-muted/20 p-2.5 rounded-2xl border border-border/50">
                    <Image
                      src={i.image_url}
                      alt={i.product_name}
                      className="w-18 h-18 rounded-xl shrink-0 overflow-hidden border border-border object-cover"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-sm truncate text-foreground">{i.product_name}</p>
                        <button
                          onClick={() => removeItem(i.product_id, i.weight)}
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground font-medium">
                        {i.weight} · {formatINR(i.unit_price)}
                      </p>
                      <div className="flex justify-between items-center mt-1.5">
                        <div className="flex items-center gap-1 border border-border rounded-full px-1.5 py-0.5 bg-card shadow-2xs">
                          <button
                            onClick={() => updateQty(i.product_id, i.weight, -1)}
                            aria-label="Decrease quantity"
                            className="p-0.5 rounded-full hover:bg-secondary text-foreground transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center">{i.quantity}</span>
                          <button
                            onClick={() => updateQty(i.product_id, i.weight, 1)}
                            aria-label="Increase quantity"
                            className="p-0.5 rounded-full hover:bg-secondary text-foreground transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-sm text-primary font-mono">{formatINR(i.unit_price * i.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="border-t border-border p-4 space-y-3 bg-card">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base">{t("total")}</span>
                  <span className="font-heading font-bold text-2xl text-primary">{formatINR(total)}</span>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 text-center text-xs text-foreground leading-snug">
                  🛵 {isTelugu ? "20 కి.మీ లోపు ఉచిత డెలివరీ · షాపులో సెల్ఫ్ పికప్" : "Free delivery up to 20 km · Store Self Pickup available"}
                </div>
                <Button onClick={goCheckout} className="w-full h-11 text-base font-bold shadow-md">
                  {t("checkoutButton")}
                </Button>
                <p className="text-[11px] text-center text-muted-foreground">
                  {isTelugu ? "ఆర్డర్ చేసిన తర్వాత సులభంగా డైరెక్ట్ UPI ద్వారా చెల్లించండి" : "Direct UPI payment with zero gateway charges"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}