export interface ConsistencyCheckResult {
  passed: boolean;
  issues: string[];
}

export function validateQuestionRelevance(
  questions: { question_text: string; target_skill: string }[],
  resumeText: string,
  jobDescription: string
): ConsistencyCheckResult {
  const issues: string[] = [];
  const combinedSource = (resumeText + " " + jobDescription).toLowerCase();

  for (const q of questions) {
    const skillWords = q.target_skill
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    const hasOverlap = skillWords.some((word) => combinedSource.includes(word));

    if (!hasOverlap) {
      issues.push(
        `Question targeting "${q.target_skill}" has no connection to resume or job description`
      );
    }
  }

  return { passed: issues.length === 0, issues };
}

export function validateFeedbackRelevance(
  feedback: string,
  userAnswer: string
): ConsistencyCheckResult {
  const issues: string[] = [];

  const answerWords = new Set(
    userAnswer
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length >= 4)
  );

  const feedbackLower = feedback.toLowerCase();

  let overlapCount = 0;
  for (const word of answerWords) {
    if (feedbackLower.includes(word)) {
      overlapCount++;
    }
  }

  const minOverlap = answerWords.size < 5 ? 1 : 2;
  if (overlapCount < minOverlap) {
    issues.push(
      "Feedback does not appear to reference the candidate's actual answer content"
    );
  }

  return { passed: issues.length === 0, issues };
}

export function validateSuggestedAnswerLength(
  suggestedAnswer: string,
  minWords: number = 150,
  maxWords: number = 500
): ConsistencyCheckResult {
  const wordCount = suggestedAnswer.trim().split(/\s+/).length;
  const issues: string[] = [];

  if (wordCount < minWords) {
    issues.push(
      `Suggested answer is too short (${wordCount} words, minimum ${minWords})`
    );
  }
  if (wordCount > maxWords) {
    issues.push(
      `Suggested answer is too long (${wordCount} words, maximum ${maxWords})`
    );
  }

  return { passed: issues.length === 0, issues };
}

export function detectUniformScores(
  scores: number[]
): ConsistencyCheckResult {
  const issues: string[] = [];

  if (scores.length >= 3) {
    const allSame = scores.every((s) => s === scores[0]);
    if (allSame) {
      issues.push(
        `All ${scores.length} scores are identical (${scores[0]}), which suggests low-quality evaluation`
      );
    }
  }

  return { passed: issues.length === 0, issues };
}

export function validateEvaluationOutput(
  evaluation: {
    clarity_score: number;
    structure_score: number;
    depth_score: number;
    feedback: string;
    suggested_answer: string;
    [key: string]: unknown;
  },
  userAnswer: string
): ConsistencyCheckResult {
  const allIssues: string[] = [];

  const feedbackCheck = validateFeedbackRelevance(
    evaluation.feedback,
    userAnswer
  );
  allIssues.push(...feedbackCheck.issues);

  const lengthCheck = validateSuggestedAnswerLength(
    evaluation.suggested_answer
  );
  allIssues.push(...lengthCheck.issues);

  const scoreCheck = detectUniformScores([
    evaluation.clarity_score,
    evaluation.structure_score,
    evaluation.depth_score,
  ]);
  allIssues.push(...scoreCheck.issues);

  return { passed: allIssues.length === 0, issues: allIssues };
}

export async function generateWithRetry<T>(
  generateFn: (extraPromptSuffix?: string) => Promise<T>,
  validateFn: (output: T) => ConsistencyCheckResult,
  stricterPromptSuffix: string
): Promise<{ output: T; consistencyIssues: string[] }> {
  const firstOutput = await generateFn();
  const firstCheck = validateFn(firstOutput);

  if (firstCheck.passed) {
    return { output: firstOutput, consistencyIssues: [] };
  }

  console.warn(
    "First attempt failed consistency check, retrying:",
    firstCheck.issues
  );

  const retryOutput = await generateFn(stricterPromptSuffix);
  const retryCheck = validateFn(retryOutput);

  if (retryCheck.passed) {
    return { output: retryOutput, consistencyIssues: [] };
  }

  console.warn("Retry also failed consistency check:", retryCheck.issues);
  return { output: retryOutput, consistencyIssues: retryCheck.issues };
}
