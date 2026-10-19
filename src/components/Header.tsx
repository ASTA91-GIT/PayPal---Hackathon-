"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartProvider";
import { 
  ShieldCheck, 
  Sparkles, 
  Sun, 
  Moon, 
  ShoppingCart, 
  Search, 
  Bot, 
  Scale, 
  BarChart3, 
  History, 
  Menu, 
  X,
  CreditCard,
  User as UserIcon
} from "lucide-react";
import { TrustCartLogo } from "./TrustCartLogo";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/discover", label: "Discover", icon: Search },
    { href: "/agent", label: "AI Agent", icon: Bot, badge: "AI Core" },
    { href: "/compare", label: "Compare", icon: Scale },
    { href: "/dashboard", label: "Intelligence", icon: BarChart3 },
    { href: "/orders", label: "Orders", icon: History },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 h-16 backdrop-blur-xl border-b z-50 flex items-center justify-between px-4 sm:px-8 transition-colors duration-200"
      style={{
        backgroundColor: "var(--bg-header)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Brand & Telemetry Badge */}
      <div className="flex items-center gap-4 lg:gap-6">
        <Link href="/" className="flex items-center group">
          <TrustCartLogo variant="full" size="md" />
        </Link>

        <div className="h-5 w-px hidden md:block" style={{ backgroundColor: "var(--border-color)" }} />

        {/* Global Decision Latency Badge */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <span className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: "var(--status-mint)" }}
          />
          <span className="font-mono-tech font-bold" style={{ color: "var(--status-mint)" }}>
            9ms
          </span>
          <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Tensor Inference SLA
          </span>
        </div>
      </div>

      {/* Center Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "shadow-sm font-bold"
                  : "hover:bg-[var(--bg-surface-subtle)]"
              }`}
              style={{
                backgroundColor: isActive ? "var(--accent-lavender)" : "transparent",
                color: isActive ? "#171722" : "var(--text-secondary)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
              {link.badge && (
                <span className="text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: isActive ? "#171722" : "var(--accent-lavender-bg)",
                    color: isActive ? "var(--accent-lavender)" : "var(--accent-lavender)",
                  }}
                >
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Theme Toggle, Cart, Mobile Menu */}
      <div className="flex items-center gap-3">
        {/* Dual-Theme Pastel Switcher */}
        <div className="flex items-center p-0.5 rounded-full border backdrop-blur-md"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <button
            onClick={() => setTheme("light")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              theme === "light" ? "shadow-sm font-bold" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: theme === "light" ? "var(--accent-lavender)" : "transparent",
              color: theme === "light" ? "#171722" : "var(--text-secondary)",
            }}
            title="Dreamy Pastel Light Mode"
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">Dreamy</span>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
              theme === "dark" ? "shadow-sm font-bold" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: theme === "dark" ? "var(--accent-lavender)" : "transparent",
              color: theme === "dark" ? "#171722" : "var(--text-secondary)",
            }}
            title="Midnight Pastels Dark Mode"
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px] uppercase font-bold tracking-wider">Midnight</span>
          </button>
        </div>

        {/* Defcon / Level Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px]"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--status-mint)" }} />
          <span className="font-cyber-tag text-[9px]" style={{ color: "var(--text-secondary)" }}>
            PERIMETER:
          </span>
          <span className="font-bold font-mono-tech text-[10px]" style={{ color: "var(--status-mint)" }}>
            NOMINAL
          </span>
        </div>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="relative p-2 rounded-xl border flex items-center justify-center transition-all hover:scale-105"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
          title="Shopping Cart"
        >
          <ShoppingCart className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: "var(--status-coral)" }}
            >
              {itemCount}
            </span>
          )}
        </Link>

        {/* Sign In / Auth Button */}
        <Link
          href="/login"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold glass-subtle transition-all hover:bg-[var(--bg-surface-elevated)]"
          style={{ color: "var(--text-primary)" }}
        >
          <UserIcon className="w-3.5 h-3.5" style={{ color: "var(--accent-lavender)" }} />
          <span>Sign In</span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border flex items-center justify-center"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 p-4 border-b flex flex-col gap-2 lg:hidden shadow-xl"
          style={{
            backgroundColor: "var(--bg-main)",
            borderColor: "var(--border-color)",
          }}
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold"
                style={{
                  backgroundColor: isActive ? "var(--accent-lavender-bg)" : "var(--bg-surface)",
                  color: isActive ? "var(--accent-lavender)" : "var(--text-primary)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                    style={{
                      backgroundColor: "var(--accent-lavender-bg)",
                      color: "var(--accent-lavender)",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            href="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold border"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-4 h-4" />
              <span>Shopping Cart ({itemCount} items)</span>
            </div>
            <span className="font-bold text-xs" style={{ color: "var(--accent-lavender)" }}>
              View Cart →
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
