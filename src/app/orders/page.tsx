"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  History, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck,
  PackageCheck
} from "lucide-react";

interface OrderItem {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  buyerName: string;
  itemCount: number;
  createdAt: string;
  captures: Array<{ captureId: string; status: string; amount: number }>;
  riskSummary: { overallRisk?: number; tier?: string } | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch((err) => console.error("Error fetching orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
            TRANSACTION AUDIT LEDGER
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            VERIFIED ORDER HISTORY
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Cryptographically logged transaction receipts confirmed through PayPal Orders API v2.
          </p>
        </div>

        <Link
          href="/discover"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold"
          style={{
            backgroundColor: "var(--accent-lavender)",
            color: "#171722",
          }}
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-24 text-center font-mono-tech text-sm" style={{ color: "var(--text-muted)" }}>
          Loading transaction audit records...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 rounded-2xl border glass-panel text-center space-y-3">
          <History className="w-10 h-10 mx-auto" style={{ color: "var(--text-muted)" }} />
          <p className="font-heading font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            No transaction records found yet.
          </p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Complete a test checkout through PayPal Sandbox to view your order confirmation here.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border glass-panel overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b font-mono-tech uppercase text-[10px]"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--bg-surface-subtle)",
                    color: "var(--text-muted)",
                  }}
                >
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4">Buyer Identity</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Trust Tier</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                {orders.map((o) => {
                  const isCompleted = o.status === "COMPLETED";
                  const risk = o.riskSummary?.overallRisk ?? 12;

                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-[var(--bg-surface-elevated)] transition-colors"
                    >
                      <td className="p-4 font-mono-tech font-bold" style={{ color: "var(--accent-lavender)" }}>
                        {o.orderNumber}
                      </td>
                      <td className="p-4 font-mono-tech" style={{ color: "var(--text-secondary)" }}>
                        {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="p-4 font-medium" style={{ color: "var(--text-primary)" }}>
                        {o.buyerName}
                      </td>
                      <td className="p-4 font-mono-tech" style={{ color: "var(--text-secondary)" }}>
                        {o.itemCount} item(s)
                      </td>
                      <td className="p-4 font-mono-tech font-bold" style={{ color: "var(--text-primary)" }}>
                        ${o.totalAmount.toFixed(2)} {o.currency}
                      </td>
                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-tech uppercase border"
                          style={{
                            backgroundColor: isCompleted ? "var(--status-mint-bg)" : "var(--status-peach-bg)",
                            color: isCompleted ? "var(--status-mint)" : "var(--status-peach)",
                            borderColor: isCompleted ? "var(--status-mint-border)" : "var(--status-peach-border)",
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isCompleted ? "var(--status-mint)" : "var(--status-peach)" }} />
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono-tech text-[11px]" style={{ color: risk < 25 ? "var(--status-mint)" : "var(--status-coral)" }}>
                          Risk: {risk}/100
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/orders/${o.id}`}
                          className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold glass-subtle hover:bg-[var(--bg-surface-elevated)] transition-colors inline-flex items-center gap-1"
                          style={{ color: "var(--accent-lavender)" }}
                        >
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
