import { CurriculumGrade } from '@/types'

export const cienciasCurriculum: CurriculumGrade[] = [
  {
    grade: '1',
    label: 'Ciencias — Grado 1',
    units: [
      {
        id: 'CIE1.1',
        name: 'U.1 — Prácticas de ciencias e ingeniería',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.IT1.1',
          '1.IT1.2',
          '1.IT1.3',
          '1.IT1.4',
          '1.IT1.5',
          '1.IT1.6',
          '1.IT1.7',
          '1.IT1.8',
        ],
      },
      {
        id: 'CIE1.2',
        name: 'U.2 — La materia y sus propiedades',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.PS1.1',
          '1.PS1.2',
          '1.PS1.3',
        ],
      },
      {
        id: 'CIE1.3',
        name: 'U.3 — La energía: luz, calor y sonido',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.PS3.1',
          '1.PS4.1',
          '1.PS4.2',
        ],
      },
      {
        id: 'CIE1.4',
        name: 'U.4 — Los seres vivos y su ambiente',
        weeks: [1, 2, 3, 4, 5],
        standards: [
          '1.LS1.1',
          '1.LS1.2',
          '1.LS3.1',
        ],
      },
      {
        id: 'CIE1.5',
        name: 'U.5 — La Tierra: patrones del cielo',
        weeks: [1, 2, 3, 4],
        standards: [
          '1.ESS1.1',
          '1.ESS1.2',
          '1.ESS2.1',
        ],
      },
    ],
  },
]
