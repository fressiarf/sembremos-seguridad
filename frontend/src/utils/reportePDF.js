import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Genera un reporte PDF institucional completo del programa Sembremos Seguridad.
 * Consume datos de las tablas relacionadas del dashboard (líneas de acción, tareas,
 * zonas, alertas, usuarios y reportes).
 * 
 * @param {Object} dashboardData - Datos completos del dashboard
 * @param {Object} currentUser - Datos del usuario que genera el reporte
 */
export const generateReportePDF = (dashboardData, currentUser) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 20;
  let cursorY = 0;

  // ═══════════════════════════════════════════
  // Colores institucionales
  // ═══════════════════════════════════════════
  const isMSP = currentUser?.nivel === 'MSP';
  const primaryColor = isMSP ? [30, 58, 138] : [6, 95, 70];    // Azul MSP | Verde MUNI
  const accentColor = isMSP ? [59, 130, 246] : [16, 185, 129];
  const darkText = [15, 23, 42];
  const mutedText = [100, 116, 139];
  const lightBg = [248, 250, 252];

  // ═══════════════════════════════════════════
  // Helpers
  // ═══════════════════════════════════════════
  const addNewPageIfNeeded = (requiredSpace = 40) => {
    if (cursorY + requiredSpace > pageH - 30) {
      doc.addPage();
      cursorY = 25;
      addPageFooter();
    }
  };

  const addPageFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(
      `Página ${pageCount} · Generado: ${new Date().toLocaleString('es-CR')} · Sembremos Seguridad`,
      pageW / 2, pageH - 10, { align: 'center' }
    );
  };

  const drawSectionTitle = (title, icon = '▪') => {
    addNewPageIfNeeded(25);
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, cursorY, pageW - margin * 2, 10, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(`${icon}  ${title}`, margin + 5, cursorY + 7);
    cursorY += 16;
  };

  // ═══════════════════════════════════════════
  // PORTADA
  // ═══════════════════════════════════════════
  // Franja superior
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageW, 80, 'F');

  // Franja tricolor de Costa Rica
  doc.setFillColor(0, 47, 167);   // Azul
  doc.rect(0, 80, pageW, 3, 'F');
  doc.setFillColor(255, 255, 255); // Blanco
  doc.rect(0, 83, pageW, 3, 'F');
  doc.setFillColor(206, 17, 38);  // Rojo
  doc.rect(0, 86, pageW, 3, 'F');

  // Título principal
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('SEMBREMOS SEGURIDAD', pageW / 2, 35, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte Ejecutivo de Gestión Integral', pageW / 2, 48, { align: 'center' });

  doc.setFontSize(10);
  doc.text(isMSP ? 'Ministerio de Seguridad Pública · Fuerza Pública' : 'Gobierno Local · Municipalidad', pageW / 2, 60, { align: 'center' });
  doc.text('Puntarenas, Costa Rica', pageW / 2, 68, { align: 'center' });

  // Info del reporte
  doc.setTextColor(...darkText);
  doc.setFontSize(10);
  cursorY = 105;
  doc.setFont('helvetica', 'bold');
  doc.text('Fecha de generación:', margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), margin + 45, cursorY);

  cursorY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Generado por:', margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(`${currentUser?.nombre || 'Administrador'} (${currentUser?.rol || 'N/A'})`, margin + 45, cursorY);

  cursorY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Cédula:', margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(currentUser?.cedula || '---', margin + 45, cursorY);

  cursorY += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Nivel:', margin, cursorY);
  doc.setFont('helvetica', 'normal');
  doc.text(isMSP ? 'MSP - Ministerio de Seguridad Pública' : 'MUNI - Gobierno Local', margin + 45, cursorY);

  // ═══════════════════════════════════════════
  // RESUMEN EJECUTIVO (Estadísticas globales)
  // ═══════════════════════════════════════════
  cursorY += 20;
  drawSectionTitle('RESUMEN EJECUTIVO', '📊');

  const stats = dashboardData?.stats || {};
  const summaryData = [
    ['Total Líneas de Acción', String(stats.totalLineas || 0)],
    ['Total Tareas Registradas', String(stats.totalTareas || 0)],
    ['Tareas Completadas', String(stats.tareasCompletadas || 0)],
    ['Tareas Pendientes', String(stats.tareasPendientes || 0)],
    ['Cumplimiento General', `${stats.cumplimiento || 0}%`],
    ['Inversión Total (₡)', `₡${(stats.inversionTotal || 0).toLocaleString('es-CR')}`],
    ['Presupuesto Asignado (₡)', `₡${(stats.presupuestoAsignado || 0).toLocaleString('es-CR')}`]
  ];

  doc.autoTable({
    startY: cursorY,
    head: [['Indicador', 'Valor']],
    body: summaryData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: lightBg },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 100 } }
  });
  cursorY = doc.lastAutoTable.finalY + 10;

  // ═══════════════════════════════════════════
  // LÍNEAS DE ACCIÓN
  // ═══════════════════════════════════════════
  addNewPageIfNeeded(40);
  drawSectionTitle('LÍNEAS DE ACCIÓN ESTRATÉGICAS', '🎯');

  const lineas = dashboardData?.lineasEnriquecidas || dashboardData?.lineas || [];
  if (lineas.length > 0) {
    const lineasBody = lineas.map((l, i) => [
      String(i + 1),
      l.titulo || l.nombre || 'Sin título',
      `${l.totalTareas || 0}`,
      `${l.tareasCompletadas || 0}`,
      `${l.progreso || 0}%`,
      (l.responsables || []).join(', ') || 'N/A'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Línea de Acción', 'Tareas', 'Completadas', 'Progreso', 'Responsables']],
      body: lineasBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: lightBg },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 55 },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 20, halign: 'center' }
      }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // TAREAS
  // ═══════════════════════════════════════════
  addNewPageIfNeeded(40);
  drawSectionTitle('DETALLE DE TAREAS', '📋');

  const tareas = dashboardData?.tareasConProgreso || dashboardData?.tareas || [];
  if (tareas.length > 0) {
    const tareasBody = tareas.map((t, i) => [
      String(i + 1),
      t.titulo || t.nombre || 'Sin título',
      t.responsable || 'N/A',
      `${t.meta || 0}`,
      `${t.progresoReal || 0}%`,
      t.completada ? '✓ Completada' : '⏳ Pendiente'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Tarea', 'Responsable', 'Meta', 'Avance', 'Estado']],
      body: tareasBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: lightBg },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 55 },
        4: { cellWidth: 18, halign: 'center' },
        5: { cellWidth: 28, halign: 'center' }
      }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // ZONAS CRÍTICAS
  // ═══════════════════════════════════════════
  addNewPageIfNeeded(40);
  drawSectionTitle('ZONAS GEOGRÁFICAS DE INTERVENCIÓN', '📍');

  const zonas = dashboardData?.zones || [];
  if (zonas.length > 0) {
    const zonasBody = zonas.map((z, i) => [
      String(i + 1),
      z.nombre || 'N/A',
      z.nivel || 'N/A',
      String(z.incidentes || 0),
      z.ultimaActualizacion || 'N/A'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Zona', 'Nivel de Riesgo', 'Incidentes', 'Últ. Actualización']],
      body: zonasBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: lightBg },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' }
      }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // ALERTAS
  // ═══════════════════════════════════════════
  const alertas = dashboardData?.alerts || [];
  if (alertas.length > 0) {
    addNewPageIfNeeded(40);
    drawSectionTitle('ALERTAS ACTIVAS', '⚠️');

    const alertasBody = alertas.map((a, i) => [
      String(i + 1),
      a.titulo || a.mensaje || 'Sin descripción',
      a.tipo || 'General',
      a.fecha || 'N/A',
      a.prioridad || 'Media'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Alerta', 'Tipo', 'Fecha', 'Prioridad']],
      body: alertasBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [254, 242, 242] },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' } }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // USUARIOS REGISTRADOS
  // ═══════════════════════════════════════════
  const usuarios = dashboardData?.usuarios || [];
  if (usuarios.length > 0) {
    addNewPageIfNeeded(40);
    drawSectionTitle('PERSONAL REGISTRADO EN EL SISTEMA', '👤');

    const usersBody = usuarios.map((u, i) => [
      String(i + 1),
      u.nombre || 'N/A',
      u.cedula || '---',
      u.usuario || u.email || 'N/A',
      u.rol || 'N/A',
      u.institucion || 'N/A'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Nombre', 'Cédula', 'Correo', 'Rol', 'Institución']],
      body: usersBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: lightBg },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 25 }
      }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // REPORTES DE AVANCE
  // ═══════════════════════════════════════════
  const reportes = dashboardData?.reportes || [];
  if (reportes.length > 0) {
    addNewPageIfNeeded(40);
    drawSectionTitle('REPORTES DE AVANCE INSTITUCIONAL', '📄');

    const reportesBody = reportes.map((r, i) => [
      String(i + 1),
      r.tareaId || 'N/A',
      r.institucion || 'N/A',
      String(r.beneficiados || 0),
      r.estado || 'N/A',
      r.fechaCreacion ? new Date(r.fechaCreacion).toLocaleDateString('es-CR') : 'N/A'
    ]);

    doc.autoTable({
      startY: cursorY,
      head: [['#', 'Tarea ID', 'Institución', 'Beneficiados', 'Estado', 'Fecha']],
      body: reportesBody,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: lightBg },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' }
      }
    });
    cursorY = doc.lastAutoTable.finalY + 10;
  }

  // ═══════════════════════════════════════════
  // PIE DE DOCUMENTO
  // ═══════════════════════════════════════════
  addNewPageIfNeeded(35);
  cursorY += 5;
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(margin, cursorY, pageW - margin, cursorY);
  cursorY += 8;

  doc.setFontSize(9);
  doc.setTextColor(...mutedText);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Este documento es de carácter CONFIDENCIAL y de uso exclusivo del programa Sembremos Seguridad.',
    pageW / 2, cursorY, { align: 'center' }
  );
  cursorY += 5;
  doc.text(
    'Cualquier reproducción no autorizada está sujeta a las normativas de la Ley de Protección de Datos N° 8968.',
    pageW / 2, cursorY, { align: 'center' }
  );

  // Agregar footers a todas las páginas
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedText);
    doc.text(
      `Página ${i} de ${totalPages} · Sembremos Seguridad · ${new Date().toLocaleDateString('es-CR')}`,
      pageW / 2, pageH - 10, { align: 'center' }
    );
  }

  // ═══════════════════════════════════════════
  // DESCARGAR
  // ═══════════════════════════════════════════
  const timestamp = new Date().toISOString().slice(0, 10);
  doc.save(`Reporte_SembremosSeguridad_${timestamp}.pdf`);
};
