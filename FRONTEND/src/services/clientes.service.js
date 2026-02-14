import api from './api'

// GET /clientes - Listar clientes con filtros
export const getClientes = async (filtros = {}) => {
  const params = new URLSearchParams()
  
  if (filtros.search) params.append('search', filtros.search)
  if (filtros.tipo_cliente) params.append('tipo_cliente', filtros.tipo_cliente)
  if (filtros.zona) params.append('zona', filtros.zona)
  if (filtros.estado) params.append('estado', filtros.estado)
  if (filtros.page) params.append('page', filtros.page)
  if (filtros.limit) params.append('limit', filtros.limit)

  const res = await api.get(`/clientes?${params.toString()}`)
  return res.data // { data, pagination }
}

// GET /clientes/busqueda-rapida - Búsqueda rápida
export const busquedaRapidaClientes = async (termino) => {
  if (!termino || termino.length < 2) return []
  const res = await api.get(`/clientes/busqueda-rapida?q=${termino}`)
  return res.data.data
}

// GET /clientes/:id - Obtener cliente por ID
export const getClienteById = async (id) => {
  const res = await api.get(`/clientes/${id}`)
  return res.data.data
}

// POST /clientes - Crear nuevo cliente
export const createCliente = async (cliente) => {
  const res = await api.post('/clientes', cliente)
  return res.data // { message, data }
}

// PUT /clientes/:id - Actualizar cliente
export const updateCliente = async (id, data) => {
  const res = await api.put(`/clientes/${id}`, data)
  return res.data
}

// PATCH /clientes/:id/estado - Cambiar estado (activo/inactivo/eliminado)
export const cambiarEstadoCliente = async (id, estado) => {
  const res = await api.patch(`/clientes/${id}/estado`, { estado })
  return res.data
}

// DELETE /clientes/:id - Eliminar cliente (solo admin)
export const deleteCliente = async (id) => {
  const res = await api.delete(`/clientes/${id}`)
  return res.data
}

// POST /clientes/:id/restaurar - Restaurar cliente eliminado (solo admin)
export const restaurarCliente = async (id) => {
  const res = await api.post(`/clientes/${id}/restaurar`)
  return res.data
}