import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { scanForInjection, moderateContent, redactPII } from "@/lib/guardrails";

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

  // Content moderation
  const resumeModeration = moderateContent(resumeText);
  if (resumeModeration.severity === "block") {
    return NextResponse.json(
      { error: "Resume text contains inappropriate content and cannot be processed." },
      { status: 400 }
    );
  }

  const jdModeration = moderateContent(jobDescription);
  if (jdModeration.severity === "block") {
    return NextResponse.json(
      { error: "Job description contains inappropriate content and cannot be processed." },
      { status: 400 }
    );
  }

  // Prompt injection sanitization
  const resumeInjection = scanForInjection(resumeText);
  const jdInjection = scanForInjection(jobDescription);

  // PII redaction (resume only)
  const piiResult = redactPII(resumeInjection.sanitized);

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      user_id: user.id,
      resume_text: piiResult.redactedText,
      job_description: jdInjection.sanitized,
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
