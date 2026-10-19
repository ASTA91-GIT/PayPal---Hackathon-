import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  classifyDiscourse,
  extractBudgetConstraint,
  extractRiskTolerance,
  detectSemanticConcept,
  runAgentOrchestration,
  ConversationTurn,
} from "../src/lib/agentBrain";
import * as agentTools from "../src/lib/agentTools";
import * as llmClient from "../src/lib/llmClient";

describe("Agent Generalisation & Invariant Test Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  // ===========================================================================
  // 1. INVARIANT: GREETINGS NEVER TRIGGER TOOLS (Parameterized across phrasings)
  // ===========================================================================
  describe("Invariant 1: Arbitrary Greetings must not invoke shopping tools", () => {
    const diverseGreetings = [
      "hi",
      "hello",
      "Hey there!",
      "Good morning",
      "good evening",
      "yo!",
      "howdy",
      "what's up",
      "sup",
      "greetings",
      "hola",
      "aloha",
    ];

    it.each(diverseGreetings)("discourse classifier flags '%s' as GREETING", (greeting) => {
      const type = classifyDiscourse(greeting, false);
      expect(type).toBe("GREETING");
    });

    it.each(diverseGreetings)("agent execution on '%s' invokes exactly 0 tools and returns a welcoming response", async (greeting) => {
      const res = await runAgentOrchestration(greeting, []);
      expect(res.toolExecutionTrace).toHaveLength(0);
      expect(res.matchedProductIds).toHaveLength(0);
      expect(res.recommendationRationale).toMatch(/hello|trustcart|assist/i);
    });
  });

  // ===========================================================================
  // 2. INVARIANT: BUDGET CONSTRAINT PARSING PRESERVES NUMERIC VALUE
  // ===========================================================================
  describe("Invariant 2: Budget constraints are preserved across diverse natural phrasings", () => {
    const budgetPhrases = [
      { text: "find a keyboard under $50", expected: 50 },
      { text: "show me keebs below 80 bucks", expected: 80 },
      { text: "gaming mouse capped at 65", expected: 65 },
      { text: "headphones with a budget of 120", expected: 120 },
      { text: "solid state drive less than 200 dollars", expected: 200 },
      { text: "45.50 bucks max for a charger", expected: 45.5 },
      { text: "spend up to $75 on audio", expected: 75 },
      { text: "under 99.99", expected: 99.99 },
    ];

    it.each(budgetPhrases)("correctly extracts budget from '%s'", ({ text, expected }) => {
      const parsed = extractBudgetConstraint(text);
      expect(parsed).toBe(expected);
    });
  });

  // ===========================================================================
  // 3. INVARIANT: SLANG & TYPO GENERALISATION (Semantic Mapping)
  // ===========================================================================
  describe("Invariant 3: Semantic concepts resolve regardless of slang or common typos", () => {
    const slangMappings = [
      { text: "look for a keybaord", expected: "keyboard" },
      { text: "show me some clackers", expected: "keyboard" },
      { text: "best keebs under 100", expected: "keyboard" },
      { text: "wireless cans with anc", expected: "headphones" },
      { text: "need a new clicker for gaming", expected: "mouse" },
      { text: "rtx 4090 card", expected: "graphics" },
      { text: "m.2 nvme storage", expected: "storage" },
      { text: "gan brick fast charger", expected: "charger" },
      { text: "workpack commuter bag", expected: "backpack" },
    ];

    it.each(slangMappings)("detects semantic concept '%s' for '%s'", ({ text, expected }) => {
      const concept = detectSemanticConcept(text);
      expect(concept).toBe(expected);
    });
  });

  // ===========================================================================
  // 4. INVARIANT: AMBIGUOUS REQUESTS TRIGGER CLARIFICATION (0 tools invoked)
  // ===========================================================================
  describe("Invariant 4: Genuinely ambiguous requests prompt clarification rather than guessing", () => {
    const ambiguousInputs = [
      "show me stuff",
      "find me something",
      "what do you have?",
      "i want to buy something",
      "give me a deal",
      "recommend something",
      "browse",
    ];

    it.each(ambiguousInputs)("flags '%s' as AMBIGUOUS and does not invoke tools", async (query) => {
      const type = classifyDiscourse(query, false);
      expect(type).toBe("AMBIGUOUS");

      const res = await runAgentOrchestration(query, []);
      expect(res.isClarification).toBe(true);
      expect(res.toolExecutionTrace).toHaveLength(0);
      expect(res.recommendationRationale).toMatch(/clarify|broad|looking for/i);
      expect(res.missingEvidence.length).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // 5. INVARIANT: GENERAL Q&A INVOKES ZERO SHOPPING TOOLS
  // ===========================================================================
  describe("Invariant 5: Educational, technical, and policy questions invoke zero shopping tools", () => {
    const educationalQuestions = [
      "how does paypal buyer protection work?",
      "what is switch debounce in mechanical keyboards?",
      "explain tor exit node proxy fraud detection",
      "how can i write secure webhook signature validation?",
    ];

    it.each(educationalQuestions)("flags '%s' as GENERAL_QA and invokes zero tools", async (question) => {
      const type = classifyDiscourse(question, false);
      expect(type).toBe("GENERAL_QA");

      const res = await runAgentOrchestration(question, []);
      expect(res.toolExecutionTrace).toHaveLength(0);
      expect(res.matchedProductIds).toHaveLength(0);
      expect(res.recommendationRationale.length).toBeGreaterThan(40);
    });
  });

  // ===========================================================================
  // 6. INVARIANT: CONTEXTUAL FOLLOW-UPS RESOLVE ANAPHORA ACCURATELY
  // ===========================================================================
  describe("Invariant 6: Contextual follow-up pronoun resolution using conversation history", () => {
    const sampleHistory: ConversationTurn[] = [
      {
        role: "user",
        content: "find me mechanical keyboards",
      },
      {
        role: "assistant",
        content: "Found 2 keyboards.",
        metadata: {
          matchedProducts: [
            { id: "prod-kb-001", title: "Apex Pro Mini Mechanical Keyboard", price: 129.99, riskScore: 12 },
            { id: "prod-kb-002", title: "Keychron K2 Wireless Keyboard", price: 79.99, riskScore: 22 },
          ],
        },
      },
    ];

    it("resolves 'the cheaper option' to Keychron K2 ($79.99) and runs assess_listing", async () => {
      const spyAssess = vi.spyOn(agentTools, "executeAssessListing").mockResolvedValue({
        productId: "prod-kb-002",
        overallScore: 22,
        riskTier: "LOW",
        verdict: "SAFE_CLEARANCE",
        confidenceScore: 0.94,
        summary: "Listing is safe.",
        recommendedAction: "Eligible for checkout.",
        signalsCount: 5,
        signals: [],
      } as any);

      const res = await runAgentOrchestration("is the cheaper option safe?", sampleHistory);
      expect(spyAssess).toHaveBeenCalledWith({ productId: "prod-kb-002" });
      expect(res.matchedProductIds).toContain("prod-kb-002");
      expect(res.riskAssessmentReferences?.productId).toBe("prod-kb-002");
    });

    it("resolves 'compare them' to compare both items from history", async () => {
      const spyCompare = vi.spyOn(agentTools, "executeCompareProducts").mockResolvedValue([
        { id: "prod-kb-001", title: "Apex Pro", price: 129.99, riskScore: 12 },
        { id: "prod-kb-002", title: "Keychron K2", price: 79.99, riskScore: 22 },
      ] as any);

      const res = await runAgentOrchestration("compare them side by side", sampleHistory);
      expect(spyCompare).toHaveBeenCalledWith({ productIds: ["prod-kb-001", "prod-kb-002"] });
      expect(res.comparisonResults).toHaveLength(2);
    });

    it("resolves 'add the cheaper one to cart' and stages the correct item", async () => {
      const spyCart = vi.spyOn(agentTools, "executePrepareCart").mockResolvedValue({
        items: [{ productId: "prod-kb-002", quantity: 1, unitPrice: 79.99 }],
        subtotal: 79.99,
        shipping: 0,
        tax: 6.4,
        total: 86.39,
        avgRiskScore: 22,
      } as any);

      const res = await runAgentOrchestration("add the cheaper one to cart", sampleHistory);
      expect(spyCart).toHaveBeenCalledWith({
        items: [{ productId: "prod-kb-002", quantity: 1 }],
      });
      expect(res.preparedCart?.total).toBe(86.39);
    });
  });

  // ===========================================================================
  // 7. INVARIANT: MODEL-DRIVEN ROUTING WITH MOCKED LLM
  // ===========================================================================
  describe("Invariant 7: Configured Model Integration dynamically drives tool calls", () => {
    it("executes tools specified by configured LLM response", async () => {
      vi.spyOn(llmClient, "callConfiguredLLM").mockResolvedValue({
        content: "I identified two low-risk mechanical keyboards that fit your desk setup.",
        toolCalls: [
          {
            name: "search_products",
            args: { query: "keyboard", maxPrice: 100 },
          },
        ],
      });

      vi.spyOn(agentTools, "executeSearchProducts").mockResolvedValue([
        { id: "prod-kb-002", title: "Keychron K2", price: 79.99, riskScore: 20, sellerName: "KeyStore", sellerRating: 4.8 },
      ] as any);

      const res = await runAgentOrchestration("find me a mechanical keyboard under $100", []);
      expect(res.toolExecutionTrace).toHaveLength(1);
      expect(res.toolExecutionTrace[0].tool).toBe("search_products");
      expect(res.recommendationRationale).toBe("I identified two low-risk mechanical keyboards that fit your desk setup.");
    });
  });
});
