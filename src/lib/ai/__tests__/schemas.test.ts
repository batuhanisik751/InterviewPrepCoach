import { describe, it, expect } from "vitest";
import { evaluationSchema, questionsSchema } from "../schemas";

describe("evaluationSchema", () => {
  it("accepts a valid evaluation", () => {
    const valid = {
      clarity_score: 7.5,
      structure_score: 8.0,
      depth_score: 6.5,
      overall_score: 7.1,
      feedback: "Good answer with clear structure.",
      suggested_answer: "A stronger version would include metrics.",
    };

    const result = evaluationSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects scores below 0", () => {
    const invalid = {
      clarity_score: -1,
      structure_score: 8.0,
      depth_score: 6.5,
      overall_score: 7.1,
      feedback: "Good answer.",
      suggested_answer: "Better answer.",
    };

    const result = evaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects scores above 10", () => {
    const invalid = {
      clarity_score: 11,
      structure_score: 8.0,
      depth_score: 6.5,
      overall_score: 7.1,
      feedback: "Good answer.",
      suggested_answer: "Better answer.",
    };

    const result = evaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing feedback", () => {
    const invalid = {
      clarity_score: 7.5,
      structure_score: 8.0,
      depth_score: 6.5,
      overall_score: 7.1,
      suggested_answer: "Better answer.",
    };

    const result = evaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing suggested_answer", () => {
    const invalid = {
      clarity_score: 7.5,
      structure_score: 8.0,
      depth_score: 6.5,
      overall_score: 7.1,
      feedback: "Good answer.",
    };

    const result = evaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("questionsSchema", () => {
  it("accepts valid questions array", () => {
    const valid = {
      questions: [
        {
          question_text: "Tell me about a time you led a team.",
          question_type: "behavioral",
          difficulty: "medium",
          target_skill: "Leadership",
        },
      ],
    };

    const result = questionsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects invalid question_type", () => {
    const invalid = {
      questions: [
        {
          question_text: "Some question",
          question_type: "invalid_type",
          difficulty: "easy",
          target_skill: "Skill",
        },
      ],
    };

    const result = questionsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects invalid difficulty", () => {
    const invalid = {
      questions: [
        {
          question_text: "Some question",
          question_type: "behavioral",
          difficulty: "impossible",
          target_skill: "Skill",
        },
      ],
    };

    const result = questionsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
