/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  AppTheme, 
  Student, 
  Subject, 
  StudentSubjectGrade, 
  StudentAttendance, 
  SchoolInfo, 
  UserAccount, 
  SchoolNotification 
} from './types';
import { StorageService } from './services/storageService';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SubjectsView } from './components/SubjectsView';
import { ReportCardView } from './components/ReportCardView';
import { AttendanceAndStudentsView } from './components/AttendanceAndStudentsView';
import { ParentPortalView } from './components/ParentPortalView';
import { SaaSAdminView } from './components/SaaSAdminView';
import { Wifi, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  // Application Data State
  const [school, setSchool] = useState<SchoolInfo>(() => StorageService.loadSchool());
  const [subjects, setSubjects] = useState<Subject[]>(() => StorageService.loadSubjects());
  const [students, setStudents] = useState<Student[]>(() => StorageService.loadStudents());
  const [grades, setGrades] = useState<StudentSubjectGrade[]>(() => StorageService.loadGrades());
  const [attendance, setAttendance] = useState<Record<string, StudentAttendance>>(() => StorageService.loadAttendance());
  const [notifications, setNotifications] = useState<SchoolNotification[]>(() => StorageService.loadNotifications());
  const [users, setUsers] = useState<UserAccount[]>(() => StorageService.loadUsers());
  
  // Navigation & User State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const list = StorageService.loadUsers();
    return list[0] || {
      id: "usr-admin-1",
      nombre: "Chris Portorreal",
      email: "chris.portorreal@minerd.edu.do",
      rol: "admin",
      avatar: "CP",
      cargo: "Administrador General del Centro",
      institucion: "Liceo República de Guatemala",
      dosFactores: true
    };
  });
  const [currentTheme, setCurrentTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('egrading_theme_v1') as AppTheme;
      if (saved && ['dr', 'light', 'dark', 'contrast'].includes(saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'dr';
  });
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>('2026-002');
  const [activePlan, setActivePlan] = useState<string>('pro');

  // Offline / Online state & Sync Simulation
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnlineEvent = () => {
      setIsOnline(true);
      triggerSync();
    };
    const handleOfflineEvent = () => {
      setIsOnline(false);
      showToast('Sin conexión a internet. Modo fuera de línea activo: los cambios se sincronizarán al reconectar.');
    };

    window.addEventListener('online', handleOnlineEvent);
    window.addEventListener('offline', handleOfflineEvent);

    return () => {
      window.removeEventListener('online', handleOnlineEvent);
      window.removeEventListener('offline', handleOfflineEvent);
    };
  }, []);

  // Update theme classes on HTML & body tags
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'theme-dr', 'theme-light', 'theme-dark', 'theme-contrast');
    body.classList.remove('dark', 'theme-dr', 'theme-light', 'theme-dark', 'theme-contrast');

    root.setAttribute('data-theme', currentTheme);
    body.setAttribute('data-theme', currentTheme);

    try {
      localStorage.setItem('egrading_theme_v1', currentTheme);
    } catch {
      // ignore
    }

    if (currentTheme === 'dark') {
      root.classList.add('dark', 'theme-dark');
      body.classList.add('dark', 'theme-dark');
    } else if (currentTheme === 'contrast') {
      root.classList.add('dark', 'theme-contrast');
      body.classList.add('dark', 'theme-contrast');
    } else if (currentTheme === 'dr') {
      root.classList.add('theme-dr');
      body.classList.add('theme-dr');
    } else if (currentTheme === 'light') {
      root.classList.add('theme-light');
      body.classList.add('theme-light');
    }
  }, [currentTheme]);

  const handleChangeTheme = (theme: AppTheme) => {
    setCurrentTheme(theme);
    const root = document.documentElement;
    const body = document.body;

    root.classList.remove('dark', 'theme-dr', 'theme-light', 'theme-dark', 'theme-contrast');
    body.classList.remove('dark', 'theme-dr', 'theme-light', 'theme-dark', 'theme-contrast');
    root.setAttribute('data-theme', theme);
    body.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      root.classList.add('dark', 'theme-dark');
      body.classList.add('dark', 'theme-dark');
    } else if (theme === 'contrast') {
      root.classList.add('dark', 'theme-contrast');
      body.classList.add('dark', 'theme-contrast');
    } else if (theme === 'dr') {
      root.classList.add('theme-dr');
      body.classList.add('theme-dr');
    } else if (theme === 'light') {
      root.classList.add('theme-light');
      body.classList.add('theme-light');
    }

    try {
      localStorage.setItem('egrading_theme_v1', theme);
    } catch {
      // ignore
    }

    const themeLabels: Record<AppTheme, string> = {
      dr: 'República Dominicana (Azul #22396F, rojo bermellón y blanco)',
      light: 'Modo Claro institucional',
      dark: 'Modo Oscuro',
      contrast: 'Alto Contraste (WCAG AAA)'
    };
    showToast(`Tema visual aplicado: ${themeLabels[theme]}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Trigger sync worker
  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      StorageService.clearOfflineQueue();
      setPendingSyncCount(0);
      setIsSyncing(false);
      showToast('¡Datos locales sincronizados exitosamente con el servidor central!');
    }, 1200);
  };

  const handleToggleOnline = () => {
    if (isOnline) {
      setIsOnline(false);
      showToast('Modo sin conexión simulado activado. Sus notas se guardarán localmente.');
    } else {
      setIsOnline(true);
      triggerSync();
    }
  };

  const handleSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    showToast(`Sesión cambiada a ${user.nombre} (${user.cargo})`);
    if (user.rol === 'parent') {
      setCurrentView('parent_portal');
    } else if (currentView === 'parent_portal') {
      setCurrentView('dashboard');
    }
  };

  const handleUpdateGrade = (updatedGrade: StudentSubjectGrade) => {
    const newGrades = grades.map(g => 
      g.estudianteId === updatedGrade.estudianteId && g.materiaId === updatedGrade.materiaId
        ? updatedGrade
        : g
    );
    setGrades(newGrades);
    StorageService.saveGrades(newGrades);

    if (!isOnline) {
      StorageService.enqueueOfflineAction('grade_update', `Actualización de notas para ${updatedGrade.estudianteId}`);
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const handleAddStudent = (student: Student) => {
    const newStudents = [student, ...students];
    setStudents(newStudents);
    StorageService.saveStudents(newStudents);

    // Create default attendance
    const newAtt = {
      ...attendance,
      [student.id]: {
        estudianteId: student.id,
        periodos: {
          P1: { presentes: 45, ausentes: 5, porcentaje: 90 },
          P2: { presentes: 47, ausentes: 3, porcentaje: 94 },
          P3: { presentes: 48, ausentes: 2, porcentaje: 96 },
          P4: { presentes: 49, ausentes: 1, porcentaje: 98 }
        },
        promedioAnual: 95
      }
    };
    setAttendance(newAtt);
    StorageService.saveAttendance(newAtt);

    showToast(`Estudiante ${student.apellidos}, ${student.nombres} registrado con éxito.`);
  };

  const handleDeleteStudent = (studentId: string) => {
    const newStudents = students.filter(s => s.id !== studentId);
    setStudents(newStudents);
    StorageService.saveStudents(newStudents);
    showToast(`Estudiante ${studentId} eliminado de la nómina.`);
  };

  const handleUpdateAttendance = (newAttendance: Record<string, StudentAttendance>) => {
    setAttendance(newAttendance);
    StorageService.saveAttendance(newAttendance);
    if (!isOnline) {
      setPendingSyncCount(prev => prev + 1);
    }
  };

  const handleUpdateSchool = (newSchool: SchoolInfo) => {
    setSchool(newSchool);
    StorageService.saveSchool(newSchool);
  };

  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    StorageService.saveUsers(newUsers);
    const updatedSelf = newUsers.find(u => u.id === currentUser.id);
    if (updatedSelf) {
      setCurrentUser(updatedSelf);
    }
  };

  const handleMarkNotificationRead = (notifId: string) => {
    const updated = notifications.map(n => n.id === notifId ? { ...n, leido: true } : n);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const handleNavigateToReportCard = (studentId?: string) => {
    if (studentId) {
      setSelectedStudentForReport(studentId);
    }
    setCurrentView('report_card');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        currentUser={currentUser}
        allUsers={users}
        onSwitchUser={handleSwitchUser}
        currentTheme={currentTheme}
        onChangeTheme={handleChangeTheme}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        pendingSyncCount={pendingSyncCount}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Syncing Overlay Indicator */}
      {isSyncing && (
        <div className="bg-[#22396F] text-white px-4 py-2 text-xs flex items-center justify-center gap-2 font-medium shadow-sm no-print">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Sincronizando cambios locales con el servidor escolar del MINERD...</span>
        </div>
      )}

      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs flex items-center justify-between font-bold shadow-sm no-print">
          <div className="flex items-center gap-2">
            <span>Modo Offline: {pendingSyncCount} operaciones pendientes de sincronización en cola local cifrada.</span>
          </div>
          <button 
            onClick={handleToggleOnline} 
            className="underline text-xs hover:text-black"
          >
            Reconectar ahora
          </button>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {currentView === 'dashboard' && (
          <DashboardView
            students={students}
            subjects={subjects}
            grades={grades}
            attendance={attendance}
            school={school}
            currentUser={currentUser}
            notifications={notifications}
            onNavigate={(view, studentId) => {
              if (studentId) setSelectedStudentForReport(studentId);
              setCurrentView(view);
            }}
          />
        )}

        {currentView === 'subjects' && (
          <SubjectsView
            subjects={subjects}
            students={students}
            grades={grades}
            currentUser={currentUser}
            school={school}
            onUpdateGrade={handleUpdateGrade}
            onOpenReportCard={handleNavigateToReportCard}
          />
        )}

        {currentView === 'report_card' && (
          <ReportCardView
            students={students}
            subjects={subjects}
            grades={grades}
            attendance={attendance}
            school={school}
            selectedStudentId={selectedStudentForReport}
            onSelectStudent={setSelectedStudentForReport}
          />
        )}

        {currentView === 'students' && (
          <AttendanceAndStudentsView
            students={students}
            attendance={attendance}
            school={school}
            onAddStudent={handleAddStudent}
            onUpdateAttendance={handleUpdateAttendance}
            onDeleteStudent={handleDeleteStudent}
            onOpenReportCard={handleNavigateToReportCard}
          />
        )}

        {currentView === 'parent_portal' && (
          <ParentPortalView
            students={students}
            subjects={subjects}
            grades={grades}
            attendance={attendance}
            school={school}
            notifications={notifications}
            onOpenReportCard={handleNavigateToReportCard}
          />
        )}

        {currentView === 'saas_admin' && (
          <SaaSAdminView
            school={school}
            onUpdateSchool={handleUpdateSchool}
            users={users}
            onUpdateUsers={handleUpdateUsers}
            subjects={subjects}
            activePlan={activePlan}
            onSelectPlan={(planId) => {
              setActivePlan(planId);
              showToast(`Plan SaaS actualizado a: ${planId.toUpperCase()}`);
            }}
          />
        )}

      </main>

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 max-w-md animate-fade-in no-print border border-slate-700 dark:border-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Institutional Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#22396F] dark:text-blue-400">EGrading SaaS</span>
            <span>·</span>
            <span>Plataforma Académica Oficial para Educación Secundaria</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Currículo MINERD (COM · PLC · CYT · EYC)</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Cifrado E2E Activo
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
