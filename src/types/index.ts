export type SessionStatus = "draft" | "in_progress" | "completed";

export type QuestionType = "behavioral" | "technical" | "situational" | "general";

export type Difficulty = "easy" | "medium" | "hard";

export type GapSeverity = "low" | "medium" | "high";

export interface Session {
  id: string;
  user_id: string;
  resume_text: string;
  job_description: string;
  job_title: string | null;
  company_name: string | null;
  overall_score: number | null;
  weak_points: WeakPoint[] | null;
  status: SessionStatus;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  session_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty: Difficulty;
  target_skill: string;
  sort_order: number;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  user_answer: string;
  created_at: string;
}

export interface StarComponent {
  present: boolean;
  text: string;
  score: number;
}

export interface StarBreakdown {
  situation: StarComponent;
  task: StarComponent;
  action: StarComponent;
  result: StarComponent;
  missing_components: string[];
  improvement_tips: string[];
}

export interface Evaluation {
  id: string;
  answer_id: string;
  clarity_score: number;
  structure_score: number;
  depth_score: number;
  overall_score: number;
  feedback: string;
  suggested_answer: string;
  star_detected: boolean;
  star_breakdown: StarBreakdown | null;
  created_at: string;
}

export interface WeakPoint {
  skill: string;
  gap_severity: GapSeverity;
  jd_requirement: string;
  resume_evidence: string;
  suggestion: string;
}

export interface MockMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}
