import { describe, it, expect } from "vitest";
import {
  QUESTION_GENERATION_PROMPT,
  ANSWER_EVALUATION_PROMPT,
  buildQuestionPrompt,
  buildEvaluationPrompt,
} from "../prompts";

describe("QUESTION_GENERATION_PROMPT", () => {
  it("includes instructions for question types", () => {
    expect(QUESTION_GENERATION_PROMPT).toContain("behavioral");
    expect(QUESTION_GENERATION_PROMPT).toContain("technical");
    expect(QUESTION_GENERATION_PROMPT).toContain("situational");
  });

  it("includes difficulty instructions", () => {
    expect(QUESTION_GENERATION_PROMPT).toContain("easy");
    expect(QUESTION_GENERATION_PROMPT).toContain("medium");
    expect(QUESTION_GENERATION_PROMPT).toContain("hard");
  });

  it("mentions STAR format", () => {
    expect(QUESTION_GENERATION_PROMPT).toContain("STAR");
  });
});

describe("ANSWER_EVALUATION_PROMPT", () => {
  it("includes all three scoring dimensions", () => {
    expect(ANSWER_EVALUATION_PROMPT).toContain("Clarity");
    expect(ANSWER_EVALUATION_PROMPT).toContain("Structure");
    expect(ANSWER_EVALUATION_PROMPT).toContain("Depth");
  });

  it("includes scoring weights", () => {
    expect(ANSWER_EVALUATION_PROMPT).toContain("25%");
    expect(ANSWER_EVALUATION_PROMPT).toContain("30%");
    expect(ANSWER_EVALUATION_PROMPT).toContain("45%");
  });

  it("mentions feedback and suggested_answer", () => {
    expect(ANSWER_EVALUATION_PROMPT).toContain("feedback");
    expect(ANSWER_EVALUATION_PROMPT).toContain("suggested_answer");
  });
});

describe("buildQuestionPrompt", () => {
  it("includes resume and job description", () => {
    const result = buildQuestionPrompt("My resume text", "Job desc text");
    expect(result).toContain("My resume text");
    expect(result).toContain("Job desc text");
    expect(result).toContain("Resume:");
    expect(result).toContain("Job Description:");
  });
});

describe("buildEvaluationPrompt", () => {
  it("includes all four context fields", () => {
    const result = buildEvaluationPrompt(
      "Resume here",
      "JD here",
      "What is your experience?",
      "I have 5 years of experience."
    );
    expect(result).toContain("Resume here");
    expect(result).toContain("JD here");
    expect(result).toContain("What is your experience?");
    expect(result).toContain("I have 5 years of experience.");
    expect(result).toContain("Interview Question:");
    expect(result).toContain("Candidate's Answer:");
  });
});
