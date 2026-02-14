const pool = require('../config/database');
class ClientesRepository {
  // ============== LISTAR CON FILTROS ==============
  async findAll(filtros = {}, paginacion = {}) {
    const { 
      search = '', 
      tipo_cliente = '', 
      zona = '', 
      estado = 'activo',
      page = 1, 
      limit = 20 
    } = filtros;
    
    const offset = (page - 1) * limit;
    
    // Construir WHERE dinámico
    let condiciones = ['c.estado != $1']; // No mostrar eliminados por defecto
    let valores = ['eliminado'];
    let idx = 2;
    
    if (search) {
      condiciones.push(`(c.razon_social ILIKE $${idx} OR c.numero_documento ILIKE $${idx})`);
      valores.push(`%${search}%`);
      idx++;
    }
    
    if (tipo_cliente && tipo_cliente !== 'todos') {
      condiciones.push(`c.tipo_cliente = $${idx}`);
      valores.push(tipo_cliente);
      idx++;
    }
    
    if (zona && zona !== 'todas') {
      condiciones.push(`c.zona = $${idx}`);
      valores.push(zona);
      idx++;
    }
    
    if (estado && estado !== 'todos') {
      condiciones.push(`c.estado = $${idx}`);
      valores.push(estado);
      idx++;
    }
    
    const whereClause = condiciones.length > 0 
      ? 'WHERE ' + condiciones.join(' AND ') 
      : '';
    
    // Consulta principal con paginación
    const query = `
      SELECT 
        c.id,
        c.tipo_documento,
        c.numero_documento,
        c.razon_social,
        c.nombre_comercial,
        c.telefono,
        c.email,
        c.direccion,
        c.zona,
        c.tipo_cliente,
        c.preferencias,
        c.latitud,
        c.longitud,
        c.estado,
        c.creado_el,
        c.actualizado_el,
        u_creador.username as creado_por_nombre,
        u_actualizador.username as actualizado_por_nombre
      FROM clientes c
      LEFT JOIN usuarios u_creador ON c.creado_por = u_creador.id
      LEFT JOIN usuarios u_actualizador ON c.actualizado_por = u_actualizador.id
      ${whereClause}
      ORDER BY c.creado_el DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    
    valores.push(limit, offset);
    
    // Consulta para contar total
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM clientes c
      ${whereClause}
    `;
    
    try {
      const [result, countResult] = await Promise.all([
        pool.query(query, valores),
        pool.query(countQuery, valores.slice(0, -2)) // Quitar limit y offset
      ]);
      
      return {
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          totalPages: Math.ceil(countResult.rows[0].total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Error al listar clientes: ${error.message}`);
    }
  }
  
  // ============== BUSCAR POR ID ==============
  async findById(id) {
    const query = `
      SELECT 
        c.*,
        u_creador.username as creado_por_nombre,
        u_actualizador.username as actualizado_por_nombre,
        (
          SELECT json_agg(
            json_build_object(
              'id', ch.id,
              'campo', ch.campo,
              'valor_anterior', ch.valor_anterior,
              'valor_nuevo', ch.valor_nuevo,
              'cambiado_por', u_camb.username,
              'cambiado_el', ch.cambiado_el
            ) ORDER BY ch.cambiado_el DESC
          )
          FROM clientes_historial ch
          LEFT JOIN usuarios u_camb ON ch.cambiado_por = u_camb.id
          WHERE ch.cliente_id = c.id
        ) as historial
      FROM clientes c
      LEFT JOIN usuarios u_creador ON c.creado_por = u_creador.id
      LEFT JOIN usuarios u_actualizador ON c.actualizado_por = u_actualizador.id
      WHERE c.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
  
  // ============== CREAR CLIENTE ==============
  async create(clienteData, usuarioId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verificar documento único
      const checkQuery = `
        SELECT id FROM clientes 
        WHERE numero_documento = $1 AND estado != 'eliminado'
      `;
      const checkResult = await client.query(checkQuery, [clienteData.numero_documento]);
      
      if (checkResult.rows.length > 0) {
        throw new Error('Ya existe un cliente con este documento');
      }
      
      // Insertar cliente
      const insertQuery = `
        INSERT INTO clientes (
          tipo_documento,
          numero_documento,
          razon_social,
          nombre_comercial,
          telefono,
          email,
          direccion,
          zona,
          tipo_cliente,
          preferencias,
          latitud,
          longitud,
          estado,
          creado_por,
          creado_el
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
        RETURNING *
      `;
      
      const values = [
        clienteData.tipo_documento,
        clienteData.numero_documento,
        clienteData.razon_social,
        clienteData.nombre_comercial || null,
        clienteData.telefono,
        clienteData.email || null,
        clienteData.direccion || null,
        clienteData.zona || null,
        clienteData.tipo_cliente,
        clienteData.preferencias ? JSON.stringify(clienteData.preferencias) : null,
        clienteData.latitud || null,
        clienteData.longitud || null,
        clienteData.estado || 'activo',
        usuarioId
      ];
      
      const result = await client.query(insertQuery, values);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============== ACTUALIZAR CLIENTE ==============
  async update(id, clienteData, usuarioId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Obtener datos actuales para historial
      const currentQuery = 'SELECT * FROM clientes WHERE id = $1';
      const currentResult = await client.query(currentQuery, [id]);
      
      if (currentResult.rows.length === 0) {
        throw new Error('Cliente no encontrado');
      }
      
      const currentData = currentResult.rows[0];
      
      // Verificar documento único (si cambió)
      if (clienteData.numero_documento && 
          clienteData.numero_documento !== currentData.numero_documento) {
        const checkQuery = `
          SELECT id FROM clientes 
          WHERE numero_documento = $1 AND id != $2 AND estado != 'eliminado'
        `;
        const checkResult = await client.query(checkQuery, [clienteData.numero_documento, id]);
        
        if (checkResult.rows.length > 0) {
          throw new Error('Ya existe otro cliente con este documento');
        }
      }
      
      // Construir UPDATE dinámico
      const updates = [];
      const values = [];
      let idx = 1;
      
      // Solo actualizar campos que vienen en la petición
      const camposActualizados = [];
      
      if (clienteData.tipo_documento !== undefined) {
        updates.push(`tipo_documento = $${idx++}`);
        values.push(clienteData.tipo_documento);
        if (clienteData.tipo_documento !== currentData.tipo_documento) {
          camposActualizados.push('tipo_documento');
        }
      }
      
      if (clienteData.numero_documento !== undefined) {
        updates.push(`numero_documento = $${idx++}`);
        values.push(clienteData.numero_documento);
        if (clienteData.numero_documento !== currentData.numero_documento) {
          camposActualizados.push('numero_documento');
        }
      }
      
      if (clienteData.razon_social !== undefined) {
        updates.push(`razon_social = $${idx++}`);
        values.push(clienteData.razon_social);
        if (clienteData.razon_social !== currentData.razon_social) {
          camposActualizados.push('razon_social');
        }
      }
      
      if (clienteData.nombre_comercial !== undefined) {
        updates.push(`nombre_comercial = $${idx++}`);
        values.push(clienteData.nombre_comercial || null);
        if (clienteData.nombre_comercial !== currentData.nombre_comercial) {
          camposActualizados.push('nombre_comercial');
        }
      }
      
      if (clienteData.telefono !== undefined) {
        updates.push(`telefono = $${idx++}`);
        values.push(clienteData.telefono);
        if (clienteData.telefono !== currentData.telefono) {
          camposActualizados.push('telefono');
        }
      }
      
      if (clienteData.email !== undefined) {
        updates.push(`email = $${idx++}`);
        values.push(clienteData.email || null);
        if (clienteData.email !== currentData.email) {
          camposActualizados.push('email');
        }
      }
      
      if (clienteData.direccion !== undefined) {
        updates.push(`direccion = $${idx++}`);
        values.push(clienteData.direccion || null);
        if (clienteData.direccion !== currentData.direccion) {
          camposActualizados.push('direccion');
        }
      }
      
      if (clienteData.zona !== undefined) {
        updates.push(`zona = $${idx++}`);
        values.push(clienteData.zona || null);
        if (clienteData.zona !== currentData.zona) {
          camposActualizados.push('zona');
        }
      }
      
      if (clienteData.tipo_cliente !== undefined) {
        updates.push(`tipo_cliente = $${idx++}`);
        values.push(clienteData.tipo_cliente);
        if (clienteData.tipo_cliente !== currentData.tipo_cliente) {
          camposActualizados.push('tipo_cliente');
        }
      }
      
      if (clienteData.preferencias !== undefined) {
        updates.push(`preferencias = $${idx++}`);
        values.push(clienteData.preferencias ? JSON.stringify(clienteData.preferencias) : null);
        if (JSON.stringify(clienteData.preferencias) !== JSON.stringify(currentData.preferencias)) {
          camposActualizados.push('preferencias');
        }
      }
      
      if (clienteData.latitud !== undefined) {
        updates.push(`latitud = $${idx++}`);
        values.push(clienteData.latitud || null);
        if (clienteData.latitud !== currentData.latitud) {
          camposActualizados.push('latitud');
        }
      }
      
      if (clienteData.longitud !== undefined) {
        updates.push(`longitud = $${idx++}`);
        values.push(clienteData.longitud || null);
        if (clienteData.longitud !== currentData.longitud) {
          camposActualizados.push('longitud');
        }
      }
      
      // Siempre actualizar estos campos
      updates.push(`actualizado_por = $${idx++}`);
      values.push(usuarioId);
      
      updates.push(`actualizado_el = NOW()`);
      
      values.push(id); // Para el WHERE
      
      const updateQuery = `
        UPDATE clientes 
        SET ${updates.join(', ')}
        WHERE id = $${idx}
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, values);
      
      // Guardar historial para cada campo actualizado
      for (const campo of camposActualizados) {
        const historialQuery = `
          INSERT INTO clientes_historial (
            cliente_id,
            campo,
            valor_anterior,
            valor_nuevo,
            cambiado_por,
            cambiado_el
          ) VALUES ($1, $2, $3, $4, $5, NOW())
        `;
        
        await client.query(historialQuery, [
          id,
          campo,
          String(currentData[campo] || ''),
          String(clienteData[campo] || ''),
          usuarioId
        ]);
      }
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============== CAMBIAR ESTADO ==============
  async cambiarEstado(id, nuevoEstado, usuarioId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const query = `
        UPDATE clientes 
        SET estado = $1, actualizado_por = $2, actualizado_el = NOW()
        WHERE id = $3
        RETURNING *
      `;
      
      const result = await client.query(query, [nuevoEstado, usuarioId, id]);
      
      // Registrar en historial
      const historialQuery = `
        INSERT INTO clientes_historial (
          cliente_id,
          campo,
          valor_anterior,
          valor_nuevo,
          cambiado_por,
          cambiado_el
        ) VALUES ($1, 'estado', $2, $3, $4, NOW())
      `;
      
      await client.query(historialQuery, [
        id,
        result.rows[0].estado, // valor anterior (lo capturamos antes del cambio)
        nuevoEstado,
        usuarioId
      ]);
      
      await client.query('COMMIT');
      return result.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // ============== ELIMINACIÓN LÓGICA ==============
  async delete(id, usuarioId) {
    return this.cambiarEstado(id, 'eliminado', usuarioId);
  }
  
  // ============== RESTAURAR ==============
  async restore(id, usuarioId) {
    return this.cambiarEstado(id, 'activo', usuarioId);
  }
  
  // ============== BÚSQUEDA RÁPIDA ==============
  async quickSearch(termino) {
    const query = `
      SELECT 
        id,
        tipo_documento,
        numero_documento,
        razon_social,
        telefono,
        zona,
        estado
      FROM clientes
      WHERE estado = 'activo'
        AND (
          numero_documento ILIKE $1 OR
          razon_social ILIKE $1 OR
          telefono ILIKE $1
        )
      ORDER BY 
        CASE 
          WHEN numero_documento ILIKE $1 THEN 1
          WHEN razon_social ILIKE $1 THEN 2
          ELSE 3
        END
      LIMIT 10
    `;
    
    const result = await pool.query(query, [`%${termino}%`]);
    return result.rows;
  }
}

module.exports = new ClientesRepository();