import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const DetalleCliente = ({ cliente, onEditar, onVolver, onImprimir }) => {
  const { user } = useAuth()
  const [showHistorial, setShowHistorial] = useState(false)

  const getTipoClienteText = (tipo) => {
    const tipos = {
      persona_natural: 'Persona Natural',
      persona_juridica: 'Persona Jurídica',
      empresa: 'Empresa'
    }
    return tipos[tipo] || tipo
  }

  const getZonaText = (zona) => {
    if (!zona) return 'No especificada'
    const zonas = {
      norte: 'Norte',
      sur: 'Sur',
      este: 'Este',
      oeste: 'Oeste',
      centro: 'Centro'
    }
    return zonas[zona]
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'activo':
        return <span className="badge badge-success">Activo</span>
      case 'inactivo':
        return <span className="badge badge-warning">Inactivo</span>
      case 'eliminado':
        return <span className="badge badge-danger">Eliminado</span>
      default:
        return <span className="badge badge-default">{estado}</span>
    }
  }

  const formatFecha = (fecha) => {
    if (!fecha) return '-'
    return new Date(fecha).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAbrirMapa = () => {
    if (cliente.latitud && cliente.longitud) {
      window.open(`https://www.google.com/maps?q=${cliente.latitud},${cliente.longitud}`, '_blank')
    } else if (cliente.direccion) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cliente.direccion)}`, '_blank')
    }
  }

  return (
    <div className="detalle-container">
      {/* Header con acciones */}
      <div className="detalle-header">
        <div className="header-left">
          <button className="btn-volver" onClick={onVolver}>
            ← Volver
          </button>
          <div className="cliente-titulo">
            <h2>{cliente.razon_social}</h2>
            {cliente.nombre_comercial && (
              <span className="nombre-comercial">{cliente.nombre_comercial}</span>
            )}
          </div>
          {getEstadoBadge(cliente.estado)}
        </div>

        <div className="header-actions">
          {cliente.estado !== 'eliminado' && (
            <button 
              className="btn-editar"
              onClick={() => onEditar(cliente)}
            >
              ✏️ Editar
            </button>
          )}
          <button 
            className="btn-imprimir"
            onClick={onImprimir}
          >
            🖨️ Imprimir
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="detalle-content">
        {/* Columna izquierda - Información principal */}
        <div className="columna-principal">
          {/* Tarjeta de identificación */}
          <div className="info-card">
            <h3 className="card-title">Identificación</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Tipo Documento:</span>
                <span className="info-value">{cliente.tipo_documento}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Número:</span>
                <span className="info-value numero-documento">{cliente.numero_documento}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Tipo Cliente:</span>
                <span className="info-value">{getTipoClienteText(cliente.tipo_cliente)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Zona:</span>
                <span className="info-value">{getZonaText(cliente.zona)}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de contacto */}
          <div className="info-card">
            <h3 className="card-title">Contacto</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Teléfono:</span>
                <span className="info-value telefono">
                  <a href={`tel:${cliente.telefono}`}>{cliente.telefono}</a>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value email">
                  {cliente.email ? (
                    <a href={`mailto:${cliente.email}`}>{cliente.email}</a>
                  ) : (
                    'No registrado'
                  )}
                </span>
              </div>
              <div className="info-item full-width">
                <span className="info-label">Dirección:</span>
                <span className="info-value direccion">
                  {cliente.direccion || 'No registrada'}
                  {cliente.direccion && (
                    <button 
                      className="btn-mapa"
                      onClick={handleAbrirMapa}
                      title="Ver en mapa"
                    >
                      🗺️
                    </button>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Preferencias del cliente */}
          {cliente.preferencias && (
            <div className="info-card preferencias">
              <h3 className="card-title">Preferencias de Compra</h3>
              <div className="preferencias-grid">
                {cliente.preferencias.tipo_huevo && (
                  <div className="preferencia-item">
                    <span className="preferencia-icon">🥚</span>
                    <div>
                      <span className="preferencia-label">Tipo de huevo:</span>
                      <span className="preferencia-value">
                        {cliente.preferencias.tipo_huevo === 'blanco' ? 'Blanco' :
                         cliente.preferencias.tipo_huevo === 'rojo' ? 'Rojo' : 'Mixto'}
                      </span>
                    </div>
                  </div>
                )}
                
                {cliente.preferencias.frecuencia_compra && (
                  <div className="preferencia-item">
                    <span className="preferencia-icon">📅</span>
                    <div>
                      <span className="preferencia-label">Frecuencia:</span>
                      <span className="preferencia-value">
                        {cliente.preferencias.frecuencia_compra === 'diario' ? 'Diario' :
                         cliente.preferencias.frecuencia_compra === 'semanal' ? 'Semanal' :
                         cliente.preferencias.frecuencia_compra === 'quincenal' ? 'Quincenal' : 'Mensual'}
                      </span>
                    </div>
                  </div>
                )}

                {cliente.preferencias.horario_preferido && (
                  <div className="preferencia-item">
                    <span className="preferencia-icon">⏰</span>
                    <div>
                      <span className="preferencia-label">Horario:</span>
                      <span className="preferencia-value">
                        {cliente.preferencias.horario_preferido === 'mañana' ? 'Mañana' : 'Tarde'}
                      </span>
                    </div>
                  </div>
                )}

                {cliente.preferencias.observaciones && (
                  <div className="preferencia-item full-width">
                    <span className="preferencia-icon">📝</span>
                    <div>
                      <span className="preferencia-label">Observaciones:</span>
                      <span className="preferencia-value observaciones">
                        {cliente.preferencias.observaciones}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Información secundaria */}
        <div className="columna-secundaria">
          {/* Ubicación en mapa (si tiene coordenadas) */}
          {(cliente.latitud && cliente.longitud) && (
            <div className="info-card mapa">
              <h3 className="card-title">Ubicación</h3>
              <div className="coordenadas">
                <div className="coord-item">
                  <span className="coord-label">Latitud:</span>
                  <span className="coord-value">{cliente.latitud}</span>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Longitud:</span>
                  <span className="coord-value">{cliente.longitud}</span>
                </div>
                <button className="btn-ver-mapa" onClick={handleAbrirMapa}>
                  Ver en Google Maps
                </button>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="info-card metadata">
            <h3 className="card-title">Información del Registro</h3>
            <div className="metadata-grid">
              <div className="meta-item">
                <span className="meta-label">Creado el:</span>
                <span className="meta-value">{formatFecha(cliente.creado_el)}</span>
              </div>
              {cliente.creado_por_nombre && (
                <div className="meta-item">
                  <span className="meta-label">Creado por:</span>
                  <span className="meta-value">{cliente.creado_por_nombre}</span>
                </div>
              )}
              {cliente.actualizado_el && (
                <div className="meta-item">
                  <span className="meta-label">Actualizado el:</span>
                  <span className="meta-value">{formatFecha(cliente.actualizado_el)}</span>
                </div>
              )}
              {cliente.actualizado_por_nombre && (
                <div className="meta-item">
                  <span className="meta-label">Actualizado por:</span>
                  <span className="meta-value">{cliente.actualizado_por_nombre}</span>
                </div>
              )}
            </div>
          </div>

          {/* Historial de cambios (toggle) */}
          {cliente.historial && cliente.historial.length > 0 && (
            <div className="info-card historial">
              <div 
                className="historial-header"
                onClick={() => setShowHistorial(!showHistorial)}
              >
                <h3 className="card-title">Historial de Cambios</h3>
                <span className="toggle-icon">{showHistorial ? '▼' : '▶'}</span>
              </div>
              
              {showHistorial && (
                <div className="historial-lista">
                  {cliente.historial.map((cambio, index) => (
                    <div key={index} className="cambio-item">
                      <div className="cambio-header">
                        <span className="cambio-campo">{cambio.campo}</span>
                        <span className="cambio-fecha">
                          {new Date(cambio.cambiado_el).toLocaleDateString('es-PE')}
                        </span>
                      </div>
                      <div className="cambio-valores">
                        <span className="valor-anterior">{cambio.valor_anterior || 'vacío'}</span>
                        <span className="cambio-flecha">→</span>
                        <span className="valor-nuevo">{cambio.valor_nuevo || 'vacío'}</span>
                      </div>
                      {cambio.cambiado_por && (
                        <div className="cambio-por">por: {cambio.cambiado_por}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .detalle-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .detalle-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #eaeaea;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .btn-volver {
          background: none;
          border: none;
          color: #3a86ff;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .btn-volver:hover {
          background-color: #e7f5ff;
        }

        .cliente-titulo {
          display: flex;
          flex-direction: column;
        }

        .cliente-titulo h2 {
          margin: 0;
          font-size: 1.8rem;
          color: #212529;
        }

        .nombre-comercial {
          font-size: 1rem;
          color: #6c757d;
          margin-top: 0.25rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-editar,
        .btn-imprimir {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-editar {
          background-color: #3a86ff;
          color: white;
        }

        .btn-editar:hover {
          background-color: #2667d9;
          transform: translateY(-1px);
        }

        .btn-imprimir {
          background-color: #f8f9fa;
          color: #495057;
          border: 1px solid #ddd;
        }

        .btn-imprimir:hover {
          background-color: #e9ecef;
        }

        .detalle-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .info-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #eaeaea;
        }

        .card-title {
          margin: 0 0 1.25rem 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 0.8rem;
          color: #6c757d;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1rem;
          color: #212529;
          font-weight: 500;
        }

        .numero-documento {
          font-family: monospace;
          font-size: 1.1rem;
        }

        .info-value.telefono a,
        .info-value.email a {
          color: #3a86ff;
          text-decoration: none;
        }

        .info-value.telefono a:hover,
        .info-value.email a:hover {
          text-decoration: underline;
        }

        .info-value.direccion {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-mapa {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .btn-mapa:hover {
          background-color: #e7f5ff;
        }

        /* Preferencias */
        .preferencias-grid {
          display: grid;
          gap: 1rem;
        }

        .preferencia-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 0.5rem;
          background-color: #f8f9fa;
          border-radius: 6px;
        }

        .preferencia-item.full-width {
          grid-column: 1 / -1;
        }

        .preferencia-icon {
          font-size: 1.5rem;
          line-height: 1;
        }

        .preferencia-label {
          font-size: 0.85rem;
          color: #6c757d;
          display: block;
        }

        .preferencia-value {
          font-size: 1rem;
          font-weight: 500;
          color: #212529;
        }

        .preferencia-value.observaciones {
          font-style: italic;
        }

        /* Columna secundaria */
        .columna-secundaria {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Mapa */
        .coordenadas {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .coord-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #eaeaea;
        }

        .coord-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .coord-value {
          font-family: monospace;
          font-weight: 500;
        }

        .btn-ver-mapa {
          margin-top: 1rem;
          padding: 0.75rem;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 6px;
          color: #3a86ff;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .btn-ver-mapa:hover {
          background-color: #e7f5ff;
          border-color: #3a86ff;
        }

        /* Metadata */
        .metadata-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .meta-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px dashed #eaeaea;
        }

        .meta-label {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .meta-value {
          font-weight: 500;
          color: #212529;
        }

        /* Historial */
        .historial-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .historial-header .card-title {
          margin: 0;
          padding: 0;
          border: none;
        }

        .toggle-icon {
          font-size: 0.9rem;
          color: #6c757d;
        }

        .historial-lista {
          margin-top: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .cambio-item {
          padding: 1rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          margin-bottom: 0.75rem;
        }

        .cambio-item:last-child {
          margin-bottom: 0;
        }

        .cambio-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .cambio-campo {
          font-weight: 600;
          color: #212529;
          text-transform: capitalize;
        }

        .cambio-fecha {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .cambio-valores {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .valor-anterior {
          color: #dc3545;
          text-decoration: line-through;
          font-size: 0.9rem;
          background-color: #ffe3e3;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .cambio-flecha {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .valor-nuevo {
          color: #2b8a3e;
          font-weight: 500;
          background-color: #d3f9d8;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .cambio-por {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.25rem;
          font-style: italic;
        }

        /* Badges */
        .badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-success {
          background-color: #d3f9d8;
          color: #2b8a3e;
        }

        .badge-warning {
          background-color: #fff3bf;
          color: #e67700;
        }

        .badge-danger {
          background-color: #ffe3e3;
          color: #c92a2a;
        }

        .badge-default {
          background-color: #e9ecef;
          color: #495057;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .detalle-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .detalle-container {
            padding: 1rem;
          }

          .detalle-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-left {
            flex-wrap: wrap;
          }

          .header-actions {
            width: 100%;
          }

          .btn-editar,
          .btn-imprimir {
            flex: 1;
            justify-content: center;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .cliente-titulo h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default DetalleCliente