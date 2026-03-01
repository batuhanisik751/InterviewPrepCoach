import { describe, it, expect } from "vitest";
import { starAnalysisSchema } from "../schemas";

describe("starAnalysisSchema", () => {
  it("accepts a valid STAR analysis with all components present", () => {
    const valid = {
      situation: { present: true, text: "At my previous company...", score: 8 },
      task: { present: true, text: "I was responsible for...", score: 7 },
      action: { present: true, text: "I implemented a new system...", score: 9 },
      result: { present: true, text: "This led to a 30% increase...", score: 8.5 },
      missing_components: [],
      improvement_tips: ["Consider adding more metrics"],
    };

    const result = starAnalysisSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("accepts a valid STAR analysis with missing components", () => {
    const valid = {
      situation: { present: true, text: "At my previous company...", score: 7 },
      task: { present: false, text: "", score: 0 },
      action: { present: true, text: "I did X, Y, Z", score: 6 },
      result: { present: false, text: "", score: 0 },
      missing_components: ["Task", "Result"],
      improvement_tips: ["Add what your specific task was", "Include measurable outcomes"],
    };

    const result = starAnalysisSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects scores below 0", () => {
    const invalid = {
      situation: { present: true, text: "text", score: -1 },
      task: { present: true, text: "text", score: 5 },
      action: { present: true, text: "text", score: 5 },
      result: { present: true, text: "text", score: 5 },
      missing_components: [],
      improvement_tips: [],
    };

    const result = starAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects scores above 10", () => {
    const invalid = {
      situation: { present: true, text: "text", score: 11 },
      task: { present: true, text: "text", score: 5 },
      action: { present: true, text: "text", score: 5 },
      result: { present: true, text: "text", score: 5 },
      missing_components: [],
      improvement_tips: [],
    };

    const result = starAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing situation field", () => {
    const invalid = {
      task: { present: true, text: "text", score: 5 },
      action: { present: true, text: "text", score: 5 },
      result: { present: true, text: "text", score: 5 },
      missing_components: [],
      improvement_tips: [],
    };

    const result = starAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects missing missing_components array", () => {
    const invalid = {
      situation: { present: true, text: "text", score: 5 },
      task: { present: true, text: "text", score: 5 },
      action: { present: true, text: "text", score: 5 },
      result: { present: true, text: "text", score: 5 },
      improvement_tips: [],
    };

    const result = starAnalysisSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
