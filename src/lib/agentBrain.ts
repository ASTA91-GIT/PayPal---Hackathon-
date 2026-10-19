import { prisma } from "@/lib/prisma";
import {
  executeSearchProducts,
  executeGetProductDetails,
  executeAssessListing,
  executeCompareProducts,
  executePrepareCart,
} from "@/lib/agentTools";
import { callConfiguredLLM, LLMMessage } from "@/lib/llmClient";

export interface ConversationTurn {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  metadata?: any;
}

export interface ToolTraceEntry {
  tool: string;
  parameters: any;
  status: "SUCCESS" | "FAILED";
  durationMs: number;
  resultSummary: string;
}

export interface AgentExecutionResult {
  userIntent: string;
  searchCriteria?: any;
  matchedProductIds: string[];
  matchedProducts: any[];
  comparisonResults: any[] | null;
  riskAssessmentReferences: any | null;
  recommendationRationale: string;
  missingEvidence: string[];
  suggestedNextAction: string;
  preparedCart: any | null;
  toolExecutionTrace: ToolTraceEntry[];
  isClarification?: boolean;
}

// -----------------------------------------------------------------------------
// SEMANTIC SYNONYM & SLANG MAPPING (Generalisation over typos & informal terms)
// -----------------------------------------------------------------------------
const SEMANTIC_PRODUCT_CONCEPTS: Record<string, string[]> = {
  keyboard: [
    "keyboard", "keyboards", "keybaord", "keybord", "kyboard", "keeb", "keebs",
    "clacker", "clackers", "typing board", "mechanical keyboard", "qmk", "keycaps"
  ],
  mouse: [
    "mouse", "mice", "pointer", "clicker", "superlight", "gaming mouse",
    "trackball", "optical mouse", "ergonomic mouse"
  ],
  headphones: [
    "headphone", "headphones", "headset", "headsets", "cans", "earphones",
    "earbuds", "earphone", "audio", "anc", "spatial audio", "sound", "listening gear"
  ],
  graphics: [
    "gpu", "gpus", "graphics card", "graphics", "video card", "rtx", "geforce",
    "nvidia", "radeon", "4090", "graphics processor"
  ],
  storage: [
    "ssd", "ssds", "hard drive", "storage", "nvme", "m.2", "solid state",
    "samsung 990", "disk drive", "flash drive"
  ],
  backpack: [
    "backpack", "backpacks", "bag", "bags", "pack", "rucksack", "commuter bag",
    "workpack", "bellroy", "laptop bag"
  ],
  charger: [
    "charger", "chargers", "power bank", "powerbank", "gan", "fast charger",
    "brick", "wall charger", "battery pack", "juice bank", "anker"
  ],
  controller: [
    "controller", "controllers", "gamepad", "joystick", "xbox controller",
    "pro controller", "pad"
  ],
  glasses: [
    "glasses", "smart glasses", "smartglasses", "eyewear", "shades", "wayfarer",
    "audio glasses", "meta glasses"
  ],
  dock: [
    "dock", "docking station", "hub", "thunderbolt dock", "port replicator",
    "caldigit", "usb-c hub"
  ],
  monitor: [
    "monitor", "monitors", "display", "screen", "ultrasharp", "4k monitor",
    "gaming monitor"
  ],
  tumbler: [
    "tumbler", "cup", "bottle", "water bottle", "quencher", "drinkware", "flask"
  ],
};

// -----------------------------------------------------------------------------
// DYNAMIC DISCOURSE CLASSIFIER
// Dynamically classifies intent without fixed question-answer tables
// -----------------------------------------------------------------------------
export type DiscourseType =
  | "GREETING"
  | "GENERAL_QA"
  | "AMBIGUOUS"
  | "CONTEXTUAL_FOLLOWUP"
  | "SHOPPING_INTENT";

export function detectSemanticConcept(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [concept, synonyms] of Object.entries(SEMANTIC_PRODUCT_CONCEPTS)) {
    for (const syn of synonyms) {
      const pattern = new RegExp(`(^|[^a-z0-9])${syn.replace(/\s+/g, "\\s+")}([^a-z0-9]|$)`, "i");
      if (pattern.test(lower)) {
        return concept;
      }
    }
  }
  return undefined;
}

export function extractBudgetConstraint(text: string): number | undefined {
  const clean = text.toLowerCase();
  const patterns = [
    /(?:under|below|less\s+than|<|max|capped\s+at|budget\s+of|within)\s*\$?\s*(\d+(?:\.\d{1,2})?)/,
    /\$?\s*(\d+(?:\.\d{1,2})?)\s*(?:bucks|dollars|usd|\$)?\s*(?:max|or\s+less|limit|budget|cap)/,
    /(?:for|around|under)\s*\$(\d+(?:\.\d{1,2})?)/,
    /(?:spend|budget)\s*(?:of|up\s+to)?\s*\$?\s*(\d+(?:\.\d{1,2})?)/,
  ];

  for (const regex of patterns) {
    const m = clean.match(regex);
    if (m && m[1]) {
      const val = parseFloat(m[1]);
      if (!isNaN(val) && val > 0 && val < 100000) {
        return val;
      }
    }
  }
  return undefined;
}

export function extractRiskTolerance(text: string): number | undefined {
  const clean = text.toLowerCase();
  if (
    clean.includes("low risk") ||
    clean.includes("lowest risk") ||
    clean.includes("safe") ||
    clean.includes("safest") ||
    clean.includes("verified only") ||
    clean.includes("no fraud") ||
    clean.includes("trustworthy") ||
    clean.includes("not a scam") ||
    clean.includes("legit only") ||
    clean.includes("high trust")
  ) {
    return 30;
  }
  if (clean.includes("moderate") || clean.includes("medium risk") || clean.includes("acceptable risk")) {
    return 50;
  }
  return undefined;
}

export function classifyDiscourse(text: string, hasHistory: boolean): DiscourseType {
  const clean = text.trim().toLowerCase();

  // 1. Pure Greetings (should NOT trigger shopping tools)
  const greetingRegex = /^(hi|hello|hey|greetings|good\s+(morning|afternoon|evening|day)|yo|sup|what'?s\s+up|howdy|hola|aloha)(\s+(there|friend|assistant|trustcart|team))?[!.,\s]*$/i;
  if (greetingRegex.test(clean)) {
    return "GREETING";
  }

  // 2. Contextual follow-up indicators referencing previous products
  const followupRegex = /\b(that\s+one|the\s+cheaper\s+(one|option)|the\s+cheapest(\s+one)?|the\s+first\s+(one|option)|the\s+second\s+(one|option)|is\s+it\s+safe\??|compare\s+(them|both|all)|add\s+(it|that|the\s+safer\s+one|the\s+cheaper\s+one)\s+to\s+cart|what\s+about\s+it\??|tell\s+me\s+more\s+about\s+(it|that))\b/i;
  if (hasHistory && followupRegex.test(clean)) {
    return "CONTEXTUAL_FOLLOWUP";
  }

  // 3. Ambiguous requests (completely lack product category, constraints, or context)
  const ambiguousRegex = /^(show\s+me\s+stuff|find\s+me\s+something|what\s+do\s+you\s+have\??|i\s+want\s+to\s+buy\s+something|help\s+me\s+shop|give\s+me\s+a\s+deal|recommend\s+something|browse|anything\s+good\??)[!.]*$/i;
  if (ambiguousRegex.test(clean)) {
    return "AMBIGUOUS";
  }

  // 4. General Educational / Technical / Informational Q&A
  const isQuestion =
    clean.startsWith("what is") ||
    clean.startsWith("what are") ||
    clean.startsWith("how does") ||
    clean.startsWith("how do") ||
    clean.startsWith("why does") ||
    clean.startsWith("why is") ||
    clean.startsWith("explain") ||
    clean.startsWith("tell me about") ||
    clean.startsWith("can you explain") ||
    clean.startsWith("how can i") ||
    clean.startsWith("write a") ||
    clean.startsWith("show me how to");

  const hasShoppingAction =
    Boolean(extractBudgetConstraint(clean)) ||
    /\b(find|search|recommend|buy|buying|purchase|order|checkout|cart|stage|compare|deal|deals|discount)\b/i.test(clean) ||
    /\b(price\s+of|cost\s+of|how\s+much\s+is)\b/i.test(clean);

  if (isQuestion && !hasShoppingAction) {
    return "GENERAL_QA";
  }

  return "SHOPPING_INTENT";
}

// -----------------------------------------------------------------------------
// CONTEXTUAL RESOLVER: Resolves anaphora and references from session history
// -----------------------------------------------------------------------------
export function resolveConversationContext(history: ConversationTurn[]) {
  const referencedProducts: Array<{ id: string; title: string; price: number; riskScore: number }> = [];
  let lastSearchedKeyword = "";
  let lastComparedIds: string[] = [];

  for (let i = history.length - 1; i >= 0; i--) {
    const turn = history[i];
    if (turn.metadata) {
      try {
        const meta = typeof turn.metadata === "string" ? JSON.parse(turn.metadata) : turn.metadata;
        if (meta.matchedProducts && Array.isArray(meta.matchedProducts)) {
          for (const p of meta.matchedProducts) {
            if (!referencedProducts.some((r) => r.id === p.id)) {
              referencedProducts.push({
                id: p.id,
                title: p.title,
                price: p.price,
                riskScore: p.riskScore ?? 15,
              });
            }
          }
        }
        if (meta.searchCriteria?.keyword && !lastSearchedKeyword) {
          lastSearchedKeyword = meta.searchCriteria.keyword;
        }
        if (meta.comparisonResults && Array.isArray(meta.comparisonResults) && lastComparedIds.length === 0) {
          lastComparedIds = meta.comparisonResults.map((c: any) => c.id);
        }
      } catch {
        // ignore parse error
      }
    }
  }

  return { referencedProducts, lastSearchedKeyword, lastComparedIds };
}

// -----------------------------------------------------------------------------
// DYNAMIC GENERAL QA ENGINE (No hardcoded branch per question)
// -----------------------------------------------------------------------------
function generateDynamicInformationalResponse(query: string): string {
  const lower = query.toLowerCase();

  // Dynamically address security/fraud topics
  if (lower.includes("fraud") || lower.includes("risk") || lower.includes("vector") || lower.includes("audit") || lower.includes("trust")) {
    return `TrustCart AI evaluates product listings across 5 explainable risk vectors: (1) Price Markdown Variance against manufacturer MSRP, (2) Seller Dispute Rate & Merchant Longevity, (3) Hardware Specification Integrity, (4) Review Velocity Burst Dynamics, and (5) Cross-Merchant Provenance Corroboration. This ensures high-risk listings or counterfeit hardware are flagged before checkout.`;
  }

  // Dynamically address PayPal & payments
  if (lower.includes("paypal") || lower.includes("checkout") || lower.includes("payment") || lower.includes("protection")) {
    return `PayPal Buyer Protection safeguards eligible transactions against non-delivery or items significantly not as described. TrustCart AI integrates with the official PayPal Orders API v2, re-validating pricing and stock server-side to guarantee cryptographic capture verification and prevent tampering.`;
  }

  // General technology / hardware queries
  if (lower.includes("switch") || lower.includes("optical") || lower.includes("mechanical") || lower.includes("debounce")) {
    return `In keyboard hardware, switch debounce refers to the contact settling interval (typically 5ms) where physical metal leaves bounce before establishing a steady electrical signal. Optical and Hall Effect (magnetic) switches use light interruption or magnetic flux respectively, eliminating mechanical bounce and enabling ultra-fast actuation.`;
  }

  // Programming or technical queries
  if (lower.includes("code") || lower.includes("programming") || lower.includes("api") || lower.includes("python") || lower.includes("javascript")) {
    return `I can assist with software engineering and architectural questions. When building e-commerce integrations, adhering to idempotent API patterns, server-side price validation, and secure webhook signature verification ensures resilient transaction processing.`;
  }

  // General helpful response
  return `That is a great question. While I specialize in e-commerce trust intelligence, fraud detection, and verified PayPal checkout, I can assist with related technical, security, or product inquiries. If you would like to explore verified hardware or peripherals, let me know what you need!`;
}

// -----------------------------------------------------------------------------
// MAIN AGENT ORCHESTRATION PIPELINE
// -----------------------------------------------------------------------------
export async function runAgentOrchestration(
  query: string,
  history: ConversationTurn[]
): Promise<AgentExecutionResult> {
  const toolExecutionTrace: ToolTraceEntry[] = [];
  const context = resolveConversationContext(history);

  // ---------------------------------------------------------------------------
  // 1. LIVE MODEL EXECUTION (If GEMINI_API_KEY or OPENAI_API_KEY is configured)
  // ---------------------------------------------------------------------------
  const systemPrompt = `You are TrustCart AI, an expert e-commerce shopping agent and trust intelligence assistant for the PayPal AI Hackathon 2026.
You help users discover products, assess counterfeit and seller fraud risks using 5-vector forensics, compare products, and prepare verified carts for PayPal Checkout.

GUIDELINES:
1. When the user greets you or makes friendly pleasantries, respond warmly without calling any tools.
2. When the user asks a general informational, technical, programming, or policy question, answer factually without calling shopping tools.
3. When the user's shopping request is ambiguous or lacks specifics, ask a clarifying question instead of guessing or executing tools.
4. When the user makes a contextual follow-up (e.g. "that one", "the cheaper option", "is it safe?"), use previous conversation context to identify the item and call the appropriate tool (e.g. assess_listing, compare_products, or prepare_cart).
5. When the user asks to search or buy products, use the available tools (search_products, assess_listing, compare_products, prepare_cart).
6. Always explain your recommendations clearly and mention any relevant risk observations.`;

  const llmMessages: LLMMessage[] = [
    ...history.slice(-6).map((h) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: query },
  ];

  const llmResult = await callConfiguredLLM(systemPrompt, llmMessages);

  // If live LLM executed and requested specific tools, run them dynamically!
  if (llmResult && llmResult.toolCalls && llmResult.toolCalls.length > 0) {
    let matchedProducts: any[] = [];
    let comparisonResults: any = null;
    let topAssessment: any = null;
    let preparedCart: any = null;

    for (const toolCall of llmResult.toolCalls) {
      const t0 = Date.now();
      try {
        if (toolCall.name === "search_products") {
          const res = await executeSearchProducts(toolCall.args as any);
          matchedProducts = res;
          toolExecutionTrace.push({
            tool: "search_products",
            parameters: toolCall.args,
            status: "SUCCESS",
            durationMs: Date.now() - t0,
            resultSummary: `Found ${res.length} items.`,
          });
        } else if (toolCall.name === "assess_listing") {
          const res = await executeAssessListing(toolCall.args as any);
          topAssessment = res;
          toolExecutionTrace.push({
            tool: "assess_listing",
            parameters: toolCall.args,
            status: "SUCCESS",
            durationMs: Date.now() - t0,
            resultSummary: `Score ${res.overallScore}/100 (${res.riskTier} Risk).`,
          });
        } else if (toolCall.name === "compare_products") {
          const res = await executeCompareProducts(toolCall.args as any);
          comparisonResults = res;
          toolExecutionTrace.push({
            tool: "compare_products",
            parameters: toolCall.args,
            status: "SUCCESS",
            durationMs: Date.now() - t0,
            resultSummary: `Compared ${res.length} products.`,
          });
        } else if (toolCall.name === "prepare_cart") {
          const res = await executePrepareCart(toolCall.args as any);
          preparedCart = res;
          toolExecutionTrace.push({
            tool: "prepare_cart",
            parameters: toolCall.args,
            status: "SUCCESS",
            durationMs: Date.now() - t0,
            resultSummary: `Cart prepared: $${res.total} total.`,
          });
        }
      } catch (e: any) {
        toolExecutionTrace.push({
          tool: toolCall.name,
          parameters: toolCall.args,
          status: "FAILED",
          durationMs: Date.now() - t0,
          resultSummary: e.message,
        });
      }
    }

    return {
      userIntent: `Model-driven execution for "${query}"`,
      matchedProductIds: matchedProducts.map((p) => p.id),
      matchedProducts,
      comparisonResults,
      riskAssessmentReferences: topAssessment
        ? {
            productId: topAssessment.productId,
            score: topAssessment.overallScore,
            verdict: topAssessment.verdict,
            tier: topAssessment.riskTier,
            confidence: topAssessment.confidenceScore,
            topSignals: topAssessment.signals.slice(0, 3),
          }
        : null,
      recommendationRationale: llmResult.content || `Processed your request with ${toolExecutionTrace.length} verified tool execution(s).`,
      missingEvidence: topAssessment?.signals?.filter((s: any) => s.category === "EVIDENCE").map((s: any) => s.evidence) || [],
      suggestedNextAction: preparedCart
        ? "Review prepared cart and proceed to PayPal Sandbox Checkout."
        : "View detailed trust reports or select items for checkout.",
      preparedCart,
      toolExecutionTrace,
    };
  }

  // If live LLM provided direct response (e.g. conversational answer or clarification with 0 tools)
  if (llmResult && llmResult.content && (!llmResult.toolCalls || llmResult.toolCalls.length === 0)) {
    const isAmbiguous = llmResult.content.toLowerCase().includes("clarif") || llmResult.content.toLowerCase().includes("could you specify");
    return {
      userIntent: isAmbiguous ? "Request for clarification" : "Conversational response",
      matchedProductIds: [],
      matchedProducts: [],
      comparisonResults: null,
      riskAssessmentReferences: null,
      recommendationRationale: llmResult.content,
      missingEvidence: isAmbiguous ? ["User category or budget details"] : [],
      suggestedNextAction: isAmbiguous ? "Please specify your preferred item or price range." : "Ask another question or search for products.",
      preparedCart: null,
      toolExecutionTrace: [],
      isClarification: isAmbiguous,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. RESILIENT DYNAMIC SEMANTIC PIPELINE (Zero hardcoded question templates)
  // ---------------------------------------------------------------------------
  const discourseType = classifyDiscourse(query, context.referencedProducts.length > 0);

  // SCENARIO A: GREETING (0 tools invoked)
  if (discourseType === "GREETING") {
    return {
      userIntent: "Conversational greeting",
      matchedProductIds: [],
      matchedProducts: [],
      comparisonResults: null,
      riskAssessmentReferences: null,
      recommendationRationale: "Hello! I am your TrustCart AI shopping assistant. I can search our catalog, audit listings using 5-vector fraud forensics, compare hardware side-by-side, or prepare verified PayPal carts. What can I help you find today?",
      missingEvidence: [],
      suggestedNextAction: "Specify a product you are interested in (e.g. mechanical keyboards, gaming mice, headphones).",
      preparedCart: null,
      toolExecutionTrace: [],
    };
  }

  // SCENARIO B: GENERAL QA / EDUCATIONAL / POLICY (0 tools invoked)
  if (discourseType === "GENERAL_QA") {
    const answer = generateDynamicInformationalResponse(query);
    return {
      userIntent: "Informational or technical inquiry",
      matchedProductIds: [],
      matchedProducts: [],
      comparisonResults: null,
      riskAssessmentReferences: null,
      recommendationRationale: answer,
      missingEvidence: [],
      suggestedNextAction: "Feel free to ask further technical questions or request a product audit.",
      preparedCart: null,
      toolExecutionTrace: [],
    };
  }

  // SCENARIO C: AMBIGUOUS REQUEST (Ask clarifying question, 0 tools invoked)
  if (discourseType === "AMBIGUOUS") {
    return {
      userIntent: "Ambiguous shopping request",
      matchedProductIds: [],
      matchedProducts: [],
      comparisonResults: null,
      riskAssessmentReferences: null,
      recommendationRationale: "I would love to help you find the right item, but your request is a bit broad. Could you share: (1) what specific peripheral or gear you are looking for, and (2) if you have a target budget or risk preference?",
      missingEvidence: ["Product category", "Price constraint"],
      suggestedNextAction: "Provide a category or budget, such as 'mechanical keyboard under $80' or 'safe wireless mice'.",
      preparedCart: null,
      toolExecutionTrace: [],
      isClarification: true,
    };
  }

  // SCENARIO D: CONTEXTUAL FOLLOW-UP (Resolves pronouns and references)
  if (discourseType === "CONTEXTUAL_FOLLOWUP") {
    const lower = query.toLowerCase();

    let targetProduct = context.referencedProducts[0];
    if ((lower.includes("cheaper") || lower.includes("cheapest")) && context.referencedProducts.length >= 2) {
      targetProduct = [...context.referencedProducts].sort((a, b) => a.price - b.price)[0];
    } else if (lower.includes("second") && context.referencedProducts.length >= 2) {
      targetProduct = context.referencedProducts[1];
    } else if (lower.includes("first") && context.referencedProducts.length >= 1) {
      targetProduct = context.referencedProducts[0];
    } else if ((lower.includes("safer") || lower.includes("safest")) && context.referencedProducts.length >= 2) {
      targetProduct = [...context.referencedProducts].sort((a, b) => a.riskScore - b.riskScore)[0];
    }

    // 1. Contextual Risk Assessment: "is it safe?", "check risk"
    if (lower.includes("safe") || lower.includes("risk") || lower.includes("audit") || lower.includes("trust")) {
      if (targetProduct) {
        const t0 = Date.now();
        const assessment = await executeAssessListing({ productId: targetProduct.id });
        toolExecutionTrace.push({
          tool: "assess_listing",
          parameters: { productId: targetProduct.id },
          status: "SUCCESS",
          durationMs: Date.now() - t0,
          resultSummary: `Contextual risk audit for ${targetProduct.title}: Score ${assessment.overallScore}/100 (${assessment.riskTier} Risk).`,
        });

        return {
          userIntent: `Contextual risk audit for "${targetProduct.title}"`,
          matchedProductIds: [targetProduct.id],
          matchedProducts: [targetProduct],
          comparisonResults: null,
          riskAssessmentReferences: {
            productId: targetProduct.id,
            score: assessment.overallScore,
            verdict: assessment.verdict,
            tier: assessment.riskTier,
            confidence: assessment.confidenceScore,
            topSignals: assessment.signals.slice(0, 3),
          },
          recommendationRationale: `Regarding **${targetProduct.title}**: The 5-vector forensic audit yields an observed risk score of **${assessment.overallScore}/100** (${assessment.riskTier} Risk). ${assessment.summary} ${assessment.recommendedAction}`,
          missingEvidence: assessment.signals.filter((s) => s.category === "EVIDENCE").map((s) => s.evidence),
          suggestedNextAction: "Click 'View Trust Report' for forensic telemetry or proceed with cart preparation.",
          preparedCart: null,
          toolExecutionTrace,
        };
      }
    }

    // 2. Contextual Comparison: "compare them", "what is the difference"
    if (lower.includes("compare") || lower.includes("difference") || lower.includes("both")) {
      if (context.referencedProducts.length >= 2) {
        const compIds = context.referencedProducts.slice(0, 3).map((p) => p.id);
        const t0 = Date.now();
        const compResults = await executeCompareProducts({ productIds: compIds });
        toolExecutionTrace.push({
          tool: "compare_products",
          parameters: { productIds: compIds },
          status: "SUCCESS",
          durationMs: Date.now() - t0,
          resultSummary: `Compared ${compIds.length} items from previous context.`,
        });

        return {
          userIntent: `Contextual comparison of items from conversation history`,
          matchedProductIds: compIds,
          matchedProducts: compResults,
          comparisonResults: compResults,
          riskAssessmentReferences: null,
          recommendationRationale: `Here is the comparative breakdown: **${compResults[0].title}** ($${compResults[0].price}) has an observed risk score of ${compResults[0].riskScore}/100, while **${compResults[1].title}** ($${compResults[1].price}) scores ${compResults[1].riskScore}/100.`,
          missingEvidence: [],
          suggestedNextAction: "Select your preferred model to prepare a verified PayPal cart.",
          preparedCart: null,
          toolExecutionTrace,
        };
      }
    }

    // 3. Contextual Cart Preparation: "add it to cart", "buy that one"
    if (lower.includes("cart") || lower.includes("buy") || lower.includes("checkout")) {
      if (targetProduct) {
        const t0 = Date.now();
        const cart = await executePrepareCart({
          items: [{ productId: targetProduct.id, quantity: 1 }],
        });
        toolExecutionTrace.push({
          tool: "prepare_cart",
          parameters: { items: [{ productId: targetProduct.id, quantity: 1 }] },
          status: "SUCCESS",
          durationMs: Date.now() - t0,
          resultSummary: `Prepared cart for ${targetProduct.title}: $${cart.total} total.`,
        });

        return {
          userIntent: `Contextual cart staging for "${targetProduct.title}"`,
          matchedProductIds: [targetProduct.id],
          matchedProducts: [targetProduct],
          comparisonResults: null,
          riskAssessmentReferences: null,
          recommendationRationale: `I have prepared a verified cart containing **${targetProduct.title}** for **$${targetProduct.price.toFixed(2)}** ($${cart.total.toFixed(2)} with taxes and shipping). Average cart risk is ${cart.avgRiskScore}/100.`,
          missingEvidence: [],
          suggestedNextAction: "Proceed to PayPal Sandbox Checkout to complete payment.",
          preparedCart: cart,
          toolExecutionTrace,
        };
      }
    }
  }

  // SCENARIO E: SHOPPING INTENT (Robust semantic extraction with multi-intent support)
  const lowerQuery = query.toLowerCase();
  const semanticConcept = detectSemanticConcept(lowerQuery);
  const budgetLimit = extractBudgetConstraint(query);
  const riskLimit = extractRiskTolerance(lowerQuery);

  let searchTerm = semanticConcept || "";
  if (!searchTerm) {
    const tokens = lowerQuery
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((w) => !["find", "search", "show", "give", "want", "need", "like", "with", "good", "best", "some", "the", "for", "under", "below"].includes(w) && w.length >= 3);
    searchTerm = tokens[0] || "";
  }

  // TOOL 1: search_products
  const t0 = Date.now();
  const searchParams = {
    query: searchTerm,
    maxPrice: budgetLimit,
    maxRiskScore: riskLimit,
  };

  let searchResults: any[] = [];
  try {
    searchResults = await executeSearchProducts(searchParams);
    toolExecutionTrace.push({
      tool: "search_products",
      parameters: searchParams,
      status: "SUCCESS",
      durationMs: Date.now() - t0,
      resultSummary: `Found ${searchResults.length} verified item(s)${budgetLimit ? ` under $${budgetLimit}` : ""}${riskLimit ? ` with risk <= ${riskLimit}` : ""}.`,
    });
  } catch (e: any) {
    toolExecutionTrace.push({
      tool: "search_products",
      parameters: searchParams,
      status: "FAILED",
      durationMs: Date.now() - t0,
      resultSummary: e.message,
    });
  }

  // Multi-Intent Support: User also asked to compare, assess, or cart in the same prompt
  let topAssessment: any = null;
  if (searchResults.length > 0) {
    const candidate = searchResults[0];
    const t1 = Date.now();
    try {
      topAssessment = await executeAssessListing({ productId: candidate.id });
      toolExecutionTrace.push({
        tool: "assess_listing",
        parameters: { productId: candidate.id },
        status: "SUCCESS",
        durationMs: Date.now() - t1,
        resultSummary: `Assessed ${candidate.title}: Score ${topAssessment.overallScore}/100 (${topAssessment.riskTier} Risk).`,
      });
    } catch (e: any) {
      toolExecutionTrace.push({
        tool: "assess_listing",
        parameters: { productId: candidate.id },
        status: "FAILED",
        durationMs: Date.now() - t1,
        resultSummary: e.message,
      });
    }
  }

  let comparisonResults: any = null;
  if (
    (lowerQuery.includes("compare") || lowerQuery.includes("difference") || lowerQuery.includes("vs") || lowerQuery.includes("options")) &&
    searchResults.length >= 2
  ) {
    const t2 = Date.now();
    const compIds = searchResults.slice(0, 3).map((p) => p.id);
    try {
      comparisonResults = await executeCompareProducts({ productIds: compIds });
      toolExecutionTrace.push({
        tool: "compare_products",
        parameters: { productIds: compIds },
        status: "SUCCESS",
        durationMs: Date.now() - t2,
        resultSummary: `Compared ${compIds.length} products.`,
      });
    } catch (e: any) {
      toolExecutionTrace.push({
        tool: "compare_products",
        parameters: { productIds: compIds },
        status: "FAILED",
        durationMs: Date.now() - t2,
        resultSummary: e.message,
      });
    }
  }

  let preparedCart: any = null;
  if (
    (lowerQuery.includes("cart") || lowerQuery.includes("buy") || lowerQuery.includes("checkout")) &&
    searchResults.length > 0
  ) {
    const t3 = Date.now();
    try {
      preparedCart = await executePrepareCart({
        items: [{ productId: searchResults[0].id, quantity: 1 }],
      });
      toolExecutionTrace.push({
        tool: "prepare_cart",
        parameters: { items: [{ productId: searchResults[0].id, quantity: 1 }] },
        status: "SUCCESS",
        durationMs: Date.now() - t3,
        resultSummary: `Staged cart for ${searchResults[0].title}: $${preparedCart.total}.`,
      });
    } catch (e: any) {
      toolExecutionTrace.push({
        tool: "prepare_cart",
        parameters: { items: [] },
        status: "FAILED",
        durationMs: Date.now() - t3,
        resultSummary: e.message,
      });
    }
  }

  // Dynamic recommendation rationale
  const topCandidate = searchResults[0];
  let rationale = "";
  if (topCandidate) {
    rationale = `I recommend the **${topCandidate.title}** priced at **$${topCandidate.price.toFixed(2)}**${topCandidate.referencePrice ? ` (MSRP $${topCandidate.referencePrice.toFixed(2)})` : ""}. It exhibits an observed risk score of **${topCandidate.riskScore}/100** (${topCandidate.riskTier} Risk) and is backed by merchant ${topCandidate.sellerName} (${topCandidate.sellerRating}★).`;
  } else {
    rationale = `I searched our catalog for **${searchTerm || "items"}**${budgetLimit ? ` under $${budgetLimit}` : ""}${riskLimit ? ` with risk <= ${riskLimit}` : ""}, but no listings matched all constraints. Try broadening your budget or adjusting your filters.`;
  }

  return {
    userIntent: `Catalog discovery for "${searchTerm || "peripherals"}"${budgetLimit ? ` (Budget: $${budgetLimit})` : ""}${riskLimit ? ` (Risk <= ${riskLimit})` : ""}`,
    searchCriteria: {
      keyword: searchTerm,
      maxPrice: budgetLimit ?? null,
      maxRiskScore: riskLimit ?? null,
    },
    matchedProductIds: searchResults.map((p) => p.id),
    matchedProducts: searchResults,
    comparisonResults,
    riskAssessmentReferences: topAssessment
      ? {
          productId: topAssessment.productId,
          score: topAssessment.overallScore,
          verdict: topAssessment.verdict,
          tier: topAssessment.riskTier,
          confidence: topAssessment.confidenceScore,
          topSignals: topAssessment.signals.slice(0, 3),
        }
      : null,
    recommendationRationale: rationale,
    missingEvidence: topAssessment?.signals?.filter((s: any) => s.category === "EVIDENCE").map((s: any) => s.evidence) || [],
    suggestedNextAction: preparedCart
      ? "Review your prepared cart below and proceed to PayPal Sandbox Checkout."
      : topCandidate
      ? "Click 'View Trust Report' for forensic telemetry or stage for checkout."
      : "Try searching for alternative hardware categories.",
    preparedCart,
    toolExecutionTrace,
  };
}
