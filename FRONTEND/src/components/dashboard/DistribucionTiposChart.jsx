// frontend/src/components/dashboard/DistribucionTiposChart.jsx
const DistribucionTiposChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center p-4" style={{ color: '#64748b' }}>
          No hay datos disponibles
        </div>
      )
    }
  
    const colores = ['#3a86ff', '#38b2ac', '#f59e0b', '#ec4899', '#8b5cf6']
  
    return (
      <div>
        {/* Versión simplificada con tabla (más compatible) */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Tipo de Cliente
                </th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Cantidad
                </th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Porcentaje
                </th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>
                  Barra
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '4px',
                        background: colores[index % colores.length],
                        display: 'inline-block'
                      }}></span>
                      <span style={{ fontWeight: '500' }}>{item.nombre}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>
                    {item.cantidad}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <span style={{ 
                      background: '#f1f5f9',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      color: '#334155'
                    }}>
                      {item.porcentaje}%
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ 
                      height: '8px', 
                      background: '#e2e8f0', 
                      borderRadius: '4px',
                      width: '100%',
                      maxWidth: '200px'
                    }}>
                      <div style={{ 
                        width: `${item.porcentaje}%`,
                        height: '100%',
                        background: colores[index % colores.length],
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Tarjetas de resumen */}
        <div className="row g-2 mt-3">
          {data.map((item, index) => (
            <div className="col-4" key={index}>
              <div style={{ 
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '0.5rem',
                textAlign: 'center',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.nombre}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', color: colores[index % colores.length] }}>
                  {item.porcentaje}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default DistribucionTiposChart