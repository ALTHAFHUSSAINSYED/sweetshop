import db from "@/lib/db";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Candy, Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHOP } from "@/lib/shopConfig";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await db.auth.loginViaEmailPassword(email.trim(), password);
      const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/admin";
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <Candy className="w-8 h-8 text-primary" />
          </span>
          <h1 className="font-heading text-3xl font-bold">{SHOP.name}</h1>
          <p className="text-muted-foreground mt-1">Shop Owner Dashboard</p>
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="owner@mithaidelight.com"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
              </>
            ) : (
              <>
                <LockKeyhole className="w-4 h-4" /> Sign In
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Access is restricted to shop administrators.
          </p>
        </form>
      </div>
    </div>
  );
}