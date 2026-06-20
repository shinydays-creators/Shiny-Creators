-- ============================================================
-- SHINY CREATORS — Tabla de rachas (daily_logs)
-- Pega en Supabase > SQL Editor y haz clic en Run ▶️
-- ============================================================

CREATE TABLE IF NOT EXISTS public.daily_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date   date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, log_date)   -- solo un registro por día y usuaria
);

-- Activar Row Level Security
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- Cada usuaria solo ve y toca sus propios logs
CREATE POLICY "Ver propios logs" ON public.daily_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Insertar propios logs" ON public.daily_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Borrar propios logs" ON public.daily_logs
  FOR DELETE USING (auth.uid() = user_id);

-- Columna de récord en profiles (máxima racha histórica)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_record integer DEFAULT 0;

-- ✅ Listo.
