import { CurriculumGrade } from '@/types'

// Español 1-12 — Currículo oficial DEPR 2022
// Unidades extraídas directamente del SharePoint del Departamento de Educación de Puerto Rico
// Estándares: dominios del currículo revisado 2022 (CO=Comunicación Oral, L=Lectura, W=Escritura, LEN=Lenguaje, LI=Literatura)

export const spanishCurriculum: CurriculumGrade[] = [
  {
    grade: '1',
    label: 'Grado 1',
    units: [
      { id: 'ESP1.1', name: 'U.1 — Mis amigos africanos',                               weeks: [1,2,3,4,5], standards: ['1.CO.1.1','1.CO.2.1','1.L.1.1','1.L.2.1','1.W.1.1','1.LEN.1.1'] },
      { id: 'ESP1.2', name: 'U.2 — Asia, el más grande y poblado',                      weeks: [1,2,3,4,5], standards: ['1.CO.1.1','1.L.1.1','1.L.3.1','1.W.2.1','1.LEN.1.1'] },
      { id: 'ESP1.3', name: 'U.3 — Europa, viejo continente',                            weeks: [1,2,3,4,5], standards: ['1.CO.2.1','1.L.1.1','1.L.2.1','1.W.1.1','1.LEN.2.1'] },
      { id: 'ESP1.4', name: 'U.4 — Australia, un continente, una isla',                  weeks: [1,2,3,4,5], standards: ['1.CO.1.1','1.L.2.1','1.L.3.1','1.W.2.1','1.LEN.1.1'] },
      { id: 'ESP1.5', name: 'U.5 — Antártica, el continente más frío',                   weeks: [1,2,3,4,5], standards: ['1.CO.2.1','1.L.1.1','1.W.1.1','1.W.3.1','1.LEN.2.1'] },
      { id: 'ESP1.6', name: 'U.6 — Sudamérica, tierra de grandes regiones culturales',   weeks: [1,2,3,4,5], standards: ['1.CO.1.1','1.L.2.1','1.W.2.1','1.LEN.1.1','1.LEN.2.1'] },
      { id: 'ESP1.7', name: 'U.7 — América del Norte',                                   weeks: [1,2,3,4], standards: ['1.CO.2.1','1.L.1.1','1.L.3.1','1.W.1.1','1.LEN.1.1'] },
    ],
  },
  {
    grade: '2',
    label: 'Grado 2',
    units: [
      { id: 'ESP2.1', name: 'U.1 — Brasil, Sensacional',                                 weeks: [1,2,3,4,5], standards: ['2.CO.1.1','2.CO.2.1','2.L.1.1','2.L.2.1','2.W.1.1','2.LEN.1.1'] },
      { id: 'ESP2.2', name: 'U.2 — Colombia es realismo mágico',                         weeks: [1,2,3,4,5], standards: ['2.CO.1.1','2.L.1.1','2.L.3.1','2.W.2.1','2.LEN.1.1'] },
      { id: 'ESP2.3', name: 'U.3 — Las Antillas lo tienen todo, experiméntala',          weeks: [1,2,3,4,5], standards: ['2.CO.2.1','2.L.2.1','2.L.3.1','2.W.1.1','2.LEN.2.1'] },
      { id: 'ESP2.4', name: 'U.4 — Las sorpresas de Panamá',                             weeks: [1,2,3,4,5], standards: ['2.CO.1.1','2.L.1.1','2.W.2.1','2.W.3.1','2.LEN.1.1'] },
      { id: 'ESP2.5', name: 'U.5 — México, Vívelo para creerlo',                         weeks: [1,2,3,4,5], standards: ['2.CO.2.1','2.L.2.1','2.W.1.1','2.LEN.1.1','2.LEN.2.1'] },
      { id: 'ESP2.6', name: 'U.6 — Estados Unidos — Todo a tu alcance',                  weeks: [1,2,3,4,5], standards: ['2.CO.1.1','2.L.1.1','2.L.3.1','2.W.2.1','2.LEN.1.1'] },
      { id: 'ESP2.7', name: 'U.7 — Canadá, sigue explorando',                            weeks: [1,2,3,4], standards: ['2.CO.2.1','2.L.2.1','2.W.1.1','2.LEN.2.1'] },
    ],
  },
  {
    grade: '3',
    label: 'Grado 3',
    units: [
      { id: 'ESP3.1', name: 'U.1 — Egipto, donde todo comienza',                         weeks: [1,2,3,4,5], standards: ['3.CO.1.1','3.CO.2.1','3.L.1.1','3.L.2.1','3.W.1.1','3.LEN.1.1'] },
      { id: 'ESP3.2', name: 'U.2 — Madagascar — una isla auténtica; un mundo aparte',    weeks: [1,2,3,4,5], standards: ['3.CO.1.1','3.L.1.1','3.L.3.1','3.W.2.1','3.LEN.1.1'] },
      { id: 'ESP3.3', name: 'U.3 — España al detalle',                                   weeks: [1,2,3,4,5], standards: ['3.CO.2.1','3.L.2.1','3.L.3.1','3.W.1.1','3.LEN.2.1'] },
      { id: 'ESP3.4', name: 'U.4 — Inglaterra, hogar de momentos increíbles',            weeks: [1,2,3,4,5], standards: ['3.CO.1.1','3.L.1.1','3.W.2.1','3.W.3.1','3.LEN.1.1'] },
      { id: 'ESP3.5', name: 'U.5 — China como nunca antes',                              weeks: [1,2,3,4,5], standards: ['3.CO.2.1','3.L.2.1','3.W.1.1','3.LEN.1.1','3.LEN.2.1'] },
      { id: 'ESP3.6', name: 'U.6 — India Increíble',                                     weeks: [1,2,3,4,5], standards: ['3.CO.1.1','3.L.1.1','3.L.3.1','3.W.2.1','3.LEN.1.1'] },
      { id: 'ESP3.7', name: 'U.7 — Revela tu propia Rusia',                              weeks: [1,2,3,4], standards: ['3.CO.2.1','3.L.2.1','3.W.1.1','3.LEN.2.1'] },
    ],
  },
  {
    grade: '4',
    label: 'Grado 4',
    units: [
      { id: 'ESP4.1', name: 'U.1 — El maravilloso mundo de la lectura',                  weeks: [1,2,3,4,5,6], standards: ['4.CO.1.1','4.CO.2.1','4.L.1.1','4.L.2.1','4.W.1.1','4.LEN.1.1'] },
      { id: 'ESP4.2', name: 'U.2 — La descripción y la narración — dos formas de creación', weeks: [1,2,3,4,5,6], standards: ['4.CO.1.1','4.L.2.1','4.L.3.1','4.W.2.1','4.LEN.2.1'] },
      { id: 'ESP4.3', name: 'U.3 — Leo y descubro mi lenguaje',                          weeks: [1,2,3,4,5,6], standards: ['4.CO.2.1','4.L.1.1','4.L.2.1','4.W.3.1','4.LEN.1.1'] },
      { id: 'ESP4.4', name: 'U.4 — Se expresan las ideas para darles forma a los pensamientos', weeks: [1,2,3,4,5,6], standards: ['4.CO.1.1','4.L.3.1','4.W.1.1','4.W.2.1','4.LEN.2.1'] },
      { id: 'ESP4.5', name: 'U.5 — La investigación — una herramienta de redacción',     weeks: [1,2,3,4,5,6], standards: ['4.CO.2.1','4.L.1.1','4.W.2.1','4.W.3.1','4.LEN.1.1'] },
      { id: 'ESP4.6', name: 'U.6 — ¡Cuánto aprendo con la lectura!',                    weeks: [1,2,3,4,5,6], standards: ['4.CO.1.1','4.L.2.1','4.L.3.1','4.W.1.1','4.LEN.2.1'] },
    ],
  },
  {
    grade: '5',
    label: 'Grado 5',
    units: [
      { id: 'ESP5.1', name: 'U.1 — De la mano con los diferentes textos',                weeks: [1,2,3,4,5,6], standards: ['5.CO.1.1','5.CO.2.1','5.L.1.1','5.L.2.1','5.W.1.1','5.LEN.1.1'] },
      { id: 'ESP5.2', name: 'U.2 — La escritura es un proceso unido a la lectura',       weeks: [1,2,3,4,5,6], standards: ['5.CO.1.1','5.L.2.1','5.L.3.1','5.W.2.1','5.LEN.2.1'] },
      { id: 'ESP5.3', name: 'U.3 — El arte de la comunicación oral y escritura',         weeks: [1,2,3,4,5,6], standards: ['5.CO.2.1','5.L.1.1','5.W.1.1','5.W.3.1','5.LEN.1.1'] },
      { id: 'ESP5.4', name: 'U.4 — Descubro e interpreto para expresar lo que leo',      weeks: [1,2,3,4,5,6], standards: ['5.CO.1.1','5.L.2.1','5.L.3.1','5.W.2.1','5.LEN.2.1'] },
      { id: 'ESP5.5', name: 'U.5 — Una historia es un gran recurso para comunicarme',    weeks: [1,2,3,4,5,6], standards: ['5.CO.2.1','5.L.1.1','5.L.2.1','5.W.1.1','5.LEN.1.1'] },
      { id: 'ESP5.6', name: 'U.6 — La organización de ideas hacia la investigación',     weeks: [1,2,3,4,5,6], standards: ['5.CO.1.1','5.L.3.1','5.W.2.1','5.W.3.1','5.LEN.2.1'] },
    ],
  },
  {
    grade: '6',
    label: 'Grado 6',
    units: [
      { id: 'ESP6.1', name: 'U.1 — Se descubre el mundo por medio de la lectura',        weeks: [1,2,3,4,5,6], standards: ['6.CO.1.1','6.CO.2.1','6.L.1.1','6.L.2.1','6.W.1.1','6.LEN.1.1'] },
      { id: 'ESP6.2', name: 'U.2 — Expreso mi creatividad al escribir',                  weeks: [1,2,3,4,5,6], standards: ['6.CO.1.1','6.L.2.1','6.L.3.1','6.W.2.1','6.LEN.2.1'] },
      { id: 'ESP6.3', name: 'U.3 — La redacción como técnica de expresión',              weeks: [1,2,3,4,5,6], standards: ['6.CO.2.1','6.L.1.1','6.W.1.1','6.W.3.1','6.LEN.1.1'] },
      { id: 'ESP6.4', name: 'U.4 — Los textos — una mirada hacia el ser',               weeks: [1,2,3,4,5,6], standards: ['6.CO.1.1','6.L.2.1','6.L.3.1','6.W.2.1','6.LEN.2.1'] },
      { id: 'ESP6.5', name: 'U.5 — La aventura de leer hacia una escritura comprensiva', weeks: [1,2,3,4,5,6], standards: ['6.CO.2.1','6.L.1.1','6.L.2.1','6.W.1.1','6.LEN.1.1'] },
      { id: 'ESP6.6', name: 'U.6 — La introducción a la investigación',                  weeks: [1,2,3,4,5,6], standards: ['6.CO.1.1','6.L.3.1','6.W.2.1','6.W.3.1','6.LEN.2.1'] },
    ],
  },
  {
    grade: '7',
    label: 'Grado 7',
    units: [
      { id: 'ESP7.1', name: 'U.1 — Un personaje para una historia',                      weeks: [1,2,3,4,5,6], standards: ['7.CO.1.1','7.CO.2.1','7.L.1.1','7.LI.1.1','7.W.1.1','7.LEN.1.1'] },
      { id: 'ESP7.2', name: 'U.2 — Llevo la poesía en mi corazón',                      weeks: [1,2,3,4,5,6], standards: ['7.CO.1.1','7.L.2.1','7.LI.1.1','7.W.2.1','7.LEN.2.1'] },
      { id: 'ESP7.3', name: 'U.3 — De la oración al párrafo',                           weeks: [1,2,3,4,5,6], standards: ['7.CO.2.1','7.L.1.1','7.W.1.1','7.W.3.1','7.LEN.1.1'] },
      { id: 'ESP7.4', name: 'U.4 — Un investigador en acción',                           weeks: [1,2,3,4,5,6], standards: ['7.CO.1.1','7.L.3.1','7.LI.2.1','7.W.2.1','7.LEN.2.1'] },
      { id: 'ESP7.5', name: 'U.5 — El mundo en mis manos',                              weeks: [1,2,3,4,5,6], standards: ['7.CO.2.1','7.L.1.1','7.L.2.1','7.W.1.1','7.LEN.1.1'] },
      { id: 'ESP7.6', name: 'U.6 — ¡Sube el telón!',                                   weeks: [1,2,3,4,5,6], standards: ['7.CO.1.1','7.LI.1.1','7.LI.2.1','7.W.3.1','7.LEN.2.1'] },
    ],
  },
  {
    grade: '8',
    label: 'Grado 8',
    units: [
      { id: 'ESP8.1', name: 'U.1 — Nuestro contexto cultural',                           weeks: [1,2,3,4,5,6], standards: ['8.CO.1.1','8.CO.2.1','8.L.1.1','8.LI.1.1','8.W.1.1','8.LEN.1.1'] },
      { id: 'ESP8.2', name: 'U.2 — Leo, describo y valoro',                              weeks: [1,2,3,4,5,6], standards: ['8.CO.1.1','8.L.2.1','8.LI.1.1','8.W.2.1','8.LEN.2.1'] },
      { id: 'ESP8.3', name: 'U.3 — El texto vivo — transformaciones y posibilidades',   weeks: [1,2,3,4,5,6], standards: ['8.CO.2.1','8.L.1.1','8.LI.2.1','8.W.1.1','8.LEN.1.1'] },
      { id: 'ESP8.4', name: 'U.4 — El recurso del humor y la comedia en el discurso',   weeks: [1,2,3,4,5,6], standards: ['8.CO.1.1','8.L.3.1','8.LI.1.1','8.W.2.1','8.LEN.2.1'] },
      { id: 'ESP8.5', name: 'U.5 — La literatura rompe estereotipos',                    weeks: [1,2,3,4,5,6], standards: ['8.CO.2.1','8.L.1.1','8.LI.2.1','8.W.1.1','8.LEN.1.1'] },
      { id: 'ESP8.6', name: 'U.6 — El poder de la persuasión y la argumentación',       weeks: [1,2,3,4,5,6], standards: ['8.CO.1.1','8.L.2.1','8.L.3.1','8.W.3.1','8.LEN.2.1'] },
    ],
  },
  {
    grade: '9',
    label: 'Grado 9',
    units: [
      { id: 'ESP9.1', name: 'U.1 — Mi lengua — Espejo de identidad cultural',           weeks: [1,2,3,4,5,6], standards: ['9.CO.1.1','9.CO.2.1','9.L.1.1','9.LI.1.1','9.W.1.1','9.LEN.1.1'] },
      { id: 'ESP9.2', name: 'U.2 — Expresión de ideas',                                  weeks: [1,2,3,4,5,6], standards: ['9.CO.1.1','9.L.2.1','9.LI.1.1','9.W.2.1','9.LEN.2.1'] },
      { id: 'ESP9.3', name: 'U.3 — Detrás de las palabras',                              weeks: [1,2,3,4,5,6], standards: ['9.CO.2.1','9.L.1.1','9.LI.2.1','9.W.1.1','9.LEN.1.1'] },
      { id: 'ESP9.4', name: 'U.4 — Impacto con mis palabras',                            weeks: [1,2,3,4,5,6], standards: ['9.CO.1.1','9.L.3.1','9.LI.1.1','9.W.2.1','9.LEN.2.1'] },
      { id: 'ESP9.5', name: 'U.5 — Esplendor literario',                                 weeks: [1,2,3,4,5,6], standards: ['9.CO.2.1','9.L.1.1','9.LI.2.1','9.LI.3.1','9.W.1.1'] },
      { id: 'ESP9.6', name: 'U.6 — Enfoque teatral',                                     weeks: [1,2,3,4,5,6], standards: ['9.CO.1.1','9.CO.2.1','9.LI.1.1','9.LI.2.1','9.W.3.1'] },
    ],
  },
  {
    grade: '10',
    label: 'Grado 10',
    units: [
      { id: 'ESP10.1', name: 'U.1 — Héroes de ayer, hoy y siempre — mitos y leyendas', weeks: [1,2,3,4,5,6], standards: ['10.CO.1.1','10.CO.2.1','10.L.1.1','10.LI.1.1','10.W.1.1','10.LEN.1.1'] },
      { id: 'ESP10.2', name: 'U.2 — Leemos para soñar, escribimos para sentir y expresar', weeks: [1,2,3,4,5,6], standards: ['10.CO.1.1','10.L.2.1','10.LI.1.1','10.W.2.1','10.LEN.2.1'] },
      { id: 'ESP10.3', name: 'U.3 — Artesanos de la palabra — taller de lectores y escritores', weeks: [1,2,3,4,5,6], standards: ['10.CO.2.1','10.L.1.1','10.LI.2.1','10.W.1.1','10.LEN.1.1'] },
      { id: 'ESP10.4', name: 'U.4 — La palabra posee música y color',                   weeks: [1,2,3,4,5,6], standards: ['10.CO.1.1','10.L.3.1','10.LI.1.1','10.W.2.1','10.LEN.2.1'] },
      { id: 'ESP10.5', name: 'U.5 — Hablo y escribo — nuestras opiniones cuentan',     weeks: [1,2,3,4,5,6], standards: ['10.CO.2.1','10.L.1.1','10.LI.2.1','10.W.3.1','10.LEN.1.1'] },
      { id: 'ESP10.6', name: 'U.6 — Teatro — Luces, cámara y... ¡Arriba el telón!',   weeks: [1,2,3,4,5,6], standards: ['10.CO.1.1','10.CO.2.1','10.LI.1.1','10.LI.2.1','10.W.1.1'] },
    ],
  },
  {
    grade: '11',
    label: 'Grado 11',
    units: [
      { id: 'ESP11.1', name: 'U.1 — El arte de contar historias',                        weeks: [1,2,3,4,5,6], standards: ['11.CO.1.1','11.CO.2.1','11.L.1.1','11.LI.1.1','11.W.1.1','11.LEN.1.1'] },
      { id: 'ESP11.2', name: 'U.2 — Literatura modernista — palabras y sentimientos',   weeks: [1,2,3,4,5,6], standards: ['11.CO.1.1','11.L.2.1','11.LI.1.1','11.LI.2.1','11.W.2.1'] },
      { id: 'ESP11.3', name: 'U.3 — Zona teatral, ¡arriba el telón!',                  weeks: [1,2,3,4,5,6], standards: ['11.CO.2.1','11.CO.1.1','11.LI.1.1','11.LI.2.1','11.W.1.1'] },
      { id: 'ESP11.4', name: 'U.4 — Lo real maravilloso en las letras hispanoamericanas', weeks: [1,2,3,4,5,6], standards: ['11.CO.1.1','11.L.1.1','11.LI.1.1','11.LI.3.1','11.W.2.1'] },
      { id: 'ESP11.5', name: 'U.5 — Lectura y escritura — ventanas al mundo laboral',  weeks: [1,2,3,4,5,6], standards: ['11.CO.2.1','11.L.2.1','11.L.3.1','11.W.3.1','11.LEN.2.1'] },
      { id: 'ESP11.6', name: 'U.6 — Letra, música y culturas hispanas',                 weeks: [1,2,3,4,5,6], standards: ['11.CO.1.1','11.CO.2.1','11.LI.1.1','11.LI.2.1','11.W.1.1'] },
    ],
  },
  {
    grade: '12',
    label: 'Grado 12',
    units: [
      { id: 'ESP12.1', name: 'U.1 — Somos Puerto Rico — nuestra voz ante el mundo',    weeks: [1,2,3,4,5,6], standards: ['12.CO.1.1','12.CO.2.1','12.L.1.1','12.LI.1.1','12.W.1.1','12.LEN.1.1'] },
      { id: 'ESP12.2', name: 'U.2 — Literatura — espacio e instrumento para la justicia', weeks: [1,2,3,4,5,6], standards: ['12.CO.1.1','12.L.2.1','12.LI.1.1','12.LI.2.1','12.W.2.1'] },
      { id: 'ESP12.3', name: 'U.3 — Mundo de poetas — palabras y sentimientos',        weeks: [1,2,3,4,5,6], standards: ['12.CO.2.1','12.L.1.1','12.LI.1.1','12.LI.3.1','12.W.1.1'] },
      { id: 'ESP12.4', name: 'U.4 — Ficción histórica — verdad y fantasía',            weeks: [1,2,3,4,5,6], standards: ['12.CO.1.1','12.L.3.1','12.LI.1.1','12.LI.2.1','12.W.2.1'] },
      { id: 'ESP12.5', name: 'U.5 — Cultura y transformación — visiones de un mundo diverso', weeks: [1,2,3,4,5,6], standards: ['12.CO.2.1','12.L.1.1','12.LI.2.1','12.LI.3.1','12.W.3.1'] },
      { id: 'ESP12.6', name: 'U.6 — Trabajo — virtud para la solidaridad humana',      weeks: [1,2,3,4,5,6], standards: ['12.CO.1.1','12.CO.2.1','12.L.2.1','12.LI.1.1','12.W.1.1'] },
    ],
  },
]
