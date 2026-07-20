// Shared data for onboarding and profile pages

export const MUNICIPIO_REGION: Record<string, string> = {
  // Arecibo
  Arecibo: 'Arecibo', Barceloneta: 'Arecibo', Camuy: 'Arecibo', Ciales: 'Arecibo',
  Florida: 'Arecibo', Hatillo: 'Arecibo', Lares: 'Arecibo', Manatí: 'Arecibo',
  Morovis: 'Arecibo', Quebradillas: 'Arecibo', Utuado: 'Arecibo', 'Vega Alta': 'Arecibo', 'Vega Baja': 'Arecibo',
  // Bayamón
  Bayamón: 'Bayamón', Cataño: 'Bayamón', Corozal: 'Bayamón', Dorado: 'Bayamón',
  Naranjito: 'Bayamón', 'Toa Alta': 'Bayamón', 'Toa Baja': 'Bayamón',
  // Caguas
  'Aguas Buenas': 'Caguas', Aibonito: 'Caguas', Barranquitas: 'Caguas', Caguas: 'Caguas',
  Cayey: 'Caguas', Cidra: 'Caguas', Comerío: 'Caguas', Gurabo: 'Caguas',
  Juncos: 'Caguas', 'San Lorenzo': 'Caguas',
  // Humacao
  Arroyo: 'Humacao', Ceiba: 'Humacao', Culebra: 'Humacao', Fajardo: 'Humacao',
  Humacao: 'Humacao', 'Las Piedras': 'Humacao', Maunabo: 'Humacao', Naguabo: 'Humacao',
  Patillas: 'Humacao', 'Río Grande': 'Humacao', Vieques: 'Humacao', Yabucoa: 'Humacao',
  // Mayagüez
  Aguada: 'Mayagüez', Aguadilla: 'Mayagüez', Añasco: 'Mayagüez', 'Cabo Rojo': 'Mayagüez',
  Hormigueros: 'Mayagüez', Isabela: 'Mayagüez', Lajas: 'Mayagüez', 'Las Marías': 'Mayagüez',
  Maricao: 'Mayagüez', Mayagüez: 'Mayagüez', Moca: 'Mayagüez', Rincón: 'Mayagüez',
  'Sabana Grande': 'Mayagüez', 'San Germán': 'Mayagüez', 'San Sebastián': 'Mayagüez',
  // Ponce
  Adjuntas: 'Ponce', Coamo: 'Ponce', Guánica: 'Ponce', Guayama: 'Ponce',
  Guayanilla: 'Ponce', Jayuya: 'Ponce', 'Juana Díaz': 'Ponce', Orocovis: 'Ponce',
  Peñuelas: 'Ponce', Ponce: 'Ponce', Salinas: 'Ponce', 'Santa Isabel': 'Ponce',
  Villalba: 'Ponce', Yauco: 'Ponce',
  // San Juan
  Canóvanas: 'San Juan', Carolina: 'San Juan', Guaynabo: 'San Juan', Loíza: 'San Juan',
  Luquillo: 'San Juan', 'San Juan': 'San Juan', 'Trujillo Alto': 'San Juan',
}

export const MUNICIPIOS = Object.keys(MUNICIPIO_REGION).sort()

export const REGIONS = ['Arecibo', 'Bayamón', 'Caguas', 'Humacao', 'Mayagüez', 'Ponce', 'San Juan']

export const SCHOOL_LEVELS = [
  'Elemental (K–6)',
  'Intermedia (7–9)',
  'Superior (10–12)',
  'K–12 Completa',
  'Otro',
]

export const YEARS_EXPERIENCE = [
  '0–3 años',
  '4–7 años',
  '8–15 años',
  '16–25 años',
  'Más de 25 años',
]

export const ACADEMIC_PREPARATION = [
  'Bachillerato',
  'Bachillerato + Créditos de Maestría',
  'Maestría',
  'Doctorado (Ed.D. / Ph.D.)',
]

export const CERTIFICATIONS = [
  'Certificación en Inglés / ESL',
  'Certificación en Español',
  'Certificación en Matemáticas',
  'Certificación en Ciencias',
  'Certificación en Estudios Sociales',
  'Certificación en Educación Especial',
  'Certificación en Educación Física',
  'Certificación en Arte',
  'Certificación en Música',
  'Certificación TESOL / TEFL',
  'Certificación en Tecnología Educativa',
  'Certificación en Administración Escolar',
  'Elemental K–3',
  'Elemental K–6',
  'Educación Ocupacional',
]

export const SUBJECTS = [
  'Inglés / English',
  'Español',
  'Matemáticas',
  'Ciencias',
  'Estudios Sociales',
  'Educación Física',
  'Arte',
  'Música',
  'Educación Especial',
  'Otro',
]

export const GRADES = ['K','1','2','3','4','5','6','7','8','9','10','11','12']
