const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado: requiere rol ADMIN'
      })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al validar rol'
    })
  }
}

module.exports = isAdmin