// frontend/src/components/dashboard/TablaDistritos.jsx
const TablaDistritos = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center p-4" style={{ color: '#64748b' }}>
          No hay datos de distritos
        </div>
      )
    }
  
    const getColorByPorcentaje = (porcentaje) => {
      if (porcentaje >= 30) return '#38b2ac'
      if (porcentaje >= 20) return '#f59e0b'
      if (porcentaje >= 10) return '#3a86ff'
      return '#ef4444'
    }
  
    const totalClientes = data.reduce((acc, item) => acc + item.clientes, 0)
  
    return (
      <div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Distrito</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Zona</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Clientes</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Porcentaje</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Distribución</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '1.2rem' }}>🏘️</span>
                      <span style={{ fontWeight: '500' }}>{item.distrito}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ 
                      background: '#f1f5f9',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      textTransform: 'capitalize'
                    }}>
                      {item.zona}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600' }}>
                    {item.clientes}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <span style={{ 
                      background: getColorByPorcentaje(item.porcentaje) + '20',
                      color: getColorByPorcentaje(item.porcentaje),
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
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
                      maxWidth: '200px',
                      position: 'relative'
                    }}>
                      <div style={{ 
                        width: `${item.porcentaje}%`,
                        height: '100%',
                        background: getColorByPorcentaje(item.porcentaje),
                        borderRadius: '4px'
                      }}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {/* Total general */}
        <div className="mt-3 p-3" style={{ 
          background: '#f8fafc', 
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Total clientes en distritos:</span>
          <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{totalClientes}</span>
        </div>
  
        {/* Mini ranking */}
        <div className="mt-3">
          <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
            🏆 Ranking de distritos
          </p>
          <div className="d-flex gap-2 flex-wrap">
            {data.sort((a, b) => b.clientes - a.clientes).map((item, index) => (
              <div key={index} style={{ 
                background: '#f1f5f9',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}</span>
                <span style={{ fontWeight: '600' }}>{item.distrito}</span>
                <span style={{ color: '#64748b' }}>({item.clientes})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export default TablaDistritos