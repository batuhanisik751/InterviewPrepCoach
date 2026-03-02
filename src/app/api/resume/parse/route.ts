import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFParse } from "pdf-parse";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPE = "application/pdf";
const MAX_EXTRACTED_LENGTH = 15_000;

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return NextResponse.json(
      { error: "No PDF file provided" },
      { status: 400 }
    );
  }

  if (file.type !== ALLOWED_MIME_TYPE) {
    return NextResponse.json(
      { error: "Only PDF files are accepted" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "File must be under 5 MB" },
      { status: 400 }
    );
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
    const result = await parser.getText();
    const text = result.text.trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be image-based or empty.",
        },
        { status: 422 }
      );
    }

    const truncated = text.length > MAX_EXTRACTED_LENGTH;

    return NextResponse.json({
      text: text.slice(0, MAX_EXTRACTED_LENGTH),
      truncated,
      originalLength: text.length,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Failed to parse PDF. The file may be corrupted or password-protected.",
      },
      { status: 422 }
    );
  }
}
