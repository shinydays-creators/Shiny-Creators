-- ============================================================
-- GLOW — Columnas de onboarding para la tabla profiles
-- Pega esto en Supabase > SQL Editor y haz clic en "Run"
-- (Después del supabase-setup.sql inicial)
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS platform          text,          -- 'youtube' | 'tiktok' | 'instagram'
  ADD COLUMN IF NOT EXISTS current_followers text,          -- '0-100' | '100-1k' | '1k-10k' | '10k+'
  ADD COLUMN IF NOT EXISTS can_edit          text,          -- 'yes' | 'a-bit' | 'no'
  ADD COLUMN IF NOT EXISTS biggest_challenge text,          -- 'ideas' | 'consistency' | 'editing' | 'algorithm' | 'time'
  ADD COLUMN IF NOT EXISTS goal_followers    text,          -- '1k' | '10k' | '100k' | '1m'
  ADD COLUMN IF NOT EXISTS content_reason    text,          -- 'passion' | 'income' | 'brand' | 'community' | 'fun'
  ADD COLUMN IF NOT EXISTS onboarding_done   boolean DEFAULT false;

-- ✅ Listo. Ahora el perfil guarda las respuestas del onboarding.
