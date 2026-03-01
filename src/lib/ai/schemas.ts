import { z } from "zod";

export const questionSchema = z.object({
  question_text: z.string().describe("The interview question"),
  question_type: z
    .enum(["behavioral", "technical", "situational", "general"])
    .describe("The type of interview question"),
  difficulty: z
    .enum(["easy", "medium", "hard"])
    .describe("Difficulty level of the question"),
  target_skill: z
    .string()
    .describe("The specific skill or competency this question tests"),
});

export const questionsSchema = z.object({
  questions: z
    .array(questionSchema)
    .describe("Array of 10 tailored interview questions"),
});

export const evaluationSchema = z.object({
  clarity_score: z
    .number()
    .min(0)
    .max(10)
    .describe("Clarity score from 0 to 10"),
  structure_score: z
    .number()
    .min(0)
    .max(10)
    .describe("Structure score from 0 to 10"),
  depth_score: z
    .number()
    .min(0)
    .max(10)
    .describe("Depth score from 0 to 10"),
  overall_score: z
    .number()
    .min(0)
    .max(10)
    .describe("Weighted overall score: clarity 25%, structure 30%, depth 45%"),
  feedback: z
    .string()
    .describe("2-3 sentences of constructive criticism"),
  suggested_answer: z
    .string()
    .describe("A stronger version of the answer the candidate could study"),
});
