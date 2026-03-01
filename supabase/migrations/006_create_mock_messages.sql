-- Mock messages table (chat history for mock interviews)
CREATE TABLE public.mock_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mock_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view mock messages for own sessions"
  ON public.mock_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = mock_messages.session_id
        AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert mock messages for own sessions"
  ON public.mock_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sessions
      WHERE sessions.id = mock_messages.session_id
        AND sessions.user_id = auth.uid()
    )
  );
