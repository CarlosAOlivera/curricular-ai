-- Add subject and grade preference to profiles
alter table public.profiles
  add column if not exists subject_preference text,
  add column if not exists grade_preference text;
