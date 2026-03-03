import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scanForInjection, moderateContent } from "@/lib/guardrails";

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId, role, content } = await request.json();

  if (!sessionId || !role || !content) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Guardrails for user messages
  let persistContent = content;
  if (role === "user") {
    const moderation = moderateContent(content);
    if (moderation.severity === "block") {
      return NextResponse.json(
        { error: "Message contains inappropriate content." },
        { status: 400 }
      );
    }

    const injection = scanForInjection(content);
    persistContent = injection.sanitized;
  }

  await supabase.from("mock_messages").insert({
    session_id: sessionId,
    role,
    content: persistContent,
  });

  return NextResponse.json({ ok: true });
}
