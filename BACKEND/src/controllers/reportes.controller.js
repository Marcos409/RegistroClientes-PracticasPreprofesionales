// backend/src/controllers/reportes.controller.js

const reportesRepository = require('../repositories/reportes.repository');

class ReportesController {
  
  /**
   * GET /api/reportes/clientes-por-zona
   */
  async getClientesPorZona(req, res) {
    try {
      console.log('📊 Reporte: Clientes por zona - Usuario:', req.user?.id);
      
      const data = await reportesRepository.getClientesPorZona();
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error en getClientesPorZona:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener reporte de clientes por zona',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reportes/clientes-por-tipo
   */
  async getClientesPorTipo(req, res) {
    try {
      console.log('📊 Reporte: Clientes por tipo - Usuario:', req.user?.id);
      
      const data = await reportesRepository.getClientesPorTipoYEstado();
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error en getClientesPorTipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener reporte de clientes por tipo',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reportes/preferencias
   */
  async getPreferencias(req, res) {
    try {
      console.log('📊 Reporte: Preferencias de clientes - Usuario:', req.user?.id);
      
      const data = await reportesRepository.getPreferenciasClientes();
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error en getPreferencias:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener reporte de preferencias',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reportes/evolucion-mensual
   */
  async getEvolucionMensual(req, res) {
    try {
      const { meses = 12 } = req.query;
      console.log('📊 Reporte: Evolución mensual - Usuario:', req.user?.id, '- Meses:', meses);
      
      const data = await reportesRepository.getEvolucionMensual(parseInt(meses));
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error en getEvolucionMensual:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener evolución mensual',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reportes/top-clientes
   */
  async getTopClientes(req, res) {
    try {
      const { limite = 10 } = req.query;
      console.log('📊 Reporte: Top clientes - Usuario:', req.user?.id, '- Límite:', limite);
      
      const data = await reportesRepository.getTopClientes(parseInt(limite));
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('❌ Error en getTopClientes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener top clientes',
        error: error.message
      });
    }
  }

  /**
   * GET /api/reportes/todos
   * Obtiene todos los reportes (para vista general)
   */
  async getTodosLosReportes(req, res) {
    try {
      console.log('📊 Solicitando todos los reportes - Usuario:', req.user?.id);
      
      const [
        clientesPorZona,
        clientesPorTipo,
        preferencias,
        evolucion,
        topClientes
      ] = await Promise.all([
        reportesRepository.getClientesPorZona(),
        reportesRepository.getClientesPorTipoYEstado(),
        reportesRepository.getPreferenciasClientes(),
        reportesRepository.getEvolucionMensual(12),
        reportesRepository.getTopClientes(5)
      ]);

      res.json({
        success: true,
        data: {
          clientes_por_zona: clientesPorZona,
          clientes_por_tipo: clientesPorTipo,
          preferencias: preferencias,
          evolucion_mensual: evolucion,
          top_clientes: topClientes,
          metadata: {
            fecha_generacion: new Date(),
            generado_por: req.user?.username
          }
        }
      });
    } catch (error) {
      console.error('❌ Error en getTodosLosReportes:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener todos los reportes',
        error: error.message
      });
    }
  }
}

module.exports = new ReportesController();