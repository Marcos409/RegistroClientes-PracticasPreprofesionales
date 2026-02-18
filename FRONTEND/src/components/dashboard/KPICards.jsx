// frontend/src/components/dashboard/KPICards.jsx
const KPICards = ({ kpis }) => {
    if (!kpis) return null
  
    const cards = [
      {
        titulo: 'Total Clientes',
        valor: kpis.total_clientes,
        icono: '👥',
        gradient: 'linear-gradient(135deg, #3a86ff, #6c63ff)',
        color: '#3a86ff'
      },
      {
        titulo: 'Clientes Activos',
        valor: kpis.clientes_activos,
        icono: '✅',
        gradient: 'linear-gradient(135deg, #38b2ac, #319795)',
        color: '#38b2ac'
      },
      {
        titulo: '% Activos',
        valor: `${kpis.porcentaje_activos}%`,
        icono: '📊',
        gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
        color: '#f59e0b'
      },
      {
        titulo: 'Nuevos Hoy',
        valor: kpis.nuevos_hoy,
        icono: '🆕',
        gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
        color: '#ec4899'
      }
    ]
  
    return (
      <div className="row g-3 mb-4">
        {cards.map((card, index) => (
          <div className="col-md-3" key={index}>
            <div className="card h-100" style={{ border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px',
                    background: card.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    color: 'white'
                  }}>
                    {card.icono}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{card.titulo}</p>
                    <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                      {card.valor}
                    </h3>
                  </div>
                </div>
                <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
                  <div style={{ 
                    width: index === 2 ? kpis.porcentaje_activos + '%' : '100%', 
                    height: '100%', 
                    background: card.color, 
                    borderRadius: '2px' 
                  }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }
  
  export default KPICards