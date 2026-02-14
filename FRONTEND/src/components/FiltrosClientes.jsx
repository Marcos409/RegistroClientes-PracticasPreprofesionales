import { useState } from 'react'

const FiltrosClientes = ({ filtros, onFiltroChange, onLimpiar }) => {
  const [showAvanzados, setShowAvanzados] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    onFiltroChange(name, value)
  }

  const handleLimpiar = () => {
    onLimpiar()
  }

  return (
    <div className="filtros-container">
      <div className="filtros-grid">
        {/* Tipo de Cliente */}
        <div className="filtro-group">
          <label htmlFor="tipo_cliente">Tipo de Cliente</label>
          <select
            id="tipo_cliente"
            name="tipo_cliente"
            className="filtro-select"
            value={filtros.tipo_cliente || ''}
            onChange={handleChange}
          >
            <option value="">Todos los tipos</option>
            <option value="persona_natural">Persona Natural</option>
            <option value="persona_juridica">Persona Jurídica</option>
            <option value="empresa">Empresa</option>
          </select>
        </div>

        {/* Zona */}
        <div className="filtro-group">
          <label htmlFor="zona">Zona</label>
          <select
            id="zona"
            name="zona"
            className="filtro-select"
            value={filtros.zona || ''}
            onChange={handleChange}
          >
            <option value="">Todas las zonas</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
            <option value="este">Este</option>
            <option value="oeste">Oeste</option>
            <option value="centro">Centro</option>
          </select>
        </div>

        {/* Estado */}
        <div className="filtro-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            className="filtro-select"
            value={filtros.estado || 'activo'}
            onChange={handleChange}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
            <option value="eliminado">Eliminados</option>
          </select>
        </div>

        {/* Límite por página */}
        <div className="filtro-group">
          <label htmlFor="limit">Mostrar</label>
          <select
            id="limit"
            name="limit"
            className="filtro-select"
            value={filtros.limit || 20}
            onChange={handleChange}
          >
            <option value="10">10 por página</option>
            <option value="20">20 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
          </select>
        </div>
      </div>

      {/* Filtros avanzados (toggle) */}
      <div className="filtros-avanzados-toggle">
        <button 
          type="button"
          className="toggle-btn"
          onClick={() => setShowAvanzados(!showAvanzados)}
        >
          <span className="toggle-icon">{showAvanzados ? '▼' : '▶'}</span>
          Filtros avanzados
        </button>
      </div>

      {showAvanzados && (
        <div className="filtros-avanzados">
          <div className="filtros-grid">
            {/* Rango de fechas */}
            <div className="filtro-group">
              <label htmlFor="fecha_desde">Fecha registro desde</label>
              <input
                type="date"
                id="fecha_desde"
                name="fecha_desde"
                className="filtro-input"
                value={filtros.fecha_desde || ''}
                onChange={handleChange}
              />
            </div>

            <div className="filtro-group">
              <label htmlFor="fecha_hasta">Fecha registro hasta</label>
              <input
                type="date"
                id="fecha_hasta"
                name="fecha_hasta"
                className="filtro-input"
                value={filtros.fecha_hasta || ''}
                onChange={handleChange}
              />
            </div>

            {/* Con preferencias específicas */}
            <div className="filtro-group">
              <label htmlFor="tipo_huevo">Tipo de huevo preferido</label>
              <select
                id="tipo_huevo"
                name="tipo_huevo"
                className="filtro-select"
                value={filtros.tipo_huevo || ''}
                onChange={handleChange}
              >
                <option value="">Todos</option>
                <option value="blanco">Blanco</option>
                <option value="rojo">Rojo</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>

            <div className="filtro-group">
              <label htmlFor="frecuencia_compra">Frecuencia de compra</label>
              <select
                id="frecuencia_compra"
                name="frecuencia_compra"
                className="filtro-select"
                value={filtros.frecuencia_compra || ''}
                onChange={handleChange}
              >
                <option value="">Todas</option>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="filtros-actions">
        <button 
          type="button"
          className="btn-limpiar"
          onClick={handleLimpiar}
        >
          <span className="btn-icon">🗑️</span>
          Limpiar filtros
        </button>
        
        <div className="filtros-info">
          <span className="info-badge">
            {filtros.search && `Buscando: "${filtros.search}"`}
          </span>
        </div>
      </div>

      <style jsx>{`
        .filtros-container {
          background-color: white;
          border-radius: 8px;
          padding: 1rem;
          border: 1px solid #eaeaea;
        }
        
        .filtros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .filtro-group {
          display: flex;
          flex-direction: column;
        }
        
        .filtro-group label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #495057;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .filtro-select,
        .filtro-input {
          padding: 0.6rem 0.75rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
          background-color: white;
          transition: all 0.2s ease;
        }
        
        .filtro-select:focus,
        .filtro-input:focus {
          outline: none;
          border-color: #3a86ff;
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }
        
        .filtro-select:hover,
        .filtro-input:hover {
          border-color: #b0b0b0;
        }
        
        .filtros-avanzados-toggle {
          margin-bottom: 1rem;
        }
        
        .toggle-btn {
          background: none;
          border: none;
          color: #3a86ff;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0;
        }
        
        .toggle-btn:hover {
          color: #2667d9;
        }
        
        .toggle-icon {
          font-size: 0.8rem;
        }
        
        .filtros-avanzados {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          animation: slideDown 0.3s ease;
        }
        
        .filtros-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.5rem;
          border-top: 1px solid #eaeaea;
        }
        
        .btn-limpiar {
          background: none;
          border: 1px solid #dc3545;
          color: #dc3545;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .btn-limpiar:hover {
          background-color: #dc3545;
          color: white;
        }
        
        .btn-icon {
          font-size: 0.9rem;
        }
        
        .filtros-info {
          display: flex;
          gap: 0.5rem;
        }
        
        .info-badge {
          background-color: #e7f5ff;
          color: #1971c2;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .filtros-grid {
            grid-template-columns: 1fr;
          }
          
          .filtros-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .btn-limpiar {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

export default FiltrosClientes