"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Scale, 
  ShoppingCart,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

interface ToolTrace {
  tool: string;
  parameters: any;
  status: "SUCCESS" | "FAILED";
  durationMs: number;
  resultSummary: string;
}

interface AgentResult {
  userIntent: string;
  searchCriteria: any;
  matchedProductIds: string[];
  matchedProducts: any[];
  comparisonResults: any[] | null;
  riskAssessmentReferences: any | null;
  recommendationRationale: string;
  missingEvidence: string[];
  suggestedNextAction: string;
  preparedCart: any | null;
  toolExecutionTrace: ToolTrace[];
}

export default function AgentPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AgentResult | null>(null);
  const [history, setHistory] = useState<Array<{ role: "user" | "agent"; content: string; result?: AgentResult }>>([
    {
      role: "agent",
      content:
        "Hello! I am your TrustCart AI Shopping Agent. Ask me to find deals, investigate counterfeit risks, compare specifications, or prepare a verified purchase. How can I assist you today?",
    },
  ]);

  const { addItem } = useCart();

  const samplePrompts = [
    "Find me a mechanical gaming keyboard under $50 with good specifications and low observed risk.",
    "Investigate the GeForce RTX 4090 for $189 and check for counterfeit indicators.",
    "Compare noise-canceling headphones under $400.",
    "Prepare a cart with a verified gaming mouse and proceed to checkout.",
  ];

  const handleSend = async (userText: string) => {
    if (!userText.trim() || loading) return;

    const currentQuery = userText;
    setQuery("");
    setLoading(true);

    setHistory((prev) => [...prev, { role: "user", content: currentQuery }]);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: currentQuery }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
        setHistory((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.result.recommendationRationale,
            result: data.result,
          },
        ]);
      } else {
        setHistory((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.error || "Agent encountered an error executing tools.",
          },
        ]);
      }
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Network error communicating with AI agent backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-cyber-tag text-xs font-bold" style={{ color: "var(--accent-lavender)" }}>
              AUTONOMOUS SHOPPING CONDUIT
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tech font-bold"
              style={{
                backgroundColor: "var(--status-mint-bg)",
                color: "var(--status-mint)",
              }}
            >
              STRUCTURED TOOL CALLING ACTIVE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl" style={{ color: "var(--text-primary)" }}>
            AI SHOPPING WORKSPACE
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
            Natural language intent extraction backed by real-time catalog search and deterministic forensic risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setHistory([
                {
                  role: "agent",
                  content: "Conversation reset. What product shall we investigate next?",
                },
              ]);
              setResult(null);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold glass-subtle transition-all"
            style={{ color: "var(--text-secondary)" }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Session</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-cyber-tag text-[10px]" style={{ color: "var(--text-muted)" }}>
          DEMO PROMPTS:
        </span>
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            disabled={loading}
            className="px-3 py-1.5 rounded-lg border text-[11px] font-medium text-left glass-subtle hover:bg-[var(--bg-surface-elevated)] transition-all line-clamp-1"
            style={{ color: "var(--text-primary)" }}
          >
            "{p}"
          </button>
        ))}
      </div>

      {/* Split Workspace: Chat & Response Stream (Left 60%) / Execution Telemetry (Right 40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Conversation & Structured Results */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-4 sm:p-6 rounded-2xl border glass-panel space-y-6 min-h-[460px] flex flex-col justify-between">
            {/* Message Stream */}
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "agent" && (
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 shadow-sm"
                      style={{
                        backgroundColor: "var(--accent-lavender)",
                        color: "#171722",
                      }}
                    >
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "border glass-panel-elevated font-medium"
                        : "border glass-subtle"
                    }`}
                    style={{
                      backgroundColor: msg.role === "user" ? "var(--accent-lavender-bg)" : "var(--bg-surface)",
                      color: "var(--text-primary)",
                      borderColor: "var(--border-color)",
                    }}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    {/* Matched Product Cards within Chat Bubble */}
                    {msg.result && msg.result.matchedProducts && msg.result.matchedProducts.length > 0 && (
                      <div className="mt-4 pt-3 border-t space-y-3" style={{ borderColor: "var(--border-color)" }}>
                        <span className="font-cyber-tag text-[10px] font-bold" style={{ color: "var(--accent-lavender)" }}>
                          MATCHED RECOMMENDATIONS:
                        </span>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.result.matchedProducts.slice(0, 2).map((item: any) => (
                            <div
                              key={item.id}
                              className="p-3 rounded-xl border glass-panel flex flex-col justify-between gap-2"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] font-mono-tech font-bold"
                                    style={{
                                      color: item.riskScore < 25 ? "var(--status-mint)" : "var(--status-coral)",
                                    }}
                                  >
                                    Risk: {item.riskScore}/100
                                  </span>
                                  <span className="text-[10px] font-mono-tech font-bold" style={{ color: "var(--text-primary)" }}>
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                <h4 className="font-heading font-bold text-xs line-clamp-2" style={{ color: "var(--text-primary)" }}>
                                  {item.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1.5 pt-1">
                                <Link
                                  href={`/investigate/${item.id}`}
                                  className="flex-1 py-1 text-center rounded text-[10px] font-semibold border"
                                  style={{
                                    backgroundColor: "var(--bg-surface-subtle)",
                                    color: "var(--accent-lavender)",
                                  }}
                                >
                                  Forensic Audit
                                </Link>
                                <button
                                  onClick={() =>
                                    addItem({
                                      id: item.id,
                                      title: item.title,
                                      price: item.price,
                                      currency: "USD",
                                      imageUrl: "",
                                      category: item.category,
                                      sellerName: item.sellerName,
                                      riskScore: item.riskScore,
                                    })
                                  }
                                  className="px-2 py-1 rounded text-[10px] font-bold shadow-sm"
                                  style={{
                                    backgroundColor: "var(--accent-lavender)",
                                    color: "#171722",
                                  }}
                                >
                                  + Cart
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Prepared Cart Checkout Box */}
                        {msg.result.preparedCart && (
                          <div className="p-3 rounded-xl border mt-3 flex items-center justify-between"
                            style={{
                              backgroundColor: "var(--status-mint-bg)",
                              borderColor: "var(--status-mint-border)",
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-bold text-xs" style={{ color: "var(--status-mint)" }}>
                                Cart Prepared: ${msg.result.preparedCart.total} (Avg Risk: {msg.result.preparedCart.avgRiskScore}/100)
                              </span>
                              <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                Ready for PayPal checkout clearance
                              </span>
                            </div>
                            <Link
                              href="/checkout"
                              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1"
                              style={{
                                backgroundColor: "var(--accent-lavender)",
                                color: "#171722",
                              }}
                            >
                              <span>Checkout</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 p-3 rounded-xl border glass-subtle text-xs font-mono-tech"
                  style={{ color: "var(--accent-lavender)" }}
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Executing backend tools & evaluating risk evidence...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(query);
              }}
              className="flex items-center gap-2 pt-3 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about budget keyboards, counterfeit GPU deals, or noise canceling..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border text-xs sm:text-sm glass-subtle focus:outline-none focus:ring-1 focus:ring-[var(--accent-lavender)]"
                style={{ color: "var(--text-primary)" }}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                style={{
                  backgroundColor: "var(--accent-lavender)",
                  color: "#171722",
                }}
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Honest Tool Execution Traces & Structured Artifacts */}
        <div className="lg:col-span-5 space-y-4">
          {/* Tool Tracing Box */}
          <div className="p-5 rounded-2xl border glass-panel space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4" style={{ color: "var(--accent-lavender)" }} />
                <h3 className="font-heading font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                  Controlled Tool Execution Log
                </h3>
              </div>
              <span className="font-cyber-tag text-[9px]" style={{ color: "var(--text-muted)" }}>
                SANDBOX RUNNER
              </span>
            </div>

            <div className="space-y-2.5">
              {!result || !result.toolExecutionTrace || result.toolExecutionTrace.length === 0 ? (
                <div className="p-4 rounded-xl border glass-subtle text-center text-xs font-mono-tech"
                  style={{ color: "var(--text-muted)" }}
                >
                  Awaiting query dispatch. Tool calls (`search_products`, `assess_listing`, `compare_products`, `prepare_cart`) will trace here honestly with milliseconds latency.
                </div>
              ) : (
                result.toolExecutionTrace.map((trace, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border glass-subtle space-y-1 font-mono-tech text-xs"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px]" style={{ color: "var(--accent-lavender)" }}>
                        tool: {trace.tool}()
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
                        style={{
                          backgroundColor: "var(--status-mint-bg)",
                          color: "var(--status-mint)",
                        }}
                      >
                        {trace.durationMs}ms
                      </span>
                    </div>

                    <div className="text-[10px] text-truncate opacity-75" style={{ color: "var(--text-secondary)" }}>
                      args: {JSON.stringify(trace.parameters)}
                    </div>

                    <p className="text-[11px] pt-1" style={{ color: "var(--text-primary)" }}>
                      → {trace.resultSummary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Structured Output Schema Inspector */}
          {result && (
            <div className="p-5 rounded-2xl border glass-panel space-y-3">
              <span className="font-cyber-tag text-[10px] font-bold" style={{ color: "var(--accent-blue)" }}>
                STRUCTURED ARTIFACT CONTRACT
              </span>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg border glass-subtle flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>Extracted Intent:</span>
                  <span className="font-semibold text-right" style={{ color: "var(--text-primary)" }}>
                    {result.userIntent}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg border glass-subtle flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>Suggested Action:</span>
                  <span className="font-semibold text-right" style={{ color: "var(--status-mint)" }}>
                    {result.suggestedNextAction}
                  </span>
                </div>

                {result.missingEvidence && result.missingEvidence.length > 0 && (
                  <div className="p-2.5 rounded-lg border glass-subtle space-y-1">
                    <span className="font-bold text-[11px]" style={{ color: "var(--status-coral)" }}>
                      Missing Evidence Noted:
                    </span>
                    <ul className="list-disc pl-4 text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      {result.missingEvidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
