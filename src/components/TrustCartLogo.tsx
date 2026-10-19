"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";

interface TrustCartLogoProps {
  variant?: "full" | "compact" | "symbol";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TrustCartLogo({
  variant = "full",
  size = "md",
  className = "",
}: TrustCartLogoProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Size dimensions
  const symbolDimensions = {
    sm: { width: 28, height: 28 },
    md: { width: 36, height: 36 },
    lg: { width: 48, height: 48 },
    xl: { width: 64, height: 64 },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Original Custom Vector Shield + Cart + AI Synapse Emblem */}
      <svg
        width={symbolDimensions.width}
        height={symbolDimensions.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="tcCompShieldGrad" x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor={isDark ? "#C4B5FD" : "#9D87E8"} />
            <stop offset="50%" stopColor={isDark ? "#A9D9F0" : "#5BA8C2"} />
            <stop offset="100%" stopColor={isDark ? "#F0BDD3" : "#D97E9E"} />
          </linearGradient>
          <linearGradient id="tcCompSynapseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "#F0BDD3" : "#D97E9E"} />
            <stop offset="50%" stopColor={isDark ? "#C4B5FD" : "#9D87E8"} />
            <stop offset="100%" stopColor={isDark ? "#A9D9F0" : "#5BA8C2"} />
          </linearGradient>
        </defs>

        {/* Outer Protective Shield Perimeter */}
        <path
          d="M50 8 C63 8 78 12 85 18 C86 38 84 62 50 92 C16 62 14 38 15 18 C22 12 37 8 50 8Z"
          stroke="url(#tcCompShieldGrad)"
          strokeWidth="4"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Translucent Shield Glow Backing */}
        <path
          d="M50 11 C61 11 75 14.5 81.5 20 C82.5 38 80.5 60 50 87 C19.5 60 17.5 38 18.5 20 C25 14.5 39 11 50 11Z"
          fill="url(#tcCompShieldGrad)"
          fillOpacity={isDark ? 0.12 : 0.08}
        />

        {/* AI Neural Scanning Waves */}
        <path
          d="M32 28 C42 21 58 21 68 28"
          stroke="url(#tcCompSynapseGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.8}
        />
        <path
          d="M38 34 C45 29 55 29 62 34"
          stroke="url(#tcCompSynapseGrad)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Integrated Shopping Cart Silhouette */}
        <path
          d="M29 42 L35 42 L42 62 L67 62 L74 46 L38 46"
          stroke="url(#tcCompShieldGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M45 52 L62 52"
          stroke="url(#tcCompSynapseGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.85}
        />

        {/* Synapse Wheels / Nodes */}
        <circle cx="44" cy="71" r="3.5" fill={isDark ? "#A9D9F0" : "#5BA8C2"} />
        <circle cx="44" cy="71" r="6" stroke={isDark ? "#C4B5FD" : "#9D87E8"} strokeWidth="1.2" opacity="0.6" />

        <circle cx="65" cy="71" r="3.5" fill={isDark ? "#F0BDD3" : "#D97E9E"} />
        <circle cx="65" cy="71" r="6" stroke={isDark ? "#A9D9F0" : "#5BA8C2"} strokeWidth="1.2" opacity="0.6" />

        {/* Central Neural Nexus Core */}
        <circle cx="50" cy="24" r="2.5" fill={isDark ? "#FFFFFF" : "#29263D"} />
      </svg>

      {/* Wordmark & Tagline (if not symbol-only) */}
      {variant !== "symbol" && (
        <div className="flex flex-col">
          <span
            className="font-display font-black tracking-wider leading-none"
            style={{
              fontSize: size === "sm" ? "0.95rem" : size === "lg" ? "1.45rem" : size === "xl" ? "1.85rem" : "1.15rem",
              color: "var(--text-primary)",
            }}
          >
            TRUSTCART
            <span style={{ color: "var(--accent-lavender)" }}> AI</span>
          </span>

          {variant === "full" && (
            <span
              className="font-cyber-tag tracking-widest leading-tight mt-0.5"
              style={{
                fontSize: size === "sm" ? "8px" : size === "lg" ? "10px" : size === "xl" ? "11px" : "9px",
                color: "var(--text-muted)",
              }}
            >
              Autonomous Shopping &amp; Trust Shield
            </span>
          )}
        </div>
      )}
    </div>
  );
}
