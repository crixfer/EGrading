import { SchoolInfo, Subject, Student, StudentSubjectGrade, StudentAttendance, UserAccount, SchoolNotification, SaaSPlan } from '../types';

export const INITIAL_SCHOOL_INFO: SchoolInfo = {
  nombre: "LICEO REPÚBLICA DE GUATEMALA",
  subtitulo: "BOLETÍN DE CALIFICACIONES DE EDUCACIÓN SECUNDARIA",
  direccion: "C. Leonardo Da Vinci, No. 40",
  telefono: "809-797-4037",
  correo: "lrepublicadeguatemala@gmail.com",
  distrito: "10-04",
  regional: "10 Santo Domingo",
  director: "Lic. Manuel Antonio Peña",
  maestroEncargadoDefault: "Prof. Licda. Carmen Rosa Valdez",
  anoEscolar: "2025 - 2026",
  logo: "/src/assets/images/school_crest_emblem_1791649950852.jpg"
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "mat",
    nombre: "Matemáticas",
    profesorAsignado: "Lic. Francisco Almonte",
    color: "#22396F",
    icono: "Calculator",
    imagen: "/src/assets/images/stem_math_science_1791649965877.jpg",
    descripcion: "Álgebra, geometría analítica, trigonometría, estadística y resolución de problemas.",
    creditos: 5
  },
  {
    id: "len",
    nombre: "Lengua Española",
    profesorAsignado: "Licda. Carmen Rosa Valdez",
    color: "#CE1126",
    icono: "BookOpen",
    imagen: "/src/assets/images/humanities_literature_1791649980367.jpg",
    descripcion: "Comprensión y producción escrita, análisis literario, gramática y comunicación oral.",
    creditos: 5
  },
  {
    id: "soc",
    nombre: "Ciencias Sociales",
    profesorAsignado: "Lic. Roberto Santana",
    color: "#B45309",
    icono: "Globe",
    imagen: "/src/assets/images/humanities_literature_1791649980367.jpg",
    descripcion: "Historia dominicana y universal, geografía humana, educación cívica y geopolítica.",
    creditos: 4
  },
  {
    id: "nat",
    nombre: "Ciencias Naturales",
    profesorAsignado: "Dra. Patricia Henríquez",
    color: "#047857",
    icono: "FlaskConical",
    imagen: "/src/assets/images/stem_math_science_1791649965877.jpg",
    descripcion: "Biología celular, química experimental, física fundamental y ecología ambiental.",
    creditos: 4
  },
  {
    id: "ef",
    nombre: "Educación Física",
    profesorAsignado: "Prof. Marcos De León",
    color: "#0284C7",
    icono: "Activity",
    imagen: "/src/assets/images/arts_physical_education_1791649992140.jpg",
    descripcion: "Acondicionamiento físico, deportes de equipo, atletismo, salud corporal y recreación.",
    creditos: 2
  },
  {
    id: "art",
    nombre: "Educación Artística",
    profesorAsignado: "Licda. Xiomara Reyes",
    color: "#7C3AED",
    icono: "Palette",
    imagen: "/src/assets/images/arts_physical_education_1791649992140.jpg",
    descripcion: "Artes visuales, teatro, apreciación musical, folklore dominicano y expresión plástica.",
    creditos: 2
  },
  {
    id: "fh",
    nombre: "Formación Humana",
    profesorAsignado: "Pbro. Nelson Candelier",
    color: "#D97706",
    icono: "HeartHandshake",
    imagen: "/src/assets/images/humanities_literature_1791649980367.jpg",
    descripcion: "Valores éticos, desarrollo espiritual, convivencia armónica y proyecto de vida.",
    creditos: 2
  },
  {
    id: "ing",
    nombre: "Inglés",
    profesorAsignado: "Licda. Jennifer Davis",
    color: "#0F766E",
    icono: "Languages",
    imagen: "/src/assets/images/humanities_literature_1791649980367.jpg",
    descripcion: "Lectura, escritura, fluidez conversacional y comprensión auditiva de lengua extranjera.",
    creditos: 3
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "2026-002",
    apellidos: "Mejía",
    nombres: "Ana",
    grado: "2do",
    seccion: "A",
    tutor: "Carlos Mejía",
    tutorEmail: "carlos.mejia@gmail.com",
    tutorTelefono: "809-555-0142",
    situacion: "Activo",
    condicionFinal: "Promovido satisfactoriamente con excelencia en competencias comunicativas y científicas."
  },
  {
    id: "2026-001",
    apellidos: "Alcántara",
    nombres: "Carlos David",
    grado: "2do",
    seccion: "A",
    tutor: "David Alcántara",
    tutorEmail: "david.alcantara@gmail.com",
    tutorTelefono: "809-555-0189",
    situacion: "Activo",
    condicionFinal: "Promovido al siguiente grado escolar."
  },
  {
    id: "2026-003",
    apellidos: "Castillo Pérez",
    nombres: "María Elena",
    grado: "2do",
    seccion: "A",
    tutor: "Elena Pérez de Castillo",
    tutorEmail: "elena.perez@hotmail.com",
    tutorTelefono: "809-555-0211",
    situacion: "Activo",
    condicionFinal: "Promovida con mención de honor."
  },
  {
    id: "2026-004",
    apellidos: "Díaz Guzmán",
    nombres: "José Luis",
    grado: "2do",
    seccion: "A",
    tutor: "Ramón Díaz",
    tutorEmail: "ramon.diaz@gmail.com",
    tutorTelefono: "809-555-0345",
    situacion: "En Nivelación",
    condicionFinal: "Pendiente de completar nivelación en Matemáticas (PLC)."
  },
  {
    id: "2026-005",
    apellidos: "Gómez Terrero",
    nombres: "Sofía Carolina",
    grado: "2do",
    seccion: "B",
    tutor: "Luisa Terrero",
    tutorEmail: "luisa.terrero@gmail.com",
    tutorTelefono: "809-555-0456",
    situacion: "Activo",
    condicionFinal: "Promovida satisfactoriamente."
  },
  {
    id: "2026-006",
    apellidos: "Herrera Batista",
    nombres: "Kelvin Manuel",
    grado: "2do",
    seccion: "B",
    tutor: "Manuel Herrera",
    tutorEmail: "m.herrera@claro.net.do",
    tutorTelefono: "809-555-0567",
    situacion: "Activo",
    condicionFinal: "Promovido al siguiente nivel."
  },
  {
    id: "2026-007",
    apellidos: "Jiménez Morales",
    nombres: "Valeria Isabel",
    grado: "1ro",
    seccion: "A",
    tutor: "Isabel Morales",
    tutorEmail: "isabel.morales@gmail.com",
    tutorTelefono: "809-555-0678",
    situacion: "Activo",
    condicionFinal: "Promovida."
  },
  {
    id: "2026-008",
    apellidos: "López Rosario",
    nombres: "Eduardo José",
    grado: "3ro",
    seccion: "A",
    tutor: "Eduardo López Sr.",
    tutorEmail: "elopez@gmail.com",
    tutorTelefono: "809-555-0789",
    situacion: "Activo",
    condicionFinal: "Promovido."
  },
  {
    id: "2026-009",
    apellidos: "Núñez Marte",
    nombres: "Camila Antonella",
    grado: "4to",
    seccion: "A",
    tutor: "Antonella Marte",
    tutorEmail: "amarte@gmail.com",
    tutorTelefono: "809-555-0890",
    situacion: "Activo",
    condicionFinal: "Promovida con honores."
  },
  {
    id: "2026-010",
    apellidos: "Paredes Santos",
    nombres: "Gabriel Alejandro",
    grado: "5to",
    seccion: "B",
    tutor: "Alejandro Paredes",
    tutorEmail: "aparedes@gmail.com",
    tutorTelefono: "809-555-0901",
    situacion: "Activo",
    condicionFinal: "Promovido."
  },
  {
    id: "2026-011",
    apellidos: "Rodríguez Cruz",
    nombres: "Laura Patricia",
    grado: "6to",
    seccion: "A",
    tutor: "Patricia Cruz",
    tutorEmail: "pcruz@gmail.com",
    tutorTelefono: "809-555-0912",
    situacion: "Activo",
    condicionFinal: "Graduanda promovida."
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: "usr-admin-1",
    nombre: "Chris Portorreal",
    email: "chris.portorreal@minerd.edu.do",
    rol: "admin",
    avatar: "CP",
    cargo: "Administrador General del Centro",
    tituloProfesional: "Administrador General",
    institucion: "Liceo República de Guatemala",
    dosFactores: true
  },
  {
    id: "usr-prof-1",
    nombre: "Lic. Francisco Almonte",
    email: "francisco.almonte@minerd.edu.do",
    rol: "teacher",
    avatar: "FA",
    cargo: "Profesor Matemáticas",
    tituloProfesional: "Lic. Matemáticas",
    materiasAsignadas: ["mat"],
    institucion: "Liceo República de Guatemala",
    dosFactores: true
  },
  {
    id: "usr-prof-2",
    nombre: "Licda. Carmen Rosa Valdez",
    email: "carmen.valdez@minerd.edu.do",
    rol: "teacher",
    avatar: "CV",
    cargo: "Profesor Lengua Española",
    tituloProfesional: "Licda. Lengua Española",
    materiasAsignadas: ["len"],
    institucion: "Liceo República de Guatemala",
    dosFactores: true
  },
  {
    id: "usr-prof-3",
    nombre: "Prof. Marcos Peña",
    email: "marcos.pena@minerd.edu.do",
    rol: "teacher",
    avatar: "MP",
    cargo: "Profesor Ciencias Naturales y Sociales",
    tituloProfesional: "Prof. Ciencias y Sociales",
    materiasAsignadas: ["nat", "soc"],
    institucion: "Liceo República de Guatemala",
    dosFactores: true
  },
  {
    id: "usr-padre-1",
    nombre: "Carlos Mejía",
    email: "carlos.mejia@gmail.com",
    rol: "parent",
    avatar: "CM",
    cargo: "Tutor Legal de Ana Mejía (2do A)",
    tituloProfesional: "Tutor Legal",
    institucion: "Comunidad de Padres EGrading",
    dosFactores: false,
    estudianteAsignadoId: "2026-002"
  }
];

// Helper to compute grade summaries
export function calculateSubjectTotals(periodos: StudentSubjectGrade['periodos']): {
  totalCom: number;
  totalPlc: number;
  totalCyt: number;
  totalEyc: number;
  calificacionFinal: number;
  estado: 'Aprobado' | 'Reprobado';
} {
  const pList = [periodos.P1, periodos.P2, periodos.P3, periodos.P4];
  const totalCom = Math.round(pList.reduce((acc, p) => acc + p.com, 0) / 4);
  const totalPlc = Math.round(pList.reduce((acc, p) => acc + p.plc, 0) / 4);
  const totalCyt = Math.round(pList.reduce((acc, p) => acc + p.cyt, 0) / 4);
  const totalEyc = Math.round(pList.reduce((acc, p) => acc + p.eyc, 0) / 4);
  const calificacionFinal = Math.round(pList.reduce((acc, p) => acc + p.cf, 0) / 4);
  const estado: 'Aprobado' | 'Reprobado' = calificacionFinal >= 70 ? 'Aprobado' : 'Reprobado';
  return { totalCom, totalPlc, totalCyt, totalEyc, calificacionFinal, estado };
}

// Generate realistic Dominican grade records
export function createDefaultGradeRecord(
  estudianteId: string,
  materiaId: string,
  baseScore: number
): StudentSubjectGrade {
  const p1 = {
    com: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 2)),
    plc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 6) - 3)),
    cyt: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 4) - 2)),
    eyc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 1)),
    cf: 0
  };
  p1.cf = Math.round((p1.com + p1.plc + p1.cyt + p1.eyc) / 4);

  const p2 = {
    com: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 6) - 2)),
    plc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 2)),
    cyt: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 1)),
    eyc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 4) - 1)),
    cf: 0
  };
  p2.cf = Math.round((p2.com + p2.plc + p2.cyt + p2.eyc) / 4);

  const p3 = {
    com: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 7) - 3)),
    plc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 6) - 2)),
    cyt: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 2)),
    eyc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 1)),
    cf: 0
  };
  p3.cf = Math.round((p3.com + p3.plc + p3.cyt + p3.eyc) / 4);

  const p4 = {
    com: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 5) - 1)),
    plc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 7) - 2)),
    cyt: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 4) - 1)),
    eyc: Math.min(100, Math.max(50, baseScore + Math.floor(Math.random() * 6) - 1)),
    cf: 0
  };
  p4.cf = Math.round((p4.com + p4.plc + p4.cyt + p4.eyc) / 4);

  const periodos = { P1: p1, P2: p2, P3: p3, P4: p4 };
  const totals = calculateSubjectTotals(periodos);

  return {
    estudianteId,
    materiaId,
    periodos,
    ...totals
  };
}

// Default preloaded grades for Ana Mejía and others
export const INITIAL_GRADES: StudentSubjectGrade[] = [
  // Ana Mejía (2026-002) - Excellent student with rich realistic distribution
  {
    estudianteId: "2026-002",
    materiaId: "mat",
    periodos: {
      P1: { 
        com: 88, plc: 86, cyt: 90, eyc: 94, cf: 90,
        observacion: "Excelente desempeño y agilidad mental en resolución de problemas. Gran entusiasmo en clase." 
      },
      P2: { 
        com: 90, plc: 89, cyt: 92, eyc: 95, cf: 92,
        observacion: "Demuestra dominio pleno de expresiones algebraicas y cooperación con sus compañeros de equipo." 
      },
      P3: { 
        com: 92, plc: 91, cyt: 94, eyc: 96, cf: 93,
        observacion: "Constante dedicación en tareas y participación destacada en proyectos de razonamiento lógico." 
      },
      P4: { 
        com: 94, plc: 93, cyt: 95, eyc: 98, cf: 95,
        observacion: "Sobresaliente cierre de año escolar. Cumplió con todas las competencias clave con honores." 
      }
    },
    totalCom: 91, totalPlc: 90, totalCyt: 93, totalEyc: 96,
    calificacionFinal: 93, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "len",
    periodos: {
      P1: { 
        com: 95, plc: 92, cyt: 90, eyc: 96, cf: 93,
        observacion: "Excelente redacción y comprensión de textos literarios. Vocabulario amplio y fluido."
      },
      P2: { 
        com: 96, plc: 94, cyt: 91, eyc: 97, cf: 95,
        observacion: "Destacada presentación en exposiciones orales sobre literatura dominicana."
      },
      P3: { 
        com: 94, plc: 92, cyt: 93, eyc: 96, cf: 94,
        observacion: "Habilidad sobresaliente en análisis crítico y síntesis de ensayos."
      },
      P4: { 
        com: 97, plc: 95, cyt: 94, eyc: 98, cf: 96,
        observacion: "Cierre impecable con producción escrita de alto nivel."
      }
    },
    totalCom: 96, totalPlc: 93, totalCyt: 92, totalEyc: 97,
    calificacionFinal: 95, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "soc",
    periodos: {
      P1: { 
        com: 89, plc: 88, cyt: 87, eyc: 95, cf: 90,
        observacion: "Gran interés y respeto en el estudio de la historia y geografía dominicana."
      },
      P2: { 
        com: 91, plc: 90, cyt: 89, eyc: 96, cf: 92,
        observacion: "Pensamiento crítico reflexivo ante los procesos sociohistóricos analizados."
      },
      P3: { 
        com: 90, plc: 89, cyt: 90, eyc: 95, cf: 91,
        observacion: "Excelente aporte en foros cívicos y dilemas éticos ciudadanos."
      },
      P4: { 
        com: 93, plc: 92, cyt: 91, eyc: 97, cf: 93,
        observacion: "Compromiso ejemplar con los valores patrios y la convivencia democrática."
      }
    },
    totalCom: 91, totalPlc: 90, totalCyt: 89, totalEyc: 96,
    calificacionFinal: 92, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "nat",
    periodos: {
      P1: { 
        com: 92, plc: 90, cyt: 95, eyc: 94, cf: 93,
        observacion: "Curiosidad científica innata y rigurosa metodología en informes de laboratorio."
      },
      P2: { 
        com: 94, plc: 92, cyt: 96, eyc: 95, cf: 94,
        observacion: "Excelente comprensión de los ecosistemas y preservación de los recursos naturales."
      },
      P3: { 
        com: 93, plc: 91, cyt: 97, eyc: 96, cf: 94,
        observacion: "Participación destacada en la feria de ciencias institucional."
      },
      P4: { 
        com: 95, plc: 93, cyt: 98, eyc: 97, cf: 96,
        observacion: "Dominio extraordinario del método científico y aplicación ecológica."
      }
    },
    totalCom: 94, totalPlc: 92, totalCyt: 97, totalEyc: 96,
    calificacionFinal: 94, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "ef",
    periodos: {
      P1: { com: 90, plc: 88, cyt: 92, eyc: 98, cf: 92 },
      P2: { com: 92, plc: 90, cyt: 94, eyc: 98, cf: 94 },
      P3: { com: 94, plc: 91, cyt: 95, eyc: 99, cf: 95 },
      P4: { com: 95, plc: 93, cyt: 96, eyc: 100, cf: 96 }
    },
    totalCom: 93, totalPlc: 91, totalCyt: 94, totalEyc: 99,
    calificacionFinal: 94, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "art",
    periodos: {
      P1: { com: 94, plc: 92, cyt: 89, eyc: 96, cf: 93 },
      P2: { com: 96, plc: 93, cyt: 90, eyc: 97, cf: 94 },
      P3: { com: 95, plc: 94, cyt: 92, eyc: 98, cf: 95 },
      P4: { com: 97, plc: 95, cyt: 93, eyc: 99, cf: 96 }
    },
    totalCom: 96, totalPlc: 94, totalCyt: 91, totalEyc: 98,
    calificacionFinal: 95, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "fh",
    periodos: {
      P1: { com: 96, plc: 94, cyt: 92, eyc: 98, cf: 95 },
      P2: { com: 97, plc: 95, cyt: 93, eyc: 99, cf: 96 },
      P3: { com: 96, plc: 96, cyt: 94, eyc: 99, cf: 96 },
      P4: { com: 98, plc: 97, cyt: 95, eyc: 100, cf: 98 }
    },
    totalCom: 97, totalPlc: 96, totalCyt: 94, totalEyc: 99,
    calificacionFinal: 96, estado: 'Aprobado'
  },
  {
    estudianteId: "2026-002",
    materiaId: "ing",
    periodos: {
      P1: { com: 91, plc: 89, cyt: 88, eyc: 94, cf: 91 },
      P2: { com: 93, plc: 90, cyt: 90, eyc: 95, cf: 92 },
      P3: { com: 92, plc: 91, cyt: 91, eyc: 96, cf: 93 },
      P4: { com: 95, plc: 93, cyt: 93, eyc: 97, cf: 95 }
    },
    totalCom: 93, totalPlc: 91, totalCyt: 91, totalEyc: 96,
    calificacionFinal: 93, estado: 'Aprobado'
  },

  // Carlos Alcántara (2026-001)
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-001", s.id, 82)),

  // María Castillo (2026-003)
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-003", s.id, 91)),

  // José Luis Díaz (2026-004) - Needs remediation in math
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-004", s.id, s.id === 'mat' ? 64 : 75)),

  // Other students
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-005", s.id, 85)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-006", s.id, 79)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-007", s.id, 88)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-008", s.id, 84)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-009", s.id, 93)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-010", s.id, 81)),
  ...INITIAL_SUBJECTS.map(s => createDefaultGradeRecord("2026-011", s.id, 90)),
];

export const INITIAL_ATTENDANCE: Record<string, StudentAttendance> = {
  "2026-002": {
    estudianteId: "2026-002",
    periodos: {
      P1: { presentes: 48, ausentes: 2, porcentaje: 96 },
      P2: { presentes: 50, ausentes: 0, porcentaje: 100 },
      P3: { presentes: 47, ausentes: 3, porcentaje: 94 },
      P4: { presentes: 49, ausentes: 1, porcentaje: 98 }
    },
    promedioAnual: 97
  },
  "2026-001": {
    estudianteId: "2026-001",
    periodos: {
      P1: { presentes: 45, ausentes: 5, porcentaje: 90 },
      P2: { presentes: 46, ausentes: 4, porcentaje: 92 },
      P3: { presentes: 47, ausentes: 3, porcentaje: 94 },
      P4: { presentes: 48, ausentes: 2, porcentaje: 96 }
    },
    promedioAnual: 93
  },
  "2026-004": {
    estudianteId: "2026-004",
    periodos: {
      P1: { presentes: 38, ausentes: 12, porcentaje: 76 },
      P2: { presentes: 39, ausentes: 11, porcentaje: 78 },
      P3: { presentes: 41, ausentes: 9, porcentaje: 82 },
      P4: { presentes: 42, ausentes: 8, porcentaje: 84 }
    },
    promedioAnual: 80
  }
};

export const INITIAL_NOTIFICATIONS: SchoolNotification[] = [
  {
    id: "notif-1",
    titulo: "Alerta Académica: Estudiante en Nivelación",
    mensaje: "El estudiante José Luis Díaz (2do A) presenta calificación en Matemáticas por debajo de 70 puntos (64) en el período actual.",
    tipo: "alerta",
    fecha: "Hoy, 08:30 AM",
    leido: false,
    destinatarioRol: "todos",
    estudianteId: "2026-004"
  },
  {
    id: "notif-2",
    titulo: "Boletines de Calificaciones P4 Generados",
    mensaje: "Las actas finales de Educación Secundaria del Liceo República de Guatemala están disponibles para revisión y firma de dirección.",
    tipo: "exito",
    fecha: "Hoy, 07:45 AM",
    leido: false,
    destinatarioRol: "admin"
  },
  {
    id: "notif-3",
    titulo: "Aviso de Asistencia para Padres",
    mensaje: "Ana Mejía registró 98% de asistencia en el P4. Felicitaciones por su excelente constancia.",
    tipo: "info",
    fecha: "Ayer, 04:15 PM",
    leido: true,
    destinatarioRol: "parent",
    estudianteId: "2026-002"
  },
  {
    id: "notif-4",
    titulo: "Recordatorio Diario Docente",
    mensaje: "Recuerde completar la ponderación de la competencia EYC (Ética y Ciudadana) antes del cierre de período.",
    tipo: "urgente",
    fecha: "Hace 2 días",
    leido: false,
    destinatarioRol: "teacher"
  }
];

export const SAAS_PLANS: SaaSPlan[] = [
  {
    id: "basic",
    nombre: "Básico Escolar",
    precioMensual: 49,
    precioAnual: 490,
    limiteEstudiantes: "Hasta 250 estudiantes",
    caracteristicas: [
      "Gestión de calificaciones por competencias (MINERD)",
      "Boletín oficial en PDF y HTML",
      "Control de asistencia básica",
      "Soporte por correo electrónico"
    ],
    actual: false
  },
  {
    id: "pro",
    nombre: "Pro Institucional",
    precioMensual: 119,
    precioAnual: 1190,
    limiteEstudiantes: "Hasta 1,200 estudiantes",
    caracteristicas: [
      "Todo lo del plan Básico",
      "Portal exclusivo para padres en tiempo real",
      "Modo Offline con sincronización automática garantizada",
      "Exportación masiva a Excel (XLSX/CSV) e importador inteligente",
      "Analíticas avanzadas de deserción y rendimiento",
      "Cifrado de extremo a extremo y autenticación 2FA"
    ],
    actual: true
  },
  {
    id: "district",
    nombre: "Distrital Enterprise",
    precioMensual: 289,
    precioAnual: 2890,
    limiteEstudiantes: "Estudiantes ilimitados (Múltiples centros)",
    caracteristicas: [
      "Todo lo del plan Pro Institucional",
      "API RESTful abierta para integración con SIGERD/MINERD",
      "Multi-colegio centralizado para directores distritales",
      "Auditoría forense de cambios de notas con marcas de tiempo",
      "Soporte prioritario 24/7 y despliegue dedicado"
    ],
    actual: false
  }
];
