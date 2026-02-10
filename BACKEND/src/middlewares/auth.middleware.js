const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    // 1. Obtener token desde header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      })
    }

    const token = authHeader.split(' ')[1] // Bearer TOKEN

    // 2. Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Guardar usuario en request
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    })
  }
}

module.exports = verifyToken
