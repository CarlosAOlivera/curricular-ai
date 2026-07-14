import { CurriculumGrade } from '@/types'

// Matemáticas — Currículo oficial DEPR 2022
// Unidad 1.1 extraída del Mapa Curricular oficial
// Dominios: N=Numeración y Operación, G=Geometría, M=Medición, A=Álgebra
// PM1=Comprende problemas, PM2=Razona, PM4=Resuelve problemas cotidianos

export const matematicasCurriculum: CurriculumGrade[] = [
  {
    grade: '1',
    label: 'Grado 1',
    units: [
      {
        id: 'MAT1.1',
        name: 'U.1 — Aprendo al jugar con los números',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.N.1.1', '1.N.1.2', '1.N.1.3', '1.N.1.4', '1.N.2.1', '1.N.2.2', 'PM1', 'PM2', 'PM4'],
      },
      {
        id: 'MAT1.2',
        name: 'U.2 — Sumamos y restamos',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.N.3.1', '1.N.3.2', '1.N.3.3', '1.N.3.4', '1.N.3.5', 'PM1', 'PM2', 'PM4'],
      },
      {
        id: 'MAT1.3',
        name: 'U.3 — Figuras y cuerpos geométricos',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.G.1.1', '1.G.1.2', '1.G.2.1', '1.G.2.2', 'PM1', 'PM2', 'PM4'],
      },
      {
        id: 'MAT1.4',
        name: 'U.4 — Medimos y estimamos',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.M.1.1', '1.M.1.2', '1.M.2.1', '1.M.3.1', 'PM1', 'PM2', 'PM4'],
      },
      {
        id: 'MAT1.5',
        name: 'U.5 — Patrones y álgebra',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.A.1.1', '1.A.1.2', '1.N.4.1', '1.N.4.2', 'PM1', 'PM2', 'PM4'],
      },
      {
        id: 'MAT1.6',
        name: 'U.6 — Datos y probabilidad',
        weeks: [1, 2, 3, 4, 5, 6],
        standards: ['1.E.1.1', '1.E.1.2', '1.E.1.3', '1.E.2.1', 'PM1', 'PM2', 'PM4'],
      },
    ],
  },
]
