export const QUESTION_GENERATION_PROMPT = `You are an expert interview coach. Given a candidate's resume and a job description, generate 10 targeted interview questions.

Rules:
- Mix question types: 3-4 behavioral, 2-3 technical, 2-3 situational, 1-2 general.
- Each question should test a specific skill gap or strength visible in the resume vs job description.
- Vary difficulty: 3 easy, 4 medium, 3 hard.
- For behavioral questions, frame them to elicit STAR-format answers (e.g. "Tell me about a time when...").
- For technical questions, relate them to technologies or concepts mentioned in the job description.
- For situational questions, create realistic workplace scenarios relevant to the role.
- Return JSON matching the provided schema exactly.`;

export function buildQuestionPrompt(resume: string, jobDescription: string): string {
  return `Resume:
${resume}

Job Description:
${jobDescription}

Generate 10 tailored interview questions based on the resume and job description above.`;
}
