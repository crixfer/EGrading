import React, { useState, useRef } from 'react';
import { Student, StudentAttendance, SchoolInfo, Subject, StudentSubjectGrade } from '../types';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  Upload, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertCircle,
  FileText,
  Trash2,
  Calendar,
  Save
} from 'lucide-react';
import { downloadSampleCSVTemplate, parseCSVStudentImport } from '../utils/exportUtils';

interface AttendanceAndStudentsViewProps {
  students: Student[];
  attendance: Record<string, StudentAttendance>;
  school: SchoolInfo;
  onAddStudent: (student: Student) => void;
  onUpdateAttendance: (attendanceMap: Record<string, StudentAttendance>) => void;
  onDeleteStudent: (studentId: string) => void;
  onOpenReportCard: (studentId: string) => void;
}

export const AttendanceAndStudentsView: React.FC<AttendanceAndStudentsViewProps> = ({
  students,
  attendance,
  school,
  onAddStudent,
  onUpdateAttendance,
  onDeleteStudent,
  onOpenReportCard
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'directory'>('attendance');
  const [selectedGrade, setSelectedGrade] = useState<string>('2do');
  const [selectedSection, setSelectedSection] = useState<string>('A');
  const [selectedPeriod, setSelectedPeriod] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P4');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Daily attendance state for today
  const [dailyAttendanceStatus, setDailyAttendanceStatus] = useState<Record<string, 'presente' | 'ausente' | 'tardanza' | 'justificado'>>({});
  const [attendanceSavedNotice, setAttendanceSavedNotice] = useState<string | null>(null);

  // New Student Manual Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newStudentForm, setNewStudentForm] = useState({
    apellidos: '',
    nombres: '',
    grado: '2do',
    seccion: 'A',
    tutor: '',
    tutorEmail: '',
    tutorTelefono: '',
    situacion: 'Activo'
  });

  // Excel/CSV Import modal state
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importedPreview, setImportedPreview] = useState<Partial<Student>[]>([]);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter students for display
  const filteredStudents = students.filter(s => {
    const matchesGrade = s.grado.toLowerCase() === selectedGrade.toLowerCase();
    const matchesSection = s.seccion.toUpperCase() === selectedSection.toUpperCase();
    const matchesSearch = searchQuery.trim() === '' || 
      `${s.nombres} ${s.apellidos} ${s.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSection && matchesSearch;
  });

  // Toggle quick attendance
  const setStatus = (studentId: string, status: 'presente' | 'ausente' | 'tardanza' | 'justificado') => {
    setDailyAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    const updated: Record<string, 'presente' | 'ausente' | 'tardanza' | 'justificado'> = {};
    filteredStudents.forEach(s => {
      updated[s.id] = 'presente';
    });
    setDailyAttendanceStatus(prev => ({ ...prev, ...updated }));
  };

  // Save attendance batch
  const handleSaveAttendance = () => {
    const updatedAttendance = { ...attendance };

    filteredStudents.forEach(s => {
      const status = dailyAttendanceStatus[s.id] || 'presente';
      const existing = updatedAttendance[s.id] || {
        estudianteId: s.id,
        periodos: {
          P1: { presentes: 45, ausentes: 5, porcentaje: 90 },
          P2: { presentes: 46, ausentes: 4, porcentaje: 92 },
          P3: { presentes: 47, ausentes: 3, porcentaje: 94 },
          P4: { presentes: 48, ausentes: 2, porcentaje: 96 }
        },
        promedioAnual: 93
      };

      const periodData = existing.periodos[selectedPeriod];
      let newPresentes = periodData.presentes;
      let newAusentes = periodData.ausentes;

      if (status === 'presente' || status === 'tardanza') {
        newPresentes += 1;
      } else if (status === 'ausente') {
        newAusentes += 1;
      }

      const totalDias = newPresentes + newAusentes;
      const nuevoPorcentaje = totalDias > 0 ? Math.round((newPresentes / totalDias) * 100) : 100;

      const p1 = existing.periodos.P1.porcentaje;
      const p2 = existing.periodos.P2.porcentaje;
      const p3 = existing.periodos.P3.porcentaje;
      const p4 = selectedPeriod === 'P4' ? nuevoPorcentaje : existing.periodos.P4.porcentaje;

      const promedioAnual = Math.round((p1 + p2 + p3 + p4) / 4);

      updatedAttendance[s.id] = {
        ...existing,
        periodos: {
          ...existing.periodos,
          [selectedPeriod]: {
            presentes: newPresentes,
            ausentes: newAusentes,
            porcentaje: nuevoPorcentaje
          }
        },
        promedioAnual
      };
    });

    onUpdateAttendance(updatedAttendance);
    setAttendanceSavedNotice('¡Asistencia diaria registrada y promedios actualizados correctamente!');
    setTimeout(() => setAttendanceSavedNotice(null), 3000);
  };

  // Manual Add Student submit
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.nombres || !newStudentForm.apellidos) return;

    const newStudent: Student = {
      id: `2026-${Math.floor(100 + Math.random() * 900)}`,
      apellidos: newStudentForm.apellidos,
      nombres: newStudentForm.nombres,
      grado: newStudentForm.grado,
      seccion: newStudentForm.seccion,
      tutor: newStudentForm.tutor || 'Tutor no especificado',
      tutorEmail: newStudentForm.tutorEmail || 'tutor@ejemplo.com',
      tutorTelefono: newStudentForm.tutorTelefono || '809-555-0000',
      situacion: newStudentForm.situacion || 'Activo',
      condicionFinal: 'En curso'
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    setNewStudentForm({
      apellidos: '',
      nombres: '',
      grado: '2do',
      seccion: 'A',
      tutor: '',
      tutorEmail: '',
      tutorTelefono: '',
      situacion: 'Activo'
    });
  };

  // Handle CSV file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const parsed = parseCSVStudentImport(content);
        setImportedPreview(parsed);
      }
    };
    reader.readAsText(file);
  };

  // Confirm import
  const handleConfirmImport = () => {
    importedPreview.forEach(p => {
      if (p.nombres && p.apellidos) {
        const student: Student = {
          id: p.id || `2026-${Math.floor(100 + Math.random() * 900)}`,
          apellidos: p.apellidos,
          nombres: p.nombres,
          grado: p.grado || '2do',
          seccion: p.seccion || 'A',
          tutor: p.tutor || 'Tutor',
          tutorEmail: p.tutorEmail || 'tutor@mail.com',
          tutorTelefono: p.tutorTelefono || '809-555-0000',
          situacion: 'Activo'
        };
        onAddStudent(student);
      }
    });

    setShowImportModal(false);
    setImportedPreview([]);
    setImportFileName(null);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header with Sub-tabs and Actions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22396F] dark:text-blue-400">
              Gestión Escolar y Matrícula
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">{school.nombre}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Control de Asistencia y Expediente de Estudiantes
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Tome asistencia diaria con un clic, gestione la nómina de alumnos o importe listados completos desde Excel.
          </p>
        </div>

        {/* Action Buttons: Add Student, Import Excel */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Agregar Estudiante
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Upload className="w-3.5 h-3.5" />
            Subir Archivo Excel
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          
          {/* Sub-tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-white dark:bg-slate-900 text-[#22396F] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pase de Asistencia Rápido
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'directory'
                  ? 'bg-white dark:bg-slate-900 text-[#22396F] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Directorio de Estudiantes
            </button>
          </div>

          {/* Section & Grade filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Grado:</span>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="1ro">1ro de Secundaria</option>
                <option value="2do">2do de Secundaria</option>
                <option value="3ro">3ro de Secundaria</option>
                <option value="4to">4to de Secundaria</option>
                <option value="5to">5to de Secundaria</option>
                <option value="6to">6to de Secundaria</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">Sección:</span>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="A">Sección A</option>
                <option value="B">Sección B</option>
                <option value="C">Sección C</option>
              </select>
            </div>

            {activeTab === 'attendance' && (
              <div className="flex items-center gap-1">
                <span className="text-slate-500 font-medium">Período:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-[#22396F] dark:text-blue-300 focus:outline-none"
                >
                  <option value="P1">P1 (Sept-Nov)</option>
                  <option value="P2">P2 (Dic-Feb)</option>
                  <option value="P3">P3 (Mar-Abr)</option>
                  <option value="P4">P4 (May-Jun)</option>
                </select>
              </div>
            )}
          </div>

        </div>

        {/* Search bar & batch quick action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#22396F]"
            />
          </div>

          {activeTab === 'attendance' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllPresent}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                Marcar Todos Presentes
              </button>
              <button
                onClick={handleSaveAttendance}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Asistencia de Hoy
              </button>
            </div>
          )}
        </div>

        {attendanceSavedNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {attendanceSavedNotice}
          </div>
        )}

      </div>

      {/* Main Table: Attendance or Directory */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        
        {activeTab === 'attendance' ? (
          /* Attendance Mode */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Estudiante</th>
                  <th className="py-2.5 px-3">Grado</th>
                  <th className="py-2.5 px-3 text-center">Registro de Hoy</th>
                  <th className="py-2.5 px-3 text-center">{selectedPeriod} (%)</th>
                  <th className="py-2.5 px-3 text-center">Promedio Anual</th>
                  <th className="py-2.5 px-3 text-right">Boletín</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-sans">
                      No se encontraron estudiantes para los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(student => {
                    const att = attendance[student.id];
                    const currentStatus = dailyAttendanceStatus[student.id] || 'presente';
                    const periodPct = att ? att.periodos[selectedPeriod].porcentaje : 96;
                    const anualPct = att ? att.promedioAnual : 96;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-500 font-medium">{student.id}</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {student.apellidos}, {student.nombres}
                          </div>
                          <span className="text-[11px] text-slate-400">Tutor: {student.tutor}</span>
                        </td>
                        <td className="py-3 px-3 font-medium">
                          {student.grado.toUpperCase()} {student.seccion}
                        </td>
                        
                        {/* Attendance Toggle Buttons */}
                        <td className="py-2 px-3 text-center">
                          <div className="inline-flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <button
                              onClick={() => setStatus(student.id, 'presente')}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                currentStatus === 'presente'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                              }`}
                            >
                              Presente
                            </button>
                            <button
                              onClick={() => setStatus(student.id, 'tardanza')}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                currentStatus === 'tardanza'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                              }`}
                            >
                              Tardanza
                            </button>
                            <button
                              onClick={() => setStatus(student.id, 'justificado')}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                currentStatus === 'justificado'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                              }`}
                            >
                              Justificado
                            </button>
                            <button
                              onClick={() => setStatus(student.id, 'ausente')}
                              className={`px-2 py-1 rounded text-[11px] font-bold transition-colors ${
                                currentStatus === 'ausente'
                                  ? 'bg-[#CE1126] text-white shadow-xs'
                                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                              }`}
                            >
                              Ausente
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-3 text-center font-mono tabular-nums font-semibold">
                          <span className={periodPct < 80 ? 'text-[#CE1126] font-bold' : ''}>
                            {periodPct}%
                          </span>
                        </td>

                        <td className="py-3 px-3 text-center font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                          <span className={anualPct < 80 ? 'text-[#CE1126]' : ''}>
                            {anualPct}%
                          </span>
                        </td>

                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onOpenReportCard(student.id)}
                            className="px-2.5 py-1 text-xs font-semibold rounded bg-[#22396F] text-white hover:bg-[#1B2D58] transition-colors"
                          >
                            Boletín
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Directory Mode */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Apellidos y Nombres</th>
                  <th className="py-2.5 px-3">Curso</th>
                  <th className="py-2.5 px-3">Tutor Principal</th>
                  <th className="py-2.5 px-3">Contacto</th>
                  <th className="py-2.5 px-3 text-center">Situación</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-slate-500 font-medium">{student.id}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {student.apellidos}, {student.nombres}
                    </td>
                    <td className="py-3 px-3 font-semibold uppercase">
                      {student.grado} {student.seccion}
                    </td>
                    <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                      {student.tutor}
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      <div>{student.tutorEmail}</div>
                      <div className="text-[10px]">{student.tutorTelefono}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {student.situacion}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenReportCard(student.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-[#22396F] text-white hover:bg-[#1B2D58]"
                        >
                          Boletín
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student.id)}
                          className="p-1 text-slate-400 hover:text-[#CE1126] transition-colors rounded"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Manual Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Registrar Nuevo Estudiante
            </h2>
            <p className="text-xs text-slate-500">
              Ingrese los datos del alumno y de su tutor para agregarlo al sistema escolar.
            </p>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombres *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.nombres}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, nombres: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                    placeholder="Ej. Ana Victoria"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Apellidos *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.apellidos}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, apellidos: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                    placeholder="Ej. Mejía Rosario"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Grado *</label>
                  <select
                    value={newStudentForm.grado}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, grado: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="1ro">1ro de Secundaria</option>
                    <option value="2do">2do de Secundaria</option>
                    <option value="3ro">3ro de Secundaria</option>
                    <option value="4to">4to de Secundaria</option>
                    <option value="5to">5to de Secundaria</option>
                    <option value="6to">6to de Secundaria</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sección *</label>
                  <select
                    value={newStudentForm.seccion}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, seccion: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                    <option value="C">Sección C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre del Tutor *</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.tutor}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, tutor: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                  placeholder="Ej. Carlos Mejía"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo del Tutor</label>
                  <input
                    type="email"
                    value={newStudentForm.tutorEmail}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, tutorEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="carlos.mejia@gmail.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={newStudentForm.tutorTelefono}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, tutorTelefono: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    placeholder="809-555-0142"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#22396F] text-white hover:bg-[#1B2D58]"
                >
                  Guardar Estudiante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel / CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Importación Masiva de Estudiantes desde Excel / CSV
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Suba la hoja de cálculo con la nómina de estudiantes para extraerlos automáticamente.
                </p>
              </div>
              <button
                onClick={downloadSampleCSVTemplate}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-[#22396F] dark:text-blue-400 hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar Plantilla CSV
              </button>
            </div>

            {/* Drop Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#22396F] rounded-xl p-8 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .xlsx, .txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileSpreadsheet className="w-10 h-10 text-[#22396F] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {importFileName ? `Archivo seleccionado: ${importFileName}` : 'Haga clic para seleccionar o arrastre un archivo Excel (.xlsx / .csv)'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Columnas requeridas: Codigo, Apellidos, Nombres, Grado, Seccion, Tutor, TutorEmail, TutorTelefono
              </p>
            </div>

            {/* Preview of Parsed Students */}
            {importedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Previsualización ({importedPreview.length} estudiantes detectados):</span>
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0 text-[11px] font-bold text-slate-500">
                      <tr>
                        <th className="p-2">Código</th>
                        <th className="p-2">Apellidos</th>
                        <th className="p-2">Nombres</th>
                        <th className="p-2">Curso</th>
                        <th className="p-2">Tutor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {importedPreview.map((p, idx) => (
                        <tr key={idx} className="text-[11px]">
                          <td className="p-2 font-mono">{p.id}</td>
                          <td className="p-2 font-semibold">{p.apellidos}</td>
                          <td className="p-2">{p.nombres}</td>
                          <td className="p-2">{p.grado} {p.seccion}</td>
                          <td className="p-2">{p.tutor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => { setShowImportModal(false); setImportedPreview([]); }}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                disabled={importedPreview.length === 0}
                onClick={handleConfirmImport}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#22396F] text-white hover:bg-[#1B2D58] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar e Importar {importedPreview.length > 0 ? `(${importedPreview.length})` : ''}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
