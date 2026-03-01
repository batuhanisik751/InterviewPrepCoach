import { describe, it, expect } from "vitest";
import { weakPointsSchema } from "../schemas";

describe("weakPointsSchema", () => {
  it("accepts valid weak points with all severities", () => {
    const valid = {
      weak_points: [
        {
          skill: "Kubernetes",
          gap_severity: "high",
          jd_requirement: "5+ years experience with Kubernetes orchestration",
          resume_evidence: "No mention of Kubernetes or container orchestration",
          suggestion: "Obtain a CKA certification and add container projects to your portfolio",
        },
        {
          skill: "Team Leadership",
          gap_severity: "medium",
          jd_requirement: "Lead a team of 5+ engineers",
          resume_evidence: "Mentored 2 junior developers",
          suggestion: "Highlight any cross-team coordination or mentorship experience",
        },
        {
          skill: "GraphQL",
          gap_severity: "low",
          jd_requirement: "Familiarity with GraphQL is a plus",
          resume_evidence: "No mention of GraphQL",
          suggestion: "Consider adding a small GraphQL project to demonstrate familiarity",
        },
      ],
    };

    const result = weakPointsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts minimum of 1 weak point", () => {
    const valid = {
      weak_points: [
        {
          skill: "Python",
          gap_severity: "high",
          jd_requirement: "Expert-level Python required",
          resume_evidence: "Only JavaScript experience listed",
          suggestion: "Learn Python fundamentals and build a project",
        },
      ],
    };

    const result = weakPointsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects empty weak_points array", () => {
    const invalid = { weak_points: [] };

    const result = weakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects more than 8 weak points", () => {
    const ninePoints = Array.from({ length: 9 }, (_, i) => ({
      skill: `Skill ${i}`,
      gap_severity: "medium",
      jd_requirement: "Required",
      resume_evidence: "Missing",
      suggestion: "Learn it",
    }));

    const result = weakPointsSchema.safeParse({ weak_points: ninePoints });
    expect(result.success).toBe(false);
  });

  it("rejects invalid severity value", () => {
    const invalid = {
      weak_points: [
        {
          skill: "Python",
          gap_severity: "critical",
          jd_requirement: "Required",
          resume_evidence: "Missing",
          suggestion: "Learn it",
        },
      ],
    };

    const result = weakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing skill field", () => {
    const invalid = {
      weak_points: [
        {
          gap_severity: "high",
          jd_requirement: "Required",
          resume_evidence: "Missing",
          suggestion: "Learn it",
        },
      ],
    };

    const result = weakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing suggestion field", () => {
    const invalid = {
      weak_points: [
        {
          skill: "Python",
          gap_severity: "high",
          jd_requirement: "Required",
          resume_evidence: "Missing",
        },
      ],
    };

    const result = weakPointsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
