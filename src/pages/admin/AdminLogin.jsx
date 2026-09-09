import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Candy, KeyRound, Loader2, LockKeyhole, ShieldAlert, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHOP } from "@/lib/shopConfig";
import { useAuth } from "@/lib/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, verifyMfa } = useAuth();

  const [step, setStep] = useState("credentials"); // 'credentials' or 'mfa'
  const [email, setEmail] = useState("abbus2155@gmail.com");
  const [password, setPassword] = useState("");
  const [mfaPin, setMfaPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      // Password correct -> Proceed to Step 2: Strict MFA PIN
      setStep("mfa");
    } catch (err) {
      setError(err?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(mfaPin)) {
      setError("Please enter your exact 6-digit Owner Security PIN.");
      return;
    }
    setLoading(true);
    try {
      await verifyMfa(mfaPin);
      const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/admin";
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(err?.message || "MFA verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <span className="inline-flex w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-3">
            <Candy className="w-8 h-8 text-primary" />
          </span>
          <h1 className="font-heading text-3xl font-bold">{SHOP.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">Authorized Owner Portal</p>
        </div>

        {step === "credentials" ? (
          /* STEP 1: Email & Password */
          <form
            onSubmit={handleCredentialsSubmit}
            className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg animate-in fade-in"
          >
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <LockKeyhole className="w-5 h-5 text-primary" />
              <div>
                <h2 className="font-heading font-bold text-base">Owner Authentication</h2>
                <p className="text-xs text-muted-foreground">Step 1 of 2: Master Credentials</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs">
                Admin Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abbus2155@gmail.com"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-xs">
                Admin Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying Password…
                </>
              ) : (
                "Continue to Step 2 (MFA)"
              )}
            </Button>

            <p className="text-[11px] text-center text-muted-foreground pt-1">
              🔒 Multi-Factor Authentication is strictly enforced.
            </p>
          </form>
        ) : (
          /* STEP 2: Strict MFA PIN Verification */
          <form
            onSubmit={handleMfaSubmit}
            className="bg-card border-2 border-primary/40 rounded-2xl p-6 space-y-4 shadow-xl animate-in zoom-in-95"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h2 className="font-heading font-bold text-base">Step 2: Strict MFA PIN</h2>
                  <p className="text-xs text-muted-foreground">Owner Verification Required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setError("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2 text-center py-2">
              <Label htmlFor="mfa-pin" className="text-xs text-muted-foreground block">
                Enter your 6-digit Owner Security PIN
              </Label>
              <Input
                id="mfa-pin"
                type="password"
                inputMode="numeric"
                maxLength={6}
                value={mfaPin}
                onChange={(e) => setMfaPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••••"
                className="text-center font-mono text-2xl tracking-[0.4em] font-bold h-12 w-48 mx-auto"
                autoFocus
                required
              />
              <p className="text-[11px] text-muted-foreground">
                Default Master PIN: <span className="font-mono font-semibold text-foreground">938167</span>
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
              disabled={loading || mfaPin.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying Security PIN…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2" /> Verify &amp; Access Dashboard
                </>
              )}
            </Button>

            <div className="pt-2 border-t border-border/60 text-center">
              <p className="text-[11px] text-muted-foreground">
                🛡️ Max 3 attempts allowed. Brute-force protection active.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}