"use client";

import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportarReporteProps {
  filas: any[][];
  columnas: string[];
  titulo: string;
  nombreArchivo: string;
}

export default function ExportarReporte({ 
  filas, 
  columnas, 
  titulo, 
  nombreArchivo 
}: ExportarReporteProps) {
  
  const generarPDF = () => {
    const doc = new jsPDF();
    
    // Configuración estética del PDF
    doc.setFontSize(20);
    doc.setTextColor(239, 68, 68); // Rojo Institucional
    doc.text("DATAGOAL", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(titulo, 14, 32);
    
    doc.setFontSize(8);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 38);

    // Generar tabla
    autoTable(doc, {
      startY: 45,
      head: [columnas],
      body: filas,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
    });

    doc.save(`${nombreArchivo}.pdf`);
  };

  return (
    <button
      onClick={generarPDF}
      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
    >
      <FileDown size={14} />
      Exportar PDF
    </button>
  );
}
