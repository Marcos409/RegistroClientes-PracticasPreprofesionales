// frontend/src/components/dashboard/MapaCalorHuancayo.jsx
const MapaCalorHuancayo = ({ data }) => {
    if (!data || !data.zonas) {
      return (
        <div className="text-center p-4" style={{ color: '#64748b' }}>
          No hay datos de mapa de calor
        </div>
      )
    }
  
    const getColorByIntensity = (nivel) => {
      const colores = {
        1: '#feedde',
        2: '#fdd0a2',
        3: '#fdae6b',
        4: '#fd8d3c',
        5: '#e6550d'
      }
      return colores[nivel] || '#feedde'
    }
  
    const getIconByZona = (zona) => {
      const icons = {
        centro: '🏛️',
        norte: '⬆️',
        sur: '⬇️',
        este: '➡️',
        oeste: '⬅️'
      }
      return icons[zona] || '📍'
    }
  
    return (
      <div>
        {/* Grid de zonas */}
        <div className="row g-2">
          {data.zonas.map((zona) => (
            <div className="col-6 col-md-4 mb-2" key={zona.id}>
              <div style={{ 
                background: getColorByIntensity(zona.nivel_calor),
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {getIconByZona(zona.zona)}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.25rem' }}>
                  {zona.nombre}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
                  {zona.clientes}
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  🔥 {zona.nivel_calor}/5
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Leyenda */}
        <div className="mt-3 p-3" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '20px', height: '20px', background: '#feedde', borderRadius: '4px' }}></span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Baja</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '20px', height: '20px', background: '#fdae6b', borderRadius: '4px' }}></span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Media</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span style={{ width: '20px', height: '20px', background: '#e6550d', borderRadius: '4px' }}></span>
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Alta</span>
              </div>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#334155' }}>
              <strong>Total en zonas:</strong> {data.total_clientes_zonas} clientes
            </div>
          </div>
        </div>
  
        {/* Zona destacada */}
        {data.zona_con_mas_clientes && (
          <div className="mt-3" style={{ 
            background: 'linear-gradient(135deg, #f59e0b20, #d9770620)',
            border: '1px solid #f59e0b',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <div>
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Zona con más clientes</span>
              <div style={{ fontWeight: '700', color: '#1e293b' }}>
                {data.zona_con_mas_clientes.nombre} ({data.zona_con_mas_clientes.clientes} clientes)
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  export default MapaCalorHuancayo