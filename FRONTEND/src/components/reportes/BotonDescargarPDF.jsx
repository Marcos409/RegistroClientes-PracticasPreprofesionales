// frontend/src/components/reportes/BotonDescargarPDF.jsx
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BotonDescargarPDF = ({ 
  titulo, 
  data, 
  columnas, 
  nombreArchivo = 'reporte.pdf',
  tipo = 'tabla'
}) => {
  
  const generarPDF = () => {
    console.log('📥 Generando PDF...', { titulo, data, columnas });
    
    try {
      // Crear nuevo documento PDF
      const doc = new jsPDF();
      
      // Configurar fuente
      doc.setFont('helvetica');
      
      // Título principal
      doc.setFontSize(18);
      doc.setTextColor(26, 43, 70); // #1e293b
      doc.text(titulo, 14, 20);
      
      // Fecha de generación
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // #64748b
      const fecha = new Date().toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Generado: ${fecha}`, 14, 28);
      
      // Línea separadora
      doc.setDrawColor(226, 232, 240); // #e2e8f0
      doc.setLineWidth(0.5);
      doc.line(14, 32, 196, 32);
      
      let startY = 40;
      
      if (tipo === 'tabla' && columnas && data && data.length > 0) {
        console.log('📊 Generando tabla con:', data.length, 'filas');
        
        // Preparar datos para la tabla
        const headers = [columnas.map(col => col.titulo)];
        const rows = data.map(item => 
          columnas.map(col => {
            let valor = item[col.campo];
            // Formatear valores según el tipo
            if (typeof valor === 'number') {
              return valor.toString();
            }
            if (valor === null || valor === undefined) {
              return '-';
            }
            return valor.toString();
          })
        );
        
        // Generar tabla
        autoTable(doc, {
          head: headers,
          body: rows,
          startY: startY,
          theme: 'striped',
          headStyles: {
            fillColor: [58, 134, 255], // #3a86ff
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'center'
          },
          bodyStyles: {
            fontSize: 9,
            textColor: [30, 41, 59] // #1e293b
          },
          alternateRowStyles: {
            fillColor: [248, 250, 252] // #f8fafc
          },
          margin: { left: 14, right: 14 },
          didDrawPage: function(data) {
            // Número de página
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // #94a3b8
            doc.text(
              `Página ${data.pageCount}`,
              doc.internal.pageSize.width / 2,
              doc.internal.pageSize.height - 10,
              { align: 'center' }
            );
          }
        });
        
        // Obtener la posición final de la tabla
        startY = doc.lastAutoTable.finalY + 10;
      } else {
        // Mensaje para gráficos
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text('Los gráficos se visualizan mejor en la pantalla.', 14, startY);
        doc.text('Para exportar datos, use la vista de tabla.', 14, startY + 8);
      }
      
      // Agregar información de totales al final
      if (data && data.length > 0) {
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(`Total de registros: ${data.length}`, 14, startY + 10);
      }
      
      // Guardar el PDF
      console.log('💾 Guardando PDF como:', nombreArchivo);
      doc.save(nombreArchivo);
      console.log('✅ PDF generado exitosamente');
      
    } catch (error) {
      console.error('❌ Error al generar PDF:', error);
      alert('Error al generar el PDF. Revisa la consola para más detalles.');
    }
  };

  return (
    <button 
      className="btn-descargar-pdf"
      onClick={generarPDF}
      title="Descargar como PDF"
      style={{
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '0.5rem 1rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.background = '#dc2626'}
      onMouseLeave={(e) => e.target.style.background = '#ef4444'}
    >
      <span style={{ fontSize: '1.2rem' }}>📥</span>
      <span>PDF</span>
    </button>
  );
};

export default BotonDescargarPDF;