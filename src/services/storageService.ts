import { Student, Subject, StudentSubjectGrade, StudentAttendance, SchoolNotification, SchoolInfo, UserAccount } from '../types';
import { INITIAL_SCHOOL_INFO, INITIAL_SUBJECTS, INITIAL_STUDENTS, INITIAL_GRADES, INITIAL_ATTENDANCE, INITIAL_NOTIFICATIONS, INITIAL_USERS } from '../data/mockData';

const STORAGE_KEYS = {
  SCHOOL: 'egrading_school_info_v1',
  SUBJECTS: 'egrading_subjects_v1',
  STUDENTS: 'egrading_students_v1',
  GRADES: 'egrading_grades_v1',
  ATTENDANCE: 'egrading_attendance_v1',
  NOTIFICATIONS: 'egrading_notifications_v1',
  USERS: 'egrading_users_v1',
  QUEUE: 'egrading_offline_queue_v1',
  THEME: 'egrading_theme_v1',
  ACTIVE_USER: 'egrading_active_user_v1'
};

export interface OfflineAction {
  id: string;
  timestamp: string;
  tipo: 'grade_update' | 'student_add' | 'attendance_update' | 'student_delete';
  detalles: string;
}

export const StorageService = {
  loadSchool(): SchoolInfo {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SCHOOL);
      return data ? JSON.parse(data) : INITIAL_SCHOOL_INFO;
    } catch {
      return INITIAL_SCHOOL_INFO;
    }
  },

  saveSchool(info: SchoolInfo): void {
    localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(info));
  },

  loadSubjects(): Subject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  },

  saveSubjects(subjects: Subject[]): void {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  loadStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return data ? JSON.parse(data) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  },

  saveStudents(students: Student[]): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  loadGrades(): StudentSubjectGrade[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GRADES);
      if (data) {
        const loaded: StudentSubjectGrade[] = JSON.parse(data);
        INITIAL_GRADES.forEach(ig => {
          const matching = loaded.find(l => l.estudianteId === ig.estudianteId && l.materiaId === ig.materiaId);
          if (matching) {
            (['P1', 'P2', 'P3', 'P4'] as const).forEach(p => {
              if (ig.periodos[p]?.observacion && !matching.periodos[p]?.observacion) {
                matching.periodos[p].observacion = ig.periodos[p].observacion;
              }
            });
          }
        });
        return loaded;
      }
      return INITIAL_GRADES;
    } catch {
      return INITIAL_GRADES;
    }
  },

  saveGrades(grades: StudentSubjectGrade[]): void {
    localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
  },

  loadAttendance(): Record<string, StudentAttendance> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
      return data ? JSON.parse(data) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  },

  saveAttendance(attendance: Record<string, StudentAttendance>): void {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  },

  loadNotifications(): SchoolNotification[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  saveNotifications(notifs: SchoolNotification[]): void {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  },

  loadUsers(): UserAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) {
        const loaded: UserAccount[] = JSON.parse(data);
        // Ensure initial accounts have up-to-date role titles, assigned subjects, and student links
        const merged = [...loaded];
        INITIAL_USERS.forEach(initUser => {
          const existing = merged.find(u => u.id === initUser.id);
          if (!existing) {
            merged.push(initUser);
          } else {
            if (!existing.materiasAsignadas || existing.materiasAsignadas.length === 0) {
              existing.materiasAsignadas = initUser.materiasAsignadas;
            }
            if (initUser.tituloProfesional && (!existing.tituloProfesional || existing.tituloProfesional === 'Teacher')) {
              existing.tituloProfesional = initUser.tituloProfesional;
            }
            if (initUser.cargo && existing.cargo?.includes('Docente Titular')) {
              existing.cargo = initUser.cargo;
            }
            if (initUser.estudianteAsignadoId && !existing.estudianteAsignadoId) {
              existing.estudianteAsignadoId = initUser.estudianteAsignadoId;
            }
          }
        });
        return merged;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  saveUsers(users: UserAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  loadOfflineQueue(): OfflineAction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  enqueueOfflineAction(tipo: OfflineAction['tipo'], detalles: string): OfflineAction {
    const queue = this.loadOfflineQueue();
    const action: OfflineAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      tipo,
      detalles
    };
    queue.push(action);
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    return action;
  },

  clearOfflineQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.QUEUE);
  },

  resetAll(): void {
    localStorage.clear();
  }
};
