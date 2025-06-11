-- Add questions column to surveys table
ALTER TABLE public.surveys
ADD COLUMN questions text[] NOT NULL DEFAULT '{}';

-- Update existing surveys to have empty questions array
UPDATE public.surveys
SET questions = '{}'
WHERE questions IS NULL; 