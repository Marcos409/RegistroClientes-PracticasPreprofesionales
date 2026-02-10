import { useEffect, useState } from 'react'
import { createUsuario, updateUsuario } from '../services/usuarios.service'

const UsuarioForm = ({ usuario, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    rol: 'supervisor',
    nombre_completo: '',
    correo: '',
    telefono_movil: ''
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (usuario) {
      setForm({
        username: usuario.username,
        password: '',
        rol: usuario.rol,
        nombre_completo: usuario.nombre_completo || '',
        correo: usuario.correo || '',
        telefono_movil: usuario.telefono_movil || ''
      })
    } else {
      setForm({
        username: '',
        password: '',
        rol: 'supervisor',
        nombre_completo: '',
        correo: '',
        telefono_movil: ''
      })
    }
  }, [usuario])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    // Validación básica
    if (!form.username.trim()) {
      alert('El nombre de usuario es requerido')
      return
    }
    
    if (!usuario && !form.password) {
      alert('La contraseña es requerida para nuevos usuarios')
      return
    }

    setLoading(true)
    try {
      if (usuario) {
        // Preparar datos para actualización (sin password si está vacío)
        const datosActualizacion = { ...form }
        if (!datosActualizacion.password) {
          delete datosActualizacion.password
        }
        await updateUsuario(usuario.id, datosActualizacion)
      } else {
        await createUsuario(form)
      }

      // Limpiar formulario
      setForm({
        username: '',
        password: '',
        rol: 'supervisor',
        nombre_completo: '',
        correo: '',
        telefono_movil: ''
      })

      // Llamar al callback de guardado
      onSaved && onSaved()
    } catch (error) {
      console.error('Error al guardar usuario:', error)
      alert(error.response?.data?.message || 'Error al guardar usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="usuario-form">
      <div className="form-grid">
        {/* Nombre completo */}
        <div className="form-group">
          <label htmlFor="nombre_completo">Nombre completo *</label>
          <input
            type="text"
            id="nombre_completo"
            name="nombre_completo"
            className="form-input"
            placeholder="Ingrese nombre completo"
            value={form.nombre_completo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Correo */}
        <div className="form-group">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            className="form-input"
            placeholder="ejemplo@correo.com"
            value={form.correo}
            onChange={handleChange}
          />
        </div>

        {/* Teléfono móvil */}
        <div className="form-group">
          <label htmlFor="telefono_movil">Teléfono móvil</label>
          <input
            type="tel"
            id="telefono_movil"
            name="telefono_movil"
            className="form-input"
            placeholder="Número de contacto"
            value={form.telefono_movil}
            onChange={handleChange}
          />
        </div>

        {/* Usuario */}
        <div className="form-group">
          <label htmlFor="username">Usuario *</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            disabled={!!usuario}
            required
          />
          {usuario && <small className="input-hint">El usuario no se puede modificar</small>}
        </div>

        {/* Contraseña (solo en creación) */}
        {!usuario ? (
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Contraseña segura"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Dejar en blanco para no cambiar"
              value={form.password}
              onChange={handleChange}
            />
            <small className="input-hint">Solo llenar si desea cambiar la contraseña</small>
          </div>
        )}

        {/* Rol */}
        <div className="form-group">
          <label htmlFor="rol">Rol *</label>
          <select
            id="rol"
            name="rol"
            className="form-select"
            value={form.rol}
            onChange={handleChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="vendedor">Vendedor</option>
          </select>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loading">
              <span className="spinner-small"></span>
              Guardando...
            </span>
          ) : usuario ? (
            'Actualizar Usuario'
          ) : (
            'Crear Usuario'
          )}
        </button>
      </div>

      <style jsx>{`
        .usuario-form {
          padding: 1.5rem;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .form-input,
        .form-select {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: white;
        }
        
        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3a86ff;
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }
        
        .form-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .input-hint {
          font-size: 0.75rem;
          color: #666;
          margin-top: 0.25rem;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding-top: 1.5rem;
          border-top: 1px solid #eee;
        }
        
        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-primary {
          background-color: #3a86ff;
          color: white;
        }
        
        .btn-primary:hover:not(:disabled) {
          background-color: #2a75ff;
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: #f8f9fa;
          color: #666;
          border: 1px solid #ddd;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background-color: #e9ecef;
        }
        
        .btn-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </form>
  )
}

export default UsuarioForm