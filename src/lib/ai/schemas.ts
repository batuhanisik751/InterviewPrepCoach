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
    .describe("Array of 5 tailored interview questions"),
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

const starComponentSchema = z.object({
  present: z.boolean().describe("Whether this STAR component is present in the answer"),
  text: z.string().describe("The relevant text snippet from the answer, or empty string if not present"),
  score: z.number().min(0).max(10).describe("Quality score from 0 to 10"),
});

export const starAnalysisSchema = z.object({
  situation: starComponentSchema.describe("The Situation component of STAR"),
  task: starComponentSchema.describe("The Task component of STAR"),
  action: starComponentSchema.describe("The Action component of STAR"),
  result: starComponentSchema.describe("The Result component of STAR"),
  missing_components: z
    .array(z.string())
    .describe("List of missing STAR components, e.g. ['Result', 'Task']"),
  improvement_tips: z
    .array(z.string())
    .describe("Specific tips for improving the STAR structure of this answer"),
});

const weakPointSchema = z.object({
  skill: z.string().describe("The specific skill or qualification gap"),
  gap_severity: z
    .enum(["low", "medium", "high"])
    .describe("Severity: low (nice-to-have), medium (important), high (required and missing)"),
  jd_requirement: z
    .string()
    .describe("The relevant requirement quoted from the job description"),
  resume_evidence: z
    .string()
    .describe("What evidence exists in the resume, or explanation of why it's missing"),
  suggestion: z
    .string()
    .describe("Actionable coaching suggestion to address this gap"),
});

export const weakPointsSchema = z.object({
  weak_points: z
    .array(weakPointSchema)
    .min(1)
    .max(8)
    .describe("3-8 identified gaps between resume and job description"),
});

export const questionsWithWeakPointsSchema = z.object({
  questions: z
    .array(questionSchema)
    .describe("Array of 5 tailored interview questions"),
  weak_points: z
    .array(weakPointSchema)
    .min(1)
    .max(8)
    .describe("3-8 identified gaps between resume and job description"),
});

export const behavioralEvaluationSchema = z.object({
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
  situation: starComponentSchema.describe("The Situation component of STAR"),
  task: starComponentSchema.describe("The Task component of STAR"),
  action: starComponentSchema.describe("The Action component of STAR"),
  result: starComponentSchema.describe("The Result component of STAR"),
  missing_components: z
    .array(z.string())
    .describe("List of missing STAR components, e.g. ['Result', 'Task']"),
  improvement_tips: z
    .array(z.string())
    .describe("Specific tips for improving the STAR structure of this answer"),
});
