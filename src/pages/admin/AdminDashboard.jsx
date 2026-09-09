import db from "@/lib/db";

import React, { useState } from "react";
import { Candy, ClipboardList, KeyRound, Loader2, LogOut, Package, ShieldCheck, X } from "lucide-react";

import OrdersPanel from "@/components/admin/OrdersPanel";
import InventoryPanel from "@/components/admin/InventoryPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SHOP } from "@/lib/shopConfig";

// Palnadu Sweets admin dashboard
export default function AdminDashboard() {
  const [tab, setTab] = useState("orders");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");
  const [savingPass, setSavingPass] = useState(false);

  // MFA PIN modal state
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [oldMfaPin, setOldMfaPin] = useState("");
  const [newMfaPin, setNewMfaPin] = useState("");
  const [confirmMfaPin, setConfirmMfaPin] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaSuccess, setMfaSuccess] = useState("");
  const [savingMfa, setSavingMfa] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (newPassword !== confirmPassword) {
      setPassError("New passwords do not match.");
      return;
    }

    setSavingPass(true);
    try {
      await db.auth.changePassword(oldPassword, newPassword);
      setPassSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPassSuccess("");
      }, 1500);
    } catch (err) {
      setPassError(err?.message || "Could not change password.");
    } finally {
      setSavingPass(false);
    }
  };

  const handleMfaChange = async (e) => {
    e.preventDefault();
    setMfaError("");
    setMfaSuccess("");

    if (newMfaPin !== confirmMfaPin) {
      setMfaError("New MFA PINs do not match.");
      return;
    }
    if (!/^\d{6}$/.test(newMfaPin)) {
      setMfaError("MFA PIN must be exactly 6 numeric digits.");
      return;
    }

    setSavingMfa(true);
    try {
      await db.auth.changeMfaPin(oldMfaPin, newMfaPin);
      setMfaSuccess("MFA PIN updated successfully!");
      setOldMfaPin("");
      setNewMfaPin("");
      setConfirmMfaPin("");
      setTimeout(() => {
        setShowMfaModal(false);
        setMfaSuccess("");
      }, 1500);
    } catch (err) {
      setMfaError(err?.message || "Could not change MFA PIN.");
    } finally {
      setSavingMfa(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Candy className="w-5 h-5 text-primary" />
            </span>
            <div>
              <span className="font-heading font-bold block leading-tight">{SHOP.name}</span>
              <span className="text-xs text-muted-foreground">Admin Dashboard</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setMfaError("");
                setMfaSuccess("");
                setShowMfaModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Change MFA PIN
            </button>
            <button
              onClick={() => {
                setPassError("");
                setPassSuccess("");
                setShowPasswordModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-lg"
            >
              <KeyRound className="w-3.5 h-3.5" /> Change Password
            </button>
            <button
              onClick={() => db.auth.logout("/admin/login")}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Change Password Dialog Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" /> Change Admin Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passError && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                {passError}
              </div>
            )}

            {passSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="old-pass">Current Password</Label>
                <Input
                  id="old-pass"
                  type="password"
                  placeholder="Enter current password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-pass">New Password</Label>
                <Input
                  id="new-pass"
                  type="password"
                  placeholder="Enter new password (min 4 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-pass">Confirm New Password</Label>
                <Input
                  id="confirm-pass"
                  type="password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingPass}>
                  {savingPass ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save Password"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change MFA PIN Dialog Modal */}
      {showMfaModal && (
        <div className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" /> Change Owner MFA Security PIN
              </h2>
              <button
                onClick={() => setShowMfaModal(false)}
                className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Update your 6-digit Multi-Factor Authentication PIN used to log in as the shop owner.
            </p>

            {mfaError && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                {mfaError}
              </div>
            )}

            {mfaSuccess && (
              <div className="p-3 text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg">
                {mfaSuccess}
              </div>
            )}

            <form onSubmit={handleMfaChange} className="space-y-3.5">
              <div className="space-y-1">
                <Label htmlFor="old-mfa">Current 6-Digit PIN</Label>
                <Input
                  id="old-mfa"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter current PIN"
                  value={oldMfaPin}
                  onChange={(e) => setOldMfaPin(e.target.value.replace(/\D/g, ""))}
                  className="font-mono text-center tracking-widest"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="new-mfa">New 6-Digit PIN</Label>
                <Input
                  id="new-mfa"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Enter new 6-digit PIN"
                  value={newMfaPin}
                  onChange={(e) => setNewMfaPin(e.target.value.replace(/\D/g, ""))}
                  className="font-mono text-center tracking-widest"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirm-mfa">Confirm New 6-Digit PIN</Label>
                <Input
                  id="confirm-mfa"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Re-enter new 6-digit PIN"
                  value={confirmMfaPin}
                  onChange={(e) => setConfirmMfaPin(e.target.value.replace(/\D/g, ""))}
                  className="font-mono text-center tracking-widest"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowMfaModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={savingMfa} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  {savingMfa ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                    </>
                  ) : (
                    "Save MFA PIN"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <Package className="w-4 h-4" /> Inventory &amp; Prices
          </button>
        </div>

        <div className="mt-6">{tab === "orders" ? <OrdersPanel /> : <InventoryPanel />}</div>
      </div>
    </div>
  );
}