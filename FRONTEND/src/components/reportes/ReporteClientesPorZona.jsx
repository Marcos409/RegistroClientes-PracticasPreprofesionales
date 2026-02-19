// frontend/src/components/reportes/ReporteClientesPorZona.jsx
import BotonDescargarPDF from './BotonDescargarPDF';

const ReporteClientesPorZona = ({ data }) => {
  if (!data || !data.data) {
    return <div className="text-center p-4">No hay datos disponibles</div>;
  }

  const { data: zonas, totales } = data;

  // Colores para las zonas
  const coloresZonas = {
    norte: '#3a86ff',
    sur: '#38b2ac',
    este: '#f59e0b',
    oeste: '#ec4899',
    centro: '#8b5cf6'
  };

  // Columnas para PDF
  const columnasPDF = [
    { titulo: 'Zona', campo: 'nombre_zona' },
    { titulo: 'Total', campo: 'total_clientes' },
    { titulo: 'Activos', campo: 'activos' },
    { titulo: 'Inactivos', campo: 'inactivos' },
    { titulo: 'Personas', campo: 'personas_naturales' },
    { titulo: 'Empresas', campo: 'empresas' },
    { titulo: '%', campo: 'porcentaje_del_total' }
  ];

  return (
    <div className="reporte-card">
      <div className="reporte-header">
        <h3 className="reporte-titulo">
          📍 Clientes por Zona - Huancayo
        </h3>
        <BotonDescargarPDF
          titulo="Reporte de Clientes por Zona"
          data={zonas}
          columnas={columnasPDF}
          nombreArchivo="clientes-por-zona.pdf"
          tipo="tabla"
        />
      </div>

      {/* Tarjetas de resumen */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-valor">{totales.general}</div>
          <div className="stat-label">Total Clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor" style={{ color: '#38b2ac' }}>{totales.activos}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor" style={{ color: '#ef4444' }}>{totales.inactivos}</div>
          <div className="stat-label">Inactivos</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor">{zonas.length}</div>
          <div className="stat-label">Zonas</div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="table-responsive">
        <table className="reporte-tabla">
          <thead>
            <tr>
              <th>Zona</th>
              <th>Total</th>
              <th>Activos</th>
              <th>Inactivos</th>
              <th>Personas</th>
              <th>Empresas</th>
              <th>%</th>
              <th>Distribución</th>
            </tr>
          </thead>
          <tbody>
            {zonas.map((zona, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '4px',
                      background: coloresZonas[zona.zona] || '#3a86ff'
                    }}></span>
                    <strong>{zona.nombre_zona}</strong>
                  </div>
                </td>
                <td className="text-right">{zona.total_clientes}</td>
                <td className="text-right" style={{ color: '#38b2ac' }}>{zona.activos}</td>
                <td className="text-right" style={{ color: '#ef4444' }}>{zona.inactivos}</td>
                <td className="text-right">{zona.personas_naturales}</td>
                <td className="text-right">{zona.empresas}</td>
                <td className="text-right">
                  <span className="badge badge-info">{zona.porcentaje_del_total}%</span>
                </td>
                <td style={{ width: '150px' }}>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${zona.porcentaje_del_total}%`,
                        backgroundColor: coloresZonas[zona.zona] || '#3a86ff'
                      }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda de zonas */}
      <div className="mt-3 p-2" style={{ background: '#f8fafc', borderRadius: '8px' }}>
        <div className="d-flex gap-3 flex-wrap">
          {Object.entries(coloresZonas).map(([zona, color]) => (
            <div key={zona} className="d-flex align-items-center gap-2">
              <span style={{ width: '12px', height: '12px', background: color, borderRadius: '4px' }}></span>
              <span style={{ fontSize: '0.85rem', textTransform: 'capitalize' }}>{zona}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReporteClientesPorZona;