import { describe, it, expect } from "vitest";
import { WEAK_POINTS_PROMPT, buildWeakPointsPrompt } from "../prompts";

describe("WEAK_POINTS_PROMPT", () => {
  it("mentions severity levels", () => {
    expect(WEAK_POINTS_PROMPT).toContain("low");
    expect(WEAK_POINTS_PROMPT).toContain("medium");
    expect(WEAK_POINTS_PROMPT).toContain("high");
  });

  it("instructs to identify 3-8 weak points", () => {
    expect(WEAK_POINTS_PROMPT).toContain("3-8");
  });

  it("mentions key analysis areas", () => {
    expect(WEAK_POINTS_PROMPT).toContain("skill");
    expect(WEAK_POINTS_PROMPT).toContain("severity");
    expect(WEAK_POINTS_PROMPT).toContain("coaching suggestion");
  });

  it("asks for JD requirement quote", () => {
    expect(WEAK_POINTS_PROMPT).toContain("JD requirement");
  });

  it("mentions ATS screening", () => {
    expect(WEAK_POINTS_PROMPT).toContain("ATS");
  });
});

describe("buildWeakPointsPrompt", () => {
  it("includes resume and job description", () => {
    const result = buildWeakPointsPrompt(
      "5 years of JavaScript experience",
      "Looking for a senior Python developer"
    );

    expect(result).toContain("5 years of JavaScript experience");
    expect(result).toContain("Looking for a senior Python developer");
    expect(result).toContain("Resume:");
    expect(result).toContain("Job Description:");
  });
});
