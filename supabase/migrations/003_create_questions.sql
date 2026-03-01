-- Questions table (generated interview questions per session)
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('behavioral', 'technical', 'situational', 'general')),
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  target_skill TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view questions for own sessions"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = questions.session_id
        AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert questions for own sessions"
  ON public.questions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = questions.session_id
        AND sessions.user_id = auth.uid()
    )
  );
