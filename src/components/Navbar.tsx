import React, { useState } from 'react';
import { UserRole, AppTheme, UserAccount, SchoolNotification } from '../types';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  FileSpreadsheet, 
  Users, 
  Building2, 
  Bell, 
  Sun, 
  Moon, 
  Flag, 
  Eye, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  LogOut,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Check
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onSwitchUser: (user: UserAccount) => void;
  currentTheme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  notifications: SchoolNotification[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  allUsers,
  onSwitchUser,
  currentTheme,
  onChangeTheme,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  notifications,
  onMarkNotificationRead
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.leido).length;

  const getRoleLabel = (user: UserAccount) => {
    if (user.rol === 'admin') return 'Administrador General';
    if (user.rol === 'parent') return 'Padre / Tutor Legal';
    if (user.rol === 'teacher') {
      if (user.cargo?.startsWith('Profesor')) return user.cargo;
      if (user.tituloProfesional) return user.tituloProfesional;
      if (user.materiasAsignadas && user.materiasAsignadas.length > 0) {
        return `Profesor ${user.materiasAsignadas.join(', ')}`;
      }
      return 'Profesor Titular';
    }
    return user.cargo || 'Usuario';
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      {/* Dominican Republic flag subtle accent bar when in DR theme */}
      {currentTheme === 'dr' && (
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#22396F]" />
          <div className="w-6 bg-white border-x border-slate-200" />
          <div className="flex-1 bg-[#CE1126]" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Single text element wordmark with brand crest */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onSelectView(currentUser.rol === 'parent' ? 'parent_portal' : 'dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-lg bg-[#22396F] text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-[#CE1126]/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#22396F] dark:text-blue-400 group-hover:text-[#CE1126] transition-colors whitespace-nowrap">
                  EGrading
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Rep. Dominicana
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium">
            {currentUser.rol === 'parent' ? (
              // Para Padre o Tutor: Acceso exclusivo a Portal de Padres y Boletín del Inscrito
              <>
                <button
                  onClick={() => onSelectView('parent_portal')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'parent_portal'
                      ? 'bg-rose-50 text-[#CE1126] font-semibold dark:bg-slate-800 dark:text-red-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Portal de Padres
                </button>

                <button
                  onClick={() => onSelectView('report_card')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'report_card'
                      ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Boletín del Inscrito
                </button>
              </>
            ) : (
              // Para Docentes y Administradores: Orden específico solicitado
              // 1. Tablero, 2. Estudiantes & Asistencia, 3. Materias & Notas, 4. Boletín
              <>
                <button
                  onClick={() => onSelectView('dashboard')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'dashboard'
                      ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tablero
                </button>

                <button
                  onClick={() => onSelectView('students')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'students'
                      ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Estudiantes & Asistencia
                </button>

                <button
                  onClick={() => onSelectView('subjects')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'subjects'
                      ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Materias & Notas
                </button>

                <button
                  onClick={() => onSelectView('report_card')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    currentView === 'report_card'
                      ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Boletín
                </button>

                {currentUser.rol === 'admin' && (
                  <button
                    onClick={() => onSelectView('saas_admin')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      currentView === 'saas_admin'
                        ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-400'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    SaaS & Licencias
                  </button>
                )}
              </>
            )}
          </nav>

          {/* Zone 3: 1 primary action cluster: Connectivity status, Theme, Notifications & User profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Online / Offline status toggle */}
            <button
              onClick={onToggleOnline}
              title={isOnline ? 'Conexión activa. Haga clic para simular modo sin internet' : 'Modo fuera de línea activo. Haga clic para reconectar y sincronizar'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isOnline 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' 
                  : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">En Línea</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Offline ({pendingSyncCount})</span>
                </>
              )}
            </button>

            {/* Theme Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowThemeMenu(!showThemeMenu); setShowUserMenu(false); setShowNotifMenu(false); }}
                className="p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Cambiar tema visual"
              >
                {currentTheme === 'dr' && <Flag className="w-4 h-4 text-[#22396F]" />}
                {currentTheme === 'light' && <Sun className="w-4 h-4 text-amber-500" />}
                {currentTheme === 'dark' && <Moon className="w-4 h-4 text-indigo-400" />}
                {currentTheme === 'contrast' && <Eye className="w-4 h-4 text-emerald-500" />}
              </button>

              {showThemeMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemeMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-fade-in">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Tema Visual
                  </div>
                  <button
                    onClick={() => { onChangeTheme('dr'); setShowThemeMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      currentTheme === 'dr' 
                        ? 'bg-blue-50 text-[#22396F] font-bold dark:bg-slate-800 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Flag className="w-3.5 h-3.5 text-[#22396F]" />
                      <span>República Dominicana</span>
                    </div>
                    {currentTheme === 'dr' && <Check className="w-3.5 h-3.5 text-[#22396F] dark:text-blue-400" />}
                  </button>
                  <button
                    onClick={() => { onChangeTheme('light'); setShowThemeMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      currentTheme === 'light' 
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-slate-800 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Modo Claro</span>
                    </div>
                    {currentTheme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { onChangeTheme('dark'); setShowThemeMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      currentTheme === 'dark' 
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-slate-800 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Modo Oscuro</span>
                    </div>
                    {currentTheme === 'dark' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                  <button
                    onClick={() => { onChangeTheme('contrast'); setShowThemeMenu(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                      currentTheme === 'contrast' 
                        ? 'bg-blue-50 text-blue-700 font-bold dark:bg-slate-800 dark:text-blue-300' 
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Eye className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Alto Contraste (AAA)</span>
                    </div>
                    {currentTheme === 'contrast' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                </div>
              </>
            )}
            </div>

            {/* Notifications Center */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifMenu(!showNotifMenu); setShowUserMenu(false); setShowThemeMenu(false); }}
                className="relative p-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Centro de notificaciones y alertas"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CE1126] rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {showNotifMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifMenu(false)} />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">Alertas & Notificaciones</span>
                      <span className="text-xs text-slate-500">{unreadCount} pendientes</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          No hay notificaciones en este momento.
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div 
                            key={n.id} 
                            onClick={() => onMarkNotificationRead(n.id)}
                            className={`p-3 text-xs transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                              !n.leido ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {n.tipo === 'alerta' && <AlertTriangle className="w-4 h-4 text-[#CE1126] shrink-0 mt-0.5" />}
                              {n.tipo === 'exito' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
                              {n.tipo === 'info' && <Bell className="w-4 h-4 text-[#22396F] shrink-0 mt-0.5" />}
                              {n.tipo === 'urgente' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 dark:text-white truncate">{n.titulo}</p>
                                <p className="text-slate-600 dark:text-slate-400 mt-0.5 text-[11px] leading-relaxed">{n.mensaje}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{n.fecha}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Profile / Quick Role Switcher */}
            <div className="relative">
              <button
                onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifMenu(false); setShowThemeMenu(false); }}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#22396F] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.avatar}
                </div>
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                    {currentUser.nombre}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {getRoleLabel(currentUser)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{currentUser.nombre}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-medium text-[#22396F] dark:text-blue-300 bg-blue-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {getRoleLabel(currentUser)}
                      </span>
                    </div>

                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Cambiar Perfil de Demostración
                    </div>

                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => { onSwitchUser(u); setShowUserMenu(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                          u.id === currentUser.id 
                            ? 'bg-blue-50 text-[#22396F] font-semibold dark:bg-slate-800 dark:text-blue-300' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {u.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="truncate font-medium">{u.nombre}</div>
                          <div className="text-[10px] text-slate-400 truncate">{getRoleLabel(u)}</div>
                        </div>
                        {u.id === currentUser.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#22396F]" />}
                      </button>
                    ))}

                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 py-1">
                        <span>Cifrado E2E Activo</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Mobile sub-navigation bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-slate-800 gap-2 text-xs">
        {currentUser.rol === 'parent' ? (
          <>
            <button
              onClick={() => onSelectView('parent_portal')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'parent_portal' ? 'bg-[#CE1126] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Portal Padres
            </button>
            <button
              onClick={() => onSelectView('report_card')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'report_card' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Boletín del Inscrito
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectView('dashboard')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'dashboard' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Tablero
            </button>
            <button
              onClick={() => onSelectView('students')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'students' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Estudiantes & Asistencia
            </button>
            <button
              onClick={() => onSelectView('subjects')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'subjects' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Materias & Notas
            </button>
            <button
              onClick={() => onSelectView('report_card')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                currentView === 'report_card' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Boletín
            </button>
            {currentUser.rol === 'admin' && (
              <button
                onClick={() => onSelectView('saas_admin')}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium ${
                  currentView === 'saas_admin' ? 'bg-[#22396F] text-white' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                SaaS & Ajustes
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};
