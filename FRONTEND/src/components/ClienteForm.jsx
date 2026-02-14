import { useEffect, useState } from 'react'
import { createCliente, updateCliente } from '../services/clientes.service'

const ClienteForm = ({ cliente, onCancel, onSaved, onSubmit }) => {
  const [form, setForm] = useState({
    tipo_documento: 'DNI',
    numero_documento: '',
    razon_social: '',
    nombre_comercial: '',
    telefono: '',
    email: '',
    direccion: '',
    zona: '',
    tipo_cliente: 'persona_natural',
    preferencias: {
      tipo_huevo: 'mixto',
      frecuencia_compra: 'semanal',
      horario_preferido: 'mañana',
      observaciones: ''
    },
    latitud: '',
    longitud: ''
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (cliente) {
      setForm({
        tipo_documento: cliente.tipo_documento || 'DNI',
        numero_documento: cliente.numero_documento || '',
        razon_social: cliente.razon_social || '',
        nombre_comercial: cliente.nombre_comercial || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        direccion: cliente.direccion || '',
        zona: cliente.zona || '',
        tipo_cliente: cliente.tipo_cliente || 'persona_natural',
        preferencias: cliente.preferencias || {
          tipo_huevo: 'mixto',
          frecuencia_compra: 'semanal',
          horario_preferido: 'mañana',
          observaciones: ''
        },
        latitud: cliente.latitud || '',
        longitud: cliente.longitud || ''
      })
    } else {
      setForm({
        tipo_documento: 'DNI',
        numero_documento: '',
        razon_social: '',
        nombre_comercial: '',
        telefono: '',
        email: '',
        direccion: '',
        zona: '',
        tipo_cliente: 'persona_natural',
        preferencias: {
          tipo_huevo: 'mixto',
          frecuencia_compra: 'semanal',
          horario_preferido: 'mañana',
          observaciones: ''
        },
        latitud: '',
        longitud: ''
      })
    }
  }, [cliente])

  const handleChange = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({ ...errors, [name]: null })
    }
  }

  const handlePreferenciaChange = e => {
    const { name, value } = e.target
    setForm({
      ...form,
      preferencias: {
        ...form.preferencias,
        [name]: value
      }
    })
  }

  const validarFormulario = () => {
    const nuevosErrores = {}

    // Validación de documento según tipo
    if (!form.numero_documento.trim()) {
      nuevosErrores.numero_documento = 'El número de documento es requerido'
    } else {
      if (form.tipo_documento === 'DNI' && !/^\d{8}$/.test(form.numero_documento)) {
        nuevosErrores.numero_documento = 'El DNI debe tener 8 dígitos'
      } else if (form.tipo_documento === 'RUC' && !/^\d{11}$/.test(form.numero_documento)) {
        nuevosErrores.numero_documento = 'El RUC debe tener 11 dígitos'
      } else if (form.tipo_documento === 'CE' && !/^\d{9}$/.test(form.numero_documento)) {
        nuevosErrores.numero_documento = 'El CE debe tener 9 dígitos'
      }
    }

    if (!form.razon_social.trim()) {
      nuevosErrores.razon_social = 'La razón social es requerida'
    }

    if (!form.telefono.trim()) {
      nuevosErrores.telefono = 'El teléfono es requerido'
    } else if (!/^\d{9,15}$/.test(form.telefono)) {
      nuevosErrores.telefono = 'El teléfono debe tener entre 9 y 15 dígitos'
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nuevosErrores.email = 'Correo electrónico inválido'
    }

    if (!form.tipo_cliente) {
      nuevosErrores.tipo_cliente = 'El tipo de cliente es requerido'
    }

    setErrors(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = async e => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    // Notificar que se está enviando
    onSubmit && onSubmit()

    setLoading(true)
    try {
      // Preparar datos (convertir campos vacíos a null)
      const datosEnvio = {
        ...form,
        email: form.email || null,
        direccion: form.direccion || null,
        zona: form.zona || null,
        latitud: form.latitud ? parseFloat(form.latitud) : null,
        longitud: form.longitud ? parseFloat(form.longitud) : null,
        preferencias: form.preferencias.observaciones ? form.preferencias : null
      }

      if (cliente) {
        await updateCliente(cliente.id, datosEnvio)
      } else {
        await createCliente(datosEnvio)
      }

      // Limpiar formulario
      setForm({
        tipo_documento: 'DNI',
        numero_documento: '',
        razon_social: '',
        nombre_comercial: '',
        telefono: '',
        email: '',
        direccion: '',
        zona: '',
        tipo_cliente: 'persona_natural',
        preferencias: {
          tipo_huevo: 'mixto',
          frecuencia_compra: 'semanal',
          horario_preferido: 'mañana',
          observaciones: ''
        },
        latitud: '',
        longitud: ''
      })

      onSaved && onSaved()
    } catch (error) {
      console.error('Error al guardar cliente:', error)
      
      // Manejar error específico de documento duplicado
      if (error.response?.data?.message?.includes('documento')) {
        setErrors({ numero_documento: 'Ya existe un cliente con este documento' })
      } else {
        alert(error.response?.data?.message || 'Error al guardar cliente')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cliente-form">
      {/* Tipo de documento y número */}
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="tipo_documento">Tipo de Documento *</label>
          <select
            id="tipo_documento"
            name="tipo_documento"
            className="form-select"
            value={form.tipo_documento}
            onChange={handleChange}
            required
          >
            <option value="DNI">DNI</option>
            <option value="RUC">RUC</option>
            <option value="CE">Carnet de Extranjería</option>
          </select>
        </div>

        <div className="form-group half">
          <label htmlFor="numero_documento">Número de Documento *</label>
          <input
            type="text"
            id="numero_documento"
            name="numero_documento"
            className={`form-input ${errors.numero_documento ? 'error' : ''}`}
            placeholder={
              form.tipo_documento === 'DNI' ? '8 dígitos' :
              form.tipo_documento === 'RUC' ? '11 dígitos' : '9 dígitos'
            }
            value={form.numero_documento}
            onChange={handleChange}
            maxLength={
              form.tipo_documento === 'DNI' ? 8 :
              form.tipo_documento === 'RUC' ? 11 : 9
            }
            required
          />
          {errors.numero_documento && (
            <small className="error-text">{errors.numero_documento}</small>
          )}
        </div>
      </div>

      {/* Razón Social y Nombre Comercial */}
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="razon_social">Razón Social / Nombre Completo *</label>
          <input
            type="text"
            id="razon_social"
            name="razon_social"
            className={`form-input ${errors.razon_social ? 'error' : ''}`}
            placeholder="Nombre completo o razón social"
            value={form.razon_social}
            onChange={handleChange}
            required
          />
          {errors.razon_social && (
            <small className="error-text">{errors.razon_social}</small>
          )}
        </div>

        <div className="form-group half">
          <label htmlFor="nombre_comercial">Nombre Comercial</label>
          <input
            type="text"
            id="nombre_comercial"
            name="nombre_comercial"
            className="form-input"
            placeholder="Opcional"
            value={form.nombre_comercial}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Teléfono y Email */}
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="telefono">Teléfono *</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            className={`form-input ${errors.telefono ? 'error' : ''}`}
            placeholder="9 a 15 dígitos"
            value={form.telefono}
            onChange={handleChange}
            required
          />
          {errors.telefono && (
            <small className="error-text">{errors.telefono}</small>
          )}
        </div>

        <div className="form-group half">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="ejemplo@correo.com"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && (
            <small className="error-text">{errors.email}</small>
          )}
        </div>
      </div>

      {/* Dirección y Zona */}
      <div className="form-row">
        <div className="form-group half">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            className="form-input"
            placeholder="Dirección completa"
            value={form.direccion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group half">
          <label htmlFor="zona">Zona</label>
          <select
            id="zona"
            name="zona"
            className="form-select"
            value={form.zona}
            onChange={handleChange}
          >
            <option value="">Seleccionar zona</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
            <option value="este">Este</option>
            <option value="oeste">Oeste</option>
            <option value="centro">Centro</option>
          </select>
        </div>
      </div>

      {/* Tipo de Cliente */}
      <div className="form-group">
        <label htmlFor="tipo_cliente">Tipo de Cliente *</label>
        <select
          id="tipo_cliente"
          name="tipo_cliente"
          className={`form-select ${errors.tipo_cliente ? 'error' : ''}`}
          value={form.tipo_cliente}
          onChange={handleChange}
          required
        >
          <option value="persona_natural">Persona Natural</option>
          <option value="persona_juridica">Persona Jurídica</option>
          <option value="empresa">Empresa</option>
        </select>
        {errors.tipo_cliente && (
          <small className="error-text">{errors.tipo_cliente}</small>
        )}
      </div>

      {/* Preferencias del Cliente */}
      <div className="preferencias-section">
        <h4 className="section-title">Preferencias del Cliente</h4>
        
        <div className="form-row">
          <div className="form-group third">
            <label htmlFor="tipo_huevo">Tipo de Huevo</label>
            <select
              id="tipo_huevo"
              name="tipo_huevo"
              className="form-select"
              value={form.preferencias.tipo_huevo}
              onChange={handlePreferenciaChange}
            >
              <option value="blanco">Blanco</option>
              <option value="rojo">Rojo</option>
              <option value="mixto">Mixto</option>
            </select>
          </div>

          <div className="form-group third">
            <label htmlFor="frecuencia_compra">Frecuencia de Compra</label>
            <select
              id="frecuencia_compra"
              name="frecuencia_compra"
              className="form-select"
              value={form.preferencias.frecuencia_compra}
              onChange={handlePreferenciaChange}
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div className="form-group third">
            <label htmlFor="horario_preferido">Horario Preferido</label>
            <select
              id="horario_preferido"
              name="horario_preferido"
              className="form-select"
              value={form.preferencias.horario_preferido}
              onChange={handlePreferenciaChange}
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            className="form-textarea"
            rows="3"
            placeholder="Notas adicionales sobre el cliente..."
            value={form.preferencias.observaciones}
            onChange={handlePreferenciaChange}
          ></textarea>
        </div>
      </div>

      {/* Coordenadas (opcional) */}
      <div className="coordenadas-section">
        <h4 className="section-title">Ubicación en Mapa (Opcional)</h4>
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="latitud">Latitud</label>
            <input
              type="number"
              id="latitud"
              name="latitud"
              className="form-input"
              placeholder="-12.123456"
              step="any"
              value={form.latitud}
              onChange={handleChange}
            />
          </div>

          <div className="form-group half">
            <label htmlFor="longitud">Longitud</label>
            <input
              type="number"
              id="longitud"
              name="longitud"
              className="form-input"
              placeholder="-77.123456"
              step="any"
              value={form.longitud}
              onChange={handleChange}
            />
          </div>
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
          ) : cliente ? (
            'Actualizar Cliente'
          ) : (
            'Crear Cliente'
          )}
        </button>
      </div>

      <style jsx>{`
        .cliente-form {
          padding: 1.5rem;
        }
        
        .form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-group {
          flex: 1;
          margin-bottom: 1rem;
        }
        
        .form-group.half {
          flex: 0 0 calc(50% - 0.5rem);
        }
        
        .form-group.third {
          flex: 0 0 calc(33.333% - 0.667rem);
        }
        
        .form-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #333;
        }
        
        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          background-color: white;
        }
        
        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3a86ff;
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }
        
        .form-input.error,
        .form-select.error {
          border-color: #dc3545;
        }
        
        .error-text {
          color: #dc3545;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .preferencias-section,
        .coordenadas-section {
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
        }
        
        .section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #495057;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e9ecef;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 80px;
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
          .form-row {
            flex-direction: column;
            gap: 0;
          }
          
          .form-group.half,
          .form-group.third {
            flex: 1;
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

export default ClienteForm