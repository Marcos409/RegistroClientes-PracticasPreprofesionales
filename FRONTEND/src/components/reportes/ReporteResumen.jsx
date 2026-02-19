// frontend/src/components/reportes/ReporteResumen.jsx
import ReporteClientesPorZona from './ReporteClientesPorZona';
import ReporteClientesPorTipo from './ReporteClientesPorTipo';
import ReportePreferencias from './ReportePreferencias';
import ReporteEvolucionMensual from './ReporteEvolucionMensual';
import ReporteTopClientes from './ReporteTopClientes';

const ReporteResumen = ({ data }) => {
  if (!data) return <div className="text-center p-4">Cargando resumen...</div>;

  return (
    <div>
      {/* KPIs generales */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-valor">{data.clientes_por_zona?.totales?.general || 0}</div>
          <div className="stat-label">Total Clientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor" style={{ color: '#38b2ac' }}>
            {data.clientes_por_zona?.totales?.activos || 0}
          </div>
          <div className="stat-label">Clientes Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor">
            {data.clientes_por_tipo?.data?.length || 0}
          </div>
          <div className="stat-label">Tipos de Cliente</div>
        </div>
        <div className="stat-card">
          <div className="stat-valor">
            {data.preferencias?.tipo_huevo?.reduce((sum, t) => sum + t.cantidad, 0) || 0}
          </div>
          <div className="stat-label">Con Preferencias</div>
        </div>
      </div>

      {/* Reportes en miniatura */}
      <div className="dashboard-grid-2">
        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem' }}>📍 Clientes por Zona</h4>
          {data.clientes_por_zona?.data?.slice(0, 3).map((zona, i) => (
            <div key={i} className="d-flex justify-content-between mb-2">
              <span>{zona.nombre_zona}</span>
              <span className="badge badge-info">{zona.total_clientes}</span>
            </div>
          ))}
        </div>

        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem' }}>👥 Clientes por Tipo</h4>
          {data.clientes_por_tipo?.data?.map((tipo, i) => (
            <div key={i} className="d-flex justify-content-between mb-2">
              <span>{tipo.nombre_tipo}</span>
              <span className="badge badge-info">{tipo.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem' }}>🥚 Preferencias</h4>
          {data.preferencias?.tipo_huevo?.map((item, i) => (
            <div key={i} className="d-flex justify-content-between mb-2">
              <span>{item.nombre}</span>
              <span className="badge badge-info">{item.cantidad}</span>
            </div>
          ))}
        </div>

        <div className="grid-card">
          <h4 style={{ marginBottom: '1rem' }}>🏆 Top Clientes</h4>
          {data.top_clientes?.slice(0, 3).map((cliente, i) => (
            <div key={i} className="d-flex justify-content-between mb-2">
              <span>{cliente.razon_social}</span>
              <span className="badge" style={{ background: '#3a86ff', color: 'white' }}>
                {cliente.frecuencia || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Botón para ver todos los detalles */}
      <div className="text-center mt-3">
        <p style={{ color: '#64748b' }}>
          Selecciona un módulo específico para ver el reporte completo
        </p>
      </div>
    </div>
  );
};

export default ReporteResumen;