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
  {
    grade: '11',
    label: 'Grado 11 — Matemáticas (Trigonometría)',
    units: [
      {
        id: 'TR.1',
        name: 'Unidad TR.1 – Los ángulos y sus medidas',
        weeks: [1, 2, 3, 4, 5],
        standards: ['ES.N.2.1', 'ES.N.2.2', 'ES.F.33.1', 'ES.F.33.2', 'ES.F.33.3', 'ES.F.33.7', 'ES.G.49.1'],
      },
      {
        id: 'TR.2',
        name: 'Unidad TR.2 – Trigonometría en el triángulo rectángulo',
        weeks: [6, 7, 8, 9, 10, 11],
        standards: ['ES.F.33.1', 'ES.F.33.4', 'ES.F.33.5', 'ES.F.33.7', 'ES.G.48.1', 'ES.G.48.2', 'ES.G.48.3'],
      },
      {
        id: 'TR.3',
        name: 'Unidad TR.3 – Gráficas de funciones trigonométricas',
        weeks: [12, 13, 14, 15, 16, 17],
        standards: ['ES.G.37.1', 'ES.F.29.3', 'ES.F.29.4', 'ES.F.29.5', 'ES.F.29.6', 'ES.F.33.6', 'ES.F.34.1', 'ES.F.34.2'],
      },
      {
        id: 'TR.4',
        name: 'Unidad TR.4 – Identidades trigonométricas',
        weeks: [21, 22, 23, 24, 25],
        standards: ['ES.G.48.2', 'ES.G.48.4', 'ES.F.35.1', 'ES.F.35.2'],
      },
      {
        id: 'TR.5',
        name: 'Unidad TR.5 – Resolver ecuaciones trigonométricas',
        weeks: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
        standards: ['ES.F.29.4', 'ES.F.34.1', 'ES.F.34.2', 'ES.F.35.1', 'ES.F.35.2', 'ES.G.48.3', 'ES.G.50.1', 'ES.G.50.2'],
      },
      {
        id: 'TR.6',
        name: 'Unidad TR.6 – Inversas de funciones trigonométricas',
        weeks: [36, 37, 38],
        standards: ['ES.G.48.3', 'ES.F.31.5', 'ES.F.34.3', 'ES.F.34.4'],
      },
    ],
  },
]
