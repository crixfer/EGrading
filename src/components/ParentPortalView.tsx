import React, { useState } from 'react';
import { Student, Subject, StudentSubjectGrade, StudentAttendance, SchoolInfo, SchoolNotification } from '../types';
import { 
  ShieldCheck, 
  User, 
  Award, 
  Calendar, 
  FileText, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Phone, 
  Mail, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { printCurrentReportCard, downloadStudentReportHTML, downloadExcelSpreadsheet } from '../utils/exportUtils';

interface ParentPortalViewProps {
  students: Student[];
  subjects: Subject[];
  grades: StudentSubjectGrade[];
  attendance: Record<string, StudentAttendance>;
  school: SchoolInfo;
  notifications: SchoolNotification[];
  onOpenReportCard: (studentId: string) => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  students,
  subjects,
  grades,
  attendance,
  school,
  notifications,
  onOpenReportCard
}) => {
  // By default, Ana Mejía (Carlos Mejía's daughter)
  const defaultStudent = students.find(s => s.id === '2026-002') || students[0];
  const [selectedChildId, setSelectedChildId] = useState<string>(defaultStudent.id);

  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({
    P1: false,
    P2: false,
    P3: false,
    P4: true
  });

  const togglePeriod = (p: string) => {
    setExpandedPeriods(prev => ({ ...prev, [p]: !prev[p] }));
  };

  const child = students.find(s => s.id === selectedChildId) || defaultStudent;
  const childGrades = subjects.map(sub => {
    const rec = grades.find(g => g.estudianteId === child.id && g.materiaId === sub.id);
    return { subject: sub, record: rec };
  });

  const childAttendance = attendance[child.id] || {
    estudianteId: child.id,
    periodos: {
      P1: { presentes: 48, ausentes: 2, porcentaje: 96 },
      P2: { presentes: 50, ausentes: 0, porcentaje: 100 },
      P3: { presentes: 47, ausentes: 3, porcentaje: 94 },
      P4: { presentes: 49, ausentes: 1, porcentaje: 98 }
    },
    promedioAnual: 97
  };

  const finalScores = childGrades.map(cg => cg.record?.calificacionFinal || 0).filter(v => v > 0);
  const childAverage = finalScores.length > 0 
    ? Math.round((finalScores.reduce((a, b) => a + b, 0) / finalScores.length) * 10) / 10 
    : 0;

  // Filter alerts relevant to this student
  const childNotifs = notifications.filter(n => 
    n.destinatarioRol === 'parent' || n.destinatarioRol === 'todos' || n.estudianteId === child.id
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Parent Portal Header - Mobile Optimized Card */}
      <div className="bg-gradient-to-r from-[#22396F] to-[#1B2D58] text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xs ring-2 ring-white/20 flex items-center justify-center font-bold text-xl text-white">
              {child.nombres[0]}{child.apellidos[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                  Portal de Familias y Tutores
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/80">{school.nombre}</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                {child.nombres} {child.apellidos}
              </h1>
              <p className="text-xs text-blue-100/90 mt-1">
                {child.grado.toUpperCase()} {child.seccion} de Educación Secundaria · Cód: {child.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenReportCard(child.id)}
              className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-[#22396F] hover:bg-blue-50 shadow-sm transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-[#CE1126]" />
              Ver Boletín Oficial MINERD
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Academic Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Promedio Anual</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {childAverage}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Excelente (≥ 70)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Situación: <strong className="text-slate-800 dark:text-slate-200">{child.situacion}</strong>
          </p>
        </div>

        {/* Attendance KPI */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asistencia Acumulada</span>
            <Calendar className="w-4 h-4 text-[#22396F] dark:text-blue-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#22396F] dark:text-blue-400 font-mono tabular-nums">
              {childAttendance.promedioAnual}%
            </span>
            <span className="text-xs font-bold text-emerald-600">
              Constante
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Requisito mínimo MINERD: 80%
          </p>
        </div>

        {/* Fast Report Export */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Descargas del Boletín</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Descargue una copia para trámites o archivo familiar.
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => downloadStudentReportHTML(child, school, subjects, grades, childAttendance)}
              className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-center"
            >
              HTML
            </button>
            <button
              onClick={() => downloadExcelSpreadsheet(child, school, subjects, grades, childAttendance)}
              className="flex-1 py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 text-[11px] font-semibold text-center"
            >
              Excel (CSV)
            </button>
            <button
              onClick={() => onOpenReportCard(child.id)}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#22396F] text-white hover:bg-[#1B2D58] text-[11px] font-semibold text-center"
            >
              PDF
            </button>
          </div>
        </div>

      </div>

      {/* Real-Time Notification & Alert Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#22396F] dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Notificaciones y Alertas en Tiempo Real para el Hogar
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Actualizado al instante</span>
        </div>

        <div className="mt-3 space-y-2.5">
          {childNotifs.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No hay alertas pendientes para este alumno.
            </div>
          ) : (
            childNotifs.map(n => (
              <div 
                key={n.id} 
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-3 text-xs"
              >
                {n.tipo === 'alerta' && <AlertTriangle className="w-4 h-4 text-[#CE1126] shrink-0 mt-0.5" />}
                {n.tipo === 'exito' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                {n.tipo === 'info' && <Bell className="w-4 h-4 text-[#22396F] shrink-0 mt-0.5" />}
                {n.tipo === 'urgente' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{n.titulo}</span>
                    <span className="text-[10px] text-slate-400">{n.fecha}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed text-[11px]">
                    {n.mensaje}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Subject Grades Snapshot for Parents */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Resumen Curricular por Asignatura (P1 a P4)
            </h2>
            <p className="text-xs text-slate-500">
              Monitoreo continuo de las 8 materias del Liceo República de Guatemala
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Aprobación: <strong className="text-emerald-600 font-bold">≥ 70 pts</strong>
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {childGrades.map(({ subject, record }) => {
            const cf = record?.calificacionFinal || 0;
            const isPassing = cf >= 70;

            return (
              <div 
                key={subject.id}
                className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {subject.nombre}
                  </h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Docente: {subject.profesorAsignado}
                  </span>
                  <div className="flex items-center gap-2 mt-2 text-[10px] font-mono tabular-nums text-slate-500">
                    <span>P1: {record?.periodos.P1.cf || '—'}</span>
                    <span>·</span>
                    <span>P2: {record?.periodos.P2.cf || '—'}</span>
                    <span>·</span>
                    <span>P3: {record?.periodos.P3.cf || '—'}</span>
                    <span>·</span>
                    <span>P4: {record?.periodos.P4.cf || '—'}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xl font-black font-mono tabular-nums block ${
                    isPassing ? 'text-slate-900 dark:text-white' : 'text-[#CE1126]'
                  }`}>
                    {cf}
                  </span>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                    isPassing ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' : 'bg-red-50 text-[#CE1126] dark:bg-red-950/40'
                  }`}>
                    {isPassing ? 'Aprobado' : 'Reprobado'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* School Contact Card */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-900 dark:text-white block">Contacto con la Secretaría del Liceo</span>
          <p className="mt-0.5">Para justificaciones médicas o dudas con calificaciones, comuníquese con el centro.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={`tel:${school.telefono}`} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-[#22396F] dark:text-blue-300"
          >
            <Phone className="w-3.5 h-3.5" /> {school.telefono}
          </a>
          <a 
            href={`mailto:${school.correo}`} 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-[#22396F] dark:text-blue-300"
          >
            <Mail className="w-3.5 h-3.5" /> Correo
          </a>
        </div>
      </div>

    </div>
  );
};
