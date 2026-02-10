const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/auth.controller')
const verifyToken = require('../middlewares/auth.middleware')
const isAdmin = require('../middlewares/isAdmin.middleware')  


// LOGIN
router.post('/login', AuthController.login)

// RUTA PROTEGIDA (PRUEBA)
router.get('/protegido', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Acceso permitido',
    user: req.user
  })
})

// RUTA SOLO ADMIN
router.get('/admin', verifyToken, isAdmin, (req, res) => {
    res.json({
      success: true,
      message: 'Bienvenido ADMIN',
      user: req.user
    })
  })
  
module.exports = router
