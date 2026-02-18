// backend/src/repositories/dashboard.repository.js

const db = require('../config/database');

class DashboardRepository {
  
  /**
   * KPI 1: Totales y clientes activos
   */
  async getKPIsGenerales() {
    try {
      const result = await db.query(`
        SELECT 
          COUNT(*) as total_clientes,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as clientes_activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as clientes_inactivos,
          SUM(CASE WHEN estado = 'eliminado' THEN 1 ELSE 0 END) as clientes_eliminados,
          SUM(CASE WHEN DATE(creado_el) = CURRENT_DATE THEN 1 ELSE 0 END) as nuevos_hoy
        FROM clientes
      `);

      const totales = result.rows[0];
      console.log('📊 KPIs:', totales);

      const porcentajeActivos = totales.total_clientes > 0 
        ? Math.round((totales.clientes_activos / totales.total_clientes) * 100) 
        : 0;

      return {
        total_clientes: parseInt(totales.total_clientes || 0),
        clientes_activos: parseInt(totales.clientes_activos || 0),
        clientes_inactivos: parseInt(totales.clientes_inactivos || 0),
        clientes_eliminados: parseInt(totales.clientes_eliminados || 0),
        nuevos_hoy: parseInt(totales.nuevos_hoy || 0),
        porcentaje_activos: porcentajeActivos
      };
    } catch (error) {
      console.error('Error en getKPIsGenerales:', error);
      throw error;
    }
  }

  /**
   * KPI 2: Distribución porcentual por tipo de cliente
   */
  async getDistribucionPorTipo() {
    try {
      const totalResult = await db.query(`
        SELECT COUNT(*) as total 
        FROM clientes 
        WHERE estado != 'eliminado'
      `);
      const totalClientes = parseInt(totalResult.rows[0].total || 0);

      const distribucionResult = await db.query(`
        SELECT tipo_cliente, COUNT(*) as cantidad
        FROM clientes
        WHERE estado != 'eliminado'
        GROUP BY tipo_cliente
      `);

      const tipoNombres = {
        'persona_natural': 'Persona Natural',
        'persona_juridica': 'Persona Jurídica',
        'empresa': 'Empresa'
      };

      const resultado = distribucionResult.rows.map(item => ({
        tipo: item.tipo_cliente,
        nombre: tipoNombres[item.tipo_cliente] || item.tipo_cliente,
        cantidad: parseInt(item.cantidad),
        porcentaje: totalClientes > 0 
          ? Math.round((parseInt(item.cantidad) / totalClientes) * 100) 
          : 0
      }));

      return resultado;
    } catch (error) {
      console.error('Error en getDistribucionPorTipo:', error);
      throw error;
    }
  }

  /**
   * KPI 3: Mapa de calor - Concentración por zonas de Huancayo
   */
  async getMapaCalorZonas() {
    try {
      const zonasHuancayo = [
        { zona: 'centro', nombre: 'Centro', lat: -12.068, lng: -75.210 },
        { zona: 'norte', nombre: 'Norte (El Tambo)', lat: -12.058, lng: -75.220 },
        { zona: 'sur', nombre: 'Sur (Chilca)', lat: -12.078, lng: -75.200 },
        { zona: 'este', nombre: 'Este', lat: -12.063, lng: -75.180 },
        { zona: 'oeste', nombre: 'Oeste', lat: -12.073, lng: -75.230 }
      ];

      const zonasList = zonasHuancayo.map(z => `'${z.zona}'`).join(',');

      const result = await db.query(`
        SELECT zona, COUNT(*) as total
        FROM clientes
        WHERE estado != 'eliminado'
        AND zona IN (${zonasList})
        GROUP BY zona
      `);

      const zonaMap = {};
      result.rows.forEach(item => {
        zonaMap[item.zona] = parseInt(item.total);
      });

      const maxClientes = Math.max(...Object.values(zonaMap), 1);

      const zonasConDatos = zonasHuancayo.map(zona => ({
        ...zona,
        clientes: zonaMap[zona.zona] || 0,
        intensidad: zonaMap[zona.zona] ? (zonaMap[zona.zona] / maxClientes) : 0,
        nivel_calor: Math.ceil((zonaMap[zona.zona] || 0) / maxClientes * 5) || 1
      }));

      return {
        zonas: zonasConDatos,
        total_clientes_zonas: Object.values(zonaMap).reduce((a, b) => a + b, 0),
        zona_con_mas_clientes: zonasConDatos.reduce((max, zona) => 
          zona.clientes > max.clientes ? zona : max, zonasConDatos[0])
      };
    } catch (error) {
      console.error('Error en getMapaCalorZonas:', error);
      throw error;
    }
  }

  /**
   * KPI 4: Tendencias mensuales (nuevos vs perdidos)
   */
  async getTendenciasMensuales(meses = 6) {
    try {
      // Clientes nuevos por mes (usando creado_el)
      const nuevosResult = await db.query(`
        SELECT 
          TO_CHAR(creado_el, 'YYYY-MM') as mes,
          TO_CHAR(creado_el, 'Mon YYYY') as mes_nombre,
          COUNT(*) as nuevos
        FROM clientes
        WHERE creado_el >= CURRENT_DATE - INTERVAL '${meses} months'
        GROUP BY TO_CHAR(creado_el, 'YYYY-MM'), TO_CHAR(creado_el, 'Mon YYYY')
        ORDER BY mes ASC
      `);

      // Clientes perdidos por mes (los que cambiaron a estado 'eliminado' o 'inactivo')
      const perdidosResult = await db.query(`
        SELECT 
          TO_CHAR(actualizado_el, 'YYYY-MM') as mes,
          COUNT(*) as perdidos
        FROM clientes
        WHERE (estado = 'inactivo' OR estado = 'eliminado')
        AND actualizado_el >= CURRENT_DATE - INTERVAL '${meses} months'
        GROUP BY TO_CHAR(actualizado_el, 'YYYY-MM')
        ORDER BY mes ASC
      `);

      const perdidosMap = {};
      perdidosResult.rows.forEach(item => {
        perdidosMap[item.mes] = parseInt(item.perdidos);
      });

      const tendencias = nuevosResult.rows.map(item => ({
        mes: item.mes,
        mes_nombre: item.mes_nombre,
        nuevos: parseInt(item.nuevos),
        perdidos: perdidosMap[item.mes] || 0,
        saldo_neto: parseInt(item.nuevos) - (perdidosMap[item.mes] || 0)
      }));

      const totalNuevos = tendencias.reduce((sum, m) => sum + m.nuevos, 0);
      const totalPerdidos = tendencias.reduce((sum, m) => sum + m.perdidos, 0);
      const crecimientoNeto = totalNuevos - totalPerdidos;

      return {
        mensual: tendencias,
        totales_periodo: {
          nuevos: totalNuevos,
          perdidos: totalPerdidos,
          crecimiento_neto: crecimientoNeto,
          tasa_crecimiento: totalNuevos > 0 
            ? Math.round((crecimientoNeto / totalNuevos) * 100) 
            : 0
        }
      };
    } catch (error) {
      console.error('Error en getTendenciasMensuales:', error);
      throw error;
    }
  }

  /**
   * Distribución por distritos de Huancayo
   */
  async getDistribucionPorDistrito() {
    try {
      const distritos = [
        { zona: 'centro', distrito: 'Huancayo' },
        { zona: 'norte', distrito: 'El Tambo' },
        { zona: 'sur', distrito: 'Chilca' },
        { zona: 'este', distrito: 'San Agustín' },
        { zona: 'oeste', distrito: 'Pilcomayo' }
      ];

      const zonasList = distritos.map(d => `'${d.zona}'`).join(',');

      const result = await db.query(`
        SELECT zona, COUNT(*) as total
        FROM clientes
        WHERE estado != 'eliminado'
        AND zona IN (${zonasList})
        GROUP BY zona
      `);

      const zonaMap = {};
      result.rows.forEach(item => {
        zonaMap[item.zona] = parseInt(item.total);
      });

      const totalGeneral = Object.values(zonaMap).reduce((a, b) => a + b, 0);

      return distritos.map(distrito => ({
        distrito: distrito.distrito,
        zona: distrito.zona,
        clientes: zonaMap[distrito.zona] || 0,
        porcentaje: totalGeneral > 0 
          ? Math.round(((zonaMap[distrito.zona] || 0) / totalGeneral) * 100) 
          : 0
      }));
    } catch (error) {
      console.error('Error en getDistribucionPorDistrito:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos completos del dashboard gerencial
   */
  async getDashboardDataCompleto() {
    try {
      console.log('🚀 Iniciando carga completa del dashboard');
      
      const [
        kpisGenerales,
        distribucionTipos,
        mapaCalor,
        tendencias,
        distribucionDistritos
      ] = await Promise.all([
        this.getKPIsGenerales(),
        this.getDistribucionPorTipo(),
        this.getMapaCalorZonas(),
        this.getTendenciasMensuales(6),
        this.getDistribucionPorDistrito()
      ]);

      console.log('✅ Dashboard cargado exitosamente');

      return {
        kpis: kpisGenerales,
        distribucion_tipos: distribucionTipos,
        mapa_calor: mapaCalor,
        tendencias: tendencias,
        distribucion_distritos: distribucionDistritos,
        metadata: {
          fecha_actualizacion: new Date(),
          periodo_tendencias: 'Últimos 6 meses',
          zona_principal: 'Huancayo'
        }
      };
    } catch (error) {
      console.error('❌ Error en getDashboardDataCompleto:', error);
      throw error;
    }
  }
}

module.exports = new DashboardRepository();