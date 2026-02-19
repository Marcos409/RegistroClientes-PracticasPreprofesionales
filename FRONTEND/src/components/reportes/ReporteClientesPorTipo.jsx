// frontend/src/components/reportes/ReporteClientesPorTipo.jsx
import BotonDescargarPDF from './BotonDescargarPDF';

const ReporteClientesPorTipo = ({ data }) => {
  if (!data || !data.data) {
    return <div className="text-center p-4">No hay datos disponibles</div>;
  }

  const { data: tipos, total_general } = data;

  const coloresTipos = {
    'persona_natural': '#3a86ff',
    'persona_juridica': '#f59e0b',
    'empresa': '#38b2ac'
  };

  const nombresTipos = {
    'persona_natural': 'Persona Natural',
    'persona_juridica': 'Persona Jurídica',
    'empresa': 'Empresa'
  };

  const columnasPDF = [
    { titulo: 'Tipo de Cliente', campo: 'nombre_tipo' },
    { titulo: 'Total', campo: 'total' },
    { titulo: 'Activos', campo: 'activos' },
    { titulo: 'Inactivos', campo: 'inactivos' },
    { titulo: '%', campo: 'porcentaje' }
  ];

  return (
    <div className="reporte-card">
      <div className="reporte-header">
        <h3 className="reporte-titulo">
          👥 Clientes por Tipo y Estado
        </h3>
        <BotonDescargarPDF
          titulo="Reporte de Clientes por Tipo"
          data={tipos}
          columnas={columnasPDF}
          nombreArchivo="clientes-por-tipo.pdf"
          tipo="tabla"
        />
      </div>

      {/* Gráfico de torta simplificado */}
      <div className="stats-grid">
        {tipos.map((tipo, index) => (
          <div key={index} className="stat-card" style={{ borderColor: coloresTipos[tipo.tipo] }}>
            <div className="stat-valor" style={{ color: coloresTipos[tipo.tipo] }}>
              {tipo.porcentaje}%
            </div>
            <div className="stat-label">{tipo.nombre_tipo}</div>
            <div className="mt-2">
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{
                    width: `${tipo.porcentaje}%`,
                    backgroundColor: coloresTipos[tipo.tipo]
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla detallada */}
      <div className="table-responsive">
        <table className="reporte-tabla">
          <thead>
            <tr>
              <th>Tipo de Cliente</th>
              <th className="text-right">Total</th>
              <th className="text-right">Activos</th>
              <th className="text-right">Inactivos</th>
              <th className="text-right">%</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {tipos.map((tipo, index) => (
              <tr key={index}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <span style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '4px',
                      background: coloresTipos[tipo.tipo]
                    }}></span>
                    {tipo.nombre_tipo}
                  </div>
                </td>
                <td className="text-right">{tipo.total}</td>
                <td className="text-right" style={{ color: '#38b2ac' }}>{tipo.activos}</td>
                <td className="text-right" style={{ color: '#ef4444' }}>{tipo.inactivos}</td>
                <td className="text-right">
                  <span className="badge badge-info">{tipo.porcentaje}%</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span className="badge badge-success">{tipo.activos} activos</span>
                    <span className="badge badge-warning">{tipo.inactivos} inactivos</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
              <td>TOTAL</td>
              <td className="text-right">{total_general}</td>
              <td className="text-right">{tipos.reduce((sum, t) => sum + t.activos, 0)}</td>
              <td className="text-right">{tipos.reduce((sum, t) => sum + t.inactivos, 0)}</td>
              <td className="text-right">100%</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReporteClientesPorTipo;