const UsuariosModel = require('../models/usuarios.model')

// GET /usuarios (ADMIN)
exports.getAll = async (req, res) => {
  try {
    const usuarios = await UsuariosModel.getAll()

    res.json({
      success: true,
      data: usuarios
    })
  } catch (error) {
    console.error('Error getAll usuarios:', error)
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    })
  }
}

// POST /usuarios (ADMIN)
exports.create = async (req, res) => {
  try {
    const {
      username,
      password,
      rol,
      nombre_completo,
      correo,
      telefono_movil
    } = req.body

    // Validación mínima
    if (!username || !password || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Username, password y rol son obligatorios'
      })
    }

    await UsuariosModel.create({
      username,
      password,
      rol,
      nombre_completo,
      correo,
      telefono_movil
    })

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente'
    })
  } catch (error) {
    console.error('Error create usuario:', error)

    // Usuario duplicado
    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya existe'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    })
  }
}

// PUT /usuarios/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params

    await UsuariosModel.update(id, req.body)

    res.json({
      success: true,
      message: 'Usuario actualizado'
    })
  } catch (error) {
    console.error('Error update usuario:', error)
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    })
  }
}

// PATCH /usuarios/:id/estado
exports.toggleEstado = async (req, res) => {
  try {
    const { id } = req.params

    await UsuariosModel.toggleEstado(id)

    res.json({
      success: true,
      message: 'Estado actualizado'
    })
  } catch (error) {
    console.error('Error toggle estado:', error)
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    })
  }
}

