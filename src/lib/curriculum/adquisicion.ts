import { CurriculumGrade } from '@/types'

// Adquisición de la Lengua (Grados 1-3) — Currículo integrado DEPR 2022
// Combina Español + Estudios Sociales (materia fusionada por el DE para grados 1-3)
// Estándares reales extraídos del Mapa Curricular oficial, Unidad 1.1

export const adquisicionCurriculum: CurriculumGrade[] = [
  {
    grade: '1',
    label: 'Grado 1',
    units: [
      {
        id: 'ADQ1.1',
        name: 'U.1 — Mis amigos africanos',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          // Español — Comprensión auditiva y expresión oral
          '1.AO.1.1', '1.AO.8.1',
          // Español — Lectura literaria e informativa
          '1.LLI.7.1', '1.LLI.8.1', '1.LLI.9.1',
          // Español — Dominio de la lengua
          '1.L.1.1b', '1.L.2.1a', '1.L.2.1b', '1.L.2.1m', '1.L.5.1a',
          // Español — Escritura
          '1.E.1.1b', '1.E.5.1', '1.E.9.1',
          // Estudios Sociales — Cambio y continuidad
          '1.CC.1.1', '1.CC.2.1', '1.CC.5.1',
          // Estudios Sociales — Personas, lugares y ambiente
          '1.PLA.1.1', '1.PLA.3.1', '1.PLA.10.1',
          // Estudios Sociales — Desarrollo personal
          '1.DP.4.1', '1.DP.9.1', '1.DP.10.1',
          // Estudios Sociales — Identidad cultural
          '1.IC.7.1', '1.IC.10.1',
          // Estudios Sociales — Conciencia cívica y democrática
          '1.CCD.1.1', '1.CCD.6.1',
          // Estudios Sociales — Conciencia global
          '1.CG.1.2', '1.CG.4.1',
        ],
      },
      {
        id: 'ADQ1.2',
        name: 'U.2 — Asia, el más grande y poblado',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.AO.1.1', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.8.1', '1.LLI.9.1',
          '1.L.1.1b', '1.L.2.1a', '1.L.2.1b', '1.L.2.1m', '1.L.5.1a',
          '1.E.1.1b', '1.E.5.1', '1.E.9.1',
          '1.CC.1.1', '1.CC.2.1', '1.CC.7.1',
          '1.PLA.1.1', '1.PLA.2.1', '1.PLA.4.1',
          '1.DP.2.1', '1.DP.7.1', '1.DP.10.1',
          '1.IC.7.1', '1.IC.8.2',
          '1.CCD.4.1', '1.CG.3.1',
        ],
      },
      {
        id: 'ADQ1.3',
        name: 'U.3 — Europa, viejo continente',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.AO.1.1', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.8.1', '1.LLI.9.1',
          '1.L.1.1b', '1.L.2.1a', '1.L.2.1h', '1.L.2.1m', '1.L.6.1a',
          '1.E.3.1b', '1.E.4.1a', '1.E.9.1',
          '1.CC.1.2', '1.CC.2.3', '1.CC.8.1',
          '1.PLA.1.1', '1.PLA.3.3', '1.PLA.6.1',
          '1.DP.1.2', '1.DP.4.1', '1.DP.9.2',
          '1.IC.6.1', '1.IC.10.1',
          '1.PDC.1.1', '1.CG.3.1',
        ],
      },
      {
        id: 'ADQ1.4',
        name: 'U.4 — Australia, un continente, una isla',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.AO.1.1', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.7.1a', '1.LLI.9.1',
          '1.L.1.1c', '1.L.2.1a', '1.L.2.1v', '1.L.2.1w', '1.L.5.1a',
          '1.E.1.1b', '1.E.5.1', '1.E.9.1',
          '1.CC.1.1', '1.CC.5.1', '1.CC.7.1',
          '1.PLA.1.1', '1.PLA.7.1', '1.PLA.10.2',
          '1.DP.2.2', '1.DP.6.1', '1.DP.10.2',
          '1.IC.7.3', '1.IC.10.1',
          '1.CCD.6.1', '1.SCT.1.1',
        ],
      },
      {
        id: 'ADQ1.5',
        name: 'U.5 — Antártica, el continente más frío',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.AO.1.1', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.8.1', '1.LLI.9.1',
          '1.L.1.1b', '1.L.2.1a', '1.L.2.1b', '1.L.2.1j', '1.L.5.1a',
          '1.E.1.1b', '1.E.5.1', '1.E.9.1',
          '1.CC.2.1', '1.CC.5.1', '1.CC.8.1',
          '1.PLA.3.1', '1.PLA.4.1', '1.PLA.10.1',
          '1.DP.4.2', '1.DP.8.2', '1.DP.9.1',
          '1.IC.7.1', '1.IC.7.4',
          '1.CCD.1.1', '1.SCT.1.1',
        ],
      },
      {
        id: 'ADQ1.6',
        name: 'U.6 — Sudamérica, tierra de grandes regiones culturales',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.AO.1.1', '1.AO.1.1a', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.7.1a', '1.LLI.8.1', '1.LLI.9.1',
          '1.L.1.1b', '1.L.1.1c', '1.L.2.1a', '1.L.2.1m', '1.L.6.1a',
          '1.E.3.1b', '1.E.4.1a', '1.E.9.1',
          '1.CC.1.1', '1.CC.2.1', '1.CC.2.3',
          '1.PLA.1.1', '1.PLA.2.1', '1.PLA.6.1',
          '1.DP.1.3', '1.DP.4.1', '1.DP.10.1',
          '1.IC.7.2', '1.IC.10.1',
          '1.CG.1.2', '1.CG.4.1',
        ],
      },
      {
        id: 'ADQ1.7',
        name: 'U.7 — América del Norte',
        weeks: [1, 2, 3, 4],
        standards: [
          '1.AO.1.1', '1.AO.8.1',
          '1.LLI.7.1', '1.LLI.8.1', '1.LLI.9.1',
          '1.L.2.1a', '1.L.2.1b', '1.L.2.1m', '1.L.5.1a',
          '1.E.1.1b', '1.E.5.1', '1.E.9.1',
          '1.CC.1.1', '1.CC.5.1', '1.CC.7.1',
          '1.PLA.1.1', '1.PLA.3.1', '1.PLA.10.1',
          '1.DP.4.1', '1.DP.9.1', '1.DP.10.1',
          '1.IC.7.1', '1.CCD.6.1', '1.CG.1.2',
        ],
      },
    ],
  },
  {
    grade: '2',
    label: 'Grado 2',
    units: [
      {
        id: 'ADQ2.1',
        name: 'U.1 — Brasil, Sensacional',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.8.1', '2.LLI.9.1',
          '2.L.1.1', '2.L.2.1', '2.L.5.1',
          '2.E.1.1', '2.E.5.1', '2.E.9.1',
          '2.CC.1.1', '2.CC.2.1', '2.PLA.1.1',
          '2.DP.4.1', '2.IC.7.1', '2.CG.1.2',
        ],
      },
      {
        id: 'ADQ2.2',
        name: 'U.2 — Colombia es realismo mágico',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.8.1', '2.LLI.9.1',
          '2.L.1.1', '2.L.2.1', '2.L.5.1',
          '2.E.1.1', '2.E.5.1', '2.E.9.1',
          '2.CC.2.1', '2.CC.5.1', '2.PLA.2.1',
          '2.DP.9.1', '2.IC.10.1', '2.CG.3.1',
        ],
      },
      {
        id: 'ADQ2.3',
        name: 'U.3 — Las Antillas lo tienen todo, experiméntala',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.8.1', '2.LLI.9.1',
          '2.L.1.1', '2.L.2.1', '2.L.6.1',
          '2.E.3.1', '2.E.4.1', '2.E.9.1',
          '2.CC.1.1', '2.CC.7.1', '2.PLA.1.1',
          '2.IC.7.1', '2.CCD.1.1', '2.CG.4.1',
        ],
      },
      {
        id: 'ADQ2.4',
        name: 'U.4 — Las sorpresas de Panamá',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.8.1', '2.LLI.9.1',
          '2.L.2.1', '2.L.5.1', '2.L.6.1',
          '2.E.1.1', '2.E.5.1', '2.E.9.1',
          '2.CC.2.1', '2.PLA.3.1', '2.PLA.10.1',
          '2.DP.4.1', '2.IC.6.1', '2.PDC.1.1',
        ],
      },
      {
        id: 'ADQ2.5',
        name: 'U.5 — México, Vívelo para creerlo',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.9.1',
          '2.L.1.1', '2.L.2.1', '2.L.5.1',
          '2.E.1.1', '2.E.5.1', '2.E.9.1',
          '2.CC.5.1', '2.CC.8.1', '2.PLA.1.1',
          '2.IC.7.1', '2.CCD.6.1', '2.SCT.1.1',
        ],
      },
      {
        id: 'ADQ2.6',
        name: 'U.6 — Estados Unidos — Todo a tu alcance',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.8.1', '2.LLI.9.1',
          '2.L.1.1', '2.L.2.1', '2.L.5.1',
          '2.E.1.1', '2.E.9.1',
          '2.CC.1.1', '2.CC.2.1', '2.PLA.1.1',
          '2.DP.10.1', '2.IC.10.1', '2.CG.1.2',
        ],
      },
      {
        id: 'ADQ2.7',
        name: 'U.7 — Canadá, sigue explorando',
        weeks: [1, 2, 3, 4],
        standards: [
          '2.AO.1.1', '2.AO.8.1',
          '2.LLI.7.1', '2.LLI.9.1',
          '2.L.2.1', '2.L.5.1',
          '2.E.1.1', '2.E.9.1',
          '2.CC.1.1', '2.PLA.1.1',
          '2.IC.7.1', '2.CG.4.1',
        ],
      },
    ],
  },
  {
    grade: '3',
    label: 'Grado 3',
    units: [
      {
        id: 'ADQ3.1',
        name: 'U.1 — Egipto, donde todo comienza',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.8.1', '3.LLI.9.1',
          '3.L.1.1', '3.L.2.1', '3.L.5.1',
          '3.E.1.1', '3.E.5.1', '3.E.9.1',
          '3.CC.1.1', '3.CC.2.1', '3.PLA.1.1',
          '3.DP.4.1', '3.IC.7.1', '3.CG.1.2',
        ],
      },
      {
        id: 'ADQ3.2',
        name: 'U.2 — Madagascar — una isla auténtica; un mundo aparte',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.8.1', '3.LLI.9.1',
          '3.L.1.1', '3.L.2.1', '3.L.5.1',
          '3.E.1.1', '3.E.5.1', '3.E.9.1',
          '3.CC.5.1', '3.PLA.3.1', '3.PLA.7.1',
          '3.IC.7.1', '3.CCD.1.1', '3.CG.3.1',
        ],
      },
      {
        id: 'ADQ3.3',
        name: 'U.3 — España al detalle',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.9.1',
          '3.L.2.1', '3.L.5.1', '3.L.6.1',
          '3.E.3.1', '3.E.4.1', '3.E.9.1',
          '3.CC.1.1', '3.CC.8.1', '3.PLA.1.1',
          '3.IC.6.1', '3.CCD.4.1', '3.CG.4.1',
        ],
      },
      {
        id: 'ADQ3.4',
        name: 'U.4 — Inglaterra, hogar de momentos increíbles',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.8.1', '3.LLI.9.1',
          '3.L.1.1', '3.L.2.1', '3.L.5.1',
          '3.E.1.1', '3.E.5.1', '3.E.9.1',
          '3.CC.2.1', '3.PLA.2.1', '3.PLA.4.1',
          '3.DP.9.1', '3.IC.10.1', '3.PDC.1.1',
        ],
      },
      {
        id: 'ADQ3.5',
        name: 'U.5 — China como nunca antes',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.9.1',
          '3.L.1.1', '3.L.2.1', '3.L.5.1',
          '3.E.1.1', '3.E.9.1',
          '3.CC.1.1', '3.CC.5.1', '3.PLA.1.1',
          '3.DP.4.1', '3.IC.7.1', '3.SCT.1.1',
        ],
      },
      {
        id: 'ADQ3.6',
        name: 'U.6 — India Increíble',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.8.1', '3.LLI.9.1',
          '3.L.2.1', '3.L.5.1', '3.L.6.1',
          '3.E.3.1', '3.E.5.1', '3.E.9.1',
          '3.CC.7.1', '3.PLA.1.1', '3.PLA.10.1',
          '3.IC.7.1', '3.CCD.6.1', '3.CG.1.2',
        ],
      },
      {
        id: 'ADQ3.7',
        name: 'U.7 — Revela tu propia Rusia',
        weeks: [1, 2, 3, 4],
        standards: [
          '3.AO.1.1', '3.AO.8.1',
          '3.LLI.7.1', '3.LLI.9.1',
          '3.L.1.1', '3.L.2.1',
          '3.E.1.1', '3.E.9.1',
          '3.CC.1.1', '3.PLA.1.1',
          '3.IC.7.1', '3.CG.4.1',
        ],
      },
    ],
  },
]
