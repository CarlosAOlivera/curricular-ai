'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface PlanillaRow {
  standard: string
  objective: string
  bloomLevel: string
  questionType: string
  numItems: number
  points: number
  percentage: number
}

interface PlanillaData {
  title: string
  subject: string
  grade: string
  unitName: string
  totalItems: number
  totalPoints: number
  rows: PlanillaRow[]
}

interface ExamQuestion {
  number: number
  standard: string
  bloomLevel: string
  question: string
  options?: string[]
  answer: string
  points: number
}

interface ExamSection {
  title: string
  type: string
  pointsPerQuestion: number
  questions: ExamQuestion[]
}

interface UnitExam {
  title: string
  instructions: string
  sections: ExamSection[]
}

interface Props {
  planilla: PlanillaData
  exam: UnitExam
  showAnswers?: boolean
  view?: 'planilla' | 'exam'
}

const cell: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '6px 8px',
  fontSize: '11px',
  verticalAlign: 'top',
}

const hCell: React.CSSProperties = {
  ...cell,
  background: '#1e3a5f',
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '11px',
  textAlign: 'center',
}

export default function PlanillaView({ planilla, exam, showAnswers = false, view = 'planilla' }: Props) {
  const { t } = useLanguage()
  return (
    <div id="planilla-print" style={{ background: 'white', color: '#111', fontFamily: 'Arial, sans-serif', padding: '16px', fontSize: '12px' }}>
      {view === 'planilla' ? (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{planilla.title}</h2>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
              {planilla.subject} &bull; {planilla.grade} &bull; {planilla.unitName}
            </p>
          </div>

          {/* Specification table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
            <thead>
              <tr>
                <th style={hCell}>{t('planilla.colStandard')}</th>
                <th style={{ ...hCell, width: '28%' }}>{t('planilla.colObjective')}</th>
                <th style={hCell}>{t('planilla.colBloom')}</th>
                <th style={hCell}>{t('planilla.colType')}</th>
                <th style={{ ...hCell, width: '6%' }}>No.</th>
                <th style={{ ...hCell, width: '6%' }}>Pts</th>
                <th style={{ ...hCell, width: '7%' }}>%</th>
              </tr>
            </thead>
            <tbody>
              {planilla.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                  <td style={{ ...cell, fontWeight: 'bold', color: '#1e3a5f' }}>{row.standard}</td>
                  <td style={cell}>{row.objective}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{row.bloomLevel}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{row.questionType}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{row.numItems}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{row.points}</td>
                  <td style={{ ...cell, textAlign: 'center' }}>{row.percentage}%</td>
                </tr>
              ))}
              <tr style={{ background: '#e8f0fe', fontWeight: 'bold' }}>
                <td colSpan={4} style={{ ...cell, textAlign: 'right', fontWeight: 'bold' }}>TOTAL</td>
                <td style={{ ...cell, textAlign: 'center', fontWeight: 'bold' }}>{planilla.totalItems}</td>
                <td style={{ ...cell, textAlign: 'center', fontWeight: 'bold' }}>{planilla.totalPoints}</td>
                <td style={{ ...cell, textAlign: 'center', fontWeight: 'bold' }}>100%</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <>
          {/* Exam header */}
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{exam.title}</h2>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '4px', fontStyle: 'italic' }}>{exam.instructions}</p>
          </div>

          {/* Sections */}
          {exam.sections.map((section, si) => (
            <div key={si} style={{ marginBottom: '20px' }}>
              <div style={{ background: '#1e3a5f', color: '#fff', padding: '4px 8px', fontWeight: 'bold', fontSize: '12px', marginBottom: '10px' }}>
                {section.title} ({section.pointsPerQuestion} {section.pointsPerQuestion === 1 ? 'punto' : 'puntos'} c/u)
              </div>
              {section.questions.map((q) => (
                <div key={q.number} style={{ marginBottom: '14px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '5px' }}>
                    {q.number}. ({q.points} {q.points === 1 ? 'pt' : 'pts'}) {q.question}
                  </p>

                  {section.type === 'multiple_choice' && q.options && (
                    <div style={{ paddingLeft: '20px' }}>
                      {q.options.map((opt, i) => (
                        <p key={i} style={{ fontSize: '11px', marginBottom: '3px' }}>{opt}</p>
                      ))}
                    </div>
                  )}

                  {section.type === 'true_false' && (
                    <div style={{ paddingLeft: '20px', fontSize: '11px' }}>
                      <span style={{ marginRight: '32px' }}>( ) Cierto</span>
                      <span>( ) Falso</span>
                    </div>
                  )}

                  {section.type === 'short_answer' && (
                    <div style={{ paddingLeft: '20px' }}>
                      <div style={{ borderBottom: '1px solid #999', marginBottom: '6px', width: '100%' }} />
                      <div style={{ borderBottom: '1px solid #999', marginBottom: '6px', width: '100%' }} />
                      <div style={{ borderBottom: '1px solid #999', width: '100%' }} />
                    </div>
                  )}

                  {showAnswers && (
                    <p style={{ fontSize: '10px', color: '#2563eb', paddingLeft: '20px', marginTop: '3px' }}>
                      ✓ {q.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  )
}
