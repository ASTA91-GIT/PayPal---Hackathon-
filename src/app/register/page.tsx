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
  User, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";
import { ThreeHeroScene } from "@/components/ThreeHeroScene";
import { TrustCartLogo } from "@/components/TrustCartLogo";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreeTerms) {
      setError("Please agree to the TrustCart terms of service to continue.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/discover");
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* 1. Full-Viewport Atmospheric 3D Scene in Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center opacity-75">
        <ThreeHeroScene />
      </div>

      {/* 2. Soft Ambient Pastel Mesh Gradients */}
      <div
        className="fixed -top-40 right-1/4 w-[550px] h-[550px] rounded-full blur-[160px] pointer-events-none opacity-35 z-0"
        style={{
          background: "radial-gradient(circle, var(--accent-lavender) 0%, transparent 70%)",
        }}
      />
      <div
        className="fixed bottom-10 left-1/4 w-[450px] h-[450px] rounded-full blur-[140px] pointer-events-none opacity-25 z-0"
        style={{
          background: "radial-gradient(circle, var(--accent-pink) 0%, transparent 70%)",
        }}
      />

      {/* 3. Completely Transparent Registration Interface (NO OPAQUE CARD) */}
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
              Create Account
            </h1>
            <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Join TrustCart AI for verified shopping intelligence.
            </p>
          </div>
        </div>

        {/* Error Alert */}
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

        {/* Success Alert */}
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
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        {/* Registration Form — No Opaque Card Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block font-heading font-semibold text-xs tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              Full Name
            </label>
            <div className="relative">
              <User
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Olivia Vance"
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

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-heading font-semibold text-xs tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              Password (6+ characters)
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
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
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="block font-heading font-semibold text-xs tracking-wide"
              style={{ color: "var(--text-primary)" }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
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

          {/* Terms Agreement Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded accent-[var(--accent-lavender)] w-3.5 h-3.5 cursor-pointer"
              />
              <span className="text-xs font-medium leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                I agree to the TrustCart AI Terms of Service and PayPal Sandbox escrow buyer protections.
              </span>
            </label>
          </div>

          {/* Primary Create Account Button */}
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
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Switch to Login Link */}
        <div className="text-center pt-2">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold underline underline-offset-4 transition-colors"
              style={{ color: "var(--accent-lavender)" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
