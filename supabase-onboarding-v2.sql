-- ============================================================
-- SHINY CREATORS — Columnas nuevas del onboarding v2
-- Pega en Supabase > SQL Editor y haz clic en Run ▶️
-- ============================================================

ALTER TABLE public.profiles
  -- Campos que ya existen (no cambian)
  ADD COLUMN IF NOT EXISTS platform            text,
  ADD COLUMN IF NOT EXISTS current_followers   text,
  ADD COLUMN IF NOT EXISTS can_edit            text,
  ADD COLUMN IF NOT EXISTS goal_followers      text,
  ADD COLUMN IF NOT EXISTS onboarding_done     boolean DEFAULT false,

  -- Multi-selección → guardamos como texto separado por comas
  ADD COLUMN IF NOT EXISTS biggest_challenge   text,
  ADD COLUMN IF NOT EXISTS content_reason      text,
  ADD COLUMN IF NOT EXISTS niche               text,
  ADD COLUMN IF NOT EXISTS goal_3months        text,

  -- Campos nuevos
  ADD COLUMN IF NOT EXISTS platform_custom     text,   -- si eligió "Otra"
  ADD COLUMN IF NOT EXISTS niche_custom        text,   -- si eligió "Otro"
  ADD COLUMN IF NOT EXISTS posting_frequency   text,
  ADD COLUMN IF NOT EXISTS time_available      text;

-- ✅ Listo.
