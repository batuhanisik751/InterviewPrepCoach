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
