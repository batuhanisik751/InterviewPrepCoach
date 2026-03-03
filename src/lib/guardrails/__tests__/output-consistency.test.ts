import { describe, it, expect, vi } from "vitest";
import {
  validateQuestionRelevance,
  validateFeedbackRelevance,
  validateSuggestedAnswerLength,
  detectUniformScores,
  validateEvaluationOutput,
  generateWithRetry,
} from "../output-consistency";

describe("validateQuestionRelevance", () => {
  const resume =
    "Software engineer with experience in React, TypeScript, and PostgreSQL.";
  const jd =
    "Looking for a developer with React, Node.js, and AWS experience.";

  it("passes when target skills match source documents", () => {
    const questions = [
      { question_text: "How do you use React?", target_skill: "React" },
      {
        question_text: "Describe your Node.js work.",
        target_skill: "Node.js",
      },
    ];
    const result = validateQuestionRelevance(questions, resume, jd);
    expect(result.passed).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("fails when a target skill is not in either document", () => {
    const questions = [
      { question_text: "How do you use React?", target_skill: "React" },
      {
        question_text: "Explain Kubernetes.",
        target_skill: "Kubernetes orchestration",
      },
    ];
    const result = validateQuestionRelevance(questions, resume, jd);
    expect(result.passed).toBe(false);
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0]).toContain("Kubernetes");
  });

  it("passes when skill words partially match", () => {
    const questions = [
      {
        question_text: "How do you handle database design?",
        target_skill: "PostgreSQL database",
      },
    ];
    const result = validateQuestionRelevance(questions, resume, jd);
    expect(result.passed).toBe(true);
  });

  it("handles empty questions array", () => {
    const result = validateQuestionRelevance([], resume, jd);
    expect(result.passed).toBe(true);
  });
});

describe("validateFeedbackRelevance", () => {
  it("passes when feedback references answer content", () => {
    const result = validateFeedbackRelevance(
      "Your mention of leading the database migration was a strong example of initiative.",
      "I led a database migration project that reduced query times by 40%."
    );
    expect(result.passed).toBe(true);
  });

  it("fails when feedback is completely generic", () => {
    const result = validateFeedbackRelevance(
      "Good job. Try to be more specific next time.",
      "I redesigned the authentication system using OAuth2 and reduced login failures by 60%."
    );
    expect(result.passed).toBe(false);
  });

  it("passes for short answers with 1 overlapping word", () => {
    const result = validateFeedbackRelevance(
      "Your mention of testing was relevant.",
      "I did testing."
    );
    expect(result.passed).toBe(true);
  });

  it("handles empty feedback", () => {
    const result = validateFeedbackRelevance(
      "",
      "I implemented a caching layer that improved response times."
    );
    expect(result.passed).toBe(false);
  });
});

describe("validateSuggestedAnswerLength", () => {
  it("passes for normal length (200 words)", () => {
    const words = Array(200).fill("word").join(" ");
    expect(validateSuggestedAnswerLength(words).passed).toBe(true);
  });

  it("fails when too short", () => {
    const words = Array(50).fill("word").join(" ");
    const result = validateSuggestedAnswerLength(words);
    expect(result.passed).toBe(false);
    expect(result.issues[0]).toContain("too short");
  });

  it("fails when too long", () => {
    const words = Array(600).fill("word").join(" ");
    const result = validateSuggestedAnswerLength(words);
    expect(result.passed).toBe(false);
    expect(result.issues[0]).toContain("too long");
  });

  it("respects custom min/max", () => {
    const words = Array(10).fill("word").join(" ");
    expect(
      validateSuggestedAnswerLength(words, 5, 20).passed
    ).toBe(true);
    expect(
      validateSuggestedAnswerLength(words, 15, 20).passed
    ).toBe(false);
  });

  it("passes at boundary (exactly 150 words)", () => {
    const words = Array(150).fill("word").join(" ");
    expect(validateSuggestedAnswerLength(words).passed).toBe(true);
  });

  it("passes at boundary (exactly 500 words)", () => {
    const words = Array(500).fill("word").join(" ");
    expect(validateSuggestedAnswerLength(words).passed).toBe(true);
  });
});

describe("detectUniformScores", () => {
  it("passes for varied scores", () => {
    expect(detectUniformScores([7, 8, 6]).passed).toBe(true);
  });

  it("fails for all-identical scores", () => {
    const result = detectUniformScores([5, 5, 5]);
    expect(result.passed).toBe(false);
    expect(result.issues[0]).toContain("identical");
  });

  it("passes for arrays with fewer than 3 items", () => {
    expect(detectUniformScores([5, 5]).passed).toBe(true);
  });

  it("fails for all zeros", () => {
    const result = detectUniformScores([0, 0, 0]);
    expect(result.passed).toBe(false);
  });

  it("passes when at least one score differs", () => {
    expect(detectUniformScores([5, 5, 6]).passed).toBe(true);
  });
});

describe("validateEvaluationOutput", () => {
  it("passes for a well-formed evaluation", () => {
    const evaluation = {
      clarity_score: 7,
      structure_score: 8,
      depth_score: 6,
      feedback:
        "Your description of the migration project was clear and showed initiative.",
      suggested_answer: Array(200).fill("word").join(" "),
    };
    const result = validateEvaluationOutput(
      evaluation,
      "I led a migration project at my company that improved performance."
    );
    expect(result.passed).toBe(true);
  });

  it("fails when all scores are uniform", () => {
    const evaluation = {
      clarity_score: 5,
      structure_score: 5,
      depth_score: 5,
      feedback: "Your answer about the project was adequate.",
      suggested_answer: Array(200).fill("word").join(" "),
    };
    const result = validateEvaluationOutput(
      evaluation,
      "I worked on a project."
    );
    expect(result.passed).toBe(false);
  });

  it("fails when suggested answer is too short", () => {
    const evaluation = {
      clarity_score: 7,
      structure_score: 8,
      depth_score: 6,
      feedback:
        "Your description of the migration project was clear and showed initiative.",
      suggested_answer: "Too short.",
    };
    const result = validateEvaluationOutput(
      evaluation,
      "I led a migration project at my company."
    );
    expect(result.passed).toBe(false);
    expect(result.issues.some((i) => i.includes("too short"))).toBe(true);
  });

  it("accumulates multiple issues", () => {
    const evaluation = {
      clarity_score: 5,
      structure_score: 5,
      depth_score: 5,
      feedback: "Good try.",
      suggested_answer: "Short.",
    };
    const result = validateEvaluationOutput(
      evaluation,
      "I implemented a comprehensive caching solution for the microservices architecture."
    );
    expect(result.passed).toBe(false);
    expect(result.issues.length).toBeGreaterThanOrEqual(2);
  });
});

describe("generateWithRetry", () => {
  it("returns first output if it passes validation", async () => {
    const generateFn = vi.fn().mockResolvedValue({ score: 7 });
    const validateFn = vi.fn().mockReturnValue({ passed: true, issues: [] });

    const result = await generateWithRetry(
      generateFn,
      validateFn,
      "Be stricter"
    );

    expect(result.output).toEqual({ score: 7 });
    expect(result.consistencyIssues).toHaveLength(0);
    expect(generateFn).toHaveBeenCalledTimes(1);
  });

  it("retries once if first attempt fails", async () => {
    const generateFn = vi
      .fn()
      .mockResolvedValueOnce({ score: 5 })
      .mockResolvedValueOnce({ score: 7 });
    const validateFn = vi
      .fn()
      .mockReturnValueOnce({
        passed: false,
        issues: ["uniform scores"],
      })
      .mockReturnValueOnce({ passed: true, issues: [] });

    const result = await generateWithRetry(
      generateFn,
      validateFn,
      "Be stricter"
    );

    expect(result.output).toEqual({ score: 7 });
    expect(result.consistencyIssues).toHaveLength(0);
    expect(generateFn).toHaveBeenCalledTimes(2);
    expect(generateFn).toHaveBeenLastCalledWith("Be stricter");
  });

  it("returns retry output with issues if both attempts fail", async () => {
    const generateFn = vi
      .fn()
      .mockResolvedValueOnce({ score: 5 })
      .mockResolvedValueOnce({ score: 5 });
    const validateFn = vi.fn().mockReturnValue({
      passed: false,
      issues: ["uniform scores"],
    });

    const result = await generateWithRetry(
      generateFn,
      validateFn,
      "Be stricter"
    );

    expect(result.output).toEqual({ score: 5 });
    expect(result.consistencyIssues).toContain("uniform scores");
    expect(generateFn).toHaveBeenCalledTimes(2);
  });
});
