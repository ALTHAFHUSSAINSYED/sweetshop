import db from "@/lib/db";

import React, { useState } from "react";
import { Candy, ClipboardList, LogOut, Package } from "lucide-react";

import OrdersPanel from "@/components/admin/OrdersPanel";
import InventoryPanel from "@/components/admin/InventoryPanel";
import { SHOP } from "@/lib/shopConfig";

// Palnadu Sweets admin dashboard
export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Candy className="w-5 h-5 text-primary" />
            </span>
            <div>
              <span className="font-heading font-bold block leading-tight">{SHOP.name}</span>
              <span className="text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </div>
          <button
            onClick={() => db.auth.logout("/admin/login")}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("orders")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Orders &amp; Payments
          </button>
          <button
            onClick={() => setTab("inventory")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === "inventory"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
        </div>

        <div className="mt-6">{tab === "orders" ? <OrdersPanel /> : <InventoryPanel />}</div>
      </div>
    </div>
  );
}