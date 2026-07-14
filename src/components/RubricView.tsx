'use client'

import { useLanguage } from '@/contexts/LanguageContext'

interface RubricCriterion {
  name: string
  excellent: string
  good: string
  developing: string
  beginning: string
}

interface Rubric {
  title: string
  criteria: RubricCriterion[]
}

const cellStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  padding: '8px',
  fontSize: '11px',
  verticalAlign: 'top',
}

const headerStyle: React.CSSProperties = {
  ...cellStyle,
  background: '#4472C4',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
}

const criterionStyle: React.CSSProperties = {
  ...cellStyle,
  background: '#f0f3fa',
  fontWeight: 'bold',
}

export default function RubricView({ rubric }: { rubric: Rubric }) {
  const { t } = useLanguage()
  return (
    <div id="rubric-print" style={{ background: 'white', color: '#111', fontFamily: 'Arial, sans-serif', padding: '16px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1a1a1a' }}>
        {rubric.title}
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...headerStyle, width: '18%' }}>{t('rubrica.colCriterion')}</th>
            <th style={headerStyle}>{t('rubrica.colExcellent')}</th>
            <th style={headerStyle}>{t('rubrica.colGood')}</th>
            <th style={headerStyle}>{t('rubrica.colDeveloping')}</th>
            <th style={headerStyle}>{t('rubrica.colBeginning')}</th>
          </tr>
        </thead>
        <tbody>
          {rubric.criteria.map((c, i) => (
            <tr key={i}>
              <td style={criterionStyle}>{c.name}</td>
              <td style={cellStyle}>{c.excellent}</td>
              <td style={cellStyle}>{c.good}</td>
              <td style={cellStyle}>{c.developing}</td>
              <td style={cellStyle}>{c.beginning}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
