// backend/src/routes/reportes.routes.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const reportesController = require('../controllers/reportes.controller');

// Todas las rutas requieren autenticación
router.use(verifyToken);

/**
 * RUTA PRINCIPAL - TODOS LOS REPORTES
 * GET /api/reportes/todos
 */
router.get('/todos', reportesController.getTodosLosReportes);

/**
 * REPORTES ESPECÍFICOS
 */
router.get('/clientes-por-zona', reportesController.getClientesPorZona);
router.get('/clientes-por-tipo', reportesController.getClientesPorTipo);
router.get('/preferencias', reportesController.getPreferencias);
router.get('/evolucion-mensual', reportesController.getEvolucionMensual);
router.get('/top-clientes', reportesController.getTopClientes);

module.exports = router;