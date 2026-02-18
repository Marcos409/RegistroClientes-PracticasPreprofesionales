// backend/src/controllers/dashboard.controller.js

const dashboardRepository = require('../repositories/dashboard.repository');

class DashboardController {
  
  /**
   * GET /api/dashboard/gerencial
   * Obtiene todos los datos para el dashboard gerencial (RF11)
   */
  async getDashboardGerencial(req, res) {
    try {
      console.log('='.repeat(50));
      console.log('📊 SOLICITUD DASHBOARD GERENCIAL');
      console.log('='.repeat(50));
      console.log('👤 Usuario ID:', req.user?.id);
      console.log('👤 Username:', req.user?.username);
      console.log('👤 Rol:', req.user?.rol);
      console.log('🕒 Timestamp:', new Date().toISOString());
      
      console.log('\n🚀 Llamando a dashboardRepository.getDashboardDataCompleto()...');
      const data = await dashboardRepository.getDashboardDataCompleto();
      
      console.log('✅ Datos obtenidos exitosamente del repositorio');
      console.log('📦 Estructura de datos recibida:');
      console.log('   - KPIs:', data.kpis ? '✅' : '❌');
      console.log('   - Distribución tipos:', data.distribucion_tipos ? '✅' : '❌');
      console.log('   - Mapa calor:', data.mapa_calor ? '✅' : '❌');
      console.log('   - Tendencias:', data.tendencias ? '✅' : '❌');
      console.log('   - Distritos:', data.distribucion_distritos ? '✅' : '❌');
      
      console.log('\n📤 Enviando respuesta al frontend...');
      res.json({
        success: true,
        message: 'Dashboard gerencial obtenido correctamente',
        data
      });
      
      console.log('✅ Respuesta enviada correctamente');

    } catch (error) {
      console.error('\n❌ ERROR EN DASHBOARD GERENCIAL:');
      console.error('='.repeat(50));
      console.error('🔥 Mensaje:', error.message);
      console.error('🔥 Stack:', error.stack);
      console.error('🔥 Nombre del error:', error.name);
      if (error.code) {
        console.error('🔥 Código de error:', error.code);
      }
      if (error.detail) {
        console.error('🔥 Detalle:', error.detail);
      }
      console.error('='.repeat(50));
      
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos del dashboard gerencial',
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * GET /api/dashboard/kpis
   * Solo KPIs generales
   */
  async getKPIs(req, res) {
    try {
      console.log('📊 Solicitando KPIs generales - Usuario:', req.user?.id);
      
      const kpis = await dashboardRepository.getKPIsGenerales();
      
      console.log('✅ KPIs obtenidos:', kpis);
      
      res.json({
        success: true,
        data: kpis
      });
    } catch (error) {
      console.error('❌ Error en getKPIs:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener KPIs',
        error: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/distribucion-tipos
   * Distribución por tipo de cliente
   */
  async getDistribucionTipos(req, res) {
    try {
      console.log('📊 Solicitando distribución por tipos - Usuario:', req.user?.id);
      
      const distribucion = await dashboardRepository.getDistribucionPorTipo();
      
      console.log('✅ Distribución obtenida:', distribucion.length, 'tipos');
      
      res.json({
        success: true,
        data: distribucion
      });
    } catch (error) {
      console.error('❌ Error en getDistribucionTipos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por tipos',
        error: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/mapa-calor
   * Mapa de calor de Huancayo
   */
  async getMapaCalor(req, res) {
    try {
      console.log('🗺️ Solicitando mapa de calor - Usuario:', req.user?.id);
      
      const mapaCalor = await dashboardRepository.getMapaCalorZonas();
      
      console.log('✅ Mapa de calor obtenido:', mapaCalor.zonas.length, 'zonas');
      console.log('   Total clientes en zonas:', mapaCalor.total_clientes_zonas);
      
      res.json({
        success: true,
        data: mapaCalor
      });
    } catch (error) {
      console.error('❌ Error en getMapaCalor:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener mapa de calor',
        error: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/tendencias
   * Tendencias mensuales (nuevos vs perdidos)
   */
  async getTendencias(req, res) {
    try {
      const { meses = 6 } = req.query;
      console.log('📈 Solicitando tendencias - Usuario:', req.user?.id, '- Meses:', meses);
      
      const tendencias = await dashboardRepository.getTendenciasMensuales(parseInt(meses));
      
      console.log('✅ Tendencias obtenidas:', tendencias.mensual.length, 'meses');
      console.log('   Totales - Nuevos:', tendencias.totales_periodo.nuevos, 
                  '- Perdidos:', tendencias.totales_periodo.perdidos);
      
      res.json({
        success: true,
        data: tendencias
      });
    } catch (error) {
      console.error('❌ Error en getTendencias:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener tendencias',
        error: error.message
      });
    }
  }

  /**
   * GET /api/dashboard/distritos
   * Distribución por distritos de Huancayo
   */
  async getDistribucionDistritos(req, res) {
    try {
      console.log('🏘️ Solicitando distribución por distritos - Usuario:', req.user?.id);
      
      const distritos = await dashboardRepository.getDistribucionPorDistrito();
      
      console.log('✅ Distribución por distritos obtenida:', distritos.length, 'distritos');
      
      res.json({
        success: true,
        data: distritos
      });
    } catch (error) {
      console.error('❌ Error en getDistribucionDistritos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener distribución por distritos',
        error: error.message
      });
    }
  }
}

module.exports = new DashboardController();