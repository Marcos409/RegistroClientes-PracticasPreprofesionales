import { useEffect, useState } from 'react'
import { getUsuarios, toggleEstadoUsuario } from '../services/usuarios.service'
import UsuariosTable from '../components/UsuariosTable'
import UsuarioForm from '../components/UsuarioForm'
import { useAuth } from '../context/AuthContext'

const Usuarios = () => {
  const { user } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState(false)

  // 🔄 Cargar usuarios
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios()
      setUsuarios(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  // ✏️ Editar usuario
  const handleEdit = usuario => {
    setUsuarioEditando(usuario)
    setShowForm(true)
  }

  // 🔁 Activar / Desactivar usuario
  const handleToggleEstado = async id => {
    if (!window.confirm('¿Seguro que deseas cambiar el estado del usuario?')) return

    try {
      await toggleEstadoUsuario(id)
      await cargarUsuarios()
    } catch (error) {
      console.error('Error al cambiar estado:', error)
      alert('Error al cambiar el estado del usuario')
    }
  }

  // 📱 Manejar cierre del formulario
  const handleCancelForm = () => {
    setUsuarioEditando(null)
    setShowForm(false)
  }

  // 📱 Manejar guardado exitoso
  const handleSaved = async () => {
    setFormSubmitting(false)
    setUsuarioEditando(null)
    setShowForm(false)
    await cargarUsuarios()
  }

  // 📱 Manejar envío del formulario
  const handleFormSubmit = () => {
    setFormSubmitting(true)
  }

  // 🔐 SOLO ADMIN
  if (!user || user.rol !== 'admin') {
    return (
      <div className="minimal-container">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h3 className="access-denied-title">Acceso Restringido</h3>
          <p className="access-denied-message">
            No tienes los permisos necesarios para gestionar usuarios.
            Esta función está disponible solo para administradores del sistema.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-container">
      {/* Encabezado */}
      <div className="header-section">
        <h2 className="page-title">Gestión de Usuarios</h2>
        <p className="page-subtitle">Administra los usuarios del sistema</p>
      </div>

      {/* Botón para agregar nuevo usuario */}
      {!showForm && (
        <div className="action-bar">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
            disabled={formSubmitting}
          >
            <span className="btn-icon">+</span>
            Nuevo Usuario
          </button>
          <div className="stats-info">
            <span className="stat-badge">
              Total: {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}
            </span>
            {loading && <span className="loading-indicator">Actualizando...</span>}
            {formSubmitting && <span className="loading-indicator">Guardando...</span>}
          </div>
        </div>
      )}

      {/* Formulario Crear/Editar (aparece como overlay) */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <div className="form-header">
              <h3>{usuarioEditando ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <button 
                className="btn-close"
                onClick={handleCancelForm}
                aria-label="Cerrar formulario"
                disabled={formSubmitting}
              >
                ×
              </button>
            </div>
            <UsuarioForm
              usuario={usuarioEditando}
              onCancel={handleCancelForm}
              onSaved={handleSaved}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3>No hay usuarios registrados</h3>
            <p>Comienza agregando un nuevo usuario al sistema.</p>
            <button 
              className="btn-outline"
              onClick={() => setShowForm(true)}
              disabled={formSubmitting}
            >
              Agregar primer usuario
            </button>
          </div>
        ) : (
          <UsuariosTable
            usuarios={usuarios}
            onEdit={handleEdit}
            onToggle={handleToggleEstado}
          />
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
        
        /* Asegurar que el overlay esté sobre otros elementos */
        .form-overlay {
          z-index: 1000;
        }
        
        /* Asegurar que el contenido principal tenga menor z-index */
        .minimal-container {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </div>
  )
}

export default Usuarios