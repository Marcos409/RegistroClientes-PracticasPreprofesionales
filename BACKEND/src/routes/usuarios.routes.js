const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/auth.middleware')
const isAdmin = require('../middlewares/isAdmin.middleware')
const UsuariosController = require('../controllers/usuarios.controller')

// RUTA REAL DEL SISTEMA crud base de usuarios
router.get('/', verifyToken, isAdmin, UsuariosController.getAll)
router.post('/', verifyToken, isAdmin, UsuariosController.create)


// EDITAR USUARIO (ADMIN)
router.put('/:id', verifyToken, isAdmin, UsuariosController.update)

// ACTIVAR / DESACTIVAR
router.patch('/:id/estado', verifyToken, isAdmin, UsuariosController.toggleEstado)


module.exports = router
