export type UserRole = 'admin' | 'teacher' | 'parent';

export type AppTheme = 'dr' | 'light' | 'dark' | 'contrast';

export type CompetencyKey = 'com' | 'plc' | 'cyt' | 'eyc';

export type PeriodKey = 'P1' | 'P2' | 'P3' | 'P4';

export interface CompetencyScores {
  com: number; // Comunicativa
  plc: number; // Pensamiento Lógico, Creativo y Crítico / Resolución de Problemas
  cyt: number; // Científica y Tecnológica / Ambiental y de la Salud
  eyc: number; // Ética y Ciudadana / Desarrollo Personal y Espiritual
  cf: number;  // Calificación Final (Promedio ponderado)
}

export interface Student {
  id: string; // e.g. "2026-002"
  apellidos: string; // e.g. "Mejía"
  nombres: string; // e.g. "Ana"
  grado: string; // "1ro", "2do", "3ro", "4to", "5to", "6to"
  seccion: string; // "A", "B", "C"
  tutor: string;
  tutorEmail: string;
  tutorTelefono: string;
  situacion: string; // "Activo", "En Nivelación", "Promovido"
  fotoUrl?: string;
  condicionFinal?: string;
}

export interface Subject {
  id: string; // "mat", "len", "soc", "nat", "ef", "art", "fh", "ing"
  nombre: string;
  profesorAsignado: string;
  color: string;
  icono: string;
  imagen: string;
  descripcion: string;
  creditos: number;
}

export interface GradePeriodRecord {
  com: number;
  plc: number;
  cyt: number;
  eyc: number;
  cf: number;
  observacion?: string; // Observación pedagógica del docente para este período
}

export interface StudentSubjectGrade {
  estudianteId: string;
  materiaId: string;
  periodos: {
    P1: GradePeriodRecord;
    P2: GradePeriodRecord;
    P3: GradePeriodRecord;
    P4: GradePeriodRecord;
  };
  totalCom: number;
  totalPlc: number;
  totalCyt: number;
  totalEyc: number;
  calificacionFinal: number; // Promedio de C.F.
  estado: 'Aprobado' | 'Reprobado';
}

export interface StudentAttendance {
  estudianteId: string;
  periodos: {
    P1: { presentes: number; ausentes: number; porcentaje: number };
    P2: { presentes: number; ausentes: number; porcentaje: number };
    P3: { presentes: number; ausentes: number; porcentaje: number };
    P4: { presentes: number; ausentes: number; porcentaje: number };
  };
  promedioAnual: number;
}

export interface SchoolNotification {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'alerta' | 'info' | 'exito' | 'urgente';
  fecha: string;
  leido: boolean;
  destinatarioRol: UserRole | 'todos';
  estudianteId?: string;
}

export interface UserAccount {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  avatar: string;
  cargo: string;
  institucion: string;
  dosFactores: boolean;
  materiasAsignadas?: string[]; // IDs de materias que imparte
  tituloProfesional?: string;   // ej. "Lic. Matemáticas"
  profesionPrefijo?: string;    // ej. "Lic.", "Licda.", "Prof.", "Ing."
  estudianteAsignadoId?: string; // Para padres: ID del estudiante matriculado
}

export interface SchoolInfo {
  nombre: string;
  subtitulo: string;
  direccion: string;
  telefono: string;
  correo: string;
  distrito: string;
  regional: string;
  director: string;
  maestroEncargadoDefault: string;
  anoEscolar: string;
  logo: string;
}

export interface SaaSPlan {
  id: string;
  nombre: string;
  precioMensual: number;
  precioAnual: number;
  limiteEstudiantes: string;
  caracteristicas: string[];
  actual: boolean;
}
