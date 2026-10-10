import React, { useState } from 'react';
import { SchoolInfo, UserAccount, SaaSPlan, Subject } from '../types';
import { SAAS_PLANS, INITIAL_SUBJECTS } from '../data/mockData';
import { 
  Building2, 
  CreditCard, 
  ShieldCheck, 
  Key, 
  Code, 
  Users, 
  CheckCircle2, 
  Download, 
  FileSpreadsheet, 
  Lock, 
  Settings, 
  Save, 
  Activity, 
  Terminal,
  Copy,
  Check,
  Edit3,
  Plus,
  X,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

interface SaaSAdminViewProps {
  school: SchoolInfo;
  onUpdateSchool: (info: SchoolInfo) => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  subjects?: Subject[];
  activePlan: string;
  onSelectPlan: (planId: string) => void;
}

export const SaaSAdminView: React.FC<SaaSAdminViewProps> = ({
  school,
  onUpdateSchool,
  users,
  onUpdateUsers,
  subjects,
  activePlan,
  onSelectPlan
}) => {
  const [activeTab, setActiveTab] = useState<'plans' | 'institution' | 'users' | 'security' | 'api'>('plans');
  const [schoolForm, setSchoolForm] = useState<SchoolInfo>(school);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<boolean>(false);

  // User & Role Assignment Modal State
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const availableSubjects = subjects && subjects.length > 0 ? subjects : INITIAL_SUBJECTS;

  const [userForm, setUserForm] = useState<{
    nombre: string;
    email: string;
    profesionPrefijo: string;
    rol: 'admin' | 'teacher' | 'parent';
    materiasAsignadas: string[];
    dosFactores: boolean;
  }>({
    nombre: '',
    email: '',
    profesionPrefijo: 'Lic.',
    rol: 'teacher',
    materiasAsignadas: ['mat'],
    dosFactores: true
  });

  const handleSaveSchool = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchool(schoolForm);
    setSavedNotice('¡Configuración institucional guardada correctamente!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleToggle2FA = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        return { ...u, dosFactores: !u.dosFactores };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard?.writeText?.('egrd_live_99a8b2c4e1f7d30198cae554');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Open modal for creating new user
  const handleOpenCreateUser = () => {
    setIsCreatingUser(true);
    setEditingUserId(null);
    setUserForm({
      nombre: '',
      email: '',
      profesionPrefijo: 'Lic.',
      rol: 'teacher',
      materiasAsignadas: ['mat'],
      dosFactores: true
    });
    setUserModalOpen(true);
  };

  // Open modal for editing existing user's role and subjects
  const handleOpenEditUser = (user: UserAccount) => {
    setIsCreatingUser(false);
    setEditingUserId(user.id);
    
    // Deduce profession prefix
    let prefix = user.profesionPrefijo || 'Lic.';
    if (user.nombre.startsWith('Licda.')) prefix = 'Licda.';
    else if (user.nombre.startsWith('Prof.')) prefix = 'Prof.';
    else if (user.nombre.startsWith('Ing.')) prefix = 'Ing.';
    else if (user.nombre.startsWith('Dr.')) prefix = 'Dr.';
    else if (user.nombre.startsWith('Lic.')) prefix = 'Lic.';

    setUserForm({
      nombre: user.nombre.replace(/^(Lic\.|Licda\.|Prof\.|Ing\.|Dr\.)\s*/, ''),
      email: user.email,
      profesionPrefijo: prefix,
      rol: user.rol,
      materiasAsignadas: user.materiasAsignadas && user.materiasAsignadas.length > 0 
        ? user.materiasAsignadas 
        : (user.rol === 'teacher' ? ['mat'] : []),
      dosFactores: user.dosFactores
    });
    setUserModalOpen(true);
  };

  // Toggle subject assignment in user form
  const handleToggleSubject = (subjectId: string) => {
    setUserForm(prev => {
      const exists = prev.materiasAsignadas.includes(subjectId);
      const nextSubjects = exists
        ? prev.materiasAsignadas.filter(id => id !== subjectId)
        : [...prev.materiasAsignadas, subjectId];
      return {
        ...prev,
        materiasAsignadas: nextSubjects
      };
    });
  };

  // Save Role and Subject Assignment
  const handleSaveUserAssignment = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedSubjectNames = userForm.materiasAsignadas
      .map(id => availableSubjects.find(s => s.id === id)?.nombre || id);

    let fullName = userForm.nombre.trim();
    if (userForm.rol === 'teacher' && !fullName.startsWith(userForm.profesionPrefijo)) {
      fullName = `${userForm.profesionPrefijo} ${fullName}`;
    }

    let cargo = '';
    let tituloProfesional = '';

    if (userForm.rol === 'teacher') {
      const subjectListStr = selectedSubjectNames.length > 0 ? selectedSubjectNames.join(', ') : 'General';
      cargo = `Profesor ${subjectListStr}`;
      tituloProfesional = `${userForm.profesionPrefijo} ${selectedSubjectNames.length > 0 ? selectedSubjectNames[0] : 'Docente'}`;
    } else if (userForm.rol === 'admin') {
      cargo = 'Administrador General del Centro';
      tituloProfesional = 'Administrador General';
    } else {
      cargo = 'Tutor Legal';
      tituloProfesional = 'Tutor Legal';
    }

    if (isCreatingUser) {
      const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('') || 'US';

      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        nombre: fullName,
        email: userForm.email.trim(),
        rol: userForm.rol,
        avatar: initials,
        cargo,
        tituloProfesional,
        profesionPrefijo: userForm.profesionPrefijo,
        materiasAsignadas: userForm.rol === 'teacher' ? userForm.materiasAsignadas : [],
        institucion: school.nombre,
        dosFactores: userForm.dosFactores
      };

      const updated = [...users, newUser];
      onUpdateUsers(updated);
      setSavedNotice(`¡Usuario ${fullName} creado y rol asignado correctamente!`);
    } else if (editingUserId) {
      const updated = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            nombre: fullName,
            email: userForm.email.trim(),
            rol: userForm.rol,
            cargo,
            tituloProfesional,
            profesionPrefijo: userForm.profesionPrefijo,
            materiasAsignadas: userForm.rol === 'teacher' ? userForm.materiasAsignadas : [],
            dosFactores: userForm.dosFactores
          };
        }
        return u;
      });
      onUpdateUsers(updated);
      setSavedNotice(`¡Rol y materias asignadas a ${fullName} guardados exitosamente!`);
    }

    setUserModalOpen(false);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleExportSystemMetrics = () => {
    let csv = `\uFEFF"REPORTE DE AUDITORÍA Y USO DEL SISTEMA EGRADING"\r\n`;
    csv += `"Centro Educativo: ${school.nombre}","Año Escolar: ${school.anoEscolar}","Fecha de Emisión: ${new Date().toLocaleDateString()}"\r\n\r\n`;
    csv += `"Métrica","Valor","Estado"\r\n`;
    csv += `"Usuarios Activos en la Plataforma","${users.length} usuarios","Operativo"\r\n`;
    csv += `"Plan SaaS Contratado","Pro Institucional","Activo"\r\n`;
    csv += `"Cifrado de Extremo a Extremo","AES-GCM 256-bit","Habilitado"\r\n`;
    csv += `"Tasa de Sincronización Offline","100%","Consistente"\r\n`;
    csv += `"Llamadas API REST registradas este mes","14,820 requests","Dentro del límite"\r\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Auditoria_EGrading_${school.nombre.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* SaaS Admin Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#22396F] dark:text-blue-400">
              Panel de Administración Centralizada
            </span>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <span className="text-xs text-slate-500 font-medium">SaaS Multi-Tenant</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Administración de Planes, Licencias y Seguridad
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Gestione la suscripción escolar, la información del centro, asignación de roles y materias docentes, y seguridad 2FA.
          </p>
        </div>

        <button
          onClick={handleExportSystemMetrics}
          className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Métricas (CSV)
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeTab === 'plans' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Planes y Suscripción
        </button>
        <button
          onClick={() => setActiveTab('institution')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeTab === 'institution' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Datos del Centro y Firmas
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeTab === 'users' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Usuarios, Roles y Materias
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeTab === 'security' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Seguridad y Cifrado
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold whitespace-nowrap transition-colors ${
            activeTab === 'api' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          Integración API REST
        </button>
      </div>

      {/* Tab Content: Plans */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAAS_PLANS.map(plan => {
              const isCurrent = plan.id === activePlan;
              return (
                <div 
                  key={plan.id}
                  className={`bg-white dark:bg-slate-900 border rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-all ${
                    isCurrent 
                      ? 'border-[#22396F] ring-2 ring-[#22396F]/20 dark:border-blue-500' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.nombre}</h3>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#22396F] dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
                          Plan Activo
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tabular-nums">
                        ${plan.precioMensual}
                      </span>
                      <span className="text-xs text-slate-500">USD / mes</span>
                    </div>

                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {plan.limiteEstudiantes}
                    </div>

                    <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {plan.caracteristicas.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    disabled={isCurrent}
                    onClick={() => onSelectPlan(plan.id)}
                    className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-colors ${
                      isCurrent
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                        : 'bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs'
                    }`}
                  >
                    {isCurrent ? 'Plan en Uso' : 'Seleccionar Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: Institution Info */}
      {activeTab === 'institution' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-3xl">
          <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            Datos Institucionales y Autoridades Firmantes
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Esta información se refleja automáticamente en el encabezado oficial y en las firmas de los boletines y sábanas MINERD.
          </p>

          <form onSubmit={handleSaveSchool} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Nombre Oficial del Centro</label>
              <input
                type="text"
                value={schoolForm.nombre}
                onChange={(e) => setSchoolForm({ ...schoolForm, nombre: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#22396F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dirección del Plantel</label>
                <input
                  type="text"
                  value={schoolForm.direccion}
                  onChange={(e) => setSchoolForm({ ...schoolForm, direccion: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Teléfono Institucional</label>
                <input
                  type="text"
                  value={schoolForm.telefono}
                  onChange={(e) => setSchoolForm({ ...schoolForm, telefono: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Correo Electrónico Oficial</label>
                <input
                  type="email"
                  value={schoolForm.correo}
                  onChange={(e) => setSchoolForm({ ...schoolForm, correo: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Año Escolar Activo</label>
                <input
                  type="text"
                  value={schoolForm.anoEscolar}
                  onChange={(e) => setSchoolForm({ ...schoolForm, anoEscolar: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Director/a del Centro (Firma Oficial)</label>
                <input
                  type="text"
                  value={schoolForm.director}
                  onChange={(e) => setSchoolForm({ ...schoolForm, director: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Maestro/a Encargado Predeterminado</label>
                <input
                  type="text"
                  value={schoolForm.maestroEncargadoDefault}
                  onChange={(e) => setSchoolForm({ ...schoolForm, maestroEncargadoDefault: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Content: Users, Roles & Subjects Assignment */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Gestión de Usuarios, Asignación de Roles y Materias
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure qué materias puede gestionar cada profesor. Un docente solo tiene permisos para calificar las materias a su cargo.
              </p>
            </div>

            <button
              onClick={handleOpenCreateUser}
              className="px-3.5 py-2 rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Asignar Rol / Nuevo Usuario
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="py-2.5 px-3">Usuario & Profesión</th>
                  <th className="py-2.5 px-3">Correo Institucional</th>
                  <th className="py-2.5 px-3">Rol del Sistema</th>
                  <th className="py-2.5 px-3">Materias Asignadas (Permisos)</th>
                  <th className="py-2.5 px-3 text-center">2FA</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map(u => {
                  const assignedSubjectsList = (u.materiasAsignadas || [])
                    .map(id => availableSubjects.find(s => s.id === id))
                    .filter(Boolean) as Subject[];

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#22396F] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {u.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>{u.nombre}</span>
                              {u.tituloProfesional && (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                  {u.tituloProfesional}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400">{u.cargo}</div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{u.email}</td>

                      <td className="py-3 px-3">
                        {u.rol === 'admin' && (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-[#22396F] dark:bg-slate-800 dark:text-blue-300 border border-blue-200 dark:border-slate-700">
                            Administrador General
                          </span>
                        )}
                        {u.rol === 'teacher' && (
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {u.cargo?.startsWith('Profesor') ? u.cargo : `Profesor ${assignedSubjectsList.map(s => s.nombre).join(', ') || 'Sin Asignar'}`}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              Visualización: {u.tituloProfesional || 'Lic. Docente'}
                            </span>
                          </div>
                        )}
                        {u.rol === 'parent' && (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Padre / Tutor Legal
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {u.rol === 'teacher' ? (
                          assignedSubjectsList.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {assignedSubjectsList.map(sub => (
                                <span 
                                  key={sub.id}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-white shadow-2xs"
                                  style={{ backgroundColor: sub.color }}
                                >
                                  {sub.nombre}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-amber-600 text-[11px] font-medium flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Sin materias asignadas
                            </span>
                          )
                        ) : u.rol === 'admin' ? (
                          <span className="text-slate-500 font-medium text-[11px]">
                            Acceso global a todas las materias
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            Acceso solo a boletines familiares
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggle2FA(u.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                            u.dosFactores
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800'
                          }`}
                        >
                          {u.dosFactores ? '2FA Habilitado' : '2FA Desactivado'}
                        </button>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenEditUser(u)}
                          className="px-2.5 py-1 rounded text-xs font-semibold border border-slate-200 dark:border-slate-700 text-[#22396F] dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          Editar Rol & Materias
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" />
              Cifrado de Extremo a Extremo (E2EE)
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Toda la información académica de calificaciones y expedientes personales de los estudiantes se cifra localmente mediante claves AES-GCM antes de persistirse en la nube.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all">
              Algoritmo: AES-256-GCM / Digest: SHA-256 HMAC / Estatus: Verificado
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#22396F] dark:text-blue-400 font-bold text-sm">
              <Activity className="w-5 h-5" />
              Sincronización Offline Resiliente
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              El motor offline almacena las mutaciones pendientes en una cola local. Tan pronto se restablece la conexión a internet, se ejecuta la reconciliación con cero pérdida de datos.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Modo Fuera de Línea</span>
              <span className="text-emerald-600 font-bold">Activo & Monitoreado</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: API RESTful */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                API RESTful para Integraciones con Terceros
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conecte EGrading con SIGERD, plataformas LMS o sistemas administrativos del colegio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyApiKey}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey ? 'Copiada' : 'Copiar API Key'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Endpoint Base:</span>
            <div className="p-3 bg-slate-950 text-slate-100 rounded-lg font-mono text-xs flex items-center justify-between">
              <code>https://api.egrading.edu.do/v1/colegios/lic-guatemala</code>
              <span className="text-[10px] text-emerald-400 font-bold">STATUS 200 OK</span>
            </div>
          </div>
        </div>
      )}

      {/* Role & Subject Assignment Modal */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-xl my-auto overflow-hidden animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#22396F] dark:text-blue-400" />
                  {isCreatingUser ? 'Crear Usuario y Asignar Rol' : 'Editar Rol y Materias Asignadas'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  El rol del maestro determina estrictamente qué materias podrá calificar en EGrading.
                </p>
              </div>
              <button
                onClick={() => setUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUserAssignment} className="p-5 space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título / Prefijo
                  </label>
                  <select
                    value={userForm.profesionPrefijo}
                    onChange={(e) => setUserForm({ ...userForm, profesionPrefijo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                  >
                    <option value="Lic.">Lic.</option>
                    <option value="Licda.">Licda.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Ing.">Ing.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mag.">Mag.</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombres y Apellidos
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Francisco Almonte"
                    value={userForm.nombre}
                    onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Correo Electrónico Institucional
                </label>
                <input
                  type="email"
                  required
                  placeholder="ej. francisco.almonte@minerd.edu.do"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rol Principal en el Sistema
                </label>
                <select
                  value={userForm.rol}
                  onChange={(e) => setUserForm({ ...userForm, rol: e.target.value as 'admin' | 'teacher' | 'parent' })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#22396F]"
                >
                  <option value="teacher">Profesor (Gestiona notas por materias asignadas)</option>
                  <option value="admin">Administrador General (Acceso total)</option>
                  <option value="parent">Padre / Tutor (Consulta exclusiva de boletines)</option>
                </select>
              </div>

              {/* Materias selector ONLY for teachers */}
              {userForm.rol === 'teacher' && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-900 dark:text-white">
                      Materias que Imparte este Docente (Seleccione una o varias):
                    </label>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {userForm.materiasAsignadas.length} seleccionada(s)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    El profesor solo podrá gestionar las calificaciones de las materias marcadas. Las demás estarán bloqueadas en modo solo lectura.
                  </p>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {availableSubjects.map(sub => {
                      const isSelected = userForm.materiasAsignadas.includes(sub.id);
                      return (
                        <div
                          key={sub.id}
                          onClick={() => handleToggleSubject(sub.id)}
                          className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-all select-none ${
                            isSelected
                              ? 'bg-blue-50/70 border-[#22396F] text-[#22396F] dark:bg-blue-950/30 dark:border-blue-500 dark:text-blue-300 shadow-2xs font-bold'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs" 
                              style={{ backgroundColor: sub.color }} 
                            />
                            <span>{sub.nombre}</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 text-[#22396F] rounded border-slate-300 focus:ring-[#22396F]"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Live preview of generated role & display */}
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">Rol Asignado Resultante:</span>
                      <strong className="text-[#22396F] dark:text-blue-400 font-bold">
                        Profesor {userForm.materiasAsignadas.map(id => availableSubjects.find(s => s.id === id)?.nombre || id).join(', ') || 'Sin Materia'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-semibold">En Materias & Notas mostrará:</span>
                      <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {userForm.profesionPrefijo} {userForm.materiasAsignadas.map(id => availableSubjects.find(s => s.id === id)?.nombre || id)[0] || 'Docente'}
                      </strong>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                      {userForm.materiasAsignadas.length === 1 
                        ? `El profesor de ${availableSubjects.find(s => s.id === userForm.materiasAsignadas[0])?.nombre} no podrá gestionar las demás materias.`
                        : `El docente impartirá ${userForm.materiasAsignadas.length} materias y podrá gestionar las calificaciones de cada una de ellas.`}
                    </p>
                  </div>
                </div>
              )}

              {/* 2FA Option */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Autenticación de Dos Factores (2FA Obligatoria)
                </span>
                <input
                  type="checkbox"
                  checked={userForm.dosFactores}
                  onChange={(e) => setUserForm({ ...userForm, dosFactores: e.target.checked })}
                  className="w-4 h-4 text-[#22396F] rounded border-slate-300 focus:ring-[#22396F]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-[#22396F] hover:bg-[#1B2D58] text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserCheck className="w-4 h-4" />
                  Guardar Asignación de Rol
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
