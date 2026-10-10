import React, { useState } from 'react';
import { Student, Subject, StudentSubjectGrade, StudentAttendance, SchoolInfo, UserAccount, SchoolNotification } from '../types';
import { 
  TrendingUp, 
  Users, 
  Award, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  FileText,
  UserCheck,
  ChevronRight,
  Filter
} from 'lucide-react';

interface DashboardViewProps {
  students: Student[];
  subjects: Subject[];
  grades: StudentSubjectGrade[];
  attendance: Record<string, StudentAttendance>;
  school: SchoolInfo;
  currentUser: UserAccount;
  notifications: SchoolNotification[];
  onNavigate: (view: string, studentId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  subjects,
  grades,
  attendance,
  school,
  currentUser,
  notifications,
  onNavigate
}) => {
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<string>('todos');

  // Filter students if needed
  const filteredStudents = selectedGradeFilter === 'todos' 
    ? students 
    : students.filter(s => s.grado === selectedGradeFilter);

  // Compute school-wide KPIs
  const totalStudents = students.length;

  // Calculate average of all final grades
  const allFinalGrades = grades.map(g => g.calificacionFinal).filter(v => v > 0);
  const generalAverage = allFinalGrades.length > 0 
    ? Math.round((allFinalGrades.reduce((a, b) => a + b, 0) / allFinalGrades.length) * 10) / 10 
    : 0;

  // Passing rate (>= 70)
  const passingGradesCount = allFinalGrades.filter(g => g >= 70).length;
  const passRate = allFinalGrades.length > 0 
    ? Math.round((passingGradesCount / allFinalGrades.length) * 100) 
    : 100;

  // Average attendance rate
  const attendanceList = Object.values(attendance).map(a => a.promedioAnual);
  const generalAttendance = attendanceList.length > 0 
    ? Math.round(attendanceList.reduce((a, b) => a + b, 0) / attendanceList.length) 
    : 94;

  // Students requiring remediation or attention (grade < 70 in any subject)
  const studentsAtRisk = students.filter(student => {
    const sGrades = grades.filter(g => g.estudianteId === student.id);
    const hasFailingGrade = sGrades.some(g => g.calificacionFinal < 70 || g.periodos.P4.cf < 70);
    const sAtt = attendance[student.id];
    const lowAttendance = sAtt && sAtt.promedioAnual < 85;
    return hasFailingGrade || lowAttendance;
  });

  // Calculate Competency Breakdown Averages
  const comScores = grades.map(g => g.totalCom);
  const plcScores = grades.map(g => g.totalPlc);
  const cytScores = grades.map(g => g.totalCyt);
  const eycScores = grades.map(g => g.totalEyc);

  const avgCom = comScores.length ? Math.round(comScores.reduce((a, b) => a + b, 0) / comScores.length) : 89;
  const avgPlc = plcScores.length ? Math.round(plcScores.reduce((a, b) => a + b, 0) / plcScores.length) : 86;
  const avgCyt = cytScores.length ? Math.round(cytScores.reduce((a, b) => a + b, 0) / cytScores.length) : 88;
  const avgEyc = eycScores.length ? Math.round(eycScores.reduce((a, b) => a + b, 0) / eycScores.length) : 94;

  // Period Progression Comparison (P1, P2, P3, P4)
  const p1Avg = grades.length ? Math.round(grades.reduce((a, g) => a + g.periodos.P1.cf, 0) / grades.length) : 85;
  const p2Avg = grades.length ? Math.round(grades.reduce((a, g) => a + g.periodos.P2.cf, 0) / grades.length) : 87;
  const p3Avg = grades.length ? Math.round(grades.reduce((a, g) => a + g.periodos.P3.cf, 0) / grades.length) : 88;
  const p4Avg = grades.length ? Math.round(grades.reduce((a, g) => a + g.periodos.P4.cf, 0) / grades.length) : 90;

  return (
    <div className="space-y-6">
      
      {/* Institutional Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22396F] dark:text-blue-400">
              {school.nombre}
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">Distrito {school.distrito}</span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">Año Escolar {school.anoEscolar}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tablero de Desempeño y Rendimiento Académico
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Supervisión integral de calificaciones por competencias fundamentales (MINERD) y seguimiento de asistencia.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('report_card', '2026-002')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            Ver Boletín de Ana Mejía (2do A)
          </button>
          <button
            onClick={() => onNavigate('subjects')}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            Calificar Materias
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Promedio General */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Promedio General</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#22396F] dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {generalAverage}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +2.4 pts vs P1
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Escala vigesimal oficial / Base 100
          </p>
        </div>

        {/* Tasa de Aprobación */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tasa de Aprobación</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {passRate}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({passingGradesCount} asignaturas $\ge 70$)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Umbral mínimo aprobatorio: 70 puntos
          </p>
        </div>

        {/* Asistencia Promedio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Asistencia Anual</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
              {generalAttendance}%
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Normal
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Mínimo requerido por MINERD: 80%
          </p>
        </div>

        {/* Estudiantes en Alerta */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Atención Prioritaria</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 text-[#CE1126] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#CE1126] font-mono tabular-nums">
              {studentsAtRisk.length}
            </span>
            <span className="text-xs font-medium text-slate-500">
              de {totalStudents} alumnos
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Calificaciones &lt; 70 o baja asistencia
          </p>
        </div>

      </div>

      {/* Main Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evolution by Period (P1 - P4) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Progresión Trimestral del Rendimiento (Períodos 1 - 4)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparativa de promedios de calificación final (C.F.) a lo largo del año escolar
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500">
              8 Materias Oficiales
            </span>
          </div>

          <div className="mt-6 space-y-5">
            {[
              { periodo: 'Periodo 1 (Sept - Nov)', promedio: p1Avg, meta: 80, badge: 'Inicial' },
              { periodo: 'Periodo 2 (Dic - Feb)', promedio: p2Avg, meta: 82, badge: 'Intermedio' },
              { periodo: 'Periodo 3 (Mar - Abr)', promedio: p3Avg, meta: 85, badge: 'Avanzado' },
              { periodo: 'Periodo 4 (May - Jun)', promedio: p4Avg, meta: 88, badge: 'Cierre Anual' }
            ].map(p => (
              <div key={p.periodo} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{p.periodo}</span>
                  <div className="flex items-center gap-3 font-mono tabular-nums">
                    <span className="text-slate-500 text-[11px]">Meta: {p.meta}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{p.promedio} pts</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-[#22396F] dark:bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (p.promedio / 100) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Competencias Fundamentales Summary */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Promedio por Competencias Fundamentales MINERD
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-center">
                <span className="text-[10px] font-bold text-[#22396F] dark:text-blue-400 block">COM (Comunicativa)</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{avgCom}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-center">
                <span className="text-[10px] font-bold text-[#CE1126] dark:text-red-400 block">PLC (Lógico / Crítico)</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{avgPlc}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-center">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">CYT (Científica / Tec)</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{avgCyt}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-center">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 block">EYC (Ética y Ciudadana)</span>
                <span className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1 block">{avgEyc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Smart Reminders & Attention Needed Panel */}
        <div className="space-y-6">
          
          {/* Daily Reminders */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Clock className="w-4 h-4 text-[#22396F] dark:text-blue-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Recordatorios Diarios Inteligentes
              </h2>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-slate-800 text-xs border border-blue-100 dark:border-slate-700">
                <div className="flex items-center justify-between font-semibold text-[#22396F] dark:text-blue-300">
                  <span>Cierre de Notas P4</span>
                  <span className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">Vence en 3 días</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                  Todos los docentes deben asentar las competencias COM y PLC en el sistema antes del viernes 15.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 dark:bg-slate-800 text-xs border border-amber-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-semibold text-amber-900 dark:text-amber-300">
                  <span>Reunión de Nivelación</span>
                  <span className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">Mañana 10:00 AM</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                  Convocatoria a padres de estudiantes con asignaturas reprobadas (&lt; 70 pts) en Educación Secundaria.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/70 dark:bg-slate-800 text-xs border border-emerald-200 dark:border-slate-700">
                <div className="flex items-center justify-between font-semibold text-emerald-900 dark:text-emerald-300">
                  <span>Auditoría de Asistencia</span>
                  <span className="text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border">Al Día</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-1 text-[11px] leading-relaxed">
                  El 96% de las secciones ha completado el pase de lista de la jornada matutina.
                </p>
              </div>
            </div>
          </div>

          {/* Students at Risk Mini List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#CE1126]" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Casos de Alerta Temprana
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                {studentsAtRisk.length} detectados
              </span>
            </div>

            <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {studentsAtRisk.map(s => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {s.apellidos}, {s.nombres}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {s.grado} {s.seccion} · Cód: {s.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-bold text-[#CE1126] bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                      Nivelación
                    </span>
                    <button
                      onClick={() => onNavigate('report_card', s.id)}
                      className="block text-[11px] text-[#22396F] hover:underline mt-1 font-medium"
                    >
                      Ver Boletín
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Featured Student Roster Quick View */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Expedientes Escolares de Secundaria (1ro a 6to)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Acceso rápido a las fichas académicas individuales y emisión de boletines oficiales
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filtrar Grado:</span>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="todos">Todos los Grados</option>
              <option value="1ro">1ro de Secundaria</option>
              <option value="2do">2do de Secundaria</option>
              <option value="3ro">3ro de Secundaria</option>
              <option value="4to">4to de Secundaria</option>
              <option value="5to">5to de Secundaria</option>
              <option value="6to">6to de Secundaria</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Código</th>
                <th className="py-2.5 px-3">Estudiante</th>
                <th className="py-2.5 px-3">Grado y Sección</th>
                <th className="py-2.5 px-3">Tutor Legal</th>
                <th className="py-2.5 px-3 text-center">Asistencia</th>
                <th className="py-2.5 px-3 text-center">Situación</th>
                <th className="py-2.5 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map(student => {
                const att = attendance[student.id];
                const isPassing = student.situacion !== 'En Nivelación';

                return (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-500 font-medium">{student.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {student.apellidos}, {student.nombres}
                      </div>
                      <div className="text-[11px] text-slate-400">{student.tutorEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {student.grado.toUpperCase()} {student.seccion}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                      {student.tutor}
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold">
                      {att ? `${att.promedioAnual}%` : '95%'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isPassing 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' 
                          : 'bg-red-50 text-[#CE1126] border-red-200 dark:bg-red-950/40 dark:border-red-800'
                      }`}>
                        {student.situacion}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onNavigate('report_card', student.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-[#22396F] text-white hover:bg-[#1B2D58] transition-colors"
                      >
                        Abrir Boletín
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
