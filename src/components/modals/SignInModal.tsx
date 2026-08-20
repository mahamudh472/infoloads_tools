"use client";

import React, { useState } from "react";
import { X, Mail, Lock, Check } from "lucide-react";
import { useUI } from "@/context/UIContext";

interface SignInModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SignInModal({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
}: SignInModalProps) {
  const ui = useUI();
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : ui.signInOpen;
  const onClose = propsOnClose || ui.closeSignIn;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1200);
  };

  const handleOAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-border p-1 hover:bg-muted text-muted-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Sign in successful</h3>
            <p className="text-sm text-muted-foreground">Welcome back to InfoLoads!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Sign in to InfoLoads</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage your favorites and unlock cloud configurations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-muted/20 pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-muted/20 pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-75 mt-2"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/80"></div>
              </div>
              <span className="relative bg-card px-3 text-[10px] font-semibold text-muted-foreground uppercase">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleOAuth}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Google
              </button>
              <button
                onClick={handleOAuth}
                className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                GitHub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
