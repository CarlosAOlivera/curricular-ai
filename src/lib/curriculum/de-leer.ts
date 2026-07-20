// Proyecto DE Leer — DEPR 2025-2029
// Implementación: todos los miércoles, salón hogar, K-12

export interface DeLeerMonth {
  month: number        // 1-12
  name: string
  lema: string
  celebraciones: string[]
  temas: string[]
}

export interface DeLeerActivity {
  id: string
  label: string
}

export const DE_LEER_MONTHS: DeLeerMonth[] = [
  {
    month: 8,
    name: 'Agosto',
    lema: 'La lectura nos abre las puertas a una nueva aventura',
    celebraciones: ['Inicio escolar', 'Semana de la lactancia', 'Prevención del suicidio', 'Mes de la salud oral'],
    temas: ['Leer es divertido', 'La escuela es nuestro segundo hogar', 'No al suicidio', 'De regreso a la escuela'],
  },
  {
    month: 9,
    name: 'Septiembre',
    lema: 'Un niño que lee será un adulto que piensa',
    celebraciones: ['Día del trabajo', 'Día Internacional de la Música', 'Inicio del otoño', 'Temporada de huracanes'],
    temas: ['¿Cómo se forman los huracanes?', 'El otoño en Puerto Rico y el Mundo', 'Músicos puertorriqueños', 'Mujeres en la música'],
  },
  {
    month: 10,
    name: 'Octubre',
    lema: 'Leer es soñar con los ojos abiertos',
    celebraciones: ['Día de la Raza', 'Annual Storytelling Week', 'Mes de la salud mental', 'Concienciación sobre el cáncer de mama', 'Semana de la Salud Escolar'],
    temas: ['Prevención del cáncer de mama', 'Nuestra raza: ¿Cómo se formó?', 'Salud Mental', 'Salud Escolar'],
  },
  {
    month: 11,
    name: 'Noviembre',
    lema: 'Leer nos hace especiales',
    celebraciones: ['Mes de la Educación Especial', 'Acción de Gracias', 'Semana de la Lectura y Libros en PR', 'Día del veterano', 'Celebración de la puertorriqueñidad', 'Descubrimiento de Puerto Rico'],
    temas: ['Descubrimiento de PR', 'El Alzheimer', 'Acción de Gracias', 'Día del Veterano', 'Puertorriqueñidad'],
  },
  {
    month: 12,
    name: 'Diciembre',
    lema: 'Un libro es un regalo que puedes abrir una y otra vez',
    celebraciones: ['Semana de la Tecnología Educativa', 'Inicio del invierno', 'Navidad', 'Semana del pintor puertorriqueño'],
    temas: ['Tecnología educativa', 'Pintores puertorriqueños', 'El invierno en Puerto Rico y el Mundo', 'La Navidad'],
  },
  {
    month: 1,
    name: 'Enero',
    lema: 'Si quieres aventura… ¡lánzate a la lectura!',
    celebraciones: ['Día de Reyes', 'Mes de las tiroides', 'Mes de la prevención de defectos congénitos'],
    temas: ['Los Reyes Magos', '¿Qué son las tiroides?', 'Conociendo nuestro cuerpo'],
  },
  {
    month: 2,
    name: 'Febrero',
    lema: 'Enamórate de la lectura',
    celebraciones: ['Día de San Valentín', 'Día de la mujer y la niña en las ciencias', 'La mujer ilustre de Puerto Rico'],
    temas: ['Historia del Día de San Valentín', 'Mujeres ilustres de Puerto Rico', 'Mujeres en las ciencias', 'La amistad en distintos países'],
  },
  {
    month: 3,
    name: 'Marzo',
    lema: 'Toda lectura cuenta, no discrimines',
    celebraciones: ['Afrodescendencia y erradicación del Racismo', 'Día internacional de la mujer', 'Síndrome Down', 'Día de cero discrimen', 'Inicio de la primavera'],
    temas: ['Mujeres deportistas', 'Mujeres en las ciencias', 'Reciclaje y conservación ambiental', 'Afrodescendencia', 'Síndrome Down'],
  },
  {
    month: 4,
    name: 'Abril',
    lema: 'Un libro, el pasaporte al saber',
    celebraciones: ['El planeta Tierra', 'Autismo', 'Semana de la Biblioteca Escolar', 'Día del libro', 'Fiesta de la Lengua', 'Semana de las Ciencias'],
    temas: ['Reciclaje y conservación ambiental', 'Derechos de los niños', 'Mitos y leyendas', 'Finanzas personales', 'Emprendimiento', 'El origen de los libros', 'La danza'],
  },
  {
    month: 5,
    name: 'Mayo',
    lema: 'Leer es aprender',
    celebraciones: ['Semana educativa', 'Día del internet', 'Semana de la Enfermería Escolar', 'Día de las madres'],
    temas: ['El personal escolar y sus funciones', 'El internet', 'Cybersecurity', 'Enfermería escolar'],
  },
]

export const DE_LEER_ACTIVITIES: DeLeerActivity[] = [
  { id: 'presentacion_digital', label: 'Presentación digital' },
  { id: 'trabalenguas', label: 'Trabalenguas' },
  { id: 'poemas_coreados', label: 'Poemas coreados' },
  { id: 'recetas', label: 'Recetas' },
  { id: 'cuento_digitalizado', label: 'Cuento o poema digitalizado o ilustrado' },
  { id: 'dramatizacion', label: 'Dramatización' },
  { id: 'narracion', label: 'Narración' },
  { id: 'refranes', label: 'Refranes' },
  { id: 'lectura_compartida', label: 'Lectura compartida' },
  { id: 'lectura_guiada', label: 'Lectura guiada o dirigida' },
  { id: 'lectura_voz_alta', label: 'Lectura en voz alta' },
  { id: 'lectura_tutores', label: 'Lectura con tutores' },
  { id: 'circulo_literario', label: 'Círculo literario' },
  { id: 'karaoke', label: 'Karaoke' },
  { id: 'lectura_expositiva', label: 'Lectura expositiva: textos de no-ficción' },
  { id: 'vocabulario_contexto', label: 'Desarrollo de vocabulario en contexto' },
  { id: 'cadena_lecturas', label: 'Cadena de lecturas' },
  { id: 'bellas_artes', label: 'Recrear la historia por medio de las Bellas Artes' },
  { id: 'personalidades', label: 'Invitación de personalidades para leer en el salón' },
  { id: 'manualidad', label: 'Manualidad relacionada con la lectura' },
  { id: 'yincana', label: 'Yincana literaria' },
]

export const DE_LEER_EVALUATIONS: DeLeerActivity[] = [
  { id: 'ficha_lectura', label: 'Ficha de lectura' },
  { id: 'cadena', label: 'Eslabón para cadena de lectura' },
  { id: 'discusion_socializada', label: 'Discusión socializada' },
  { id: 'respuesta_escrita', label: 'Respuesta escrita inmediata' },
  { id: 'vocabulario', label: 'Discusión de vocabulario en contexto' },
  { id: 'ejercicio_aplicacion', label: 'Ejercicio de aplicación' },
  { id: 'trabajo_creativo', label: 'Trabajo creativo integrando las Bellas Artes' },
  { id: 'organizador_grafico', label: 'Esquema u organizador gráfico' },
]

export function getDeLeerMonth(date: Date): DeLeerMonth | undefined {
  const m = date.getMonth() + 1
  return DE_LEER_MONTHS.find(mo => mo.month === m)
}

export function getGradeLevel(grade: string): '1-5' | '6-12' {
  const g = parseInt(grade)
  if (isNaN(g) || g <= 5) return '1-5'
  return '6-12'
}
