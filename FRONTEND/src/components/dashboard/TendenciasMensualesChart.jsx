// frontend/src/components/dashboard/TendenciasMensualesChart.jsx
import { useState } from 'react'

const TendenciasMensualesChart = ({ data }) => {
  const [vista, setVista] = useState('barras') // 'barras' o 'tabla'

  if (!data || !data.mensual) {
    return (
      <div className="text-center p-4" style={{ color: '#64748b' }}>
        No hay datos de tendencias
      </div>
    )
  }

  const maxValor = Math.max(
    ...data.mensual.flatMap(m => [m.nuevos, m.perdidos])
  )

  return (
    <div>
      {/* Selector de vista */}
      <div className="d-flex justify-content-end gap-2 mb-3">
        <button
          className="btn btn-sm"
          onClick={() => setVista('barras')}
          style={{
            background: vista === 'barras' ? '#f1f5f9' : 'transparent',
            border: '1px solid #e2e8f0',
            color: '#334155',
            padding: '0.25rem 1rem',
            borderRadius: '20px'
          }}
        >
          📊 Barras
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setVista('tabla')}
          style={{
            background: vista === 'tabla' ? '#f1f5f9' : 'transparent',
            border: '1px solid #e2e8f0',
            color: '#334155',
            padding: '0.25rem 1rem',
            borderRadius: '20px'
          }}
        >
          📋 Tabla
        </button>
      </div>

      {vista === 'barras' ? (
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: '600px' }}>
            {data.mensual.map((mes, index) => (
              <div key={index} className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b' }}>
                    {mes.mes_nombre}
                  </span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: mes.saldo_neto > 0 ? '#38b2ac' : mes.saldo_neto < 0 ? '#ef4444' : '#64748b',
                    fontWeight: '600',
                    background: '#f1f5f9',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px'
                  }}>
                    {mes.saldo_neto > 0 ? '+' : ''}{mes.saldo_neto} neto
                  </span>
                </div>
                
                {/* Barras */}
                <div className="d-flex gap-2" style={{ height: '40px' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ 
                      width: `${(mes.nuevos / maxValor) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #38b2ac, #319795)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '10px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {mes.nuevos} nuevos
                    </div>
                  </div>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <div style={{ 
                      width: `${(mes.perdidos / maxValor) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '10px',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      {mes.perdidos} perdidos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Mes</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Nuevos</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Perdidos</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontSize: '0.875rem', color: '#64748b' }}>Saldo Neto</th>
              </tr>
            </thead>
            <tbody>
              {data.mensual.map((mes, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: '500' }}>{mes.mes_nombre}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#38b2ac', fontWeight: '600' }}>
                    +{mes.nuevos}
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right', color: '#ef4444', fontWeight: '600' }}>
                    -{mes.perdidos}
                  </td>
                  <td style={{ 
                    padding: '0.75rem', 
                    textAlign: 'right', 
                    fontWeight: '700',
                    color: mes.saldo_neto > 0 ? '#38b2ac' : mes.saldo_neto < 0 ? '#ef4444' : '#64748b'
                  }}>
                    {mes.saldo_neto > 0 ? '+' : ''}{mes.saldo_neto}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tarjetas de totales */}
      {data.totales_periodo && (
        <div className="row g-2 mt-4">
          <div className="col-6 col-md-3">
            <div style={{ 
              background: '#f1f5f9', 
              borderRadius: '12px', 
              padding: '1rem', 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Nuevos</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#38b2ac' }}>
                {data.totales_periodo.nuevos}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ 
              background: '#f1f5f9', 
              borderRadius: '12px', 
              padding: '1rem', 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Total Perdidos</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                {data.totales_periodo.perdidos}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ 
              background: '#f1f5f9', 
              borderRadius: '12px', 
              padding: '1rem', 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Crecimiento Neto</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3a86ff' }}>
                {data.totales_periodo.crecimiento_neto}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div style={{ 
              background: '#f1f5f9', 
              borderRadius: '12px', 
              padding: '1rem', 
              textAlign: 'center',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Tasa Crecimiento</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                {data.totales_periodo.tasa_crecimiento}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TendenciasMensualesChart