import api from './api'

// GET /usuarios
export const getUsuarios = async () => {
  const res = await api.get('/usuarios')
  return res.data.data
}

// POST /usuarios
export const createUsuario = async (usuario) => {
  const res = await api.post('/usuarios', usuario)
  return res.data
}

export const updateUsuario = async (id, data) => {
  await api.put(`/usuarios/${id}`, data)
}

export const toggleEstadoUsuario = async (id) => {
  await api.patch(`/usuarios/${id}/estado`)
}

