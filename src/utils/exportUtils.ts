import { Student, SchoolInfo, Subject, StudentSubjectGrade, StudentAttendance } from '../types';

export function printCurrentReportCard() {
  window.print();
}

export function generateStandaloneHTMLReport(
  student: Student,
  school: SchoolInfo,
  subjects: Subject[],
  grades: StudentSubjectGrade[],
  attendance?: StudentAttendance
): string {
  const studentGrades = subjects.map(sub => {
    const grade = grades.find(g => g.estudianteId === student.id && g.materiaId === sub.id);
    return {
      sub,
      grade
    };
  });

  const p1Att = attendance?.periodos?.P1?.porcentaje ? `${attendance.periodos.P1.porcentaje}%` : '—';
  const p2Att = attendance?.periodos?.P2?.porcentaje ? `${attendance.periodos.P2.porcentaje}%` : '—';
  const p3Att = attendance?.periodos?.P3?.porcentaje ? `${attendance.periodos.P3.porcentaje}%` : '—';
  const p4Att = attendance?.periodos?.P4?.porcentaje ? `${attendance.periodos.P4.porcentaje}%` : '—';
  const anualAtt = attendance?.promedioAnual ? `${attendance.promedioAnual}%` : '—';

  const rowsHtml = studentGrades.map(({ sub, grade }) => {
    if (!grade) {
      return `<tr>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 600;">${sub.nombre}</td>
        <td colspan="20" style="border: 1px solid #cbd5e1; padding: 6px; text-align: center; color: #64748b;">Sin calificaciones registradas</td>
      </tr>`;
    }

    const { P1, P2, P3, P4 } = grade.periodos;
    const formatScore = (val: number) => {
      const isRep = val < 70;
      return `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; ${isRep ? 'color: #dc2626; font-weight: 700;' : ''}">${val}</td>`;
    };
    const formatCf = (val: number) => {
      const isRep = val < 70;
      return `<td style="border: 1px solid #cbd5e1; padding: 4px; text-align: center; font-family: monospace; font-weight: 700; background-color: #f1f5f9; ${isRep ? 'color: #dc2626;' : 'color: #0f172a;'}">${val}</td>`;
    };

    return `<tr>
      <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-weight: 600; font-size: 11px;">${sub.nombre}</td>
      ${formatScore(P1.com)}${formatScore(P1.plc)}${formatScore(P1.cyt)}${formatScore(P1.eyc)}${formatCf(P1.cf)}
      ${formatScore(P2.com)}${formatScore(P2.plc)}${formatScore(P2.cyt)}${formatScore(P2.eyc)}${formatCf(P2.cf)}
      ${formatScore(P3.com)}${formatScore(P3.plc)}${formatScore(P3.cyt)}${formatScore(P3.eyc)}${formatCf(P3.cf)}
      ${formatScore(P4.com)}${formatScore(P4.plc)}${formatScore(P4.cyt)}${formatScore(P4.eyc)}${formatCf(P4.cf)}
      ${formatScore(grade.totalCom)}${formatScore(grade.totalPlc)}${formatScore(grade.totalCyt)}${formatScore(grade.totalEyc)}${formatCf(grade.calificacionFinal)}
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Boletín - ${student.apellidos}, ${student.nombres} (${student.id})</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; color: #0f172a; background: #fff; line-height: 1.3; }
    .header-box { border-bottom: 2px solid #22396F; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .school-title { font-size: 20px; font-weight: 800; color: #22396F; text-transform: uppercase; margin: 0; }
    .school-subtitle { font-size: 13px; font-weight: 700; color: #CE1126; margin: 4px 0 0 0; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; margin-bottom: 16px; border-radius: 4px; }
    .meta-item span { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
    .meta-item strong { font-size: 15px; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
    th { border: 1px solid #94a3b8; padding: 4px; text-align: center; }
    .th-main { background-color: #22396F; color: #fff; font-size: 11px; font-weight: bold; }
    .th-sub { background-color: #f1f5f9; color: #334155; font-size: 9px; font-weight: 600; }
    .section-title { font-size: 14px; font-weight: 700; color: #22396F; margin: 16px 0 8px 0; }
    .condicion-box { border: 1px solid #cbd5e1; border-radius: 4px; padding: 12px; min-height: 48px; background: #fafafa; font-size: 12px; margin-bottom: 20px; }
    .leyenda { border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 10px; color: #475569; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 30px; }
    .firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; text-align: center; font-size: 12px; }
    .linea-firma { border-top: 1px solid #64748b; padding-top: 6px; font-weight: 600; margin: 0 40px; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="school-title">${school.nombre}</h1>
      <p style="margin: 2px 0; font-size: 11px; color: #475569;">${school.direccion} · Tel: ${school.telefono} · ${school.correo}</p>
      <div class="school-subtitle">${school.subtitulo}</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Distrito: <strong>${school.distrito}</strong></div>
      <div>Año Escolar: <strong>${school.anoEscolar}</strong></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><span>ESTUDIANTE</span><strong>${student.apellidos}, ${student.nombres}</strong></div>
    <div class="meta-item"><span>GRADO Y SECCIÓN</span><strong>${student.grado.toUpperCase()} ${student.seccion}</strong></div>
    <div class="meta-item"><span>CÓDIGO</span><strong>${student.id}</strong></div>
    <div class="meta-item"><span>SITUACIÓN</span><strong>${student.situacion}</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2" class="th-main" style="width: 22%; text-align: left; padding-left: 8px;">Áreas Curriculares</th>
        <th colspan="5" class="th-main">PERIODO 1</th>
        <th colspan="5" class="th-main">PERIODO 2</th>
        <th colspan="5" class="th-main">PERIODO 3</th>
        <th colspan="5" class="th-main">PERIODO 4</th>
        <th colspan="5" class="th-main" style="background-color: #1B2D58;">TOTAL</th>
      </tr>
      <tr>
        <th class="th-sub">COM</th><th class="th-sub">PLC</th><th class="th-sub">CYT</th><th class="th-sub">EYC</th><th class="th-sub" style="background-color: #e2e8f0; font-weight: bold;">C.F.</th>
        <th class="th-sub">COM</th><th class="th-sub">PLC</th><th class="th-sub">CYT</th><th class="th-sub">EYC</th><th class="th-sub" style="background-color: #e2e8f0; font-weight: bold;">C.F.</th>
        <th class="th-sub">COM</th><th class="th-sub">PLC</th><th class="th-sub">CYT</th><th class="th-sub">EYC</th><th class="th-sub" style="background-color: #e2e8f0; font-weight: bold;">C.F.</th>
        <th class="th-sub">COM</th><th class="th-sub">PLC</th><th class="th-sub">CYT</th><th class="th-sub">EYC</th><th class="th-sub" style="background-color: #e2e8f0; font-weight: bold;">C.F.</th>
        <th class="th-sub">COM</th><th class="th-sub">PLC</th><th class="th-sub">CYT</th><th class="th-sub">EYC</th><th class="th-sub" style="background-color: #e2e8f0; font-weight: bold;">C.F.</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="section-title">Promedio de Asistencia</div>
  <table>
    <thead>
      <tr class="th-main">
        <th>PERIODO 1</th>
        <th>PERIODO 2</th>
        <th>PERIODO 3</th>
        <th>PERIODO 4</th>
        <th style="background-color: #1B2D58;">PROMEDIO ANUAL</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-size: 13px;">${p1Att}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-size: 13px;">${p2Att}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-size: 13px;">${p3Att}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-size: 13px;">${p4Att}</td>
        <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; font-family: monospace; font-size: 13px; font-weight: bold; background: #f1f5f9;">${anualAtt}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Condición Final del Estudiante</div>
  <div class="condicion-box">
    ${student.condicionFinal || 'Estudiante promovido al grado inmediato superior con evaluación satisfactoria.'}
  </div>

  <div class="leyenda">
    <div>
      <div><strong>COM:</strong> Comunicativa</div>
      <div><strong>PLC:</strong> Pens. Lógico, Creativo y Crítico / Res. Problemas</div>
      <div><strong>CYT:</strong> Científica y Tecnológica / Ambiental y de la Salud</div>
      <div><strong>EYC:</strong> Ética y Ciudadana / Desarrollo Personal y Espiritual</div>
      <div><strong>C.F.:</strong> Calificación Final (Promedio de Competencias)</div>
    </div>
    <div>
      <div style="color: #15803D; font-weight: 600;">✓ Aprobado (≥ 70)</div>
      <div style="color: #DC2626; font-weight: 600;">✕ Reprobado (&lt; 70)</div>
      <div>MINERD - Ministerio de Educación República Dominicana</div>
    </div>
  </div>

  <div class="firmas">
    <div>
      <div class="linea-firma">Maestro/a encargado/a del grado</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">${school.maestroEncargadoDefault}</div>
    </div>
    <div>
      <div class="linea-firma">Director/a del Centro</div>
      <div style="font-size: 10px; color: #64748b; margin-top: 4px;">${school.director}</div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadStudentReportHTML(
  student: Student,
  school: SchoolInfo,
  subjects: Subject[],
  grades: StudentSubjectGrade[],
  attendance?: StudentAttendance
) {
  const html = generateStandaloneHTMLReport(student, school, subjects, grades, attendance);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Boletin_${student.id}_${student.apellidos}_${student.nombres}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadExcelSpreadsheet(
  student: Student,
  school: SchoolInfo,
  subjects: Subject[],
  grades: StudentSubjectGrade[],
  attendance?: StudentAttendance
) {
  let csv = `\uFEFF"${school.nombre}"\r\n`;
  csv += `"${school.subtitulo}" - Año Escolar ${school.anoEscolar}\r\n`;
  csv += `"Estudiante: ${student.apellidos}, ${student.nombres}","Código: ${student.id}","Grado: ${student.grado} ${student.seccion}","Situación: ${student.situacion}"\r\n\r\n`;

  // Header row
  csv += `"Área Curricular",` +
    `"P1 COM","P1 PLC","P1 CYT","P1 EYC","P1 CF",` +
    `"P2 COM","P2 PLC","P2 CYT","P2 EYC","P2 CF",` +
    `"P3 COM","P3 PLC","P3 CYT","P3 EYC","P3 CF",` +
    `"P4 COM","P4 PLC","P4 CYT","P4 EYC","P4 CF",` +
    `"TOTAL COM","TOTAL PLC","TOTAL CYT","TOTAL EYC","CALIFICACIÓN FINAL","ESTADO"\r\n`;

  subjects.forEach(sub => {
    const g = grades.find(x => x.estudianteId === student.id && x.materiaId === sub.id);
    if (!g) {
      csv += `"${sub.nombre}",,,,,,,,,,,,,,,,,,,,,,\r\n`;
      return;
    }
    const { P1, P2, P3, P4 } = g.periodos;
    csv += `"${sub.nombre}",` +
      `${P1.com},${P1.plc},${P1.cyt},${P1.eyc},${P1.cf},` +
      `${P2.com},${P2.plc},${P2.cyt},${P2.eyc},${P2.cf},` +
      `${P3.com},${P3.plc},${P3.cyt},${P3.eyc},${P3.cf},` +
      `${P4.com},${P4.plc},${P4.cyt},${P4.eyc},${P4.cf},` +
      `${g.totalCom},${g.totalPlc},${g.totalCyt},${g.totalEyc},${g.calificacionFinal},"${g.estado}"\r\n`;
  });

  csv += `\r\n"PROMEDIO DE ASISTENCIA"\r\n`;
  csv += `"Periodo 1","Periodo 2","Periodo 3","Periodo 4","Promedio Anual"\r\n`;
  csv += `"${attendance?.periodos?.P1?.porcentaje || 0}%","${attendance?.periodos?.P2?.porcentaje || 0}%","${attendance?.periodos?.P3?.porcentaje || 0}%","${attendance?.periodos?.P4?.porcentaje || 0}%","${attendance?.promedioAnual || 0}%"\r\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Calificaciones_${student.id}_${student.apellidos}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadSampleCSVTemplate() {
  const sample = `\uFEFFCodigo,Apellidos,Nombres,Grado,Seccion,Tutor,TutorEmail,TutorTelefono
2026-101,Bautista Reyes,Juan Carlos,2do,A,Rosa Reyes,rosa.reyes@email.com,809-555-1122
2026-102,Santos Santana,Alba Lucia,2do,A,Pedro Santos,pedro.santos@email.com,809-555-3344
2026-103,Mendoza Cruz,Wilmer David,2do,B,Gloria Cruz,gloria.cruz@email.com,809-555-5566`;

  const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Plantilla_Importar_Estudiantes_EGrading.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseCSVStudentImport(text: string): Partial<Student>[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const students: Partial<Student>[] = [];
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 4) {
      students.push({
        id: cols[0] || `2026-${Math.floor(100 + Math.random() * 900)}`,
        apellidos: cols[1] || 'Sin Apellidos',
        nombres: cols[2] || 'Sin Nombres',
        grado: cols[3] || '2do',
        seccion: (cols[4] || 'A').toUpperCase(),
        tutor: cols[5] || 'Tutor no registrado',
        tutorEmail: cols[6] || 'tutor@ejemplo.com',
        tutorTelefono: cols[7] || '809-555-0000',
        situacion: 'Activo'
      });
    }
  }
  return students;
}

export function generateSabanaHTMLReport(
  subject: Subject,
  grado: string,
  seccion: string,
  periodo: string,
  students: Student[],
  grades: StudentSubjectGrade[],
  school: SchoolInfo
): string {
  const sectionGrades = grades.filter(g => g.materiaId === subject.id);
  const rows = students.map((s, idx) => {
    const g = sectionGrades.find(gr => gr.estudianteId === s.id);
    const p = g?.periodos[periodo as keyof typeof g.periodos] || { com: 80, plc: 80, cyt: 80, eyc: 80, cf: 80 };
    const cf = Math.round((p.com + p.plc + p.cyt + p.eyc) / 4);
    const isPassing = cf >= 70;
    return `<tr>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center;">${idx + 1}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; font-family: monospace;">${s.id}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; font-weight: 600;">${s.apellidos}, ${s.nombres}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-family: monospace;">${p.com}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-family: monospace;">${p.plc}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-family: monospace;">${p.cyt}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-family: monospace;">${p.eyc}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-weight: bold; background: #e2e8f0; font-family: monospace;">${cf}</td>
      <td style="border: 1px solid #94a3b8; padding: 6px; text-align: center; font-weight: 600; color: ${isPassing ? '#15803D' : '#DC2626'};">${isPassing ? 'Aprobado' : 'Reprobado'}</td>
    </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Sábana de Calificaciones - ${subject.nombre} (${grado} ${seccion})</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; margin: 25px; color: #0f172a; background: #fff; line-height: 1.4; }
    .header-box { border-bottom: 2px solid #22396F; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .school-title { font-size: 20px; font-weight: 800; color: #22396F; text-transform: uppercase; margin: 0; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; background: #22396F; color: #fff; font-size: 11px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 24px; }
    th { border: 1px solid #94a3b8; padding: 6px; text-align: center; }
    .th-main { background-color: #22396F; color: #fff; font-weight: bold; }
    .leyenda-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; background: #f8fafc; margin-top: 16px; font-size: 11px; }
    .leyenda-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 8px; }
    .firmas { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 45px; text-align: center; font-size: 12px; }
    .linea-firma { border-top: 1px solid #64748b; padding-top: 6px; font-weight: 600; margin: 0 40px; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <h1 class="school-title">${school.nombre}</h1>
      <p style="margin: 3px 0; font-size: 12px; color: #475569;">Ministerio de Educación de la República Dominicana (MINERD)</p>
      <div style="font-size: 14px; font-weight: bold; color: #CE1126; margin-top: 4px;">SÁBANA OFICIAL DE CALIFICACIONES POR COMPETENCIAS</div>
    </div>
    <div style="text-align: right; font-size: 12px;">
      <div>Asignatura: <strong>${subject.nombre}</strong></div>
      <div>Docente: <strong>${subject.profesorAsignado}</strong></div>
      <div>Curso: <strong>${grado.toUpperCase()} - Sección ${seccion}</strong> · Período: <strong>${periodo}</strong></div>
      <div>Año Escolar: <strong>${school.anoEscolar}</strong></div>
    </div>
  </div>

  <table>
    <thead>
      <tr class="th-main">
        <th style="width: 4%;">No.</th>
        <th style="width: 12%;">Código</th>
        <th style="text-align: left; padding-left: 8px;">Estudiante</th>
        <th style="width: 9%;">COM</th>
        <th style="width: 9%;">PLC</th>
        <th style="width: 9%;">CYT</th>
        <th style="width: 9%;">EYC</th>
        <th style="width: 10%; background-color: #1B2D58;">C.F. (${periodo})</th>
        <th style="width: 12%;">Condición</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Leyenda Oficial de Competencias -->
  <div class="leyenda-box">
    <div style="font-weight: bold; color: #22396F; text-transform: uppercase; font-size: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
      Leyenda Oficial de Competencias Fundamentales del Currículo Dominicano (MINERD)
    </div>
    <div class="leyenda-grid">
      <div>
        <strong>COM (Comunicativa):</strong> Comprensión y producción oral y escrita, lectura comprensiva y comunicación asertiva.
      </div>
      <div>
        <strong>PLC (Pensamiento Lógico, Creativo y Crítico):</strong> Resolución de problemas complejos y pensamiento científico.
      </div>
      <div>
        <strong>CYT (Científica y Tecnológica):</strong> Investigación científica, tecnológica, ambiental y de la salud.
      </div>
      <div>
        <strong>EYC (Ética y Ciudadana):</strong> Desarrollo personal y espiritual, ciudadanía democrática, intercultural y valores.
      </div>
    </div>
    <div style="margin-top: 10px; padding-top: 6px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
      <span><strong>C.F.:</strong> Calificación Final = (COM + PLC + CYT + EYC) ÷ 4</span>
      <span><strong>Criterio de Aprobación:</strong> ≥ 70 puntos Aprobado | &lt; 70 puntos Requiere Recuperación</span>
    </div>
  </div>

  <div class="firmas">
    <div>
      <div class="linea-firma">Docente de la Asignatura</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${subject.profesorAsignado}</div>
    </div>
    <div>
      <div class="linea-firma">Director/a del Centro Educativo</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">${school.director}</div>
    </div>
  </div>
</body>
</html>`;
}

export function downloadSabanaHTML(
  subject: Subject,
  grado: string,
  seccion: string,
  periodo: string,
  students: Student[],
  grades: StudentSubjectGrade[],
  school: SchoolInfo
) {
  const html = generateSabanaHTMLReport(subject, grado, seccion, periodo, students, grades, school);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Sabana_${subject.id}_${grado}_${seccion}_${periodo}.html`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
