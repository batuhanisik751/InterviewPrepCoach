import { describe, it, expect } from "vitest";
import {
  QUESTION_GENERATION_PROMPT,
  ANSWER_EVALUATION_PROMPT,
  buildQuestionPrompt,
  buildEvaluationPrompt,
  QUESTION_AND_WEAKPOINTS_PROMPT,
  buildQuestionAndWeakPointsPrompt,
  BEHAVIORAL_EVALUATION_PROMPT,
  buildBehavioralEvaluationPrompt,
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

describe("QUESTION_AND_WEAKPOINTS_PROMPT", () => {
  it("includes question generation instructions", () => {
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("behavioral");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("technical");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("situational");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("STAR");
  });

  it("includes weak points instructions", () => {
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("weak points");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("severity");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("ATS");
  });

  it("includes difficulty levels", () => {
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("easy");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("medium");
    expect(QUESTION_AND_WEAKPOINTS_PROMPT).toContain("hard");
  });
});

describe("buildQuestionAndWeakPointsPrompt", () => {
  it("includes resume and job description", () => {
    const result = buildQuestionAndWeakPointsPrompt("My resume", "Job desc");
    expect(result).toContain("My resume");
    expect(result).toContain("Job desc");
    expect(result).toContain("Resume:");
    expect(result).toContain("Job Description:");
  });
});

describe("BEHAVIORAL_EVALUATION_PROMPT", () => {
  it("includes scoring dimensions and weights", () => {
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Clarity");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Structure");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Depth");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("25%");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("30%");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("45%");
  });

  it("includes STAR analysis instructions", () => {
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Situation");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Task");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Action");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("Result");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("missing");
    expect(BEHAVIORAL_EVALUATION_PROMPT).toContain("improvement tips");
  });
});

describe("buildBehavioralEvaluationPrompt", () => {
  it("includes all four context fields and STAR instruction", () => {
    const result = buildBehavioralEvaluationPrompt(
      "Resume here",
      "JD here",
      "Tell me about a time...",
      "At my previous company..."
    );
    expect(result).toContain("Resume here");
    expect(result).toContain("JD here");
    expect(result).toContain("Tell me about a time...");
    expect(result).toContain("At my previous company...");
    expect(result).toContain("STAR format compliance");
  });
});
