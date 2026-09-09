const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { Input } from "@/components/ui/input";
import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import ProductCard from "@/components/storefront/ProductCard";
import CartDrawer from "@/components/storefront/CartDrawer";
import WhatsAppFloat from "@/components/storefront/WhatsAppFloat";
import Footer from "@/components/storefront/Footer";
import { CATEGORIES } from "@/lib/shopConfig";

// Palnadu Sweets storefront
export default function Home() {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState("All Sweets");
  const [query, setQuery] = useState("");

  useEffect(() => {
    db.entities.Product.list()
      .then((list) => setProducts(list))
      .catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (category === "All Sweets" || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q))
    );
  }, [products, category, query]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      <main id="sweets" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold">Our Sweets</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Pick a weight, add to cart — fresh sweets packed to order.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sweets…"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                category === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:border-primary/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {products === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-2/3" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="h-9 bg-muted rounded-full w-1/2" />
                  </div>
                </div>
              ))
            : filtered.length === 0
              ? (
                <div className="col-span-full text-center py-20 text-muted-foreground">
                  <SearchX className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No sweets found{query ? ` for "${query}"` : ""}.</p>
                </div>
              )
              : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />
    </div>
  );
}