const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MapPin, Phone, ShieldCheck, ShoppingBag, User } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { DELIVERY_CONFIG, formatINR, SHOP } from "@/lib/shopConfig";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    pincode: "",
    delivery_type: "Home Delivery",
  });
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    if (form.customer_name.trim().length < 2) return "Please enter your full name";
    if (!/^\d{10}$/.test(form.customer_phone)) return "Please enter a valid 10-digit mobile number";
    if (form.delivery_type === "Home Delivery") {
      if (form.delivery_address.trim().length < 8) return "Please enter your full delivery address";
      if (!/^\d{6}$/.test(form.pincode)) return "Please enter a valid 6-digit pincode";
    }
    return "";
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setPlacing(true);
    try {
      const res = await db.functions.invoke("createOrder", {
        ...form,
        items: cart.map((i) => ({
          product_id: i.product_id,
          weight: i.weight,
          quantity: i.quantity,
        })),
      });
      const data = res?.data || res;
      clearCart();
      navigate(`/payment/${data.order_id}`);
    } catch (err) {
      const msg =
        err?.response?.data?.error || err?.data?.error || err?.message || "Could not place the order. Please try again.";
      setError(msg);
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-14 h-14 mx-auto text-muted-foreground/40" />
          <h1 className="font-heading text-2xl font-bold mt-4">Your cart is empty</h1>
          <p className="text-muted-foreground mt-1">Add some sweets before checking out.</p>
          <Button asChild className="mt-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4" /> Back to Sweets
            </Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Continue shopping
        </Link>
        <h1 className="font-heading text-3xl font-bold mt-3 mb-6">Checkout</h1>

        <form onSubmit={placeOrder} className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Your Details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.customer_name} onChange={set("customer_name")} placeholder="Rahul Sharma" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Mobile Number (10 digits)</Label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-9"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.customer_phone}
                      onChange={(e) => setForm((f) => ({ ...f, customer_phone: e.target.value.replace(/\D/g, "") }))}
                      placeholder="93816 75510"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-heading font-bold text-lg">Delivery &amp; Pickup Options</h2>
                <span className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full">
                  ⚡ 20 KM Delivery Radius
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    value: "Home Delivery",
                    label: "Doorstep Delivery (20km)",
                    sub: "Piduguralla & surrounding villages",
                  },
                  {
                    value: "Self Pickup",
                    label: "Store Self Pickup",
                    sub: "Collect fresh from Maya Bazar shop",
                  },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm((f) => ({ ...f, delivery_type: opt.value }))}
                    className={`rounded-xl border-2 p-3.5 text-left transition-all ${
                      form.delivery_type === opt.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.sub}</span>
                  </button>
                ))}
              </div>

              {form.delivery_type === "Self Pickup" && (
                <div className="rounded-xl bg-secondary/60 border border-border p-4 text-sm space-y-2">
                  <div className="font-semibold flex items-center gap-1.5 text-primary">
                    <MapPin className="w-4 h-4" /> Store Pickup Location:
                  </div>
                  <p className="text-foreground text-xs font-medium leading-relaxed">{SHOP.address}</p>
                  <p className="text-xs text-muted-foreground">
                    🛍️ Your sweets will be packed fresh and ready for pickup at our counter. Zero delivery fee.
                  </p>
                </div>
              )}

              {form.delivery_type === "Home Delivery" && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200">
                    <span className="font-semibold block mb-1">🛵 We deliver up to 20 km around Piduguralla:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      Covering Piduguralla town and nearby villages: Janapadu, Karampudi, Gurazala, Dachepalli, Rentachintala, Konanki, Brahmanapalli, Pillutla, Julakallu, Morjampadu, Guttikonda, etc.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="address">Delivery Address (House / Street / Village)</Label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <textarea
                        id="address"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={form.delivery_address}
                        onChange={set("delivery_address")}
                        placeholder="e.g. Near Ramalayam, Main Road, Janapadu Village / Flat 101, Maya Bazar, Piduguralla"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:w-1/2">
                    <Label htmlFor="pincode">Pincode (6 digits)</Label>
                    <Input
                      id="pincode"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") }))}
                      placeholder="522413"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-5 lg:sticky lg:top-28 space-y-4">
              <h2 className="font-heading font-bold text-lg">Order Summary</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((i) => (
                  <div key={`${i.product_id}-${i.weight}`} className="flex justify-between gap-3 text-sm">
                    <span>
                      <span className="font-medium">{i.product_name}</span>
                      <span className="text-muted-foreground"> ({i.weight})</span>
                      <span className="text-muted-foreground"> × {i.quantity}</span>
                    </span>
                    <span className="font-semibold shrink-0">{formatINR(i.unit_price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-heading font-bold text-2xl text-primary">{formatINR(total)}</span>
              </div>
              <Button type="submit" className="w-full h-11 text-base" disabled={placing}>
                {placing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Placing Order…
                  </>
                ) : (
                  "Place Order · Pay via UPI"
                )}
              </Button>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0 text-accent" />
                Pay after placing the order — direct UPI, zero gateway fees.
              </p>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}