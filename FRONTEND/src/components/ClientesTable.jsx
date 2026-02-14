import { useState } from 'react'

const ClientesTable = ({ 
  clientes, 
  onEdit, 
  onVer, 
  onToggle, 
  onEliminar, 
  onRestaurar,
  userRol 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'razon_social', direction: 'asc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️'
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  // Ordenar clientes
  const sortedClientes = [...clientes].sort((a, b) => {
    if (sortConfig.key === 'razon_social') {
      return sortConfig.direction === 'asc'
        ? a.razon_social.localeCompare(b.razon_social)
        : b.razon_social.localeCompare(a.razon_social)
    }
    if (sortConfig.key === 'fecha_registro') {
      const dateA = new Date(a.creado_el || 0)
      const dateB = new Date(b.creado_el || 0)
      return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
    }
    return 0
  })

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

  const getTipoClienteText = (tipo) => {
    const tipos = {
      persona_natural: 'Persona Natural',
      persona_juridica: 'Persona Jurídica',
      empresa: 'Empresa'
    }
    return tipos[tipo] || tipo
  }

  const getZonaText = (zona) => {
    if (!zona) return '-'
    const zonas = {
      norte: 'Norte',
      sur: 'Sur',
      este: 'Este',
      oeste: 'Oeste',
      centro: 'Centro'
    }
    return zonas[zona] || zona
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('razon_social')} className="sortable">
              Cliente {getSortIcon('razon_social')}
            </th>
            <th>Tipo</th>
            <th>Zona</th>
            <th>Teléfono</th>
            <th>Documento</th>
            <th onClick={() => handleSort('fecha_registro')} className="sortable">
              Registro {getSortIcon('fecha_registro')}
            </th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedClientes.map((cliente) => (
            <tr 
              key={cliente.id} 
              className={cliente.estado === 'eliminado' ? 'row-deleted' : ''}
            >
              <td>
                <div className="cliente-info">
                  <strong>{cliente.razon_social}</strong>
                  {cliente.nombre_comercial && (
                    <small className="text-muted">{cliente.nombre_comercial}</small>
                  )}
                </div>
              </td>
              <td>{getTipoClienteText(cliente.tipo_cliente)}</td>
              <td>{getZonaText(cliente.zona)}</td>
              <td>{cliente.telefono}</td>
              <td>
                <span className="documento-badge">
                  {cliente.tipo_documento}: {cliente.numero_documento}
                </span>
              </td>
              <td>
                {cliente.creado_el ? new Date(cliente.creado_el).toLocaleDateString('es-PE') : '-'}
              </td>
              <td>{getEstadoBadge(cliente.estado)}</td>
              <td>
                <div className="action-buttons">
                  {/* Botón Ver detalles */}
                  <button
                    className="btn-icon view"
                    onClick={() => onVer(cliente)}
                    title="Ver detalles"
                  >
                    👁️
                  </button>

                  {/* Botón Editar (solo activos y no eliminados) */}
                  {cliente.estado !== 'eliminado' && (
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(cliente)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                  )}

                  {/* Botón Activar/Desactivar (solo para activos/inactivos) */}
                  {cliente.estado !== 'eliminado' && (
                    <button
                      className={`btn-icon toggle ${cliente.estado === 'activo' ? 'warning' : 'success'}`}
                      onClick={() => onToggle(cliente.id, cliente.estado)}
                      title={cliente.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      {cliente.estado === 'activo' ? '🔴' : '🟢'}
                    </button>
                  )}

                  {/* Botón Eliminar (solo admin y para clientes no eliminados) */}
                  {userRol === 'admin' && cliente.estado !== 'eliminado' && (
                    <button
                      className="btn-icon delete"
                      onClick={() => onEliminar(cliente.id, cliente.razon_social)}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  )}

                  {/* Botón Restaurar (solo admin y para eliminados) */}
                  {userRol === 'admin' && cliente.estado === 'eliminado' && (
                    <button
                      className="btn-icon restore"
                      onClick={() => onRestaurar(cliente.id)}
                      title="Restaurar"
                    >
                      ♻️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {clientes.length === 0 && (
            <tr>
              <td colSpan="8" className="empty-message">
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .table-container {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
        }
        
        .data-table th {
          text-align: left;
          padding: 1rem;
          background-color: #f8f9fa;
          border-bottom: 2px solid #eaeaea;
          color: #495057;
          font-weight: 600;
          white-space: nowrap;
        }
        
        .data-table th.sortable {
          cursor: pointer;
          user-select: none;
        }
        
        .data-table th.sortable:hover {
          background-color: #e9ecef;
        }
        
        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid #eaeaea;
          color: #212529;
        }
        
        .data-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        
        .data-table tbody tr.row-deleted {
          background-color: #fff5f5;
          color: #999;
        }
        
        .data-table tbody tr.row-deleted:hover {
          background-color: #ffecec;
        }
        
        .cliente-info {
          display: flex;
          flex-direction: column;
        }
        
        .cliente-info strong {
          color: #212529;
          font-weight: 600;
        }
        
        .cliente-info small {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 0.2rem;
        }
        
        .text-muted {
          color: #6c757d;
        }
        
        .documento-badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          background-color: #e7f5ff;
          color: #1971c2;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .badge {
          display: inline-block;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
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
        
        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        
        .btn-icon {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s ease;
          background: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-icon:hover {
          transform: translateY(-1px);
        }
        
        .btn-icon.view:hover {
          background-color: #e7f5ff;
        }
        
        .btn-icon.edit:hover {
          background-color: #fff3bf;
        }
        
        .btn-icon.toggle.warning:hover {
          background-color: #ffe3e3;
        }
        
        .btn-icon.toggle.success:hover {
          background-color: #d3f9d8;
        }
        
        .btn-icon.delete:hover {
          background-color: #ffe3e3;
        }
        
        .btn-icon.restore:hover {
          background-color: #d3f9d8;
        }
        
        .empty-message {
          text-align: center;
          padding: 3rem !important;
          color: #6c757d;
          font-style: italic;
        }
        
        @media (max-width: 1024px) {
          .table-container {
            overflow-x: auto;
          }
          
          .data-table {
            min-width: 900px;
          }
        }
        
        @media (max-width: 768px) {
          .action-buttons {
            gap: 0.25rem;
          }
          
          .btn-icon {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  )
}

export default ClientesTable