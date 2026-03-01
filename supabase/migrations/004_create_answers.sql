-- Answers table (user answers to interview questions)
CREATE TABLE public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  user_answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view answers for own sessions"
  ON public.answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.questions
      JOIN public.sessions ON sessions.id = questions.session_id
      WHERE questions.id = answers.question_id
        AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert answers for own sessions"
  ON public.answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.questions
      JOIN public.sessions ON sessions.id = questions.session_id
      WHERE questions.id = answers.question_id
        AND sessions.user_id = auth.uid()
    )
  );
