import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  Packer, HeadingLevel, AlignmentType, WidthType, ShadingType,
  BorderStyle, VerticalAlign,
} from 'docx'
import { WeeklyPlanData, DayPlan } from '@/types'

const DAYS_EN: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday',
}
const DAYS_ES: Record<string, string> = {
  monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
  thursday: 'Jueves', friday: 'Viernes',
}
const SECTIONS_EN = ['Standards', 'Objectives', 'Opening (Inicio)', 'Development (Desarrollo)', 'Closing (Cierre)', 'Materials', 'Differentiation']
const SECTIONS_ES = ['Estándares', 'Objetivos', 'Inicio', 'Desarrollo', 'Cierre', 'Materiales', 'Diferenciación']

const BLUE = '1D4ED8'
const BLUE_LIGHT = 'DBEAFE'
const GRAY_LIGHT = 'F8FAFC'

function makeCell(text: string, isHeader: boolean, opts?: { bold?: boolean; color?: string; shade?: string; width?: number }) {
  return new TableCell({
    width: opts?.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    shading: isHeader
      ? { type: ShadingType.SOLID, color: BLUE, fill: BLUE }
      : opts?.shade
        ? { type: ShadingType.SOLID, color: opts.shade, fill: opts.shade }
        : { type: ShadingType.SOLID, color: GRAY_LIGHT, fill: GRAY_LIGHT },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    borders: {
      top:    { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      left:   { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
      right:  { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    },
    children: [new Paragraph({
      children: [new TextRun({
        text,
        bold: isHeader || opts?.bold,
        color: isHeader ? 'FFFFFF' : (opts?.color ?? '1E293B'),
        size: isHeader ? 20 : 18,
      })],
    })],
  })
}

function daySection(day: string, data: DayPlan, lang: string) {
  const label = lang === 'english' ? DAYS_EN[day] : DAYS_ES[day]
  const sections = lang === 'english' ? SECTIONS_EN : SECTIONS_ES
  const values = [
    data.standards,
    data.objectives.join('\n'),
    data.initial.join('\n'),
    data.developing.join('\n'),
    data.closing.join('\n'),
    data.materials.join(', '),
    data.differentiation,
  ]

  return [
    new Paragraph({
      children: [new TextRun({ text: label, bold: true, size: 26, color: BLUE })],
      spacing: { before: 360, after: 120 },
    }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: values.map((val, i) =>
        new TableRow({
          children: [
            makeCell(sections[i], false, { bold: true, shade: BLUE_LIGHT, width: 22 }),
            makeCell(val || '—', false, { width: 78 }),
          ],
        })
      ),
    }),
  ]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plan: WeeklyPlanData = await req.json()
  const isEn = plan.language === 'english'

  const headerRows = [
    [`${isEn ? 'Teacher' : 'Maestro/a'}:`, plan.teacher || '—', `${isEn ? 'School' : 'Escuela'}:`, plan.school || '—'],
    [`${isEn ? 'Grade' : 'Grado'}:`, plan.grade, `${isEn ? 'Subject' : 'Materia'}:`, plan.subject],
    [`${isEn ? 'Unit' : 'Unidad'}:`, `${plan.unitNumber} – ${plan.unitName}`, `${isEn ? 'Week' : 'Semana'}:`, plan.weekCode],
    [`${isEn ? 'Theme' : 'Tema'}:`, plan.theme, `${isEn ? 'Week starting' : 'Semana del'}:`, plan.weekStartDate || '—'],
  ]

  const infoTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: headerRows.map(([l1, v1, l2, v2]) =>
      new TableRow({
        children: [
          makeCell(l1, false, { bold: true, shade: BLUE_LIGHT, width: 15 }),
          makeCell(v1, false, { width: 35 }),
          makeCell(l2, false, { bold: true, shade: BLUE_LIGHT, width: 15 }),
          makeCell(v2, false, { width: 35 }),
        ],
      })
    ),
  })

  const dayChildren: (Paragraph | Table)[] = []
  for (const day of ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']) {
    dayChildren.push(...daySection(day, plan.days[day as keyof typeof plan.days], plan.language))
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, bottom: 720, left: 900, right: 900 },
        },
      },
      children: [
        new Paragraph({
          children: [new TextRun({ text: isEn ? 'Weekly Lesson Plan' : 'Planificación Semanal', bold: true, size: 40, color: BLUE })],
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Asistente Curricular PR — DEPR', color: '64748B', size: 18 })],
          alignment: AlignmentType.CENTER,
          spacing: { after: 360 },
        }),
        infoTable,
        ...dayChildren,
        new Paragraph({
          children: [
            new TextRun({ text: `${isEn ? 'Transversal Themes' : 'Temas Transversales'}: `, bold: true, size: 18, color: '64748B' }),
            new TextRun({ text: plan.transversalThemes?.join(', ') || '—', size: 18, color: '64748B' }),
          ],
          spacing: { before: 360, after: 80 },
        }),
        new Paragraph({
          children: [
            new TextRun({ text: `${isEn ? 'Generator Themes' : 'Temas Generadores'}: `, bold: true, size: 18, color: '64748B' }),
            new TextRun({ text: plan.generatorThemes?.join(', ') || '—', size: 18, color: '64748B' }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `${isEn ? 'Generated by' : 'Generado por'} Asistente Curricular PR`, color: '94A3B8', size: 16, italics: true })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
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
