'use client'

interface Question {
  number: number
  type: string
  question: string
  options?: string[]
  answer: string
}

interface Assessment {
  title: string
  instructions: string
  questions: Question[]
}

export default function AssessmentView({ assessment, showAnswers = false }: { assessment: Assessment; showAnswers?: boolean }) {
  return (
    <div id="assessment-print" style={{ background: 'white', color: '#111', fontFamily: 'Arial, sans-serif', padding: '16px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>{assessment.title}</h2>
      <p style={{ fontSize: '12px', color: '#555', marginBottom: '16px', fontStyle: 'italic' }}>{assessment.instructions}</p>

      {assessment.questions.map((q) => (
        <div key={q.number} style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>
            {q.number}. {q.question}
          </p>

          {q.type === 'multiple_choice' && q.options && (
            <div style={{ paddingLeft: '16px' }}>
              {q.options.map((opt, i) => (
                <p key={i} style={{ fontSize: '11px', marginBottom: '3px' }}>{opt}</p>
              ))}
            </div>
          )}

          {q.type === 'true_false' && (
            <div style={{ paddingLeft: '16px', fontSize: '11px' }}>
              <span style={{ marginRight: '24px' }}>( ) Cierto</span>
              <span>( ) Falso</span>
            </div>
          )}

          {q.type === 'short_answer' && (
            <div style={{ paddingLeft: '16px' }}>
              <div style={{ borderBottom: '1px solid #999', marginBottom: '4px', width: '100%' }} />
              <div style={{ borderBottom: '1px solid #999', width: '100%' }} />
            </div>
          )}

          {showAnswers && (
            <p style={{ fontSize: '10px', color: '#2563eb', paddingLeft: '16px', marginTop: '4px' }}>
              Respuesta: {q.answer}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
