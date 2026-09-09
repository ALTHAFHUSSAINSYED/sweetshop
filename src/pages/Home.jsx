import db from "@/lib/db";

import React, { useEffect, useMemo, useState } from "react";
import { Menu, Search, SearchX, Sparkles, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import Header from "@/components/storefront/Header";
import Hero from "@/components/storefront/Hero";
import ProductCard from "@/components/storefront/ProductCard";
import CartDrawer from "@/components/storefront/CartDrawer";
import WhatsAppFloat from "@/components/storefront/WhatsAppFloat";
import Footer from "@/components/storefront/Footer";
import CategoryMenuDrawer from "@/components/storefront/CategoryMenuDrawer";
import { useLanguage } from "@/context/LanguageContext";
import { CATEGORIES, CATEGORY_TAXONOMY } from "@/lib/shopConfig";

// Palnadu Sweets storefront
export default function Home() {
  const { t, isTelugu } = useLanguage();
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState("All Sweets");
  const [query, setQuery] = useState("");
  const [activeKeyword, setActiveKeyword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    db.entities.Product.list()
      .then((list) => setProducts(list))
      .catch(() => setProducts([]));
  }, []);

  const handleSelectCategory = (catName, keyword = "") => {
    setCategory(catName);
    setActiveKeyword(keyword);
    if (keyword) {
      setQuery(keyword);
    }
  };

  const clearFilters = () => {
    setCategory("All Sweets");
    setActiveKeyword("");
    setQuery("");
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchCat =
        category === "All Sweets" ||
        p.category === category ||
        (category === "Traditional Andhra" && (p.category === "All Sweets" || p.category === "Traditional Andhra"));

      const matchQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);

      return matchCat && matchQuery;
    });
  }, [products, category, query]);

  // Helper to get category display label in current language
  const getCategoryLabel = (c) => {
    if (c === "All Sweets") return t("allSweets");
    const found = CATEGORY_TAXONOMY.find(
      (item) => item.categoryName === c || item.name_en === c
    );
    if (found) {
      return isTelugu ? found.name_te : found.name_en;
    }
    return c;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onOpenMenu={() => setIsMenuOpen(true)} />
      <Hero />

      <main id="sweets" className="max-w-6xl mx-auto px-4 py-12 scroll-mt-20">
        {/* Section Heading & Search */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-colors"
                title="Open Category Menu"
              >
                <Menu className="w-5 h-5 text-primary" />
              </button>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold">
                {t("sweetsHeading")}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              {t("sweetsSubtitle")}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value) setActiveKeyword("");
              }}
              placeholder={t("searchPlaceholder")}
              className="pl-10 pr-9 bg-card text-sm rounded-xl border-border"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveKeyword("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Category Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {/* Menu Drawer trigger tab */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold bg-secondary hover:bg-secondary/80 border border-border text-foreground transition-all"
          >
            <Menu className="w-3.5 h-3.5 text-primary" />
            <span>{t("menu")}</span>
          </button>

          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelectCategory(c, "")}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all ${
                category === c && !activeKeyword
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card border-border hover:border-primary/50 text-foreground"
              }`}
            >
              {getCategoryLabel(c)}
            </button>
          ))}
        </div>

        {/* Active Filter Pill */}
        {(category !== "All Sweets" || query) && (
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="text-muted-foreground">Filtering:</span>
            {category !== "All Sweets" && (
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-semibold px-2.5 py-1 rounded-full border border-primary/20">
                {getCategoryLabel(category)}
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => setCategory("All Sweets")}
                />
              </span>
            )}
            {query && (
              <span className="inline-flex items-center gap-1 bg-secondary text-foreground font-semibold px-2.5 py-1 rounded-full border border-border">
                "{query}"
                <X
                  className="w-3 h-3 cursor-pointer hover:opacity-75"
                  onClick={() => {
                    setQuery("");
                    setActiveKeyword("");
                  }}
                />
              </span>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-primary hover:underline ml-1 font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Products Grid */}
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
                <div className="col-span-full text-center py-20 text-muted-foreground bg-card border border-dashed border-border rounded-3xl p-8 space-y-3">
                  <SearchX className="w-12 h-12 mx-auto text-muted-foreground/40" />
                  <h3 className="font-heading font-bold text-lg text-foreground">
                    {t("noSweetsFound")}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {t("trySearchingOther")}
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> {t("allSweets")}
                  </button>
                </div>
              )
              : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <WhatsAppFloat />

      {/* Category & Subcategory Menu Drawer */}
      <CategoryMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        selectedCategory={category}
        onSelectCategory={handleSelectCategory}
      />
    </div>
  );
}