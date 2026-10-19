/**
 * Dynamic LLM Client for TrustCart AI.
 *
 * Communicates with configured AI models (Google Gemini or OpenAI)
 * using native fetch with structured tool/function definitions.
 * When API keys are absent, returns null to allow fallback to the
 * resilient dynamic semantic pipeline.
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  toolCalls?: Array<{
    id?: string;
    name: string;
    arguments: Record<string, any>;
  }>;
}

export interface LLMToolCall {
  name: string;
  args: Record<string, any>;
}

export interface LLMResponse {
  content: string;
  toolCalls: LLMToolCall[];
  isClarification?: boolean;
}

const TRUSTCART_TOOLS_GEMINI = [
  {
    name: "search_products",
    description: "Search products in the catalog with optional constraints like category, maximum price budget, and maximum risk score.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search keyword or item description (e.g., 'keyboard', 'gaming mouse')" },
        category: { type: "STRING", description: "Product category (e.g. 'Keyboards', 'Audio', 'Electronics')" },
        maxPrice: { type: "NUMBER", description: "Maximum budget limit in USD" },
        maxRiskScore: { type: "NUMBER", description: "Maximum acceptable observed risk score (0-100)" },
      },
    },
  },
  {
    name: "get_product_details",
    description: "Retrieve comprehensive specifications and seller metadata for a specific product ID.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: { type: "STRING", description: "Unique product identifier" },
      },
      required: ["productId"],
    },
  },
  {
    name: "assess_listing",
    description: "Run a 5-vector forensic risk assessment on a product listing to detect counterfeit or fraudulent signals.",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: { type: "STRING", description: "Product ID to audit for fraud risk" },
      },
      required: ["productId"],
    },
  },
  {
    name: "compare_products",
    description: "Compare 2 to 4 products side-by-side across price, specifications, and risk profiles.",
    parameters: {
      type: "OBJECT",
      properties: {
        productIds: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "List of 2 to 4 product IDs to evaluate",
        },
      },
      required: ["productIds"],
    },
  },
  {
    name: "prepare_cart",
    description: "Validate prices server-side and stage items into a verified cart ready for PayPal Sandbox checkout.",
    parameters: {
      type: "OBJECT",
      properties: {
        items: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              productId: { type: "STRING" },
              quantity: { type: "INTEGER" },
            },
            required: ["productId", "quantity"],
          },
        },
      },
      required: ["items"],
    },
  },
];

export async function callConfiguredLLM(
  systemPrompt: string,
  messages: LLMMessage[]
): Promise<LLMResponse | null> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  // 1. Try Gemini if configured
  if (geminiKey) {
    try {
      const contents = messages.map((m) => {
        let role = m.role === "assistant" ? "model" : "user";
        return {
          role,
          parts: [{ text: m.content }],
        };
      });

      const body = {
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        tools: [
          {
            functionDeclarations: TRUSTCART_TOOLS_GEMINI,
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        },
      };

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const candidate = data.candidates?.[0];
        const parts = candidate?.content?.parts || [];

        let text = "";
        const toolCalls: LLMToolCall[] = [];

        for (const part of parts) {
          if (part.text) {
            text += part.text;
          }
          if (part.functionCall) {
            toolCalls.push({
              name: part.functionCall.name,
              args: part.functionCall.args || {},
            });
          }
        }

        return {
          content: text.trim(),
          toolCalls,
        };
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back to dynamic semantic pipeline:", e);
    }
  }

  // 2. Try OpenAI if configured
  if (openaiKey) {
    try {
      const formattedMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: formattedMessages,
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const msg = data.choices?.[0]?.message;
        return {
          content: msg?.content || "",
          toolCalls: [],
        };
      }
    } catch (e) {
      console.warn("OpenAI API call failed, falling back to dynamic semantic pipeline:", e);
    }
  }

  return null;
}
