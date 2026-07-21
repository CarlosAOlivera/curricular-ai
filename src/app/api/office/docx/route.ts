import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  Packer, AlignmentType, WidthType, ShadingType,
  BorderStyle, VerticalAlign,
} from 'docx'
import { WeeklyPlanData } from '@/types'

// ── Colors ──────────────────────────────────────────────────────────────────
const C_BLUE_HEADER = '4472C4'
const C_BLUE_LIGHT  = 'DCE6F5'
const C_LABEL_BG    = 'F0F3FA'
const C_WHITE       = 'FFFFFF'
const C_BORDER      = 'CCCCCC'

// ── Font sizes (half-points: 18 = 9pt, 20 = 10pt) ────────────────────────
const SZ    = 18
const SZ_SM = 16
const SZ_HD = 20

// ── Column widths (DXA). Landscape letter 15840 − margins 1800 = 14040 ────
const COL_LABEL = 1800
const COL_DAY   = Math.round((14040 - COL_LABEL) / 5)  // 2448

// ── Helpers ──────────────────────────────────────────────────────────────────

const bdr = () => ({ style: BorderStyle.SINGLE, size: 4, color: C_BORDER })
const borders = () => ({ top: bdr(), bottom: bdr(), left: bdr(), right: bdr() })
const shade = (c: string) => ({ type: ShadingType.SOLID, color: c, fill: c })
const margins = { top: 60, bottom: 60, left: 80, right: 80 }

function mkP(text: string, opts?: { bold?: boolean; italic?: boolean; size?: number; color?: string; after?: number }) {
  return new Paragraph({
    children: [new TextRun({
      text,
      bold: opts?.bold,
      italics: opts?.italic,
      size: opts?.size ?? SZ,
      color: opts?.color,
    })],
    spacing: { before: 0, after: opts?.after ?? 40 },
  })
}

// Label column cell (gray, bold, optional italic subtitle)
function labelCell(text: string, sub?: string) {
  const children: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text, bold: true, size: SZ })],
      spacing: { before: 0, after: sub ? 20 : 0 },
    }),
  ]
  if (sub) {
    children.push(new Paragraph({
      children: [new TextRun({ text: sub, italics: true, size: SZ_SM })],
      spacing: { before: 0, after: 0 },
    }))
  }
  return new TableCell({
    width: { size: COL_LABEL, type: WidthType.DXA },
    shading: shade(C_LABEL_BG),
    borders: borders(),
    verticalAlign: VerticalAlign.TOP,
    margins,
    children,
  })
}

// Day header cell (blue, white, centered)
function dayHeaderCell(text: string) {
  return new TableCell({
    width: { size: COL_DAY, type: WidthType.DXA },
    shading: shade(C_BLUE_HEADER),
    borders: borders(),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 80, right: 80 },
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text, bold: true, size: SZ_HD, color: 'FFFFFF' })],
    })],
  })
}

// Empty top-left header cell
function emptyHeaderCell() {
  return new TableCell({
    width: { size: COL_LABEL, type: WidthType.DXA },
    shading: shade(C_BLUE_HEADER),
    borders: borders(),
    children: [new Paragraph({ children: [] })],
  })
}

// Full-width section header (spans 6 cols, light blue, centered)
function sectionHeaderRow(text: string) {
  return new TableRow({
    children: [new TableCell({
      columnSpan: 6,
      shading: shade(C_BLUE_LIGHT),
      borders: borders(),
      margins,
      children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text, bold: true, size: SZ })],
      })],
    })],
  })
}

// Data cell with array of Paragraphs
function dataCell(paragraphs: Paragraph[]) {
  return new TableCell({
    width: { size: COL_DAY, type: WidthType.DXA },
    shading: shade(C_WHITE),
    borders: borders(),
    verticalAlign: VerticalAlign.TOP,
    margins,
    children: paragraphs.length ? paragraphs : [new Paragraph({ children: [] })],
  })
}

function textCell(text: string, bold?: boolean) {
  return dataCell([mkP(text || '', { bold, after: 0 })])
}

function numberedCell(items: string[]) {
  return dataCell(items.map((it, i) => mkP(`${i + 1}. ${it}`, { after: 30 })))
}

function checkCell(items: Array<{ label: string; checked: boolean }>) {
  return dataCell(items.map(({ label, checked }) =>
    mkP(`${checked ? '☒' : '☐'} ${label}`, { after: 30 })
  ))
}

function emptyCell() {
  return dataCell([new Paragraph({ children: [] })])
}

// Info table half-cell (bold label + plain value)
function infoCell(label: string, value: string) {
  return new TableCell({
    shading: shade(C_WHITE),
    borders: borders(),
    margins,
    children: [new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: SZ }),
        new TextRun({ text: value, size: SZ }),
      ],
    })],
  })
}

// ── Translations ─────────────────────────────────────────────────────────────

const EN = {
  weeklyPlan: 'Weekly Plan (Regular Teacher)',
  transversalNote: '*Transversal Theme of Equity and Respect among All Human Beings',
  week: 'Week', teacherName: "Teacher's Name", date: 'Date',
  grade: 'Grade', subject: 'Subject (Course)', theme: 'Theme',
  unit: 'Unit', school: 'School',
  transversalThemes: 'Transversal Themes', generatorThemes: 'Generator Themes',
  dayLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  standards: 'Standards',
  indicators: 'Expectations or Indicators',
  objectives: 'Objectives',
  objectivesPrefix: 'At the end of the lesson students will be able to:',
  activitiesHeader: 'Sequence of Learning Activities',
  initial: 'Initial', developing: 'Developing', closing: 'Closing',
  integration: 'Integration with other subjects',
  initiative: 'Initiative or Innovative Project',
  evaluation: 'Evaluation',
  diagnostic: 'Diagnostic:', formative: 'Formative:', summative: 'Summative:',
  accommodations: 'Reasonable accommodations or curricular accommodations',
  specialEd: 'Special Education', immigrant: 'Immigrant', gifted: 'Gifted / Dotado',
  differentiation: 'Differentiated Instruction',
  materials: 'Materials',
  reflection: 'Reflection on the lesson (praxis).',
  reflectionSub: 'Did this really work well? Could this have been done better?',
  transversalList: [
    'Equity and Respect Among All Human Beings',
    'Cultural Identity and Interculturality',
    'Health Awareness',
    'Education for Environmental and Ecological Awareness',
    'Entrepreneurship and Innovation',
    'Information and Communications Technology (ICT)',
  ],
  generatorList: ['Diversity', 'Ethical Coexistence'],
}

const ES = {
  weeklyPlan: 'Planificación Semanal (Maestro Regular)',
  transversalNote: '*Tema transversal de Equidad y Respeto entre Todos los Seres Humanos',
  week: 'Semana', teacherName: 'Nombre del maestro/a', date: 'Fecha',
  grade: 'Grado', subject: 'Materia (Curso)', theme: 'Tema',
  unit: 'Unidad', school: 'Escuela',
  transversalThemes: 'Temas Transversales', generatorThemes: 'Temas Generadores',
  dayLabels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  standards: 'Estándares',
  indicators: 'Expectativas o Indicadores',
  objectives: 'Objetivos',
  objectivesPrefix: 'Al finalizar la clase el estudiante podrá:',
  activitiesHeader: 'Secuencia de Actividades de Aprendizaje',
  initial: 'Inicial', developing: 'Desarrollo', closing: 'Cierre',
  integration: 'Integración con otras materias',
  initiative: 'Iniciativa o Proyecto Innovador',
  evaluation: 'Evaluación',
  diagnostic: 'Diagnóstica:', formative: 'Formativa:', summative: 'Sumativa:',
  accommodations: 'Acomodos razonables o acomodos curriculares',
  specialEd: 'Educación Especial', immigrant: 'Inmigrante', gifted: 'Gifted / Dotado',
  differentiation: 'Instrucción Diferenciada',
  materials: 'Materiales',
  reflection: 'Reflexión sobre la lección (praxis).',
  reflectionSub: '¿Funcionó realmente bien? ¿Se pudo haber hecho mejor?',
  transversalList: [
    'Equidad y respeto entre todos los seres humanos',
    'Identidad cultural e interculturalidad',
    'Conciencia de la salud',
    'Educación para la conciencia ambiental y ecológica',
    'Emprendimiento e innovación',
    'Tecnología de la información y la comunicación (TIC)',
  ],
  generatorList: ['Diversidad', 'Convivencia ética'],
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plan: WeeklyPlanData = await req.json()
  const T = plan.language === 'english' ? EN : ES

  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const
  const days = dayKeys.map(k => plan.days[k])

  // ── Header ────────────────────────────────────────────────────────────────
  const headerParas = [
    new Paragraph({
      children: [new TextRun({ text: `${plan.subject} ${plan.grade} | ${T.weeklyPlan}`, bold: true, size: 28, color: '1F3864' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 60 },
    }),
    new Paragraph({
      children: [new TextRun({ text: T.transversalNote, italics: true, size: SZ_SM, color: '666666' })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `${T.week} ${plan.weekCode}`, bold: true, size: SZ })],
      spacing: { before: 0, after: 120 },
    }),
  ]

  // ── Info table (2 columns, 4 rows) ───────────────────────────────────────
  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [
        infoCell(T.teacherName, plan.teacher || '_______________________'),
        infoCell(T.date, plan.weekStartDate || '_______________________'),
      ]}),
      new TableRow({ children: [
        infoCell(T.grade, plan.grade),
        infoCell(T.subject, plan.subject),
      ]}),
      new TableRow({ children: [
        infoCell(T.theme, plan.theme),
        infoCell(`${T.unit} ${plan.unitNumber}`, plan.unitName),
      ]}),
      // Transversal / generator themes with checkboxes
      new TableRow({ children: [
        new TableCell({
          shading: shade(C_WHITE), borders: borders(),
          verticalAlign: VerticalAlign.TOP, margins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${T.transversalThemes}:`, bold: true, size: SZ })],
              spacing: { before: 0, after: 40 },
            }),
            ...T.transversalList.map(theme => {
              const checked = plan.transversalThemes.some(pt =>
                pt.toLowerCase().includes(theme.toLowerCase().slice(0, 12))
              )
              return new Paragraph({
                children: [new TextRun({ text: `${checked ? '☒' : '☐'} ${theme}`, size: SZ_SM })],
                spacing: { before: 20, after: 20 },
              })
            }),
          ],
        }),
        new TableCell({
          shading: shade(C_WHITE), borders: borders(),
          verticalAlign: VerticalAlign.TOP, margins,
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${T.generatorThemes}:`, bold: true, size: SZ })],
              spacing: { before: 0, after: 40 },
            }),
            ...T.generatorList.map(theme => {
              const checked = plan.generatorThemes.some(pt =>
                pt.toLowerCase().includes(theme.toLowerCase().slice(0, 8))
              )
              return new Paragraph({
                children: [new TextRun({ text: `${checked ? '☒' : '☐'} ${theme}`, size: SZ_SM })],
                spacing: { before: 20, after: 20 },
              })
            }),
            ...(plan.school ? [new Paragraph({
              children: [
                new TextRun({ text: `${T.school}: `, bold: true, size: SZ }),
                new TextRun({ text: plan.school, size: SZ }),
              ],
              spacing: { before: 80, after: 0 },
            })] : []),
          ],
        }),
      ]}),
    ],
  })

  // ── Main plan table (6 cols: label + 5 days) ──────────────────────────────
  const mainTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      // Header row
      new TableRow({ children: [emptyHeaderCell(), ...T.dayLabels.map(d => dayHeaderCell(d))] }),

      // Estándares
      new TableRow({ children: [labelCell(T.standards), ...days.map(d => textCell(d.standards))] }),

      // Expectativas o Indicadores
      new TableRow({ children: [labelCell(T.indicators), ...days.map(d => textCell(d.indicators, true))] }),

      // Objetivos
      new TableRow({ children: [
        labelCell(T.objectives),
        ...days.map(d => dataCell([
          mkP(T.objectivesPrefix, { italic: true, size: SZ_SM, after: 40 }),
          ...d.objectives.map(obj => mkP(`• ${obj}`, { after: 30 })),
        ])),
      ]}),

      // ── Secuencia de Actividades ──────────────────────────────────────────
      sectionHeaderRow(T.activitiesHeader),

      new TableRow({ children: [labelCell(T.initial),    ...days.map(d => numberedCell(d.initial))] }),
      new TableRow({ children: [labelCell(T.developing), ...days.map(d => numberedCell(d.developing))] }),
      new TableRow({ children: [labelCell(T.closing),    ...days.map(d => numberedCell(d.closing))] }),

      // Integración
      new TableRow({ children: [labelCell(T.integration), ...days.map(d => textCell(d.integration))] }),

      // Iniciativa (empty)
      new TableRow({ children: [labelCell(T.initiative), ...days.map(() => emptyCell())] }),

      // Evaluación
      new TableRow({ children: [
        labelCell(T.evaluation),
        ...days.map(d => checkCell([
          { label: T.diagnostic, checked: d.evaluation.includes('diagnostic') },
          { label: T.formative,  checked: d.evaluation.includes('formative') },
          { label: T.summative,  checked: d.evaluation.includes('summative') },
        ])),
      ]}),

      // Acomodos
      new TableRow({ children: [
        labelCell(T.accommodations),
        ...days.map(d => checkCell([
          { label: T.specialEd, checked: d.accommodations.includes('special_ed') },
          { label: T.immigrant, checked: d.accommodations.includes('immigrant') },
          { label: '504',       checked: d.accommodations.includes('504') },
          { label: T.gifted,    checked: d.accommodations.includes('gifted') },
        ])),
      ]}),

      // Instrucción Diferenciada
      new TableRow({ children: [labelCell(T.differentiation), ...days.map(d => textCell(d.differentiation))] }),

      // Materiales
      new TableRow({ children: [labelCell(T.materials), ...days.map(d => numberedCell(d.materials))] }),

      // Reflexión (empty tall cells)
      new TableRow({ children: [
        labelCell(T.reflection, T.reflectionSub),
        ...days.map(() => new TableCell({
          width: { size: COL_DAY, type: WidthType.DXA },
          shading: shade(C_WHITE), borders: borders(), margins,
          children: [
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
            new Paragraph({ children: [] }),
          ],
        })),
      ]}),
    ],
  })

  // ── Build document (landscape) ─────────────────────────────────────────────
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 15840, height: 12240, orientation: 'landscape' as const },
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children: [
        ...headerParas,
        infoTable,
        new Paragraph({ children: [], spacing: { before: 120, after: 0 } }),
        mainTable,
        new Paragraph({
          children: [new TextRun({ text: 'Generado por Asistente Curricular PR', italics: true, size: 16, color: '999999' })],
          alignment: AlignmentType.RIGHT,
          spacing: { before: 120, after: 0 },
        }),
      ],
    }],
  })

  const buffer = await Packer.toBuffer(doc)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="plan-${plan.weekCode}.docx"`,
    },
  })
}
