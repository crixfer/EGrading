# EGrading: Sistema Integral de Gestión Académica y Calificaciones por Competencias

Plataforma SaaS educativa diseñada para escuelas y colegios, permitiendo a administradores, profesores y padres gestionar y supervisar calificaciones por competencias fundamentales (COM, PLC, CYT, EYC, C.F.) y asistencia según el modelo oficial dominicano, con boletines imprimibles de alta fidelidad, analíticas de rendimiento, importación Excel y operatividad offline.

### User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones de arquitectura y diseño confirmadas durante la fase de clarificación con el usuario:

- **Estrategia de Persistencia y Sincronización**: Almacenamiento local reactivo (LocalStorage/IndexedDB) con motor de cola offline, detección de conectividad en tiempo real y sincronización automática bidireccional simulada con encriptación.
- **Punto de Entrada Predeterminado**: Tablero general de control con métricas globales, alertas tempranas de bajo rendimiento/inasistencia y selector rápido de rol activo (Administrador, Profesor, Padre).
- **Datos Iniciales**: Colegio precargado ("Liceo República de Guatemala") con estudiantes de 1ro a 6to de secundaria en secciones A, B y C, catálogo de 8 materias oficiales y registros de calificaciones y asistencia para los 4 períodos académicos.
- **Fidelidad del Boletín Oficial**: Reproducción exacta del formato físico MINERD exhibido en la referencia (encabezado institucional, tabla de áreas curriculares con períodos 1 a 4 y total, desglose de competencias COM, PLC, CYT, EYC, C.F., promedio de asistencia por período y anual, condición final del estudiante y firmas de Maestro y Director).

---

### 1. Overview & Core Concept

- **What It Does**: EGrading es una solución integral para la gestión escolar que unifica el registro ágil de calificaciones por competencias, control de asistencia diaria, cálculo automático de promedios ponderados, generación de boletines oficiales oficiales del MINERD descargables en PDF, HTML y Excel (XLSX/CSV), notificaciones automáticas para padres y docentes sobre estudiantes en riesgo, y un portal SaaS multi-tenant con administración de planes y suscripciones.
- **Target Audience / Persona**:
  - *Administradores escolares*: Supervisan estadísticas globales del centro, asignan profesores a cursos/materias, administran usuarios y permisos, y gestionan suscripciones escolares.
  - *Profesores*: Registran de forma visual y rápida las calificaciones por competencias para cada período, toman asistencia con un clic, importan listas de alumnos desde Excel y exportan actas de notas.
  - *Padres / Tutores*: Acceden al expediente de sus hijos desde el móvil, visualizan el boletín oficial actualizado en tiempo real, reciben alertas inmediatas de calificaciones menores a 70 puntos o ausencias reiteradas.
- **Key Value**: Elimina el trabajo manual de cuadernos de notas y hojas de cálculo desorganizadas, garantizando cumplimiento estricto con el currículo por competencias de la República Dominicana, alta disponibilidad incluso sin internet y comunicación instantánea con la comunidad educativa.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Acceso y Cambio de Perfil (Zero-Friction Role Switching)**:
   - Pantalla de autenticación institucional o acceso rápido con perfiles de demostración (Admin: *Chris Portorreal*, Docente: *Prof. Almonte*, Padre: *Familia Mejía*).
   - Acceso inmediato al tablero con indicador de estado offline/online y alertas pendientes.
2. **Tablero de Rendimiento Académico**:
   - Resumen ejecutivo: Promedio general del colegio, tasa de aprobación ($\ge 70$), asistencia promedio y estudiantes que requieren nivelación.
   - Gráficos interactivos de distribución por competencias y evolución mensual.
   - Lista de tareas pendientes y alertas críticas (estudiantes con promedio $< 70$ o inasistencia $> 20\%$).
3. **Gestión de Materias y Calificaciones Docente**:
   - Tarjetas temáticas para cada una de las 8 materias con ilustraciones alusivas, promedio actual, número de secciones y botón de acceso a la sábana de notas.
   - Matriz de captura rápida de notas: tabla interactiva con celdas de entrada numérica rápida para COM, PLC, CYT, EYC en los períodos 1 al 4, con cálculo automático en vivo de C.F. y resaltado visual accesible de aprobación/reprobación.
4. **Boletín Oficial de Calificaciones (Fiel a la Referencia)**:
   - Vista estructurada idéntica a la imagen oficial del Liceo República de Guatemala:
     - Cabecera: Escudo dominicano / logo escolar, datos del centro, código de estudiante, grado y sección.
     - Tabla de áreas curriculares con desglose por período (P1, P2, P3, P4) y columnas de competencias (COM, PLC, CYT, EYC, C.F.) más columna TOTAL.
     - Bloque de Promedio de Asistencia por período y anual.
     - Cuadro de Condición Final del Estudiante (Promovido / Aplazado).
     - Leyenda explicativa de competencias y firmas oficiales para Maestro Encargado y Director.
   - Opciones directas: Imprimir directamente (diseño optimizado para papel o PDF nativo), Descargar HTML portable y Descargar XLSX/CSV.
5. **Control de Asistencia y Perfil del Estudiante**:
   - Lista de estudiantes con foto/avatar, estatus de riesgo, registro de ausencias y botón para registrar presentes, ausencias justificadas o tardanzas.
   - Importador masivo mediante arrastrar y soltar archivo Excel (.xlsx / .csv) con previsualización y mapeo de columnas.
6. **Panel SaaS y Ajustes de Accesibilidad**:
   - Selector de temas: República Dominicana (Azul ultramar #002F6C, Rojo bermellón #CE1126, Blanco nítido), Modo Claro, Modo Oscuro y Tema de Alto Contraste (para máxima accesibilidad WCAG AAA).

#### Visual Identity & Theme
- **Aesthetic Direction**: Interfaz académica institucional moderna, limpia y rigurosa, inspirada en los colores patrios dominicanos tratados con máxima elegancia y sobriedad ejecutiva. Cero adornos innecesarios o píldoras flotantes superfluas.
- **Color Palette (60-30-10 Budget)**:
  - *Neutral Canvas (60%)*: Blanco puro (`#FFFFFF`) y gris pizarra tenue (`#F8FAFC` / en modo oscuro `#0B1120`).
  - *Structural Surfaces (30%)*: Fondos de paneles y bordes sutiles en tono slate suave (`#F1F5F9`, bordes en `#E2E8F0` / `#1E293B`).
  - *Accent Budget (10%)*:
    - **Azul Dominicano**: Azul marino profundo (`#0A2540` / `#002F6C`) para navegación principal, títulos y encabezados de tablas.
    - **Rojo Dominicano**: Rojo bermellón elegante (`#CE1126` / `#DC2626`) para alertas de notas reprobatorias ($< 70$), llamadas a la acción prioritarias y acentos heráldicos.
    - **Verde Aprobatorio**: Verde esmeralda sobrio (`#15803D`) con etiqueta explícita de estado para estudiantes con notas $\ge 70$.
- **Typography & Tabular Discipline**:
  - Títulos y encabezados: `Plus Jakarta Sans` con peso seminegrita y espaciado natural.
  - Textos de contenido: `DM Sans` para máxima legibilidad en párrafos y etiquetas.
  - Datos numéricos y tablas: `font-mono tabular-nums` para alineación vertical exacta de decimales y calificaciones.
- **Accessibility & Modes**:
  - Tema República Dominicana (Estándar elegante).
  - Tema Alto Contraste (Fondo negro azabache, bordes blancos de 2px, texto amarillo/blanco de alto contraste WCAG AAA).
  - Modo Oscuro refinado con compensación óptica para lectura prolongada.

---

### 3. Key Product Decisions & Trade-Offs

- **Estructura Curricular Basada en Competencias (MINERD)**:
  - *Chosen Approach*: Implementar explícitamente las 4 competencias fundamentales oficiales dominicanas (COM, PLC, CYT, EYC) por materia y por período académico (P1 a P4), promediando en C.F. y generando el TOTAL anual.
  - *Why*: Cumple al 100% con la normativa pedagógica exigida en República Dominicana y replica fielmente el modelo documental del Liceo en la imagen de referencia.
  - *Alternatives Considered*: Promedios numéricos simples sin desglose de competencias fueron descartados por no reflejar la realidad del sistema educativo nacional.
- **Motor Offline-First con Cola de Sincronización**:
  - *Chosen Approach*: Toda modificación se persiste de inmediato en el almacenamiento local con marcas de tiempo y bandera de sincronización. Un despachador detecta transiciones de red (`navigator.onLine`) y procesa la cola de cambios con resolución determinista de conflictos.
  - *Why*: Los centros educativos en diversas regiones sufren interrupciones de conectividad; los docentes deben poder calificar sin temor a perder su trabajo.
- **Exportación Multi-Formato Fidedigna**:
  - *Chosen Approach*: Generación de reportes PDF mediante ventana de impresión vectorizada limpia con estilos CSS `@media print` específicos que emulan el boletín gubernamental al milímetro, junto con descargas directas en HTML autocontenido y Excel/CSV con hojas tabulares formateadas.
  - *Why*: Evita dependencias pesadas que fallen en el navegador y garantiza que el padre o docente obtenga un documento idéntico al emitido por la secretaría escolar.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              EGrading App                              │
│                                                                        │
│  ┌─────────────────────────┐   ┌─────────────────────────────────────┐ │
│  │   Top Bar Navigation    │   │  Role Switcher & Theme Selector     │ │
│  │   Brand, Sections, Nav  │   │  (Admin / Docente / Padre) + Sync   │ │
│  └────────────┬────────────┘   └──────────────────┬──────────────────┘ │
│               │                                   │                    │
│  ┌────────────▼───────────────────────────────────▼──────────────────┐ │
│  │                     Active View Controller                        │ │
│  │                                                                   │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────┐ │ │
│  │  │  Dashboard   │ │ Materias &   │ │   Boletín    │ │ Asistencia│ │ │
│  │  │  Académico   │ │ Calificaciones│ │   Oficial    │ │ & Perfiles│ │ │
│  │  │  (Analíticas)│ │ (Sábana COM) │ │   (MINERD)   │ │ (Excel In)│ │ │
│  │  └───────┬──────┘ └──────┬───────┘ └──────┬───────┘ └─────┬─────┘ │ │
│  └──────────┼───────────────┼────────────────┼───────────────┼───────┘ │
│             │               │                │               │         │
│  ┌──────────▼───────────────▼────────────────▼───────────────▼───────┐ │
│  │                   Core State Store (React Context)                │ │
│  │   • Estudiantes (1ro-6to, Sec. A/B/C) • Materias oficiales (8)   │ │
│  │   • Notas (4 Períodos, 4 Competencias) • Asistencia • Tareas/Avisos│ │
│  └──────────────────────────────────┬────────────────────────────────┘ │
│                                     │                                  │
│  ┌──────────────────────────────────▼────────────────────────────────┐ │
│  │              Offline Storage Engine & Sync Worker                 │ │
│  │   • LocalStorage Cache • Cola de Mutaciones • Detector Conectividad│ │
│  └───────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

#### Data Entities & Relations
1. **Student (`Estudiante`)**:
   - `id`: string (ej. "2026-001")
   - `apellidos`: string (ej. "Mejía")
   - `nombres`: string (ej. "Ana")
   - `grado`: string ("1ro" a "6to")
   - `seccion`: string ("A", "B", "C")
   - `tutor`: string (nombre del padre/madre)
   - `tutorEmail`: string
   - `tutorTelefono`: string
   - `fotoUrl`: string
   - `condicion`: "Promovido" | "Aplazado" | "En Curso"
2. **Subject (`Materia`)**:
   - `id`: string ("mat", "len", "soc", "nat", "ef", "art", "fh", "ing")
   - `nombre`: string (Matemáticas, Lengua Española, Ciencias Sociales, Ciencias Naturales, Educación Física, Educación Artística, Formación Humana, Inglés)
   - `profesorAsignado`: string
   - `icono`: string
   - `descripcion`: string
3. **GradeRecord (`RegistroCalificacion`)**:
   - `estudianteId`: string
   - `materiaId`: string
   - `periodos`: { [p: string]: { com: number, plc: number, cyt: number, eyc: number, cf: number } } (P1 a P4)
   - `calificacionFinal`: number (promedio anual de las C.F.)
   - `estado`: "Aprobado" | "Reprobado"
4. **AttendanceRecord (`RegistroAsistencia`)**:
   - `estudianteId`: string
   - `periodoAsistencias`: { [p: string]: { presentes: number, ausencias: number, porcentaje: number } }
   - `promedioAnual`: number
5. **SystemSettings & SaaS (`Configuracion`)**:
   - `nombreColegio`: "Liceo República de Guatemala"
   - `direccion`: "C. Leonardo Da Vinci, No. 40"
   - `telefono`: "809-797-4037"
   - `correo`: "lrepublicadeguatemala@gmail.com"
   - `plan`: "SaaS Pro Institucional"
   - `almacenamientoEstado`: "Online" | "Offline (Sincronización en cola)"

---

### Plan Execution Checklist
- [ ] Configurar tipografías, variables CSS temáticas (Dominicana, Alto Contraste, Light, Dark) e infraestructura base en `src/index.css`.
- [ ] Construir la capa de datos completa con el colegio de muestra "Liceo República de Guatemala", estudiantes de 1ro a 6to (A, B, C), las 8 materias oficiales y registros precargados de notas por competencias y asistencia.
- [ ] Crear el motor offline con cola de mutaciones, indicador de estado y sincronización automática.
- [ ] Diseñar el Tablero Principal con indicadores clave (promedios, tasa de aprobación, asistencia, estudiantes en riesgo, recordatorios diarios).
- [ ] Desarrollar la vista de Materias con tarjetas enriquecidas, estadísticas por sección y vista detallada para captura rápida de calificaciones por competencias (COM, PLC, CYT, EYC).
- [ ] Desarrollar la vista del Boletín Oficial idéntica a la imagen de referencia (MINERD), con exportador a PDF para impresión, HTML portable y Excel/CSV.
- [ ] Implementar el control de asistencia y perfiles de estudiante, con función de importación masiva desde archivo Excel/CSV.
- [ ] Implementar el portal para padres con alertas en tiempo real de calificaciones y asistencias.
- [ ] Añadir panel de administración SaaS con gestión de planes, usuarios y métricas de uso.
- [ ] Verificar compilación sin errores (`compile_applet`), responsividad móvil y pruebas de todas las acciones interactivas.
