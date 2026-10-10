import React, { useState } from 'react';
import { Subject, Student, StudentSubjectGrade, UserAccount, CompetencyScores, SchoolInfo } from '../types';
import { 
  Calculator, 
  BookOpen, 
  Globe, 
  FlaskConical, 
  Activity, 
  Palette, 
  HeartHandshake, 
  Languages,
  Users,
  Award,
  TrendingUp,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Search,
  Filter,
  Lock,
  Download,
  Printer,
  MessageSquare
} from 'lucide-react';
import { downloadSabanaHTML } from '../utils/exportUtils';

const QUICK_OBSERVATIONS = [
  "Excelente rendimiento, demuestra alto dominio de las competencias curriculares.",
  "Participación activa, gran espíritu de colaboración y liderazgo constructivo.",
  "Progreso notable en razonamiento lógico y resolución de problemas.",
  "Cumplimiento puntual y esmerado en tareas y proyectos asignados.",
  "Se sugiere reforzar la constancia en el estudio y entrega de guías.",
  "Requiere acompañamiento adicional en comprensión y producción de textos.",
  "Mantiene una convivencia armoniosa y respeto a los valores éticos."
];

interface SubjectsViewProps {
  subjects: Subject[];
  students: Student[];
  grades: StudentSubjectGrade[];
  currentUser: UserAccount;
  school?: SchoolInfo;
  onUpdateGrade: (grade: StudentSubjectGrade) => void;
  onOpenReportCard: (studentId: string) => void;
}

export const SubjectsView: React.FC<SubjectsViewProps> = ({
  subjects,
  students,
  grades,
  currentUser,
  school,
  onUpdateGrade,
  onOpenReportCard
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [gradeFilter, setGradeFilter] = useState<string>('2do');
  const [sectionFilter, setSectionFilter] = useState<string>('A');
  const [selectedPeriod, setSelectedPeriod] = useState<'P1' | 'P2' | 'P3' | 'P4'>('P4');
  const [searchStudent, setSearchStudent] = useState<string>('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  // Observation modal state
  const [activeObservationStudent, setActiveObservationStudent] = useState<Student | null>(null);
  const [observationDraft, setObservationDraft] = useState<string>('');

  // Local draft state for gradebook editing
  const [draftGrades, setDraftGrades] = useState<Record<string, { com: number; plc: number; cyt: number; eyc: number }>>({});

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5 text-white" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-white" />;
      case 'Globe': return <Globe className="w-5 h-5 text-white" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-white" />;
      case 'Activity': return <Activity className="w-5 h-5 text-white" />;
      case 'Palette': return <Palette className="w-5 h-5 text-white" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-white" />;
      case 'Languages': return <Languages className="w-5 h-5 text-white" />;
      default: return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  // Open the gradebook modal for a subject
  const handleOpenGradebook = (subject: Subject) => {
    setSelectedSubject(subject);

    // Initialize drafts
    const initialDrafts: Record<string, { com: number; plc: number; cyt: number; eyc: number }> = {};
    const relevantGrades = grades.filter(g => g.materiaId === subject.id);
    
    relevantGrades.forEach(g => {
      const p = g.periodos[selectedPeriod];
      initialDrafts[g.estudianteId] = {
        com: p.com,
        plc: p.plc,
        cyt: p.cyt,
        eyc: p.eyc
      };
    });

    setDraftGrades(initialDrafts);
  };

  // Change period in gradebook modal
  const handlePeriodChange = (period: 'P1' | 'P2' | 'P3' | 'P4') => {
    setSelectedPeriod(period);
    if (!selectedSubject) return;

    const newDrafts: Record<string, { com: number; plc: number; cyt: number; eyc: number }> = {};
    const relevantGrades = grades.filter(g => g.materiaId === selectedSubject.id);

    relevantGrades.forEach(g => {
      const p = g.periodos[period];
      newDrafts[g.estudianteId] = {
        com: p.com,
        plc: p.plc,
        cyt: p.cyt,
        eyc: p.eyc
      };
    });

    setDraftGrades(newDrafts);
  };

  // Update a single draft score
  const handleScoreChange = (
    studentId: string, 
    competency: 'com' | 'plc' | 'cyt' | 'eyc', 
    val: string
  ) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setDraftGrades(prev => {
      const current = prev[studentId] || { com: 75, plc: 75, cyt: 75, eyc: 75 };
      return {
        ...prev,
        [studentId]: {
          ...current,
          [competency]: num
        }
      };
    });
  };

  // Save changes to grades state
  const handleSaveDraftGrades = () => {
    if (!selectedSubject) return;

    Object.entries(draftGrades).forEach(([studentId, scores]) => {
      let existing = grades.find(g => g.estudianteId === studentId && g.materiaId === selectedSubject.id);
      
      const cf = Math.round((scores.com + scores.plc + scores.cyt + scores.eyc) / 4);

      if (existing) {
        const updatedPeriodos = {
          ...existing.periodos,
          [selectedPeriod]: {
            ...existing.periodos[selectedPeriod],
            ...scores,
            cf
          }
        };

        const pList = [updatedPeriodos.P1, updatedPeriodos.P2, updatedPeriodos.P3, updatedPeriodos.P4];
        const totalCom = Math.round(pList.reduce((acc, p) => acc + p.com, 0) / 4);
        const totalPlc = Math.round(pList.reduce((acc, p) => acc + p.plc, 0) / 4);
        const totalCyt = Math.round(pList.reduce((acc, p) => acc + p.cyt, 0) / 4);
        const totalEyc = Math.round(pList.reduce((acc, p) => acc + p.eyc, 0) / 4);
        const calificacionFinal = Math.round(pList.reduce((acc, p) => acc + p.cf, 0) / 4);

        const updated: StudentSubjectGrade = {
          ...existing,
          periodos: updatedPeriodos,
          totalCom,
          totalPlc,
          totalCyt,
          totalEyc,
          calificacionFinal,
          estado: calificacionFinal >= 70 ? 'Aprobado' : 'Reprobado'
        };

        onUpdateGrade(updated);
      }
    });

    setSaveSuccessNotice('¡Calificaciones del período guardadas con éxito y sincronizadas!');
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  // Open observation modal for a student
  const handleOpenObservationModal = (student: Student) => {
    setActiveObservationStudent(student);
    if (!selectedSubject) return;
    const currentGrade = grades.find(g => g.estudianteId === student.id && g.materiaId === selectedSubject.id);
    const existingObs = currentGrade?.periodos[selectedPeriod]?.observacion || '';
    setObservationDraft(existingObs);
  };

  // Save observation for the active student in current period
  const handleSaveObservation = () => {
    if (!selectedSubject || !activeObservationStudent) return;
    const existingGrade = grades.find(
      g => g.estudianteId === activeObservationStudent.id && g.materiaId === selectedSubject.id
    );
    if (existingGrade) {
      const updatedPeriod = {
        ...existingGrade.periodos[selectedPeriod],
        observacion: observationDraft.trim()
      };
      const updatedGrade: StudentSubjectGrade = {
        ...existingGrade,
        periodos: {
          ...existingGrade.periodos,
          [selectedPeriod]: updatedPeriod
        }
      };
      onUpdateGrade(updatedGrade);
      setSaveSuccessNotice(`Observación de ${activeObservationStudent.nombres} para ${selectedPeriod} guardada con éxito.`);
      setTimeout(() => setSaveSuccessNotice(null), 3500);
    }
    setActiveObservationStudent(null);
  };

  // Filter students for the active modal
  const modalStudents = students.filter(s => {
    const matchesGrade = s.grado.toLowerCase() === gradeFilter.toLowerCase();
    const matchesSection = s.seccion.toUpperCase() === sectionFilter.toUpperCase();
    const matchesSearch = searchStudent.trim() === '' || 
      `${s.nombres} ${s.apellidos} ${s.id}`.toLowerCase().includes(searchStudent.toLowerCase());
    return matchesGrade && matchesSection && matchesSearch;
  });

  // Check if current user is authorized to manage this specific subject
  const canManageSubject = (subjectId: string) => {
    if (currentUser.rol === 'admin') return true;
    if (currentUser.rol === 'teacher') {
      if (currentUser.materiasAsignadas && currentUser.materiasAsignadas.length > 0) {
        return currentUser.materiasAsignadas.includes(subjectId);
      }
      return false;
    }
    return false;
  };

  // Human-readable role strictly for visualization:
  // "En Materias y Notas> Rol actual: Lic. Matematicas. No Teacher. Esto solo para visualizacion."
  const displayRole = (() => {
    if (currentUser.rol === 'admin') return 'Administrador General';
    if (currentUser.rol === 'parent') return 'Tutor Legal';
    if (currentUser.rol === 'teacher') {
      if (currentUser.tituloProfesional && currentUser.tituloProfesional.toLowerCase() !== 'teacher') {
        return currentUser.tituloProfesional;
      }
      if (currentUser.materiasAsignadas && currentUser.materiasAsignadas.length > 0) {
        const firstSub = subjects.find(s => s.id === currentUser.materiasAsignadas![0]);
        return `Lic. ${firstSub ? firstSub.nombre : 'Matemáticas'}`;
      }
      return 'Lic. Matemáticas';
    }
    return 'Docente Titular';
  })();

  const assignedSubjectNames = currentUser.materiasAsignadas && currentUser.materiasAsignadas.length > 0
    ? currentUser.materiasAsignadas.map(id => subjects.find(s => s.id === id)?.nombre || id).join(', ')
    : 'Ninguna';

  return (
    <div className="space-y-6">
      
      {/* Header Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22396F] dark:text-blue-400">
              Currículo Dominicano MINERD
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">8 Asignaturas Principales</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Gestión de Materias y Calificaciones por Competencias
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Capture las notas por competencias fundamentales (COM, PLC, CYT, EYC) de manera ágil y visual por sección.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs">
            <span className="text-slate-500 font-medium">Rol actual: </span>
            <strong className="text-[#22396F] dark:text-blue-300 font-bold">{displayRole}</strong>
          </div>
        </div>
      </div>

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {subjects.map(subject => {
          // Calculate statistics for this subject
          const subjectGrades = grades.filter(g => g.materiaId === subject.id);
          const avgScore = subjectGrades.length > 0 
            ? Math.round(subjectGrades.reduce((acc, g) => acc + g.calificacionFinal, 0) / subjectGrades.length) 
            : 85;
          const passingCount = subjectGrades.filter(g => g.calificacionFinal >= 70).length;
          const passRate = subjectGrades.length > 0 
            ? Math.round((passingCount / subjectGrades.length) * 100) 
            : 100;

          // Competency mini scores
          const comAvg = subjectGrades.length ? Math.round(subjectGrades.reduce((a, g) => a + g.totalCom, 0) / subjectGrades.length) : 88;
          const plcAvg = subjectGrades.length ? Math.round(subjectGrades.reduce((a, g) => a + g.totalPlc, 0) / subjectGrades.length) : 85;
          const cytAvg = subjectGrades.length ? Math.round(subjectGrades.reduce((a, g) => a + g.totalCyt, 0) / subjectGrades.length) : 89;
          const eycAvg = subjectGrades.length ? Math.round(subjectGrades.reduce((a, g) => a + g.totalEyc, 0) / subjectGrades.length) : 95;

          return (
            <div 
              key={subject.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Subject Image Header */}
              <div className="relative h-36 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={subject.imagen} 
                  alt={subject.nombre}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-3.5">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: subject.color }}
                    >
                      {getSubjectIcon(subject.icono)}
                    </div>
                    <div className="text-white">
                      <h2 className="text-base font-bold leading-tight drop-shadow-xs">{subject.nombre}</h2>
                      <span className="text-[10px] text-white/80 block">{subject.profesorAsignado}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Body & Metrics */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {subject.descripcion}
                </p>

                {/* Score & Pass Rate Stats */}
                <div className="grid grid-cols-2 gap-2 py-2 border-y border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Promedio</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                      {avgScore} pts
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aprobación</span>
                    <span className="text-lg font-bold font-mono tabular-nums text-emerald-600">
                      {passRate}%
                    </span>
                  </div>
                </div>

                {/* Competency Indicators */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Competencias Clave
                  </span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono tabular-nums">
                    <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded border border-slate-200/50 dark:border-slate-700/50">
                      <span className="block text-[9px] font-bold text-[#22396F] dark:text-blue-400">COM</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{comAvg}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded border border-slate-200/50 dark:border-slate-700/50">
                      <span className="block text-[9px] font-bold text-[#CE1126] dark:text-red-400">PLC</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{plcAvg}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded border border-slate-200/50 dark:border-slate-700/50">
                      <span className="block text-[9px] font-bold text-emerald-700 dark:text-emerald-400">CYT</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{cytAvg}</span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-1 rounded border border-slate-200/50 dark:border-slate-700/50">
                      <span className="block text-[9px] font-bold text-indigo-700 dark:text-indigo-400">EYC</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{eycAvg}</span>
                    </div>
                  </div>
                </div>

                {/* Action button: Active or Restricted by teacher role */}
                {canManageSubject(subject.id) ? (
                  <div className="space-y-1.5">
                    {currentUser.rol === 'teacher' && (
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Materia a su cargo
                      </span>
                    )}
                    <button
                      onClick={() => handleOpenGradebook(subject)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#22396F] hover:bg-[#1B2D58] text-white flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Gestionar Calificaciones
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div 
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
                      title={
                        currentUser.rol === 'teacher'
                          ? `Acceso Restringido: Su rol (${displayRole}) solo gestiona su materia asignada (${assignedSubjectNames}). Asignada a: ${subject.profesorAsignado}.`
                          : `Solo lectura institucional (${subject.profesorAsignado})`
                      }
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Solo lectura — No asignada a su rol</span>
                    </div>
                    <button
                      onClick={() => handleOpenGradebook(subject)}
                      className="w-full py-1.5 px-3 rounded-lg text-[11px] font-medium bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      <span>Ver Sábana (Modo Consulta)</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* Gradebook / Sábana de Notas Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: selectedSubject.color }}
                >
                  {getSubjectIcon(selectedSubject.icono)}
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedSubject.nombre} — Sábana de Calificaciones
                  </h2>
                  <span className="text-xs text-slate-500">
                    Docente: {selectedSubject.profesorAsignado} · {selectedSubject.creditos} Créditos
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSubject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs">
              
              <div className="flex items-center gap-3 flex-wrap">
                {/* Grade Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Grado:</span>
                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="1ro">1ro Secundaria</option>
                    <option value="2do">2do Secundaria</option>
                    <option value="3ro">3ro Secundaria</option>
                    <option value="4to">4to Secundaria</option>
                    <option value="5to">5to Secundaria</option>
                    <option value="6to">6to Secundaria</option>
                  </select>
                </div>

                {/* Section Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Sección:</span>
                  <select
                    value={sectionFilter}
                    onChange={(e) => setSectionFilter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="A">Sección A</option>
                    <option value="B">Sección B</option>
                    <option value="C">Sección C</option>
                  </select>
                </div>

                {/* Period Selector Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                  {(['P1', 'P2', 'P3', 'P4'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => handlePeriodChange(p)}
                      className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                        selectedPeriod === p 
                          ? 'bg-[#22396F] text-white shadow-xs' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search student in section */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                />
              </div>

            </div>

            {/* Notification alert inside modal */}
            {saveSuccessNotice && (
              <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {saveSuccessNotice}
              </div>
            )}

            {/* Read-only notice when teacher has no permission for this subject */}
            {!canManageSubject(selectedSubject.id) && (
              <div className="mx-4 mt-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Modo Solo Lectura: Su rol ({displayRole}) solo gestiona su materia asignada ({assignedSubjectNames}). Las notas aquí mostradas corresponden a la asignatura de {selectedSubject.profesorAsignado}.
                </span>
              </div>
            )}

            {/* Editable Grades Matrix */}
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Estudiante</th>
                    <th className="py-2.5 px-2 text-center w-20">COM (Com.)</th>
                    <th className="py-2.5 px-2 text-center w-20">PLC (Lóg.)</th>
                    <th className="py-2.5 px-2 text-center w-20">CYT (Cien.)</th>
                    <th className="py-2.5 px-2 text-center w-20">EYC (Ética)</th>
                    <th className="py-2.5 px-3 text-center w-24">C.F. ({selectedPeriod})</th>
                    <th className="py-2.5 px-3 text-center">Estado</th>
                    <th className="py-2.5 px-3 text-center w-32">Observaciones ({selectedPeriod})</th>
                    <th className="py-2.5 px-3 text-right">Boletín</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                  {modalStudents.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-slate-400 font-sans">
                        No hay estudiantes inscritos en {gradeFilter.toUpperCase()} {sectionFilter} con ese criterio.
                      </td>
                    </tr>
                  ) : (
                    modalStudents.map(student => {
                      const current = draftGrades[student.id] || { com: 80, plc: 80, cyt: 80, eyc: 80 };
                      const cf = Math.round((current.com + current.plc + current.cyt + current.eyc) / 4);
                      const isPassing = cf >= 70;
                      const isEditable = canManageSubject(selectedSubject.id);

                      const existingGrade = grades.find(g => g.estudianteId === student.id && g.materiaId === selectedSubject.id);
                      const existingObservation = existingGrade?.periodos[selectedPeriod]?.observacion;

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 text-slate-500 font-sans">{student.id}</td>
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                            {student.apellidos}, {student.nombres}
                          </td>

                          {/* COM Input */}
                          <td className="py-1 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={!isEditable}
                              value={current.com}
                              onChange={(e) => handleScoreChange(student.id, 'com', e.target.value)}
                              className={`w-16 text-center py-1 rounded font-bold ${
                                isEditable 
                                  ? 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]' 
                                  : 'bg-slate-100 dark:bg-slate-800/60 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed'
                              }`}
                            />
                          </td>

                          {/* PLC Input */}
                          <td className="py-1 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={!isEditable}
                              value={current.plc}
                              onChange={(e) => handleScoreChange(student.id, 'plc', e.target.value)}
                              className={`w-16 text-center py-1 rounded font-bold ${
                                isEditable 
                                  ? 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]' 
                                  : 'bg-slate-100 dark:bg-slate-800/60 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed'
                              }`}
                            />
                          </td>

                          {/* CYT Input */}
                          <td className="py-1 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={!isEditable}
                              value={current.cyt}
                              onChange={(e) => handleScoreChange(student.id, 'cyt', e.target.value)}
                              className={`w-16 text-center py-1 rounded font-bold ${
                                isEditable 
                                  ? 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]' 
                                  : 'bg-slate-100 dark:bg-slate-800/60 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed'
                              }`}
                            />
                          </td>

                          {/* EYC Input */}
                          <td className="py-1 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              disabled={!isEditable}
                              value={current.eyc}
                              onChange={(e) => handleScoreChange(student.id, 'eyc', e.target.value)}
                              className={`w-16 text-center py-1 rounded font-bold ${
                                isEditable 
                                  ? 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]' 
                                  : 'bg-slate-100 dark:bg-slate-800/60 border border-transparent text-slate-500 dark:text-slate-400 cursor-not-allowed'
                              }`}
                            />
                          </td>

                          {/* CF Result */}
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded font-extrabold text-sm ${
                              isPassing 
                                ? 'bg-slate-100 dark:bg-slate-800 text-[#22396F] dark:text-blue-300' 
                                : 'bg-red-50 dark:bg-red-950/40 text-[#CE1126]'
                            }`}>
                              {cf}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 text-center font-sans font-semibold">
                            <span className={`inline-flex items-center gap-1 text-[11px] ${
                              isPassing ? 'text-emerald-700 dark:text-emerald-400' : 'text-[#CE1126]'
                            }`}>
                              {isPassing ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {isPassing ? 'Aprobado' : 'Reprobado'}
                            </span>
                          </td>

                          {/* Observación Button Trigger */}
                          <td className="py-2 px-3 text-center font-sans">
                            <button
                              type="button"
                              onClick={() => handleOpenObservationModal(student)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-2xs ${
                                existingObservation
                                  ? 'bg-blue-50 text-[#22396F] border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800 hover:bg-blue-100'
                                  : isEditable
                                  ? 'text-slate-600 hover:text-[#22396F] dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700'
                                  : 'text-slate-400 border border-slate-200 dark:border-slate-800 opacity-60'
                              }`}
                              title={existingObservation ? `Observación (${selectedPeriod}): "${existingObservation}"` : 'Haga clic para agregar una observación pedagógica'}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#22396F] dark:text-blue-400 shrink-0" />
                              <span>{existingObservation ? 'Ver / Editar' : '+ Obs.'}</span>
                            </button>
                          </td>

                          {/* Open Bulletin */}
                          <td className="py-2.5 px-3 text-right font-sans">
                            <button
                              onClick={() => {
                                setSelectedSubject(null);
                                onOpenReportCard(student.id);
                              }}
                              className="text-[11px] text-[#22396F] dark:text-blue-400 hover:underline font-semibold"
                            >
                              Ver Boletín
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Leyenda Oficial de Competencias MINERD en la Sábana */}
            <div className="px-4 py-3 bg-slate-50/90 dark:bg-slate-800/70 border-t border-slate-200 dark:border-slate-700/80 text-xs">
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-200/60 dark:border-slate-700/60">
                <span className="font-bold text-[11px] text-slate-900 dark:text-white uppercase tracking-wider">
                  Leyenda Oficial de Competencias Fundamentales (Currículo Dominicano MINERD)
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Escala 0-100 pts · Cierre Período {selectedPeriod}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-[#22396F] dark:text-blue-400 block">COM (Comunicativa):</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">Comprensión y producción oral y escrita, lectura comprensiva e interpretación de códigos.</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-[#CE1126] dark:text-red-400 block">PLC (Pens. Lógico / Crítico):</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">Pensamiento lógico, creativo y crítico / Planteamiento y resolución de problemas.</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 block">CYT (Científica / Tecnológica):</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">Indagación científica, ambiental, de la salud y aplicación de tecnologías.</p>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-indigo-700 dark:text-indigo-400 block">EYC (Ética y Ciudadana):</span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">Ética ciudadana, desarrollo personal y espiritual, convivencia armónica y valores.</p>
                </div>
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  <strong>C.F.:</strong> Calificación Final del Período = (COM + PLC + CYT + EYC) ÷ 4
                </span>
                <div className="flex items-center gap-3 font-semibold">
                  <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado (≥ 70 pts)
                  </span>
                  <span className="text-[#CE1126] flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Reprobado (&lt; 70 pts)
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer with Save Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Docente responsable: <strong className="text-slate-800 dark:text-slate-200">{selectedSubject.profesorAsignado}</strong>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {school && (
                  <button
                    onClick={() => downloadSabanaHTML(selectedSubject, gradeFilter, sectionFilter, selectedPeriod, modalStudents, grades, school)}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-[#22396F] dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    title="Descargar Sábana Oficial en HTML con Leyenda de Competencias"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar Sábana
                  </button>
                )}
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Sábana
                </button>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cerrar
                </button>
                {canManageSubject(selectedSubject.id) && (
                  <button
                    onClick={handleSaveDraftGrades}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Calificaciones
                  </button>
                )}
              </div>
            </div>

      {/* Observation Dialog Modal */}
      {activeObservationStudent && selectedSubject && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg my-auto overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#22396F] dark:text-blue-400" />
                  Observación Pedagógica — Período {selectedPeriod}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estudiante: <strong className="text-slate-800 dark:text-slate-200">{activeObservationStudent.apellidos}, {activeObservationStudent.nombres}</strong> ({activeObservationStudent.id})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveObservationStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                <span>Asignatura: <strong className="text-slate-900 dark:text-white">{selectedSubject.nombre}</strong></span>
                <span>Docente: <strong className="text-slate-900 dark:text-white">{selectedSubject.profesorAsignado}</strong></span>
              </div>

              {/* Quick MINERD suggestion chips */}
              {canManageSubject(selectedSubject.id) && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Sugerencias Pedagógicas Rápidas (MINERD):
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    {QUICK_OBSERVATIONS.map((phrase, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setObservationDraft(prev => prev ? `${prev} ${phrase}` : phrase);
                        }}
                        className="text-[11px] px-2 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#22396F] dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700 text-left transition-colors"
                      >
                        + {phrase}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Comentario u Observación del Período {selectedPeriod}:
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {observationDraft.length}/350 caracteres
                  </span>
                </div>
                <textarea
                  rows={4}
                  maxLength={350}
                  disabled={!canManageSubject(selectedSubject.id)}
                  value={observationDraft}
                  onChange={(e) => setObservationDraft(e.target.value)}
                  placeholder={
                    canManageSubject(selectedSubject.id)
                      ? "Describa el progreso cualitativo, fortalezas demostradas o áreas de refuerzo del estudiante para este período..."
                      : "No posee permisos de edición para esta materia."
                  }
                  className={`w-full p-3 rounded-lg border text-xs leading-relaxed focus:outline-none ${
                    canManageSubject(selectedSubject.id)
                      ? 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#22396F]'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                />
              </div>

              {!canManageSubject(selectedSubject.id) && (
                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11px] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>Modo solo lectura: Solo el docente de {selectedSubject.nombre} ({selectedSubject.profesorAsignado}) puede modificar esta observación.</span>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveObservationStudent(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cerrar
                </button>
                {canManageSubject(selectedSubject.id) && (
                  <button
                    type="button"
                    onClick={handleSaveObservation}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Guardar Observación
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
