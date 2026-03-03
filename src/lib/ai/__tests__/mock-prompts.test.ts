import { describe, it, expect } from "vitest";
import { buildMockInterviewSystem } from "../prompts";

describe("buildMockInterviewSystem", () => {
  it("includes resume and job description in context", () => {
    const result = buildMockInterviewSystem(
      "5 years JavaScript experience",
      "Looking for a senior frontend developer",
      "Senior Frontend Engineer"
    );

    expect(result).toContain("5 years JavaScript experience");
    expect(result).toContain("Looking for a senior frontend developer");
  });

  it("includes the job title when provided", () => {
    const result = buildMockInterviewSystem(
      "resume text",
      "JD text",
      "Senior Frontend Engineer"
    );

    expect(result).toContain("Senior Frontend Engineer");
  });

  it("uses fallback when job title is null", () => {
    const result = buildMockInterviewSystem(
      "resume text",
      "JD text",
      null
    );

    expect(result).toContain("the position described below");
  });

  it("instructs to ask one question at a time", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("ONE question per message");
  });

  it("includes pre-selected questions section", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("PRE-SELECTED QUESTIONS");
  });

  it("includes wrap-up signal phrase", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("Thank you for completing this mock interview");
  });

  it("includes final message instructions with reflection", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("Interview Reflection");
  });

  it("includes security instruction for user data", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("IMPORTANT SECURITY INSTRUCTION");
  });

  it("forbids simulating candidate responses", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("NEVER simulate");
  });

  it("instructs to generate only the next single message", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("ONLY your next single message");
  });
});
