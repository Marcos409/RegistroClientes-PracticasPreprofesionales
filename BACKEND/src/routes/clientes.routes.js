const express = require('express')
const router = express.Router()

const verifyToken = require('../middlewares/auth.middleware')
const isAdmin = require('../middlewares/isAdmin.middleware')
const clientesController = require('../controllers/clientes.controller')

// TODAS LAS RUTAS REQUIEREN TOKEN
router.use(verifyToken)

// RUTAS PÚBLICAS (con token pero sin restricción de rol)
router.get('/', clientesController.listar)
router.get('/busqueda-rapida', clientesController.busquedaRapida)
router.get('/:id', clientesController.obtenerPorId)

// RUTAS PARA VENDEDORES/OPERADORES (cualquier rol autenticado)
router.post('/', clientesController.crear)
router.put('/:id', clientesController.actualizar)
router.patch('/:id/estado', clientesController.cambiarEstado)

// RUTAS SOLO ADMIN
router.delete('/:id', isAdmin, clientesController.eliminar)
router.post('/:id/restaurar', isAdmin, clientesController.restaurar)

module.exports = router