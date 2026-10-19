"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  TrendingUp, 
  Cpu, 
  Sparkles, 
  AlertTriangle, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  Search, 
  Filter,
  BarChart2,
  Lock,
  Layers,
  ArrowRight,
  ExternalLink,
  Fingerprint
} from "lucide-react";

interface StreamRow {
  id: string;
  verdict: "HARD DECLINE" | "AUTO-CLEARED" | "STEP-UP 3DS" | "CLUSTER BOT";
  score: number;
  txRef: string;
  time: string;
  entity: string;
  value: string;
  tags: string[];
  isTarget?: boolean;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<string>("TX_99482-AD83");

  const telemetryFeed: StreamRow[] = [
    {
      id: "row-1",
      verdict: "HARD DECLINE",
      score: 14,
      txRef: "TX_99482-AD83",
      time: "14:22:09.412Z",
      entity: "v-kharkiv@mesh-ops.net",
      value: "$1,420.00 · Cloud Lic",
      tags: ["GEO_VELOCITY_MISMATCH", "TOR_EXIT_NODE"],
      isTarget: true,
    },
    {
      id: "row-2",
      verdict: "AUTO-CLEARED",
      score: 98,
      txRef: "TX_99481-CC21",
      time: "14:22:07.198Z",
      entity: "olivia.vance@techcorp.io",
      value: "$384.50 · API Addon",
      tags: ["TOKEN_REPUTATION_HIGH", "BEHAVIOR_MATCH: 99.4%"],
    },
    {
      id: "row-3",
      verdict: "STEP-UP 3DS",
      score: 62,
      txRef: "TX_99480-KL09",
      time: "14:21:58.841Z",
      entity: "chen.weir@apex-global.hk",
      value: "$2,890.00 · Bulk Key",
      tags: ["NEW_DEVICE_FP", "CARD_BIN_UK_CROSS"],
    },
    {
      id: "row-4",
      verdict: "CLUSTER BOT",
      score: 2,
      txRef: "TX_99479-ZX44",
      time: "14:21:44.201Z",
      entity: "bot_payload_x89@relay.net",
      value: "$14.00 · Testing Ping",
      tags: ["CARDING_ATTACK_CLUSTER", "SPEED_TEST_BURST"],
    },
    {
      id: "row-5",
      verdict: "AUTO-CLEARED",
      score: 95,
      txRef: "TX_99478-BM19",
      time: "14:21:30.551Z",
      entity: "elena.marceau@luxretail.fr",
      value: "$940.00 · Annual Seat",
      tags: ["KNOWN_CUSTOMER_HASH", "APPLE_PAY_VALIDATED"],
    },
  ];

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFeed = telemetryFeed.filter((row) => {
    if (activeFilter === "high-risk") return row.verdict === "HARD DECLINE" || row.verdict === "CLUSTER BOT";
    if (activeFilter === "approved") return row.verdict === "AUTO-CLEARED";
    if (activeFilter === "step-up") return row.verdict === "STEP-UP 3DS";
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Status & Title (conforming to Stitch Cockpit) */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--accent-lavender-bg)",
                color: "var(--accent-lavender)",
                borderColor: "var(--border-color)",
              }}
            >
              [SYSTEM: NEURAL_VECTOR_V4.2]
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--status-mint-bg)",
                color: "var(--status-mint)",
                borderColor: "var(--status-mint-border)",
              }}
            >
              [RISK_DELTA: -38.4BPS]
            </span>
            <span
              className="text-xs px-2.5 py-1 rounded-md border font-semibold font-cyber-tag"
              style={{
                backgroundColor: "var(--status-coral-bg)",
                color: "var(--status-coral)",
                borderColor: "var(--status-coral-border)",
              }}
            >
              [SYNAPSE: BOTNET_ISOLATED]
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: "var(--status-mint)" }} />
              INGESTION PIPELINE: ACTIVE (99.999% SLA)
            </span>
            <div className="h-3 w-px" style={{ backgroundColor: "var(--border-color)" }} />
            <span className="font-mono-tech text-xs font-semibold" style={{ color: "var(--accent-blue)" }}>
              ZONE: AWS-US-EAST-1
            </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-2">
          <div className="max-w-3xl space-y-2">
            <span className="font-cyber-tag text-xs uppercase tracking-[0.2em] font-bold" style={{ color: "var(--accent-lavender)" }}>
              Autonomous Perimeter Defense
            </span>
            <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-[38px] leading-tight" style={{ color: "var(--text-primary)" }}>
              AUTONOMOUS CHECKOUT INTEGRITY &amp; THREAT SHIELD
            </h1>
            <p className="text-xs sm:text-sm max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Real-time deep learning tensor engine inspecting sub-second behavioral telemetry, cross-merchant bot syndicates, and adversarial checkout manipulations across global identities.
            </p>
          </div>

          <div className="flex items-center gap-4 p-3.5 rounded-xl border glass-panel shadow-sm">
            <div className="flex flex-col">
              <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
                Global Synapse Health
              </span>
              <span className="text-sm font-black font-mono-tech" style={{ color: "var(--status-mint)" }}>
                OPTIMAL // 100%
              </span>
            </div>
            <div className="w-12 h-8 flex items-end gap-1">
              <span className="w-2 h-3 rounded-sm opacity-80" style={{ backgroundColor: "var(--status-mint)" }} />
              <span className="w-2 h-5 rounded-sm opacity-80" style={{ backgroundColor: "var(--status-mint)" }} />
              <span className="w-2 h-7 rounded-sm opacity-90" style={{ backgroundColor: "var(--status-mint)" }} />
              <span className="w-2 h-8 rounded-sm animate-pulse" style={{ backgroundColor: "var(--status-mint)", boxShadow: "0 0 8px var(--status-mint)" }} />
            </div>
          </div>
        </div>

        {/* Top Telemetry 4-Pack Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              <span>Processed Volume (24h)</span>
              <TrendingUp className="w-4 h-4" style={{ color: "var(--accent-lavender)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--text-primary)" }}>
              {stats?.processedVolume24h || "$42.8M"}
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-mint)" }}>+14.2% vs yesterday</span>
              <span style={{ color: "var(--text-muted)" }}>18.4K tx/sec</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              <span>Blocked Fraud Capital</span>
              <ShieldCheck className="w-4 h-4" style={{ color: "var(--status-coral)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--status-coral)" }}>
              {stats?.blockedFraudCapital || "$381,940"}
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-coral)" }}>2,142 attacks deflected</span>
              <span style={{ color: "var(--text-muted)" }}>0.04% DISPUTE</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              <span>Autonomous Pass-Through</span>
              <Sparkles className="w-4 h-4" style={{ color: "var(--status-mint)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--status-mint)" }}>
              {stats?.autoClearedPercent ? `${stats.autoClearedPercent}%` : "98.6%"}
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--status-mint)" }}>Zero Friction</span>
              <span style={{ color: "var(--text-muted)" }}>99.98% TRUST</span>
            </div>
          </div>

          <div className="p-5 rounded-xl flex flex-col justify-between border glass-panel">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
              <span>Mean Scoring Latency</span>
              <Cpu className="w-4 h-4" style={{ color: "var(--accent-blue)" }} />
            </div>
            <div className="my-3 font-display font-black text-2xl" style={{ color: "var(--accent-blue)" }}>
              11<span className="text-sm font-normal ml-1" style={{ color: "var(--text-secondary)" }}>ms</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono-tech">
              <span className="font-semibold" style={{ color: "var(--accent-blue)" }}>P99: 18.2ms Edge</span>
              <span style={{ color: "var(--text-muted)" }}>v8.4 TensorRT</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split Cockpit: 70% Stream / 30% Dossier */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Stream Table & Heuristics */}
        <div className="lg:col-span-8 space-y-4">
          {/* Stream Control & Filter Bar */}
          <div className="p-4 rounded-xl border glass-panel flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 animate-spin" style={{ animationDuration: "12s", color: "var(--accent-lavender)" }} />
              <div>
                <h2 className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  Live Transaction Evaluation Engine
                </h2>
                <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Continuous inference stream filtering high-velocity checkout pipes
                </p>
              </div>
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center p-1 rounded-lg gap-1 border glass-subtle overflow-x-auto">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeFilter === "all" ? "shadow-sm font-bold" : "hover:bg-[var(--bg-surface)]"
                }`}
                style={{
                  backgroundColor: activeFilter === "all" ? "var(--accent-lavender)" : "transparent",
                  color: activeFilter === "all" ? "#171722" : "var(--text-secondary)",
                }}
              >
                All Telemetry
              </button>
              <button
                onClick={() => setActiveFilter("high-risk")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeFilter === "high-risk" ? "shadow-sm font-bold" : "hover:bg-[var(--bg-surface)]"
                }`}
                style={{
                  backgroundColor: activeFilter === "high-risk" ? "var(--accent-lavender)" : "transparent",
                  color: activeFilter === "high-risk" ? "#171722" : "var(--text-secondary)",
                }}
              >
                High Risk (14)
              </button>
              <button
                onClick={() => setActiveFilter("approved")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeFilter === "approved" ? "shadow-sm font-bold" : "hover:bg-[var(--bg-surface)]"
                }`}
                style={{
                  backgroundColor: activeFilter === "approved" ? "var(--accent-lavender)" : "transparent",
                  color: activeFilter === "approved" ? "#171722" : "var(--text-secondary)",
                }}
              >
                Auto-Approved
              </button>
              <button
                onClick={() => setActiveFilter("step-up")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  activeFilter === "step-up" ? "shadow-sm font-bold" : "hover:bg-[var(--bg-surface)]"
                }`}
                style={{
                  backgroundColor: activeFilter === "step-up" ? "var(--accent-lavender)" : "transparent",
                  color: activeFilter === "step-up" ? "#171722" : "var(--text-secondary)",
                }}
              >
                Step-Up 3DS
              </button>
            </div>
          </div>

          {/* Stream Table */}
          <div className="rounded-xl border glass-panel overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b font-mono-tech uppercase text-[10px]"
                    style={{
                      backgroundColor: "var(--bg-surface-subtle)",
                      borderColor: "var(--border-color)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <th className="p-3">Verdict &amp; Trust</th>
                    <th className="p-3">Tx Ref &amp; Time</th>
                    <th className="p-3">Entity &amp; Value</th>
                    <th className="p-3">Risk Vectors / Flags</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-color)" }}>
                  {filteredFeed.map((row) => {
                    const isDecline = row.verdict === "HARD DECLINE" || row.verdict === "CLUSTER BOT";
                    const isApproved = row.verdict === "AUTO-CLEARED";
                    const isSelected = selectedTx === row.txRef;

                    return (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedTx(row.txRef)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "border-l-4 border-l-[var(--status-coral)] glass-panel-elevated" : "hover:bg-[var(--bg-surface-elevated)]"
                        }`}
                      >
                        <td className="p-3 space-y-1">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono-tech border"
                            style={{
                              backgroundColor: isApproved
                                ? "var(--status-mint-bg)"
                                : isDecline
                                ? "var(--status-coral-bg)"
                                : "var(--status-peach-bg)",
                              color: isApproved
                                ? "var(--status-mint)"
                                : isDecline
                                ? "var(--status-coral)"
                                : "var(--status-peach)",
                              borderColor: isApproved
                                ? "var(--status-mint-border)"
                                : isDecline
                                ? "var(--status-coral-border)"
                                : "var(--status-peach-border)",
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isApproved ? "var(--status-mint)" : "var(--status-coral)" }} />
                            {row.verdict}
                          </span>
                          <div className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>
                            Score: {row.score} / 100
                          </div>
                        </td>

                        <td className="p-3 font-mono-tech space-y-0.5">
                          <div className="font-bold" style={{ color: "var(--accent-lavender)" }}>
                            {row.txRef}
                          </div>
                          <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                            {row.time}
                          </div>
                        </td>

                        <td className="p-3 space-y-0.5">
                          <div className="font-medium truncate max-w-[150px]" style={{ color: "var(--text-primary)" }}>
                            {row.entity}
                          </div>
                          <div className="font-mono-tech text-[10px] font-semibold" style={{ color: "var(--status-peach)" }}>
                            {row.value}
                          </div>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-w-[220px]">
                            {row.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded border text-[9px] font-mono-tech"
                                style={{
                                  backgroundColor: isApproved ? "var(--status-mint-bg)" : "var(--status-coral-bg)",
                                  color: isApproved ? "var(--status-mint)" : "var(--status-coral)",
                                  borderColor: isApproved ? "var(--status-mint-border)" : "var(--status-coral-border)",
                                }}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="p-3 text-right">
                          <button
                            className="p-1 rounded hover:opacity-80"
                            style={{
                              color: isSelected ? "var(--accent-lavender)" : "var(--text-muted)",
                            }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Split Secondary Panels (Neural Heuristics & Cart Graph) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Heuristic Telemetry Spark Module */}
            <div className="p-4 rounded-xl border glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                  Real-Time Neural Heuristics
                </h3>
                <span className="font-cyber-tag text-[9px] px-2 py-0.5 rounded border"
                  style={{
                    backgroundColor: "var(--accent-lavender-bg)",
                    color: "var(--accent-lavender)",
                  }}
                >
                  [EPOCH_TENSOR: 4096-DIM]
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Real-time weights adjust dynamically to newly detected carding payloads. Active learning updates every 15 seconds.
              </p>

              {/* Inline Micro Data Chart */}
              <div className="h-16 w-full rounded-lg p-2 flex items-end gap-1.5 border glass-subtle">
                <div className="flex-1 h-8 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-blue)" }} />
                <div className="flex-1 h-12 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-lavender)" }} />
                <div className="flex-1 h-6 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-blue)" }} />
                <div className="flex-1 h-14 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-lavender)" }} />
                <div className="flex-1 h-10 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-pink)" }} />
                <div className="flex-1 h-16 rounded-sm opacity-90" style={{ backgroundColor: "var(--status-mint)" }} />
                <div className="flex-1 h-16 rounded-sm animate-pulse" style={{ backgroundColor: "var(--status-coral)", boxShadow: "0 0 8px var(--status-coral)" }} />
                <div className="flex-1 h-10 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-lavender)" }} />
                <div className="flex-1 h-7 rounded-sm opacity-80" style={{ backgroundColor: "var(--accent-blue)" }} />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono-tech" style={{ color: "var(--text-muted)" }}>
                <span>-60s BUFFER</span>
                <span className="font-semibold" style={{ color: "var(--status-coral)" }}>BURST_DEFLECTED @ T-18s</span>
                <span>NOW (LIVE)</span>
              </div>
            </div>

            {/* Cross-Merchant Cart Graph Anomaly */}
            <div className="p-4 rounded-xl border glass-panel space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                  Cross-Merchant Cart Graph
                </h3>
                <span className="font-mono-tech text-[10px] font-semibold" style={{ color: "var(--status-mint)" }}>
                  3.8M Nodes Indexed
                </span>
              </div>
              <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                Graph Neural Network tracking identity hopping, device fingerprint collision, and shared synthetic billing addresses across network tenants.
              </p>
              <div className="p-2.5 rounded-lg border glass-subtle space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>Identities Linked in Cluster</span>
                  <span className="font-mono-tech font-bold" style={{ color: "var(--status-coral)" }}>14 Entities</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden bg-black/10">
                  <div className="h-full w-[84%] rounded-full" style={{ backgroundColor: "var(--status-coral)" }} />
                </div>
                <span className="font-mono-tech text-[9px]" style={{ color: "var(--text-muted)" }}>
                  92% fingerprint overlap detected across 3 independent stores
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Deep Evidence Dossier */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl border glass-panel space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-cyber-tag text-[10px] font-bold px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: "var(--status-coral-bg)",
                  color: "var(--status-coral)",
                  borderColor: "var(--status-coral-border)",
                }}
              >
                [ANOMALY_CONFIDENCE_99.4%]
              </span>
              <span className="font-mono-tech text-xs font-semibold" style={{ color: "var(--accent-lavender)" }}>
                #EV-88204-ML
              </span>
            </div>

            <div>
              <h3 className="font-heading font-bold text-base" style={{ color: "var(--text-primary)" }}>
                Deep Evidence Dossier
              </h3>
              <span className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>
                INSPECTING TRANSACTION: <span className="font-bold" style={{ color: "var(--accent-lavender)" }}>{selectedTx}</span>
              </span>
            </div>

            {/* Forensic Attribute Table */}
            <div className="p-3 rounded-lg border glass-subtle space-y-2 font-mono-tech text-xs">
              <div className="flex justify-between text-[10px] uppercase font-bold" style={{ color: "var(--text-muted)" }}>
                <span>Attribute</span>
                <span>Forensic Value</span>
              </div>
              <div className="h-px border-b" style={{ borderColor: "var(--border-color)" }} />
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Client IP</span>
                <span className="font-bold" style={{ color: "var(--status-coral)" }}>185.220.101.5 [TOR]</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Card Hash</span>
                <span style={{ color: "var(--text-primary)" }}>4111********9281</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Issuer BIN</span>
                <span style={{ color: "var(--text-primary)" }}>Chase Sapphire (US)</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Egress Origin</span>
                <span className="font-bold" style={{ color: "var(--status-coral)" }}>Frankfurt DE (Mismatch)</span>
              </div>
            </div>

            {/* Multi-Vector Radar Breakdown */}
            <div className="space-y-2.5">
              <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
                MULTI-VECTOR RISK BREAKDOWN
              </span>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--text-primary)" }}>Device Fingerprint</span>
                  <span className="font-mono-tech font-bold" style={{ color: "var(--status-mint)" }}>Clean ID</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden bg-black/10">
                  <div className="h-full w-[12%]" style={{ backgroundColor: "var(--status-mint)" }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--text-primary)" }}>Behavioral Biometrics</span>
                  <span className="font-mono-tech font-bold" style={{ color: "var(--status-coral)" }}>Anomalous Jitter</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden bg-black/10">
                  <div className="h-full w-[94%]" style={{ backgroundColor: "var(--status-coral)" }} />
                </div>
                <p className="text-[10px] leading-tight" style={{ color: "var(--text-secondary)" }}>
                  Automated clipboard paste detected for full card PAN &amp; CVV in under 12ms. Zero natural human pointer acceleration.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{ color: "var(--text-primary)" }}>Card Velocity</span>
                  <span className="font-mono-tech font-bold" style={{ color: "var(--status-coral)" }}>14 Cards / 90s</span>
                </div>
                <div className="w-full h-1 rounded-full overflow-hidden bg-black/10">
                  <div className="h-full w-[98%]" style={{ backgroundColor: "var(--status-coral)" }} />
                </div>
              </div>
            </div>

            {/* Intercepting Rule Code */}
            <div className="space-y-1">
              <span className="font-cyber-tag text-[9px]" style={{ color: "var(--text-muted)" }}>
                INTERCEPTING RULE LOGIC
              </span>
              <div className="p-2.5 rounded-lg border glass-subtle font-mono-tech text-[11px]" style={{ color: "var(--accent-lavender)" }}>
                <code>rule.risk_score &gt; 85 &amp;&amp; tx.velocity_1m &gt; 5 -&gt; ACTION_HARD_DECLINE</code>
              </div>
            </div>

            {/* Operator Control Actions */}
            <div className="space-y-2 pt-2">
              <button className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md text-white"
                style={{ backgroundColor: "var(--status-coral)" }}
              >
                Confirm Hard Decline &amp; Denylist
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 rounded-lg border text-xs font-semibold glass-subtle" style={{ color: "var(--text-primary)" }}>
                  Release Hold
                </button>
                <button className="py-2 rounded-lg border text-xs font-semibold glass-subtle" style={{ color: "var(--accent-lavender)" }}>
                  Simulate Rule
                </button>
              </div>
            </div>
          </div>

          {/* Synthetic Threat Actor Profile */}
          <div className="p-4 rounded-xl border glass-panel space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center border"
                style={{
                  backgroundColor: "var(--status-coral-bg)",
                  color: "var(--status-coral)",
                  borderColor: "var(--status-coral-border)",
                }}
              >
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <span className="font-cyber-tag text-[9px] font-bold" style={{ color: "var(--status-coral)" }}>
                  Syndicate Fingerprint
                </span>
                <h4 className="font-heading font-bold text-xs" style={{ color: "var(--text-primary)" }}>
                  Cluster ID: #SYN-VORON-98
                </h4>
              </div>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Attributed to headless automation rotating residential socks5 proxies targeting immediately deliverable SaaS credentials and unauthorized keys.
            </p>
          </div>
        </div>
      </section>

      {/* Typography & Mapping Guide Card (From Stitch) */}
      <section className="p-6 rounded-2xl border glass-panel space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: "var(--accent-lavender)" }} />
            <div>
              <h3 className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                Typography Implementation &amp; Next.js Mapping Guide
              </h3>
              <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>
                Production architecture reference for design engineering integration
              </p>
            </div>
          </div>
          <span className="font-cyber-tag text-xs font-semibold px-2.5 py-0.5 rounded border"
            style={{ backgroundColor: "var(--accent-lavender-bg)", color: "var(--accent-lavender)" }}
          >
            [SPEC: FONT_STACK_V2.4]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-3 rounded-lg border glass-subtle space-y-1">
            <span className="font-cyber-tag text-[9px] font-bold" style={{ color: "var(--accent-lavender)" }}>DISPLAY HEADLINE</span>
            <div className="font-display font-black text-sm" style={{ color: "var(--text-primary)" }}>Syne / Akira</div>
            <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>900 weight uppercase for high-impact hero banners &amp; stats.</p>
          </div>
          <div className="p-3 rounded-lg border glass-subtle space-y-1">
            <span className="font-cyber-tag text-[9px] font-bold" style={{ color: "var(--status-mint)" }}>BRAND HEADINGS</span>
            <div className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>Plus Jakarta / Aero</div>
            <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>700 weight for module cards and tactical subheadings.</p>
          </div>
          <div className="p-3 rounded-lg border glass-subtle space-y-1">
            <span className="font-cyber-tag text-[9px] font-bold" style={{ color: "var(--status-peach)" }}>CYBER TAGS</span>
            <div className="font-mono-tech italic text-sm" style={{ color: "var(--status-peach)" }}>Alien AI Italic Tag</div>
            <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>Italic mono for cyber status pills and system badges.</p>
          </div>
          <div className="p-3 rounded-lg border glass-subtle space-y-1">
            <span className="font-cyber-tag text-[9px] font-bold" style={{ color: "var(--accent-blue)" }}>TECHNICAL &amp; BODY</span>
            <div className="font-mono-tech text-xs font-semibold" style={{ color: "var(--accent-blue)" }}>JetBrains Mono + Inter</div>
            <p className="font-mono-tech text-[10px]" style={{ color: "var(--text-muted)" }}>Inter for body line-height; JetBrains Mono for hashes and scores.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
