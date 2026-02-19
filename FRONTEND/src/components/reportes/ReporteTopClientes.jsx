// frontend/src/components/reportes/ReporteTopClientes.jsx
import BotonDescargarPDF from './BotonDescargarPDF';

const ReporteTopClientes = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4">No hay datos disponibles</div>;
  }

  const getFrecuenciaColor = (frecuencia) => {
    const colores = {
      diario: '#38b2ac',
      semanal: '#3a86ff',
      quincenal: '#f59e0b',
      mensual: '#8b5cf6'
    };
    return colores[frecuencia] || '#64748b';
  };

  const getFrecuenciaNombre = (frecuencia) => {
    const nombres = {
      diario: 'Diario',
      semanal: 'Semanal',
      quincenal: 'Quincenal',
      mensual: 'Mensual'
    };
    return nombres[frecuencia] || frecuencia;
  };

  const columnasPDF = [
    { titulo: 'Cliente', campo: 'razon_social' },
    { titulo: 'Documento', campo: 'numero_documento' },
    { titulo: 'Teléfono', campo: 'telefono' },
    { titulo: 'Zona', campo: 'zona' },
    { titulo: 'Tipo', campo: 'tipo_cliente' },
    { titulo: 'Frecuencia', campo: 'frecuencia' }
  ];

  return (
    <div className="reporte-card">
      <div className="reporte-header">
        <h3 className="reporte-titulo">
          🏆 Top Clientes por Frecuencia de Compra
        </h3>
        <BotonDescargarPDF
          titulo="Top Clientes"
          data={data}
          columnas={columnasPDF}
          nombreArchivo="top-clientes.pdf"
          tipo="tabla"
        />
      </div>

      {/* Ranking visual */}
      <div className="stats-grid">
        {data.slice(0, 3).map((cliente, index) => (
          <div key={index} className="stat-card" style={{ 
            borderColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
            </div>
            <div className="stat-valor" style={{ fontSize: '1.2rem' }}>
              {cliente.razon_social}
            </div>
            <div className="stat-label">{cliente.zona}</div>
            <div className="mt-2">
              <span className="badge" style={{ 
                background: getFrecuenciaColor(cliente.frecuencia),
                color: 'white'
              }}>
                {getFrecuenciaNombre(cliente.frecuencia)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabla completa */}
      <div className="table-responsive">
        <table className="reporte-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Cliente</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Zona</th>
              <th>Tipo</th>
              <th>Frecuencia</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cliente, index) => (
              <tr key={cliente.id}>
                <td>
                  <span className="badge" style={{ 
                    background: index < 3 ? '#3a86ff' : '#e2e8f0',
                    color: index < 3 ? 'white' : '#1e293b'
                  }}>
                    {index + 1}
                  </span>
                </td>
                <td>
                  <strong>{cliente.razon_social}</strong>
                  {cliente.nombre_comercial && (
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {cliente.nombre_comercial}
                    </div>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem' }}>
                    {cliente.tipo_documento}: {cliente.numero_documento}
                  </span>
                </td>
                <td>{cliente.telefono}</td>
                <td>
                  <span className="badge">{cliente.zona || 'N/A'}</span>
                </td>
                <td>{cliente.tipo_cliente}</td>
                <td>
                  <span className="badge" style={{ 
                    background: getFrecuenciaColor(cliente.frecuencia),
                    color: 'white'
                  }}>
                    {getFrecuenciaNombre(cliente.frecuencia)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${cliente.estado === 'activo' ? 'badge-success' : 'badge-warning'}`}>
                    {cliente.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteTopClientes;