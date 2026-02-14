import { useEffect, useState } from 'react'
import { 
  getClientes, 
  cambiarEstadoCliente,
  deleteCliente,
  restaurarCliente,
  busquedaRapidaClientes
} from '../services/clientes.service'
import ClientesTable from '../components/ClientesTable'
import ClienteForm from '../components/ClienteForm'
import FiltrosClientes from '../components/FiltrosClientes'
import { useAuth } from '../context/AuthContext'

const Clientes = () => {
  const { user } = useAuth()
  const [clientes, setClientes] = useState([])
  const [clienteEditando, setClienteEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showFiltros, setShowFiltros] = useState(false)
  const [filtros, setFiltros] = useState({
    search: '',
    tipo_cliente: '',
    zona: '',
    estado: 'activo',
    page: 1,
    limit: 20
  })
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [modoVista, setModoVista] = useState('lista') // 'lista' o 'detalle'
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)

  // 🔄 Cargar clientes
  const cargarClientes = async () => {
    setLoading(true)
    try {
      const response = await getClientes(filtros)
      setClientes(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error al cargar clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Cargar cuando cambian los filtros
  useEffect(() => {
    cargarClientes()
  }, [filtros.page, filtros.estado, filtros.tipo_cliente, filtros.zona])

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filtros.search !== undefined) {
        setFiltros(prev => ({ ...prev, page: 1 }))
        cargarClientes()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filtros.search])

  // ✏️ Editar cliente
  const handleEdit = cliente => {
    setClienteEditando(cliente)
    setShowForm(true)
  }

  // 👁️ Ver detalle
  const handleVer = cliente => {
    setClienteSeleccionado(cliente)
    setModoVista('detalle')
  }

  // 🔙 Volver a lista desde detalle
  const handleVolverALista = () => {
    setModoVista('lista')
    setClienteSeleccionado(null)
  }

  // 🔁 Activar / Desactivar cliente
  const handleToggleEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === 'activo' ? 'inactivo' : 'activo'
    const accion = nuevoEstado === 'activo' ? 'activar' : 'desactivar'
    
    if (!window.confirm(`¿Seguro que deseas ${accion} este cliente?`)) return

    try {
      await cambiarEstadoCliente(id, nuevoEstado)
      await cargarClientes()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('Error al cambiar el estado del cliente')
    }
  }

  // 🗑️ Eliminar cliente (solo admin)
  const handleEliminar = async (id, razonSocial) => {
    if (!window.confirm(`¿Seguro que deseas eliminar al cliente "${razonSocial}"? Esta acción es reversible.`)) return

    try {
      await deleteCliente(id)
      await cargarClientes()
    } catch (error) {
      console.error('Error al eliminar cliente:', error)
      alert('Error al eliminar el cliente')
    }
  }

  // ♻️ Restaurar cliente
  const handleRestaurar = async (id) => {
    if (!window.confirm('¿Restaurar este cliente?')) return

    try {
      await restaurarCliente(id)
      await cargarClientes()
    } catch (error) {
      console.error('Error al restaurar:', error)
      alert('Error al restaurar el cliente')
    }
  }

  // 🔍 Manejar búsqueda
  const handleSearchChange = (e) => {
    setFiltros(prev => ({ ...prev, search: e.target.value }))
  }

  // 📱 Manejar cambio de filtros
  const handleFiltroChange = (nombre, valor) => {
    setFiltros(prev => ({ ...prev, [nombre]: valor, page: 1 }))
  }

  // 🧹 Limpiar filtros
  const handleLimpiarFiltros = () => {
    setFiltros({
      search: '',
      tipo_cliente: '',
      zona: '',
      estado: 'activo',
      page: 1,
      limit: 20
    })
  }

  // 📄 Cambiar página
  const handlePageChange = (nuevaPagina) => {
    setFiltros(prev => ({ ...prev, page: nuevaPagina }))
  }

  // 📱 Manejar cierre del formulario
  const handleCancelForm = () => {
    setClienteEditando(null)
    setShowForm(false)
  }

  // 📱 Manejar guardado exitoso
  const handleSaved = async () => {
    setFormSubmitting(false)
    setClienteEditando(null)
    setShowForm(false)
    await cargarClientes()
  }

  // 📱 Manejar envío del formulario
  const handleFormSubmit = () => {
    setFormSubmitting(true)
  }

  // Si no es admin ni operador, mostrar acceso restringido
  if (!user || (user.rol !== 'admin' && user.rol !== 'operador')) {
    return (
      <div className="minimal-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h3 className="access-denied-title">Acceso Restringido</h3>
          <p className="access-denied-message">
            No tienes los permisos necesarios para gestionar clientes.
            Esta función está disponible solo para administradores y vendedores.
          </p>
        </div>
      </div>
    )
  }

  // Vista de detalle
  if (modoVista === 'detalle' && clienteSeleccionado) {
    return (
      <div className="minimal-container">
        {/* Encabezado con botón volver */}
        <div className="header-section">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleVolverALista}
              className="btn-icon-only"
              aria-label="Volver"
            >
              ←
            </button>
            <div>
              <h2 className="page-title">Detalle del Cliente</h2>
              <p className="page-subtitle">{clienteSeleccionado.razon_social}</p>
            </div>
          </div>
        </div>

        {/* Aquí iría el componente DetalleCliente */}
        <div className="content-section">
          <p>Componente de detalle (pendiente)</p>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-container">
      {/* Encabezado */}
      <div className="header-section">
        <h2 className="page-title">Gestión de Clientes</h2>
        <p className="page-subtitle">Administra la cartera de clientes</p>
      </div>

      {/* Botones de acción */}
      {!showForm && (
        <div className="action-bar">
          <div className="flex gap-2">
            <button 
              className="btn-primary"
              onClick={() => setShowForm(true)}
              disabled={formSubmitting}
            >
              <span className="btn-icon">+</span>
              Nuevo Cliente
            </button>
            <button 
              className={`btn-outline ${showFiltros ? 'active' : ''}`}
              onClick={() => setShowFiltros(!showFiltros)}
            >
              <span className="btn-icon">🔍</span>
              Filtros
            </button>
          </div>
          <div className="stats-info">
            <span className="stat-badge">
              Total: {pagination.total} cliente{pagination.total !== 1 ? 's' : ''}
            </span>
            {loading && <span className="loading-indicator">Actualizando...</span>}
            {formSubmitting && <span className="loading-indicator">Guardando...</span>}
          </div>
        </div>
      )}

      {/* Barra de búsqueda rápida */}
      {!showForm && (
        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar por nombre, RUC/DNI o teléfono..."
              value={filtros.search}
              onChange={handleSearchChange}
              className="search-input"
            />
            {filtros.search && (
              <button 
                className="search-clear"
                onClick={() => setFiltros(prev => ({ ...prev, search: '', page: 1 }))}
              >
                ×
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filtros expandibles */}
      {showFiltros && !showForm && (
        <div className="filtros-section">
          <FiltrosClientes
            filtros={filtros}
            onFiltroChange={handleFiltroChange}
            onLimpiar={handleLimpiarFiltros}
          />
        </div>
      )}

      {/* Formulario Crear/Editar (aparece como overlay) */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button 
                className="btn-close"
                onClick={handleCancelForm}
                aria-label="Cerrar formulario"
                disabled={formSubmitting}
              >
                ×
              </button>
            </div>
            <ClienteForm
              cliente={clienteEditando}
              onCancel={handleCancelForm}
              onSaved={handleSaved}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Cargando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No hay clientes registrados</h3>
            <p>Comienza agregando un nuevo cliente al sistema.</p>
            <button 
              className="btn-outline"
              onClick={() => setShowForm(true)}
              disabled={formSubmitting}
            >
              Agregar primer cliente
            </button>
          </div>
        ) : (
          <>
            <ClientesTable
              clientes={clientes}
              onEdit={handleEdit}
              onVer={handleVer}
              onToggle={handleToggleEstado}
              onEliminar={handleEliminar}
              onRestaurar={handleRestaurar}
              userRol={user.rol}
            />
            
            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <div className="pagination-section">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  ← Anterior
                </button>
                <span className="pagination-info">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Estilos adicionales */}
      <style jsx>{`
        .btn-primary:disabled,
        .btn-outline:disabled,
        .btn-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn-primary:disabled:hover {
          background-color: #3a86ff;
          box-shadow: none;
        }
        
        .btn-outline:disabled:hover {
          background-color: transparent;
        }

        .btn-outline.active {
          background-color: #e8f0fe;
          border-color: #3a86ff;
          color: #3a86ff;
        }

        .btn-icon-only {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          border: 1px solid #eaeaea;
          background: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon-only:hover {
          background-color: #f5f5f5;
          border-color: #d0d0d0;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .gap-4 {
          gap: 1rem;
        }

        /* Barra de búsqueda */
        .search-section {
          margin-bottom: 1.5rem;
        }

        .search-wrapper {
          position: relative;
          max-width: 500px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
          font-size: 1rem;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.2s;
          background-color: white;
        }

        .search-input:focus {
          outline: none;
          border-color: #3a86ff;
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }

        .search-clear {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #999;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        .search-clear:hover {
          color: #666;
          background-color: #f0f0f0;
        }

        /* Filtros */
        .filtros-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #eaeaea;
        }

        /* Paginación */
        .pagination-section {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #eaeaea;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #eaeaea;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .pagination-btn:hover:not(:disabled) {
          background-color: #f5f5f5;
          border-color: #d0d0d0;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-size: 0.95rem;
          color: #666;
        }

        /* Overlay del formulario */
        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.2s ease;
        }
        
        .form-container {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.3s ease;
        }
        
        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid #eaeaea;
          position: sticky;
          top: 0;
          background: white;
          z-index: 10;
          border-radius: 12px 12px 0 0;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default Clientes