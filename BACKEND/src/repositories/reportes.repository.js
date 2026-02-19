// backend/src/repositories/reportes.repository.js

const db = require('../config/database');

class ReportesRepository {
  
  /**
   * REPORTE 1: Clientes por zona
   */
  async getClientesPorZona() {
    try {
      const result = await db.query(`
        SELECT 
          zona,
          COUNT(*) as total_clientes,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
          SUM(CASE WHEN tipo_cliente = 'persona_natural' THEN 1 ELSE 0 END) as personas_naturales,
          SUM(CASE WHEN tipo_cliente = 'persona_juridica' THEN 1 ELSE 0 END) as personas_juridicas,
          SUM(CASE WHEN tipo_cliente = 'empresa' THEN 1 ELSE 0 END) as empresas
        FROM clientes
        WHERE estado != 'eliminado'
        GROUP BY zona
        ORDER BY total_clientes DESC
      `);

      // Totales generales
      const totales = await db.query(`
        SELECT 
          COUNT(*) as total_general,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as total_activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as total_inactivos
        FROM clientes
        WHERE estado != 'eliminado'
      `);

      const zonasMap = {
        norte: 'Norte (El Tambo)',
        sur: 'Sur (Chilca)',
        este: 'Este (San Agustín)',
        oeste: 'Oeste (Pilcomayo)',
        centro: 'Centro (Huancayo)'
      };

      const data = result.rows.map(row => ({
        zona: row.zona,
        nombre_zona: zonasMap[row.zona] || row.zona,
        total_clientes: parseInt(row.total_clientes),
        activos: parseInt(row.activos),
        inactivos: parseInt(row.inactivos),
        personas_naturales: parseInt(row.personas_naturales),
        personas_juridicas: parseInt(row.personas_juridicas),
        empresas: parseInt(row.empresas),
        porcentaje_del_total: totales.rows[0].total_general > 0 
          ? Math.round((parseInt(row.total_clientes) / parseInt(totales.rows[0].total_general)) * 100) 
          : 0
      }));

      return {
        data,
        totales: {
          general: parseInt(totales.rows[0].total_general),
          activos: parseInt(totales.rows[0].total_activos),
          inactivos: parseInt(totales.rows[0].total_inactivos)
        }
      };
    } catch (error) {
      console.error('Error en getClientesPorZona:', error);
      throw error;
    }
  }

  /**
   * REPORTE 2: Clientes por tipo y estado
   */
  async getClientesPorTipoYEstado() {
    try {
      const result = await db.query(`
        SELECT 
          tipo_cliente,
          COUNT(*) as total,
          SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
          SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos
        FROM clientes
        WHERE estado != 'eliminado'
        GROUP BY tipo_cliente
      `);

      const tipoNombres = {
        'persona_natural': 'Persona Natural',
        'persona_juridica': 'Persona Jurídica',
        'empresa': 'Empresa'
      };

      const totalGeneral = result.rows.reduce((sum, row) => sum + parseInt(row.total), 0);

      const data = result.rows.map(row => ({
        tipo: row.tipo_cliente,
        nombre_tipo: tipoNombres[row.tipo_cliente] || row.tipo_cliente,
        total: parseInt(row.total),
        activos: parseInt(row.activos),
        inactivos: parseInt(row.inactivos),
        porcentaje: totalGeneral > 0 ? Math.round((parseInt(row.total) / totalGeneral) * 100) : 0
      }));

      return {
        data,
        total_general: totalGeneral
      };
    } catch (error) {
      console.error('Error en getClientesPorTipoYEstado:', error);
      throw error;
    }
  }

  /**
   * REPORTE 3: Preferencias de clientes
   */
  async getPreferenciasClientes() {
    try {
      // Preferencias de tipo de huevo
      const tipoHuevo = await db.query(`
        SELECT 
          preferencias->>'tipo_huevo' as tipo_huevo,
          COUNT(*) as cantidad
        FROM clientes
        WHERE estado != 'eliminado'
          AND preferencias IS NOT NULL
          AND preferencias->>'tipo_huevo' IS NOT NULL
        GROUP BY preferencias->>'tipo_huevo'
      `);

      // Preferencias de frecuencia de compra
      const frecuenciaCompra = await db.query(`
        SELECT 
          preferencias->>'frecuencia_compra' as frecuencia,
          COUNT(*) as cantidad
        FROM clientes
        WHERE estado != 'eliminado'
          AND preferencias IS NOT NULL
          AND preferencias->>'frecuencia_compra' IS NOT NULL
        GROUP BY preferencias->>'frecuencia_compra'
      `);

      // Preferencias de horario
      const horario = await db.query(`
        SELECT 
          preferencias->>'horario_preferido' as horario,
          COUNT(*) as cantidad
        FROM clientes
        WHERE estado != 'eliminado'
          AND preferencias IS NOT NULL
          AND preferencias->>'horario_preferido' IS NOT NULL
        GROUP BY preferencias->>'horario_preferido'
      `);

      const tipoHuevoMap = {
        'blanco': 'Huevo Blanco',
        'rojo': 'Huevo Rojo',
        'mixto': 'Mixto'
      };

      const frecuenciaMap = {
        'diario': 'Diario',
        'semanal': 'Semanal',
        'quincenal': 'Quincenal',
        'mensual': 'Mensual'
      };

      const horarioMap = {
        'mañana': 'Mañana',
        'tarde': 'Tarde'
      };

      return {
        tipo_huevo: tipoHuevo.rows.map(row => ({
          tipo: row.tipo_huevo,
          nombre: tipoHuevoMap[row.tipo_huevo] || row.tipo_huevo,
          cantidad: parseInt(row.cantidad)
        })),
        frecuencia_compra: frecuenciaCompra.rows.map(row => ({
          frecuencia: row.frecuencia,
          nombre: frecuenciaMap[row.frecuencia] || row.frecuencia,
          cantidad: parseInt(row.cantidad)
        })),
        horario: horario.rows.map(row => ({
          horario: row.horario,
          nombre: horarioMap[row.horario] || row.horario,
          cantidad: parseInt(row.cantidad)
        }))
      };
    } catch (error) {
      console.error('Error en getPreferenciasClientes:', error);
      throw error;
    }
  }

  /**
   * REPORTE 4: Evolución mensual (para reportes)
   */
  async getEvolucionMensual(meses = 12) {
    try {
      const result = await db.query(`
        SELECT 
          TO_CHAR(creado_el, 'YYYY-MM') as mes,
          TO_CHAR(creado_el, 'Mon YYYY') as mes_nombre,
          COUNT(*) as nuevos_clientes,
          SUM(CASE WHEN tipo_cliente = 'persona_natural' THEN 1 ELSE 0 END) as nuevas_personas,
          SUM(CASE WHEN tipo_cliente = 'empresa' OR tipo_cliente = 'persona_juridica' THEN 1 ELSE 0 END) as nuevas_empresas
        FROM clientes
        WHERE creado_el >= CURRENT_DATE - INTERVAL '${meses} months'
        GROUP BY TO_CHAR(creado_el, 'YYYY-MM'), TO_CHAR(creado_el, 'Mon YYYY')
        ORDER BY mes ASC
      `);

      return result.rows.map(row => ({
        mes: row.mes,
        mes_nombre: row.mes_nombre,
        nuevos_clientes: parseInt(row.nuevos_clientes),
        nuevas_personas: parseInt(row.nuevas_personas),
        nuevas_empresas: parseInt(row.nuevas_empresas)
      }));
    } catch (error) {
      console.error('Error en getEvolucionMensual:', error);
      throw error;
    }
  }

  /**
   * REPORTE 5: Datos para facturación (clientes con más compras potencial)
   */
  async getTopClientes(limite = 10) {
    try {
      const result = await db.query(`
        SELECT 
          id,
          razon_social,
          nombre_comercial,
          tipo_documento,
          numero_documento,
          telefono,
          email,
          zona,
          tipo_cliente,
          estado,
          creado_el,
          preferencias->>'frecuencia_compra' as frecuencia
        FROM clientes
        WHERE estado != 'eliminado'
        ORDER BY 
          CASE 
            WHEN preferencias->>'frecuencia_compra' = 'diario' THEN 1
            WHEN preferencias->>'frecuencia_compra' = 'semanal' THEN 2
            WHEN preferencias->>'frecuencia_compra' = 'quincenal' THEN 3
            WHEN preferencias->>'frecuencia_compra' = 'mensual' THEN 4
            ELSE 5
          END,
          creado_el DESC
        LIMIT ${limite}
      `);

      return result.rows;
    } catch (error) {
      console.error('Error en getTopClientes:', error);
      throw error;
    }
  }
}

module.exports = new ReportesRepository();