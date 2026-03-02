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

    expect(result).toContain("ONE question at a time");
  });

  it("instructs to wrap up after 3-4 exchanges", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("3-4 exchanges");
  });

  it("includes wrap-up signal phrase", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("Thank you for completing this mock interview");
  });

  it("instructs to probe for specifics", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("Probe for specifics");
  });

  it("instructs to give brief feedback after each answer", () => {
    const result = buildMockInterviewSystem("r", "j", "title");

    expect(result).toContain("brief feedback");
  });
});
