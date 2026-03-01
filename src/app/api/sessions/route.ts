import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const createSessionSchema = z.object({
  resumeText: z
    .string()
    .min(50, "Resume must be at least 50 characters")
    .max(15000, "Resume must be under 15,000 characters"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(10000, "Job description must be under 10,000 characters"),
  jobTitle: z.string().max(200).optional(),
  companyName: z.string().max(200).optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createSessionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { resumeText, jobDescription, jobTitle, companyName } = parsed.data;

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      resume_text: resumeText,
      job_description: jobDescription,
      job_title: jobTitle || null,
      company_name: companyName || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ sessionId: session.id });
}
