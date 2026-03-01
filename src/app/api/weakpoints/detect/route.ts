import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@/lib/ai/anthropic";
import { weakPointsSchema } from "@/lib/ai/schemas";
import { WEAK_POINTS_PROMPT, buildWeakPointsPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = await request.json();

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required" }, { status: 400 });
  }

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  try {
    const { object } = await generateObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: weakPointsSchema,
      prompt: buildWeakPointsPrompt(session.resume_text, session.job_description),
      system: WEAK_POINTS_PROMPT,
    });

    // Save weak points to the session
    await supabase
      .from("sessions")
      .update({
        weak_points: object.weak_points,
        updated_at: new Date().toISOString(),
      })
      .eq("id", sessionId);

    return NextResponse.json({ weak_points: object.weak_points });
  } catch (error) {
    console.error("Weak point detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect weak points" },
      { status: 500 }
    );
  }
}
