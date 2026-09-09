import React from "react";
import { Link } from "react-router-dom";
import { SHOP } from "@/lib/shopConfig";

export default function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="font-heading font-bold text-lg">{SHOP.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {SHOP.tagline}. Order online and pay directly via UPI — no gateway fees, ever.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contact</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>
              <a className="hover:text-primary transition-colors" href={`tel:${SHOP.phone}`}>
                {SHOP.phone}
              </a>
            </li>
            <li>
              <a className="hover:text-primary transition-colors" href={`mailto:${SHOP.email}`}>
                {SHOP.email}
              </a>
            </li>
            <li>{SHOP.address}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>
              <Link className="hover:text-primary transition-colors" to="/">
                Sweets Catalog
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © 2026 {SHOP.name} · Direct UPI payments — 100% free, zero gateway fees
      </div>
    </footer>
  );
}