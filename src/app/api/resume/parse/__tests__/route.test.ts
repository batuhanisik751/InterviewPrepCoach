import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetText } = vi.hoisted(() => ({
  mockGetText: vi.fn(),
}));

// Mock pdf-parse with a proper class (not vi.fn) so clearAllMocks doesn't wipe it
vi.mock("pdf-parse", () => ({
  PDFParse: class MockPDFParse {
    getText = mockGetText;
  },
}));

// Mock Supabase
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

import { POST } from "../route";
import { createClient } from "@/lib/supabase/server";

function createPdfRequest(file: File): Request {
  const formData = new FormData();
  formData.append("file", file);
  return new Request("http://localhost/api/resume/parse", {
    method: "POST",
    body: formData,
  });
}

function mockAuthenticatedUser() {
  (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
      }),
    },
  });
}

function mockUnauthenticatedUser() {
  (createClient as ReturnType<typeof vi.fn>).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: null },
      }),
    },
  });
}

describe("POST /api/resume/parse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockUnauthenticatedUser();
    const file = new File(["dummy"], "resume.pdf", { type: "application/pdf" });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 when no file is provided", async () => {
    mockAuthenticatedUser();
    const formData = new FormData();
    const req = new Request("http://localhost/api/resume/parse", {
      method: "POST",
      body: formData,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("No PDF file");
  });

  it("returns 400 when file is not a PDF", async () => {
    mockAuthenticatedUser();
    const file = new File(["hello"], "resume.txt", { type: "text/plain" });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("Only PDF");
  });

  it("returns error when pdf-parse fails on large/invalid content", async () => {
    mockAuthenticatedUser();
    mockGetText.mockRejectedValue(new Error("Invalid PDF"));
    const largeContent = new Uint8Array(6 * 1024 * 1024);
    const file = new File([largeContent], "resume.pdf", {
      type: "application/pdf",
    });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it("returns extracted text on success", async () => {
    mockAuthenticatedUser();
    mockGetText.mockResolvedValue({
      text: "John Doe\nSoftware Engineer\n5 years experience",
    });
    const file = new File(["pdf-content"], "resume.pdf", {
      type: "application/pdf",
    });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.text).toContain("John Doe");
    expect(body.truncated).toBe(false);
  });

  it("returns 422 when PDF has no extractable text", async () => {
    mockAuthenticatedUser();
    mockGetText.mockResolvedValue({ text: "   " });
    const file = new File(["pdf-content"], "resume.pdf", {
      type: "application/pdf",
    });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("image-based");
  });

  it("returns 422 when pdf-parse throws", async () => {
    mockAuthenticatedUser();
    mockGetText.mockRejectedValue(new Error("Corrupt PDF"));
    const file = new File(["bad-content"], "resume.pdf", {
      type: "application/pdf",
    });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(422);
    const body = await res.json();
    expect(body.error).toContain("Failed to parse");
  });

  it("truncates text exceeding 15,000 characters", async () => {
    mockAuthenticatedUser();
    const longText = "A".repeat(20_000);
    mockGetText.mockResolvedValue({ text: longText });
    const file = new File(["pdf-content"], "resume.pdf", {
      type: "application/pdf",
    });
    const req = createPdfRequest(file);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.text.length).toBe(15_000);
    expect(body.truncated).toBe(true);
    expect(body.originalLength).toBe(20_000);
  });
});
