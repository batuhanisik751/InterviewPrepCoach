import { describe, it, expect } from "vitest";
import {
  evaluationSchema,
  questionsSchema,
  behavioralEvaluationSchema,
  questionsWithWeakPointsSchema,
} from "../schemas";

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

describe("behavioralEvaluationSchema", () => {
  const validBehavioral = {
    clarity_score: 7.5,
    structure_score: 8.0,
    depth_score: 6.5,
    overall_score: 7.1,
    feedback: "Good answer with clear structure.",
    suggested_answer: "A stronger version would include metrics.",
    situation: { present: true, text: "At my previous job...", score: 7 },
    task: { present: true, text: "I needed to lead...", score: 6 },
    action: { present: true, text: "I organized the team...", score: 8 },
    result: { present: false, text: "", score: 0 },
    missing_components: ["Result"],
    improvement_tips: ["Add measurable outcomes"],
  };

  it("accepts a valid merged evaluation with STAR data", () => {
    const result = behavioralEvaluationSchema.safeParse(validBehavioral);
    expect(result.success).toBe(true);
  });

  it("rejects when STAR components are missing", () => {
    const { situation, ...invalid } = validBehavioral;
    void situation;
    const result = behavioralEvaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects when evaluation scores are missing", () => {
    const { clarity_score, ...invalid } = validBehavioral;
    void clarity_score;
    const result = behavioralEvaluationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe("questionsWithWeakPointsSchema", () => {
  const validCombined = {
    questions: [
      {
        question_text: "Tell me about a time you led a team.",
        question_type: "behavioral" as const,
        difficulty: "medium" as const,
        target_skill: "Leadership",
      },
    ],
    weak_points: [
      {
        skill: "Kubernetes",
        gap_severity: "high" as const,
        jd_requirement: "Experience with container orchestration",
        resume_evidence: "No mention of Kubernetes or container orchestration",
        suggestion: "Consider getting CKA certification",
      },
    ],
  };

  it("accepts valid questions with weak points", () => {
    const result = questionsWithWeakPointsSchema.safeParse(validCombined);
    expect(result.success).toBe(true);
  });

  it("rejects when weak_points array is empty", () => {
    const invalid = { ...validCombined, weak_points: [] };
    const result = questionsWithWeakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects when questions are missing", () => {
    const { questions, ...invalid } = validCombined;
    void questions;
    const result = questionsWithWeakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
