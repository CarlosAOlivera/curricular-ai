# Asistente Curricular IA Puerto Rico
## CLAUDE.md — Agent Instructions

Plataforma SaaS de planificación curricular para docentes del DEPR.
Producto independiente de ELEVATE — comparten owner (Carlos Olivera) pero son repos y Supabase projects distintos.

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | Next.js 16 + Tailwind 4 |
| Backend/Auth | Supabase |
| IA | Anthropic Claude (claude-sonnet-4-6) |
| Deploy | Vercel |

## Structure
```
src/
  app/
    (auth)/login + register
    (dashboard)/planner + history
    api/generate/route.ts   ← Claude API call
  lib/
    supabase/client.ts + server.ts
    curriculum/english.ts   ← Grade 9-12 ESL data
  types/index.ts
  middleware.ts             ← Auth guard
supabase/migrations/        ← Schema: profiles, lesson_plans
```

## Business Model
- Free: planificación semanal + PDF, historial limitado, generaciones limitadas
- Premium ($7.99–9.99/mes): Word/PPT/Google Docs, assessments, rúbricas, historial completo
- Institutional: dashboard director, aprobación de planificaciones

## MVP Scope (Fase 1)
- Inglés 9–12 solamente
- Selección: grado → unidad → semana
- Generación automática con Claude
- Exportación PDF (jsPDF, client-side)
- Historial por usuario

## Pending (after MVP)
- jsPDF install: `npm install jspdf @types/jspdf`
- Supabase project creation + apply migration
- `.env.local` con NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, ANTHROPIC_API_KEY
- Vercel deployment
- Freemium gating (count generations_this_month in profiles)
- Stripe integration for Premium

## Rules
- Never expose ANTHROPIC_API_KEY client-side — only in API routes
- All DB writes go through server-side Supabase client
- Curriculum data lives in src/lib/curriculum/ — add new subjects as separate files
- Model: claude-sonnet-4-6 (cost-efficient for plan generation)
