import React from "react";
import type { Metadata } from "next";
import { Inter, Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { PayPalProviderWrapper } from "@/components/PayPalProvider";
import { Header } from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "TrustCart AI — Autonomous AI Shopping & Trust Intelligence",
  description:
    "Next-generation AI-powered shopping platform with sub-second explainable fraud intelligence, multi-vector risk verification, and real PayPal sandbox checkout.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('trustcart-theme');
                  if (saved === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else if (saved === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-body antialiased transition-colors duration-200">
        <ThemeProvider>
          <CartProvider>
            <PayPalProviderWrapper>
              <React.Suspense fallback={<div className="h-16" />}>
                <Header />
              </React.Suspense>
              <div className="flex-1 flex flex-col">
                {children}
              </div>
            </PayPalProviderWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
