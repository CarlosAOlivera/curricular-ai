export type UserRole = 'free' | 'premium' | 'institutional'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  school: string | null
  generations_this_month: number
  created_at: string
}

export interface LessonPlan {
  id: string
  user_id: string
  grade: string
  subject: string
  unit: string
  week: number
  content: string
  created_at: string
}

export interface CurriculumUnit {
  id: string
  name: string
  weeks: number[]
  standards: string[]
}

export interface CurriculumGrade {
  grade: string
  label: string
  units: CurriculumUnit[]
}

export interface GenerateRequest {
  grade: string
  subject: string
  unitId: string
  unitName: string
  week: number
  standards: string[]
  teacherNotes?: string
  teacherName: string
  school: string
  weekStartDate: string
}

// --- Weekly Plan structured format (v2) ---

export interface DayPlan {
  standards: string
  indicators: string
  objectives: string[]
  initial: string[]
  developing: string[]
  closing: string[]
  integration: string
  evaluation: ('diagnostic' | 'formative' | 'summative')[]
  accommodations: ('special_ed' | 'immigrant' | '504' | 'gifted')[]
  differentiation: string
  materials: string[]
}

export interface WeeklyPlanData {
  version: 2
  teacher: string
  school: string
  weekStartDate: string
  grade: string
  subject: string
  theme: string
  unitNumber: string
  unitName: string
  weekCode: string
  transversalThemes: string[]
  generatorThemes: string[]
  language: 'english' | 'spanish'
  days: {
    monday: DayPlan
    tuesday: DayPlan
    wednesday: DayPlan
    thursday: DayPlan
    friday: DayPlan
  }
}
