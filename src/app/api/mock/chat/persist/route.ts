import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  await supabase.from("mock_messages").insert({
    session_id: sessionId,
    role,
    content,
  });

  return NextResponse.json({ ok: true });
}
