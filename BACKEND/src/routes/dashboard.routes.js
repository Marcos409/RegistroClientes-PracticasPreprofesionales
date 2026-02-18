// backend/src/routes/dashboard.routes.js

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

// Todas las rutas requieren autenticación
router.use(verifyToken);

/**
 * RUTA PRINCIPAL - DASHBOARD GERENCIAL (RF11)
 * GET /api/dashboard/gerencial
 */
router.get('/gerencial', dashboardController.getDashboardGerencial);

/**
 * Rutas específicas para cada KPI
 */
router.get('/kpis', dashboardController.getKPIs);
router.get('/distribucion-tipos', dashboardController.getDistribucionTipos);
router.get('/mapa-calor', dashboardController.getMapaCalor);
router.get('/tendencias', dashboardController.getTendencias);
router.get('/distritos', dashboardController.getDistribucionDistritos);

module.exports = router;