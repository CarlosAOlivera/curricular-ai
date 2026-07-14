import { WeeklyPlanData, DayPlan } from '@/types'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const

const EN = {
  dayLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  weeklyPlan: 'Weekly Plan (Regular Teacher)',
  transversalNote: '*Transversal Theme of Equity and Respect among All Human Beings',
  week: 'Week',
  teacherName: "Teacher's Name",
  date: 'Date',
  grade: 'Grade',
  subject: 'Subject (Course)',
  theme: 'Theme',
  unit: 'Unit',
  transversalThemes: 'Transversal Themes',
  generatorThemes: 'Generator Themes',
  school: 'School',
  standards: 'Standards',
  indicators: 'Expectations or Indicators',
  objectives: 'Objectives',
  objectivesPrefix: 'At the end of the lesson students will be able to:',
  activitiesHeader: 'Sequence of Learning Activities',
  initial: 'Initial',
  developing: 'Developing',
  closing: 'Closing',
  integration: 'Integration with other subjects',
  initiative: 'Initiative or Innovative Project',
  evaluation: 'Evaluation',
  diagnostic: 'Diagnostic:',
  formative: 'Formative:',
  summative: 'Summative:',
  accommodations: 'Reasonable accommodations or curricular accommodations',
  specialEd: 'Special Education',
  immigrant: 'Immigrant',
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
  dayLabels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  weeklyPlan: 'Planificación Semanal (Maestro Regular)',
  transversalNote: '*Tema transversal de Equidad y Respeto entre Todos los Seres Humanos',
  week: 'Semana',
  teacherName: 'Nombre del maestro/a',
  date: 'Fecha',
  grade: 'Grado',
  subject: 'Materia (Curso)',
  theme: 'Tema',
  unit: 'Unidad',
  transversalThemes: 'Temas Transversales',
  generatorThemes: 'Temas Generadores',
  school: 'Escuela',
  standards: 'Estándares',
  indicators: 'Expectativas o Indicadores',
  objectives: 'Objetivos',
  objectivesPrefix: 'Al finalizar la clase el estudiante podrá:',
  activitiesHeader: 'Secuencia de Actividades de Aprendizaje',
  initial: 'Inicial',
  developing: 'Desarrollo',
  closing: 'Cierre',
  integration: 'Integración con otras materias',
  initiative: 'Iniciativa o Proyecto Innovador',
  evaluation: 'Evaluación',
  diagnostic: 'Diagnóstica:',
  formative: 'Formativa:',
  summative: 'Sumativa:',
  accommodations: 'Acomodos razonables o acomodos curriculares',
  specialEd: 'Educación Especial',
  immigrant: 'Inmigrante',
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

function Checkbox({ checked }: { checked: boolean }) {
  return <span>{checked ? '☒' : '☐'}</span>
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <ol style={{ paddingLeft: '1rem', margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '4px', fontSize: '11px', lineHeight: '1.4' }}>
          {item}
        </li>
      ))}
    </ol>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '4px', fontSize: '11px', lineHeight: '1.4' }}>
          {item}
        </li>
      ))}
    </ul>
  )
}

const th: React.CSSProperties = {
  background: '#4472C4',
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '8px 6px',
  border: '1px solid #2d5ba8',
  fontSize: '12px',
}

const labelTd: React.CSSProperties = {
  fontWeight: 'bold',
  fontSize: '11px',
  padding: '8px 6px',
  background: '#f0f3fa',
  border: '1px solid #ccc',
  verticalAlign: 'top',
  width: '110px',
}

const dataTd: React.CSSProperties = {
  fontSize: '11px',
  padding: '8px 6px',
  border: '1px solid #ccc',
  verticalAlign: 'top',
}

const sectionHeader: React.CSSProperties = {
  background: '#dce6f5',
  fontWeight: 'bold',
  textAlign: 'center',
  padding: '6px',
  border: '1px solid #ccc',
  fontSize: '12px',
}

export default function WeeklyPlanTable({ plan }: { plan: WeeklyPlanData }) {
  const t = plan.language === 'english' ? EN : ES
  const days: DayPlan[] = DAYS.map(d => plan.days[d])

  return (
    <div id="weekly-plan" style={{ background: 'white', color: '#111', fontFamily: 'Arial, sans-serif', padding: '12px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '2px solid #4472C4', paddingBottom: '12px', marginBottom: '12px' }}>
        <img
          src="/depr-logo.png"
          alt="Departamento de Educacion PR"
          style={{ height: '56px', width: 'auto' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
        <div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a' }}>
            {plan.subject} {plan.grade} | {t.weeklyPlan}
          </div>
          <div style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
            {t.transversalNote}
          </div>
        </div>
      </div>

      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{t.week} {plan.weekCode}</div>

      {/* Info table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '12px' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px', width: '50%' }}>
              <strong>{t.teacherName}:</strong> {plan.teacher || <em style={{ color: '#999' }}>_______________________</em>}
            </td>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
              <strong>{t.date}:</strong> {plan.weekStartDate || <em style={{ color: '#999' }}>_______________________</em>}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
              <strong>{t.grade}:</strong> {plan.grade}
            </td>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
              <strong>{t.subject}:</strong> {plan.subject}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
              <strong>{t.theme}:</strong> {plan.theme}
            </td>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px' }}>
              <strong>{t.unit} {plan.unitNumber}:</strong> {plan.unitName}
            </td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px', verticalAlign: 'top' }}>
              <strong>{t.transversalThemes}:</strong><br />
              {t.transversalList.map(theme => (
                <div key={theme} style={{ marginTop: '3px' }}>
                  <Checkbox checked={plan.transversalThemes.some(pt =>
                    pt.toLowerCase().includes(theme.toLowerCase().slice(0, 12))
                  )} /> {theme}
                </div>
              ))}
            </td>
            <td style={{ border: '1px solid #ccc', padding: '6px 8px', verticalAlign: 'top' }}>
              <strong>{t.generatorThemes}:</strong><br />
              {t.generatorList.map(theme => (
                <div key={theme} style={{ marginTop: '3px' }}>
                  <Checkbox checked={plan.generatorThemes.some(pt =>
                    pt.toLowerCase().includes(theme.toLowerCase().slice(0, 8))
                  )} /> {theme}
                </div>
              ))}
              {plan.school && (
                <div style={{ marginTop: '8px' }}>
                  <strong>{t.school}:</strong> {plan.school}
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Main plan table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
        <thead>
          <tr>
            <th style={{ ...th, width: '110px' }}></th>
            {t.dayLabels.map(d => <th key={d} style={th}>{d}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={labelTd}>{t.standards}</td>
            {days.map((d, i) => <td key={i} style={dataTd}>{d.standards}</td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.indicators}</td>
            {days.map((d, i) => <td key={i} style={{ ...dataTd, fontWeight: 'bold' }}>{d.indicators}</td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.objectives}</td>
            {days.map((d, i) => (
              <td key={i} style={dataTd}>
                <div style={{ marginBottom: '4px', fontStyle: 'italic', fontSize: '10px' }}>
                  {t.objectivesPrefix}
                </div>
                <BulletList items={d.objectives} />
              </td>
            ))}
          </tr>

          <tr>
            <td colSpan={6} style={sectionHeader}>{t.activitiesHeader}</td>
          </tr>

          <tr>
            <td style={labelTd}>{t.initial}</td>
            {days.map((d, i) => <td key={i} style={dataTd}><NumberedList items={d.initial} /></td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.developing}</td>
            {days.map((d, i) => <td key={i} style={dataTd}><NumberedList items={d.developing} /></td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.closing}</td>
            {days.map((d, i) => <td key={i} style={dataTd}><NumberedList items={d.closing} /></td>)}
          </tr>

          <tr>
            <td style={labelTd}>{t.integration}</td>
            {days.map((d, i) => <td key={i} style={dataTd}>{d.integration}</td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.initiative}</td>
            {days.map((_, i) => <td key={i} style={dataTd}></td>)}
          </tr>

          <tr>
            <td style={labelTd}>{t.evaluation}</td>
            {days.map((d, i) => (
              <td key={i} style={dataTd}>
                <div><Checkbox checked={d.evaluation.includes('diagnostic')} /> {t.diagnostic}</div>
                <div><Checkbox checked={d.evaluation.includes('formative')} /> {t.formative}</div>
                <div><Checkbox checked={d.evaluation.includes('summative')} /> {t.summative}</div>
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelTd}>{t.accommodations}</td>
            {days.map((d, i) => (
              <td key={i} style={dataTd}>
                <div><Checkbox checked={d.accommodations.includes('special_ed')} /> {t.specialEd}</div>
                <div><Checkbox checked={d.accommodations.includes('immigrant')} /> {t.immigrant}</div>
                <div><Checkbox checked={d.accommodations.includes('504')} /> 504</div>
                <div><Checkbox checked={d.accommodations.includes('gifted')} /> Gifted / {t.specialEd === 'Educación Especial' ? 'Dotado' : 'Gifted'}</div>
              </td>
            ))}
          </tr>

          <tr>
            <td style={labelTd}>{t.differentiation}</td>
            {days.map((d, i) => <td key={i} style={dataTd}>{d.differentiation}</td>)}
          </tr>
          <tr>
            <td style={labelTd}>{t.materials}</td>
            {days.map((d, i) => <td key={i} style={dataTd}><NumberedList items={d.materials} /></td>)}
          </tr>

          <tr>
            <td style={{ ...labelTd, fontStyle: 'normal' }}>
              {t.reflection}<br />
              <em style={{ fontWeight: 'normal', fontSize: '10px' }}>{t.reflectionSub}</em>
            </td>
            {days.map((_, i) => <td key={i} style={{ ...dataTd, minHeight: '60px' }}></td>)}
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666', textAlign: 'right', fontStyle: 'italic' }}>
        {t.transversalNote}
      </div>
    </div>
  )
}
