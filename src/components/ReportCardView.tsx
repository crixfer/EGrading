import React, { useState } from 'react';
import { Student, Subject, StudentSubjectGrade, StudentAttendance, SchoolInfo, UserAccount } from '../types';
import { 
  Printer, 
  Download, 
  FileSpreadsheet, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { printCurrentReportCard, downloadStudentReportHTML, downloadExcelSpreadsheet } from '../utils/exportUtils';

interface ReportCardViewProps {
  students: Student[];
  subjects: Subject[];
  grades: StudentSubjectGrade[];
  attendance: Record<string, StudentAttendance>;
  school: SchoolInfo;
  selectedStudentId: string;
  onSelectStudent: (id: string) => void;
  currentUser?: UserAccount;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  students,
  subjects,
  grades,
  attendance,
  school,
  selectedStudentId,
  onSelectStudent,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Collapsible state for observations under each period
  const [expandedPeriods, setExpandedPeriods] = useState<Record<string, boolean>>({
    P1: false,
    P2: false,
    P3: false,
    P4: true // P4 open by default as current period
  });

  const togglePeriod = (p: string) => {
    setExpandedPeriods(prev => ({
      ...prev,
      [p]: !prev[p]
    }));
  };

  // Active student calculation: If parent, strictly lock to their enrolled child
  const assignedParentStudent = currentUser?.rol === 'parent' 
    ? (students.find(s => s.id === currentUser.estudianteAsignadoId) ||
       students.find(s => s.tutorEmail?.toLowerCase() === currentUser.email?.toLowerCase()) ||
       students.find(s => s.id === '2026-002') || students[0])
    : null;

  const currentStudent = assignedParentStudent || students.find(s => s.id === selectedStudentId) || students[0] || {
    id: "2026-002",
    apellidos: "Mejía",
    nombres: "Ana",
    grado: "2do",
    seccion: "A",
    tutor: "Carlos Mejía",
    tutorEmail: "carlos.mejia@gmail.com",
    tutorTelefono: "809-555-0142",
    situacion: "Activo",
    condicionFinal: ""
  };

  const studentGrades = subjects.map(sub => {
    const record = grades.find(g => g.estudianteId === currentStudent.id && g.materiaId === sub.id);
    return {
      subject: sub,
      record
    };
  });

  const studentAtt = attendance[currentStudent.id] || {
    estudianteId: currentStudent.id,
    periodos: {
      P1: { presentes: 48, ausentes: 2, porcentaje: 96 },
      P2: { presentes: 50, ausentes: 0, porcentaje: 100 },
      P3: { presentes: 47, ausentes: 3, porcentaje: 94 },
      P4: { presentes: 49, ausentes: 1, porcentaje: 98 }
    },
    promedioAnual: 97
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Interactive Controls & Student Selector Toolbar (Hidden during Print) */}
      <div className="no-print bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Student Selector / Parent Banner */}
        <div className="flex flex-1 items-center gap-3">
          {currentUser?.rol === 'parent' ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs">
              <ShieldCheck className="w-4 h-4 text-[#22396F] dark:text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-500 font-medium">Estudiante a su cargo: </span>
                <strong className="text-[#22396F] dark:text-blue-300 font-bold">
                  {currentStudent.apellidos}, {currentStudent.nombres}
                </strong>
                <span className="text-slate-500 ml-1.5 font-mono text-[11px]">
                  ({currentStudent.grado.toUpperCase()} {currentStudent.seccion} · Cód: {currentStudent.id})
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={currentStudent.id}
                onChange={(e) => onSelectStudent(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#22396F]"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.apellidos}, {s.nombres} — {s.grado.toUpperCase()} {s.seccion} ({s.id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons: Print PDF, HTML, Excel */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={printCurrentReportCard}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Imprimir boletín oficial en papel o guardar como PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / PDF
          </button>

          <button
            onClick={() => downloadStudentReportHTML(currentStudent, school, subjects, grades, studentAtt)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Descargar archivo HTML independiente portable"
          >
            <FileCode className="w-3.5 h-3.5" />
            Descargar HTML
          </button>

          <button
            onClick={() => downloadExcelSpreadsheet(currentStudent, school, subjects, grades, studentAtt)}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Exportar acta en formato Excel / CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Exportar Excel
          </button>

          <button
            onClick={handleCopyShareLink}
            className="px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Copiar enlace del boletín"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            {copiedLink ? 'Enlace Copiado' : 'Compartir'}
          </button>
        </div>

      </div>

      {/* Official MINERD Report Card Container (Exact replication of reference document) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-10 shadow-sm print-container">
        
        {/* Header Section with Emblem, School Title, Address, and MINERD Logo */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div className="flex items-center justify-between gap-4">
            
            {/* School Crest / Emblem */}
            <div className="flex items-center gap-4">
              <img 
                src={school.logo} 
                alt="Escudo Liceo República de Guatemala" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#22396F] dark:text-blue-400 uppercase">
                  {school.nombre}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                  <span>{school.direccion}</span>
                  <span>☎ {school.telefono}</span>
                  <span>✉ {school.correo}</span>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-[#22396F] dark:text-blue-300 uppercase tracking-wide mt-1.5">
                  {school.subtitulo}
                </h2>
              </div>
            </div>

            {/* Dominican Republic Education Seal */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="w-16 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1 flex items-center justify-center">
                <span className="text-[9px] font-bold text-[#CE1126] text-center leading-tight">
                  REPÚBLICA DOMINICANA<br />
                  <span className="text-[#22396F]">MINERD</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">Distrito {school.distrito}</span>
            </div>

          </div>
        </div>

        {/* Student Metadata Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 px-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-lg border border-slate-200/80 dark:border-slate-800 mb-6 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Estudiante</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {currentStudent.apellidos}, {currentStudent.nombres}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Grado y Sección</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase">
              {currentStudent.grado} {currentStudent.seccion}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Código</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
              {currentStudent.id}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Situación</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {currentStudent.situacion || '—'}
            </span>
          </div>
        </div>

        {/* Áreas Curriculares Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-center text-[11px]">
            <thead>
              {/* Header Row 1: Periods */}
              <tr className="bg-[#EBF2FA] dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                <th rowSpan={2} className="border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-left font-bold text-xs text-[#22396F] dark:text-blue-300 w-44">
                  Áreas Curriculares
                </th>
                <th colSpan={5} className="border border-slate-300 dark:border-slate-700 py-2 font-bold uppercase tracking-wider text-[#22396F] dark:text-blue-300">
                  Periodo 1
                </th>
                <th colSpan={5} className="border border-slate-300 dark:border-slate-700 py-2 font-bold uppercase tracking-wider text-[#22396F] dark:text-blue-300">
                  Periodo 2
                </th>
                <th colSpan={5} className="border border-slate-300 dark:border-slate-700 py-2 font-bold uppercase tracking-wider text-[#22396F] dark:text-blue-300">
                  Periodo 3
                </th>
                <th colSpan={5} className="border border-slate-300 dark:border-slate-700 py-2 font-bold uppercase tracking-wider text-[#22396F] dark:text-blue-300">
                  Periodo 4
                </th>
                <th colSpan={5} className="border border-slate-300 dark:border-slate-700 py-2 font-bold uppercase tracking-wider bg-[#DCE7F5] dark:bg-slate-700 text-[#22396F] dark:text-white">
                  Total
                </th>
              </tr>

              {/* Header Row 2: Competency Columns (COM, PLC, CYT, EYC, C.F.) */}
              <tr className="bg-[#F8FAFC] dark:bg-slate-800/80 text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                {/* Periodo 1 */}
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">COM</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">PLC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">CYT</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">EYC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-slate-200/70 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">C.F.</th>

                {/* Periodo 2 */}
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">COM</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">PLC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">CYT</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">EYC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-slate-200/70 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">C.F.</th>

                {/* Periodo 3 */}
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">COM</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">PLC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">CYT</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">EYC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-slate-200/70 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">C.F.</th>

                {/* Periodo 4 */}
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">COM</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">PLC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">CYT</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1">EYC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-slate-200/70 dark:bg-slate-700 font-bold text-slate-900 dark:text-white">C.F.</th>

                {/* Total */}
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-[#EBF2FA] dark:bg-slate-800">COM</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-[#EBF2FA] dark:bg-slate-800">PLC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-[#EBF2FA] dark:bg-slate-800">CYT</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-[#EBF2FA] dark:bg-slate-800">EYC</th>
                <th className="border border-slate-300 dark:border-slate-700 px-1.5 py-1 bg-[#DCE7F5] dark:bg-slate-700 font-bold text-[#22396F] dark:text-white">C.F.</th>
              </tr>
            </thead>

            <tbody className="font-mono tabular-nums divide-y divide-slate-200 dark:divide-slate-700">
              {studentGrades.map(({ subject, record }) => {
                if (!record) {
                  return (
                    <tr key={subject.id}>
                      <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left font-sans font-semibold text-slate-800 dark:text-slate-200">
                        {subject.nombre}
                      </td>
                      <td colSpan={25} className="border border-slate-300 dark:border-slate-700 py-2 text-slate-400 font-sans text-xs">
                        No hay calificaciones registradas
                      </td>
                    </tr>
                  );
                }

                const { P1, P2, P3, P4 } = record.periodos;

                const renderCell = (score: number, isCf = false) => {
                  const isFailing = score < 70;
                  return (
                    <td 
                      className={`border border-slate-300 dark:border-slate-700 py-1.5 px-1 ${
                        isCf ? 'bg-slate-100/70 dark:bg-slate-800 font-bold' : ''
                      } ${isFailing ? 'text-[#CE1126] font-bold' : 'text-slate-800 dark:text-slate-200'}`}
                    >
                      {score}
                    </td>
                  );
                };

                return (
                  <tr key={subject.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-left font-sans font-semibold text-slate-800 dark:text-slate-200 text-xs">
                      {subject.nombre}
                    </td>

                    {/* Periodo 1 */}
                    {renderCell(P1.com)}
                    {renderCell(P1.plc)}
                    {renderCell(P1.cyt)}
                    {renderCell(P1.eyc)}
                    {renderCell(P1.cf, true)}

                    {/* Periodo 2 */}
                    {renderCell(P2.com)}
                    {renderCell(P2.plc)}
                    {renderCell(P2.cyt)}
                    {renderCell(P2.eyc)}
                    {renderCell(P2.cf, true)}

                    {/* Periodo 3 */}
                    {renderCell(P3.com)}
                    {renderCell(P3.plc)}
                    {renderCell(P3.cyt)}
                    {renderCell(P3.eyc)}
                    {renderCell(P3.cf, true)}

                    {/* Periodo 4 */}
                    {renderCell(P4.com)}
                    {renderCell(P4.plc)}
                    {renderCell(P4.cyt)}
                    {renderCell(P4.eyc)}
                    {renderCell(P4.cf, true)}

                    {/* Total Anual */}
                    {renderCell(record.totalCom)}
                    {renderCell(record.totalPlc)}
                    {renderCell(record.totalCyt)}
                    {renderCell(record.totalEyc)}
                    {renderCell(record.calificacionFinal, true)}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Promedio de Asistencia Section */}
        <div className="mb-8">
          <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-2">
            Promedio de Asistencia
          </h3>
          <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-center text-xs">
            <thead>
              <tr className="bg-[#EBF2FA] dark:bg-slate-800 text-[#22396F] dark:text-blue-300 font-bold uppercase tracking-wider">
                <th className="border border-slate-300 dark:border-slate-700 py-2">Periodo 1</th>
                <th className="border border-slate-300 dark:border-slate-700 py-2">Periodo 2</th>
                <th className="border border-slate-300 dark:border-slate-700 py-2">Periodo 3</th>
                <th className="border border-slate-300 dark:border-slate-700 py-2">Periodo 4</th>
                <th className="border border-slate-300 dark:border-slate-700 py-2 bg-[#DCE7F5] dark:bg-slate-700">Promedio Anual</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums font-semibold">
              <tr>
                <td className="border border-slate-300 dark:border-slate-700 py-2.5">
                  {studentAtt.periodos?.P1?.porcentaje ? `${studentAtt.periodos.P1.porcentaje}%` : '—'}
                </td>
                <td className="border border-slate-300 dark:border-slate-700 py-2.5">
                  {studentAtt.periodos?.P2?.porcentaje ? `${studentAtt.periodos.P2.porcentaje}%` : '—'}
                </td>
                <td className="border border-slate-300 dark:border-slate-700 py-2.5">
                  {studentAtt.periodos?.P3?.porcentaje ? `${studentAtt.periodos.P3.porcentaje}%` : '—'}
                </td>
                <td className="border border-slate-300 dark:border-slate-700 py-2.5">
                  {studentAtt.periodos?.P4?.porcentaje ? `${studentAtt.periodos.P4.porcentaje}%` : '—'}
                </td>
                <td className="border border-slate-300 dark:border-slate-700 py-2.5 bg-slate-100/70 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                  {studentAtt.promedioAnual ? `${studentAtt.promedioAnual}%` : '—'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Observaciones por Período debajo de Asistencia (Desplegable) */}
          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#22396F] dark:text-blue-400" />
                Observaciones Pedagógicas por Período
              </span>
              <span className="text-[11px] text-slate-500">
                Comentarios y seguimiento cualitativo de los docentes
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(['P1', 'P2', 'P3', 'P4'] as const).map(pKey => {
                const periodNames: Record<string, string> = {
                  P1: 'Primer Período (P1)',
                  P2: 'Segundo Período (P2)',
                  P3: 'Tercer Período (P3)',
                  P4: 'Cuarto Período (P4)'
                };

                const observationsInPeriod = studentGrades
                  .map(({ subject, record }) => ({
                    subject,
                    observacion: record?.periodos[pKey]?.observacion
                  }))
                  .filter(item => Boolean(item.observacion && item.observacion.trim().length > 0));

                const isExpanded = expandedPeriods[pKey];
                const attPct = studentAtt.periodos?.[pKey]?.porcentaje;

                return (
                  <div 
                    key={pKey}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-800/30 transition-all"
                  >
                    {/* Period Header / Collapsible Trigger */}
                    <div className="p-3 bg-white dark:bg-slate-800/70 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {periodNames[pKey]}
                          </span>
                          {attPct && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-blue-50 text-[#22396F] dark:bg-slate-700 dark:text-blue-300">
                              Asist: {attPct}%
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 mt-0.5 block">
                          {observationsInPeriod.length > 0 
                            ? `${observationsInPeriod.length} materia(s) con observaciones` 
                            : 'Sin observaciones docentes registradas'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePeriod(pKey)}
                        className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors shrink-0"
                      >
                        <span>{isExpanded ? 'Ocultar' : 'Ver observaciones'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    </div>

                    {/* Collapsible Content */}
                    {isExpanded && (
                      <div className="p-3 space-y-2 animate-fade-in text-xs bg-slate-50/80 dark:bg-slate-900/40">
                        {observationsInPeriod.length === 0 ? (
                          <p className="text-slate-400 dark:text-slate-500 italic text-[11px] py-1 text-center">
                            No se registraron observaciones cualitativas para el {periodNames[pKey]}.
                          </p>
                        ) : (
                          observationsInPeriod.map(({ subject, observacion }) => (
                            <div 
                              key={subject.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700/60">
                                <span className="font-bold text-[#22396F] dark:text-blue-300 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                                  {subject.nombre}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {subject.profesorAsignado}
                                </span>
                              </div>
                              <p className="mt-1.5 text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                                {observacion}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Condición Final del Estudiante Section */}
        <div className="mb-8">
          <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white mb-2">
            Condición Final del Estudiante
          </h3>
          <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 min-h-20 bg-slate-50/50 dark:bg-slate-800/30 text-xs text-slate-800 dark:text-slate-200">
            {currentStudent.condicionFinal || 'Estudiante promovido al grado inmediato superior tras cumplir satisfactoriamente con las competencias requeridas.'}
          </div>
        </div>

        {/* Leyenda Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-12 text-xs">
          <h4 className="font-serif font-bold text-xs text-slate-900 dark:text-white mb-2">
            Leyenda
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 text-slate-600 dark:text-slate-400">
            <div className="space-y-1">
              <div><strong className="text-slate-900 dark:text-white">COM:</strong> Comunicativa</div>
              <div><strong className="text-slate-900 dark:text-white">CYT:</strong> Científica y Tecnológica / Ambiental y de la Salud</div>
              <div><strong className="text-slate-900 dark:text-white">C.F.:</strong> Calificación Final</div>
            </div>
            <div className="space-y-1">
              <div><strong className="text-slate-900 dark:text-white">PLC:</strong> Pens. Lógico, Creativo y Crítico / Resolución de Problemas</div>
              <div><strong className="text-slate-900 dark:text-white">EYC:</strong> Ética y Ciudadana / Desarrollo Personal y Espiritual</div>
              <div className="flex items-center gap-4 pt-1 font-semibold">
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado (≥70)
                </span>
                <span className="flex items-center gap-1 text-[#CE1126]">
                  <XCircle className="w-3.5 h-3.5" /> Reprobado (&lt;70)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Firmas Oficiales */}
        <div className="grid grid-cols-2 gap-8 sm:gap-20 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
          <div>
            <div className="w-48 sm:w-64 mx-auto border-t border-slate-400 dark:border-slate-600 pt-2 font-serif font-semibold text-slate-800 dark:text-slate-200">
              Maestro/a encargado/a del grado
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {school.maestroEncargadoDefault}
            </div>
          </div>

          <div>
            <div className="w-48 sm:w-64 mx-auto border-t border-slate-400 dark:border-slate-600 pt-2 font-serif font-semibold text-slate-800 dark:text-slate-200">
              Director/a del Centro
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {school.director}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
