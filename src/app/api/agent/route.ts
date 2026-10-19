import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { runAgentOrchestration, ConversationTurn } from "@/lib/agentBrain";

const AgentRequestSchema = z.object({
  query: z.string().min(1, "User query cannot be empty"),
  sessionId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = AgentRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { query, sessionId: clientSessionId } = parsed.data;

    // Ensure session in DB
    let sessionId = clientSessionId;
    if (!sessionId) {
      const session = await prisma.agentSession.create({
        data: { title: query.substring(0, 40) },
      });
      sessionId = session.id;
    }

    // Retrieve conversation history for this session
    const pastMessages = await prisma.agentMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
      take: 10,
    });

    const history: ConversationTurn[] = pastMessages.map((m) => {
      let parsedMetadata: any = null;
      if (m.metadata) {
        try {
          parsedMetadata = JSON.parse(m.metadata);
        } catch {
          // ignore parsing error
        }
      }
      return {
        role: m.role as "user" | "assistant",
        content: m.content,
        metadata: parsedMetadata,
      };
    });

    // Run dynamic model-driven / semantic agent orchestration
    const structuredResult = await runAgentOrchestration(query, history);

    // Persist user turn
    await prisma.agentMessage.create({
      data: {
        sessionId,
        role: "user",
        content: query,
      },
    });

    // Persist assistant turn
    await prisma.agentMessage.create({
      data: {
        sessionId,
        role: "assistant",
        content: structuredResult.recommendationRationale,
        toolCalls: JSON.stringify(structuredResult.toolExecutionTrace),
        metadata: JSON.stringify(structuredResult),
      },
    });

    return NextResponse.json({
      success: true,
      sessionId,
      result: structuredResult,
    });
  } catch (err: any) {
    console.error("POST /api/agent error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Agent execution failure" },
      { status: 500 }
    );
  }
}
