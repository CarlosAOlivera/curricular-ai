// DEPR Official Calendar 2026-2027
// Source: Calendario Académico, Legal and Assessment PDFs

export type EventType = 'holiday' | 'assessment' | 'school' | 'recess' | 'finals' | 'report' | 'special'

export interface DEPREvent {
  id: string
  date: string       // 'YYYY-MM-DD'
  endDate?: string   // inclusive, for multi-day events
  title: string
  type: EventType
  short?: string     // short label for calendar grid
}

export const EVENT_COLORS: Record<EventType, { bg: string; text: string; dot: string; label: string }> = {
  holiday:    { bg: 'bg-red-50',      text: 'text-red-700',      dot: 'bg-red-500',    label: 'Día festivo'        },
  assessment: { bg: 'bg-amber-50',    text: 'text-amber-700',    dot: 'bg-amber-500',  label: 'Assessment'         },
  school:     { bg: 'bg-emerald-50',  text: 'text-emerald-700',  dot: 'bg-emerald-500',label: 'Calendario escolar' },
  recess:     { bg: 'bg-purple-50',   text: 'text-purple-700',   dot: 'bg-purple-500', label: 'Receso académico'   },
  finals:     { bg: 'bg-orange-50',   text: 'text-orange-700',   dot: 'bg-orange-500', label: 'Evaluaciones finales'},
  report:     { bg: 'bg-blue-50',     text: 'text-blue-700',     dot: 'bg-blue-500',   label: 'Informe de progreso'},
  special:    { bg: 'bg-navy-tint',   text: 'text-navy-mid',     dot: 'bg-navy-mid',   label: 'Evento especial'   },
}

export const DEPR_EVENTS: DEPREvent[] = [
  // ── AGOSTO 2026 ───────────────────────────────────────────────
  { id: 'ag01', date: '2026-08-03', title: 'Inicia curso escolar — Agenda Sistémica (maestros)', type: 'school', short: 'Inicio curso' },
  { id: 'ag02', date: '2026-08-04', title: 'Agenda Sistémica (maestros)', type: 'school', short: 'Agenda' },
  { id: 'ag03', date: '2026-08-05', title: 'Casa Abierta — Orientación a padres y encargados', type: 'special', short: 'Casa Abierta' },
  { id: 'ag04', date: '2026-08-06', title: 'Comienzan las clases para todos los estudiantes', type: 'school', short: 'Inicio clases' },
  { id: 'ag05', date: '2026-08-17', endDate: '2026-08-28', title: 'Assessment: Diagnóstica del Currículo Académico Funcional (CAF)', type: 'assessment', short: 'Diagnóstica CAF' },
  { id: 'ag06', date: '2026-08-28', title: 'Fecha límite: Fijar matrícula (M-1)', type: 'special', short: 'M-1' },

  // ── SEPTIEMBRE 2026 ───────────────────────────────────────────
  { id: 'se01', date: '2026-09-07', title: 'Día festivo: Día del Trabajo', type: 'holiday', short: 'Día Trabajo' },
  { id: 'se02', date: '2026-09-17', title: 'Conmemoración de la Constitución de los Estados Unidos', type: 'special', short: 'Constitución EUA' },
  { id: 'se03', date: '2026-09-30', title: 'Simulacro de Emanaciones de Gases', type: 'special', short: 'Simulacro' },

  // ── OCTUBRE 2026 ──────────────────────────────────────────────
  { id: 'oc01', date: '2026-10-05', endDate: '2026-10-09', title: 'Semana del Programa de Ciencias', type: 'special', short: 'Sem. Ciencias' },
  { id: 'oc02', date: '2026-10-05', title: 'Apertura: Someter notas 1er período (10 sem.)', type: 'report', short: 'Notas 1P' },
  { id: 'oc03', date: '2026-10-12', title: 'Día festivo: Día de la Raza', type: 'holiday', short: 'Día la Raza' },
  { id: 'oc04', date: '2026-10-13', title: 'Día de los Estadísticos', type: 'special', short: 'Estadísticos' },
  { id: 'oc05', date: '2026-10-13', endDate: '2026-10-30', title: 'Assessment: Pruebas de Lectura', type: 'assessment', short: 'Pruebas Lectura' },
  { id: 'oc06', date: '2026-10-15', title: 'Simulacro Grand ShakeOut', type: 'special', short: 'ShakeOut' },
  { id: 'oc07', date: '2026-10-19', endDate: '2026-10-23', title: 'Semana del Trabajador Social Escolar', type: 'special', short: 'Trabaj. Social' },
  { id: 'oc08', date: '2026-10-21', title: 'Assessment: Prueba de Admisión Universitaria (PAA) — 12.o grado', type: 'assessment', short: 'PAA 12mo' },
  { id: 'oc09', date: '2026-10-23', title: 'Entrega Informe de Progreso Académico', type: 'report', short: 'Informe Progreso' },
  { id: 'oc10', date: '2026-10-26', endDate: '2026-10-30', title: 'To Be Bilingual Week Celebration', type: 'special', short: 'Bilingual Week' },
  { id: 'oc11', date: '2026-10-26', endDate: '2026-11-06', title: 'Assessment: Evaluación de Progreso Académico (EPA) | CAF', type: 'assessment', short: 'EPA | CAF' },

  // ── NOVIEMBRE 2026 ────────────────────────────────────────────
  { id: 'no01', date: '2026-11-09', endDate: '2026-11-13', title: 'Semana Nacional de la Psicología Escolar | Escuelas Especializadas', type: 'special', short: 'Psicología Esc.' },
  { id: 'no02', date: '2026-11-09', title: 'Día del Niño Especial (Ley 88-2019)', type: 'special', short: 'Niño Especial' },
  { id: 'no03', date: '2026-11-11', title: 'Día festivo: Día del Veterano', type: 'holiday', short: 'Veterano' },
  { id: 'no04', date: '2026-11-13', title: 'Día del Maestro de Educación Especial (Ley 76-2013)', type: 'special', short: 'Maest. Ed. Esp.' },
  { id: 'no05', date: '2026-11-16', endDate: '2026-11-20', title: 'Fiesta de la Puertorriqueñidad', type: 'special', short: 'Puertorriqueñidad' },
  { id: 'no06', date: '2026-11-18', title: 'Assessment: PIENSE I', type: 'assessment', short: 'PIENSE I' },
  { id: 'no07', date: '2026-11-19', title: 'Día festivo: Día del Descubrimiento de Puerto Rico', type: 'holiday', short: 'Descubrimiento PR' },
  { id: 'no08', date: '2026-11-26', title: 'Día festivo: Día de Acción de Gracias', type: 'holiday', short: 'Acción de Gracias' },
  { id: 'no09', date: '2026-11-27', title: 'Receso académico', type: 'recess', short: 'Receso' },
  { id: 'no10', date: '2026-11-30', endDate: '2026-12-04', title: 'Assessment: Prueba CEPA (Conoce, Explora, Planifica y Actúa)', type: 'assessment', short: 'CEPA' },
  { id: 'no11', date: '2026-11-30', endDate: '2026-12-04', title: 'Semana de la Tecnología Educativa y Ciencias de la Computación', type: 'special', short: 'Tecnología Educ.' },

  // ── DICIEMBRE 2026 ────────────────────────────────────────────
  { id: 'di01', date: '2026-12-07', title: 'Apertura: Someter notas 2do período (20 sem.)', type: 'report', short: 'Notas 2P' },
  { id: 'di02', date: '2026-12-07', endDate: '2026-12-11', title: 'Semana del Pintor Puertorriqueño y Artistas de las Artes Plásticas', type: 'special', short: 'Artes Plásticas' },
  { id: 'di03', date: '2026-12-11', title: 'Concurso Puertorriqueño de Deletreo Contextualizado', type: 'special', short: 'Deletreo' },
  { id: 'di04', date: '2026-12-16', endDate: '2026-12-18', title: 'Evaluaciones finales del 1er semestre', type: 'finals', short: 'Finales 1er S.' },
  { id: 'di05', date: '2026-12-18', title: 'Certamen Alas para un Escritor', type: 'special', short: 'Certamen Alas' },
  { id: 'di06', date: '2026-12-22', title: 'Último día de clases del 1er semestre', type: 'school', short: 'Fin 1er Sem.' },
  { id: 'di07', date: '2026-12-25', title: 'Día festivo: Navidad', type: 'holiday', short: 'Navidad' },

  // ── ENERO 2027 ────────────────────────────────────────────────
  { id: 'en01', date: '2027-01-01', title: 'Día festivo: Año Nuevo', type: 'holiday', short: 'Año Nuevo' },
  { id: 'en02', date: '2027-01-06', title: 'Día festivo: Día de Reyes', type: 'holiday', short: 'Reyes' },
  { id: 'en03', date: '2027-01-08', title: 'Inicia el curso escolar para maestros y directores — Agenda Sistémica', type: 'school', short: 'Inicio 2do Sem.' },
  { id: 'en04', date: '2027-01-11', title: 'Inician las clases para los estudiantes (2do semestre)', type: 'school', short: 'Clases 2do Sem.' },
  { id: 'en05', date: '2027-01-15', title: 'Casa Abierta — Informe de Progreso Académico', type: 'report', short: 'Informe Progreso' },
  { id: 'en06', date: '2027-01-18', title: 'Día festivo: Natalicio de Martin Luther King, Jr.', type: 'holiday', short: 'MLK Jr.' },
  { id: 'en07', date: '2027-01-25', endDate: '2027-01-29', title: 'Semana de Ferias de Ciencias y Matemáticas (Núcleos Escolares)', type: 'special', short: 'Ferias Ciencias' },
  { id: 'en08', date: '2027-01-27', title: 'Assessment: Prueba PIENSE II', type: 'assessment', short: 'PIENSE II' },
  { id: 'en09', date: '2027-01-27', title: 'Simulacro de incendios', type: 'special', short: 'Simulacro' },

  // ── FEBRERO 2027 ──────────────────────────────────────────────
  { id: 'fe01', date: '2027-02-01', endDate: '2027-02-05', title: 'Semana Nacional de Consejería Profesional en el Escenario Escolar', type: 'special', short: 'Consejería Prof.' },
  { id: 'fe02', date: '2027-02-08', endDate: '2027-02-12', title: 'Semana del Programa de Salud Escolar', type: 'special', short: 'Salud Escolar' },
  { id: 'fe03', date: '2027-02-10', title: 'Inician procesos de Matrícula en Línea', type: 'special', short: 'Matrícula Línea' },
  { id: 'fe04', date: '2027-02-15', title: 'Día festivo: Día de los Presidentes', type: 'holiday', short: 'Presidentes' },
  { id: 'fe05', date: '2027-02-18', title: 'Assessment: Prueba de Admisión Universitaria (PAA) — 11.o grado', type: 'assessment', short: 'PAA 11mo' },
  { id: 'fe06', date: '2027-02-22', endDate: '2027-02-26', title: 'Ferias de Ciencias y Matemáticas (Oficinas Regionales)', type: 'special', short: 'Ferias ORE' },
  { id: 'fe07', date: '2027-02-22', endDate: '2027-03-05', title: 'Assessment: Currículo Académico Funcional (CAF)', type: 'assessment', short: 'CAF' },
  { id: 'fe08', date: '2027-02-24', title: 'Simulacro de terremoto', type: 'special', short: 'Simulacro' },
  { id: 'fe09', date: '2027-02-26', title: 'Festival de Bandas de Marcha', type: 'special', short: 'Bandas Marcha' },

  // ── MARZO 2027 ────────────────────────────────────────────────
  { id: 'ma01', date: '2027-03-01', endDate: '2027-03-05', title: 'Semana de la Ciudadanía Americana | English Week Celebration', type: 'special', short: 'English Week' },
  { id: 'ma02', date: '2027-03-02', title: 'Día festivo: Día de la Ciudadanía Americana', type: 'holiday', short: 'Ciudadanía Am.' },
  { id: 'ma03', date: '2027-03-08', title: 'Apertura: Someter notas 3er período (30 sem.)', type: 'report', short: 'Notas 3P' },
  { id: 'ma04', date: '2027-03-08', endDate: '2027-03-18', title: 'Assessment: Evaluación de Progreso Académico (EPA)', type: 'assessment', short: 'EPA' },
  { id: 'ma05', date: '2027-03-09', endDate: '2027-03-31', title: 'Assessment: Pruebas de Lectura', type: 'assessment', short: 'Pruebas Lectura' },
  { id: 'ma06', date: '2027-03-14', endDate: '2027-03-20', title: 'Semana de las Matemáticas | Día del Número Pi (14 mar)', type: 'special', short: 'Sem. Matemáticas' },
  { id: 'ma07', date: '2027-03-17', endDate: '2027-05-07', title: 'Assessment: Pruebas CRECEA (Ed. Especial Alterna)', type: 'assessment', short: 'CRECEA' },
  { id: 'ma08', date: '2027-03-18', title: 'Simulacro Caribe Wave', type: 'special', short: 'Caribe Wave' },
  { id: 'ma09', date: '2027-03-19', title: 'Entrega Informe de Progreso Académico', type: 'report', short: 'Informe Progreso' },
  { id: 'ma10', date: '2027-03-22', title: 'Día festivo: Día de la Abolición de la Esclavitud', type: 'holiday', short: 'Abolición' },
  { id: 'ma11', date: '2027-03-25', title: 'Receso académico', type: 'recess', short: 'Receso' },
  { id: 'ma12', date: '2027-03-26', title: 'Día festivo: Viernes Santo', type: 'holiday', short: 'Viernes Santo' },

  // ── ABRIL 2027 ────────────────────────────────────────────────
  { id: 'ab01', date: '2027-04-05', endDate: '2027-04-09', title: 'Semana del Programa de Educación Física | Semana Niñez Temprana', type: 'special', short: 'Ed. Física' },
  { id: 'ab02', date: '2027-04-12', endDate: '2027-04-16', title: 'Celebración Proyecto C.A.S.A. | Semana de la Biblioteca', type: 'special', short: 'Sem. Biblioteca' },
  { id: 'ab03', date: '2027-04-19', endDate: '2027-04-23', title: 'Fiesta de la Lengua', type: 'special', short: 'Fiesta Lengua' },
  { id: 'ab04', date: '2027-04-19', endDate: '2027-05-07', title: 'Assessment: Pruebas CRECE', type: 'assessment', short: 'CRECE' },
  { id: 'ab05', date: '2027-04-26', endDate: '2027-04-30', title: 'Assessment: Pruebas del Programa de Nivel Avanzado (PNA)', type: 'assessment', short: 'PNA' },
  { id: 'ab06', date: '2027-04-28', title: 'Simulacro de Tirador Activo', type: 'special', short: 'Simulacro' },
  { id: 'ab07', date: '2027-04-30', title: 'Olimpiadas de Matemáticas', type: 'special', short: 'Olimpiadas Mat.' },

  // ── MAYO 2027 ─────────────────────────────────────────────────
  { id: 'my01', date: '2027-05-03', title: 'Apertura: Someter notas 4to período (40 sem.)', type: 'report', short: 'Notas 4P' },
  { id: 'my02', date: '2027-05-09', endDate: '2027-05-15', title: 'Semana del Programa de Enfermería Escolar', type: 'special', short: 'Enfermería Esc.' },
  { id: 'my03', date: '2027-05-17', endDate: '2027-05-21', title: 'Semana Educativa: Día del Estudiante, Director, Maestro...', type: 'special', short: 'Sem. Educativa' },
  { id: 'my04', date: '2027-05-21', title: 'Día del Maestro', type: 'holiday', short: 'Día del Maestro' },
  { id: 'my05', date: '2027-05-24', title: 'Evaluaciones finales del 2do semestre', type: 'finals', short: 'Finales 2do S.' },
  { id: 'my06', date: '2027-05-24', endDate: '2027-05-28', title: 'Assessment: Prueba de Ubicación', type: 'assessment', short: 'Prueba Ubicación' },
  { id: 'my07', date: '2027-05-26', title: 'Evaluaciones finales del 2do semestre (cont.)', type: 'finals', short: 'Finales 2do S.' },
  { id: 'my08', date: '2027-05-28', title: 'Último día del año escolar 2026-2027 | Entrega Informe de Progreso', type: 'school', short: 'Fin año escolar' },
  { id: 'my09', date: '2027-05-31', title: 'Día festivo: Día de la Recordación de los Caídos en la Guerra', type: 'holiday', short: 'Recordación' },

  // ── JUNIO 2027 ────────────────────────────────────────────────
  { id: 'ju01', date: '2027-06-01', endDate: '2027-06-28', title: 'Período para el Año Escolar Extendido', type: 'school', short: 'Año Extendido' },
  { id: 'ju02', date: '2027-06-19', title: 'Día festivo: Juneteenth', type: 'holiday', short: 'Juneteenth' },
]

// Helper: get events for a specific date (includes multi-day ranges)
export function getEventsForDate(dateStr: string): DEPREvent[] {
  const date = new Date(dateStr + 'T00:00:00')
  return DEPR_EVENTS.filter(ev => {
    const start = new Date(ev.date + 'T00:00:00')
    const end = ev.endDate ? new Date(ev.endDate + 'T00:00:00') : start
    return date >= start && date <= end
  })
}

// Helper: get all dates in a month that have events
export function getEventDatesInMonth(year: number, month: number): Map<number, EventType[]> {
  const result = new Map<number, EventType[]>()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const evs = getEventsForDate(`${year}-${mm}-${dd}`)
    if (evs.length > 0) result.set(d, evs.map(e => e.type))
  }
  return result
}

// ICS generation for calendar sync
export function generateICS(): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Asistente Curricular PR//DEPR Calendar 2026-27//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:DEPR Calendario Escolar 2026-2027',
    'X-WR-TIMEZONE:America/Puerto_Rico',
    'X-WR-CALDESC:Calendario oficial del Departamento de Educacion de Puerto Rico 2026-2027',
  ]

  for (const ev of DEPR_EVENTS) {
    const dtStart = ev.date.replace(/-/g, '')
    const dtEnd = ev.endDate
      ? formatICSDate(addDays(ev.endDate, 1))
      : formatICSDate(addDays(ev.date, 1))
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:${ev.id}@asistente-curricular-pr`)
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`)
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`)
    lines.push(`SUMMARY:${escapeICS(ev.title)}`)
    lines.push(`CATEGORIES:${ev.type.toUpperCase()}`)
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

function formatICSDate(dateStr: string): string {
  return dateStr.replace(/-/g, '')
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function escapeICS(str: string): string {
  return str.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n')
}
