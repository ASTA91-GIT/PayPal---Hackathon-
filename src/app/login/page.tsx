"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  Mail, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { ThreeHeroScene } from "@/components/ThreeHeroScene";
import { TrustCartLogo } from "@/components/TrustCartLogo";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid credentials. Please verify your email and password.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/discover");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* 1. Full-Viewport Atmospheric 3D Scene (Behind Everything) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-75">
        <ThreeHeroScene />
      </div>

      {/* 2. Soft Ambient Pastel Mesh Gradients (Visible through transparent UI) */}
      <div
        className="fixed -top-40 left-1/3 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-35 z-0"
        style={{
          background: "radial-gradient(circle, var(--accent-lavender) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-10 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25 z-0"
        style={{
          background: "radial-gradient(circle, var(--accent-pink) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed top-1/2 left-10 w-[350px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-25 z-0"
        style={{
          background: "radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)",
        }}
      />

      {/* 3. Completely Transparent Authentication Interface (NO OPAQUE CARD) */}
      <div className="relative z-10 w-full max-w-[420px] mx-auto space-y-7 bg-transparent">
        {/* Brand Logo & Wordmark */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <TrustCartLogo variant="symbol" size="xl" />
          </Link>
          <div className="space-y-1">
            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Your next great find starts here.
            </p>
          </div>
        </div>

        {/* Error Alert Pill */}
        {error && (
          <div
            className="p-3 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in slide-in-from-top-1 backdrop-blur-sm"
            style={{
              backgroundColor: "var(--status-coral-bg)",
              borderColor: "var(--status-coral-border)",
              color: "var(--status-coral)",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert Pill */}
        {success && (
          <div
            className="p-3 rounded-xl border text-xs flex items-center gap-2.5 backdrop-blur-sm"
            style={{
              backgroundColor: "var(--status-mint-bg)",
              borderColor: "var(--status-mint-border)",
              color: "var(--status-mint)",
            }}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Authenticated successfully. Redirecting to catalog...</span>
          </div>
        )}

        {/* Login Form — Free of Opaque Card Containers */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-heading font-semibold text-xs tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border text-xs sm:text-sm font-mono-tech transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-lavender)] backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  boxShadow: "0 2px 8px -2px rgba(116, 101, 158, 0.06)",
                }}
              />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block font-heading font-semibold text-xs tracking-wide"
                style={{ color: "var(--text-primary)" }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setError("Demo account: Register a new account or use any registered credentials.")}
                className="text-[11px] font-semibold transition-colors hover:underline"
                style={{ color: "var(--accent-lavender)" }}
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl border text-xs sm:text-sm font-mono-tech transition-all focus:outline-none focus:ring-2 focus:ring-[var(--accent-lavender)] backdrop-blur-sm"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  boxShadow: "0 2px 8px -2px rgba(116, 101, 158, 0.06)",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-muted)" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded accent-[var(--accent-lavender)] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Remember this session
              </span>
            </label>

            <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
              SCRYPT HASHED
            </span>
          </div>

          {/* Primary Sign In Button — Subtle Translucent Pastel Gradient */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.99] disabled:opacity-60 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--accent-lavender), var(--accent-blue))",
              color: "#171722",
              boxShadow: "0 8px 24px -4px rgba(184, 165, 245, 0.4)",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Option */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => {
              setEmail("olivia.vance@techcorp.io");
              setPassword("TrustCart@2026");
            }}
            className="text-[11px] font-mono-tech underline underline-offset-4 opacity-75 hover:opacity-100 transition-opacity"
            style={{ color: "var(--accent-blue)" }}
          >
            Pre-fill Demo Credentials
          </button>
        </div>

        {/* Switch to Registration Link */}
        <div className="text-center pt-2">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-bold underline underline-offset-4 transition-colors"
              style={{ color: "var(--accent-lavender)" }}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
