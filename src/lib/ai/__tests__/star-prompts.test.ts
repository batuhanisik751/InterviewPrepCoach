import { describe, it, expect } from "vitest";
import { STAR_ANALYSIS_PROMPT, buildStarPrompt } from "../prompts";

describe("STAR_ANALYSIS_PROMPT", () => {
  it("contains all four STAR components", () => {
    expect(STAR_ANALYSIS_PROMPT).toContain("Situation");
    expect(STAR_ANALYSIS_PROMPT).toContain("Task");
    expect(STAR_ANALYSIS_PROMPT).toContain("Action");
    expect(STAR_ANALYSIS_PROMPT).toContain("Result");
  });

  it("instructs scoring from 0-10", () => {
    expect(STAR_ANALYSIS_PROMPT).toContain("0-10");
  });

  it("asks for missing components and improvement tips", () => {
    expect(STAR_ANALYSIS_PROMPT).toContain("missing");
    expect(STAR_ANALYSIS_PROMPT).toContain("improvement");
  });
});

describe("buildStarPrompt", () => {
  it("includes question and answer", () => {
    const result = buildStarPrompt(
      "Tell me about a time you led a team.",
      "At my last job I led a team of 5 engineers."
    );

    expect(result).toContain("Tell me about a time you led a team.");
    expect(result).toContain("At my last job I led a team of 5 engineers.");
    expect(result).toContain("<interview_question>");
    expect(result).toContain("<candidate_answer>");
  });
});
