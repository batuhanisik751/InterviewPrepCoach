-- Evaluations table (AI scoring of user answers)
CREATE TABLE public.evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID REFERENCES public.answers(id) ON DELETE CASCADE NOT NULL,
  clarity_score REAL CHECK (clarity_score BETWEEN 0 AND 10),
  structure_score REAL CHECK (structure_score BETWEEN 0 AND 10),
  depth_score REAL CHECK (depth_score BETWEEN 0 AND 10),
  overall_score REAL CHECK (overall_score BETWEEN 0 AND 10),
  feedback TEXT,
  suggested_answer TEXT,
  star_detected BOOLEAN DEFAULT FALSE,
  star_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view evaluations for own sessions"
  ON public.evaluations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.answers
      JOIN public.questions ON questions.id = answers.question_id
      JOIN public.sessions ON sessions.id = questions.session_id
      WHERE answers.id = evaluations.answer_id
        AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert evaluations for own sessions"
  ON public.evaluations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.answers
      JOIN public.questions ON questions.id = answers.question_id
      JOIN public.sessions ON sessions.id = questions.session_id
      WHERE answers.id = evaluations.answer_id
        AND sessions.user_id = auth.uid()
    )
  );
