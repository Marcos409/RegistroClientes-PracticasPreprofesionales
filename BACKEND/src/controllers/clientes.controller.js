const clientesRepository = require('../repositories/clientes.repository');
const { validateCliente } = require('../models/clientes.model');

class ClientesController {
  // ============== LISTAR CON FILTROS ==============
  async listar(req, res) {
    try {
      const filtros = {
        search: req.query.search || '',
        tipo_cliente: req.query.tipo_cliente || '',
        zona: req.query.zona || '',
        estado: req.query.estado || 'activo',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20
      };
      
      const resultado = await clientesRepository.findAll(filtros);
      
      res.json({
        success: true,
        data: resultado.data,
        pagination: resultado.pagination
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al listar clientes',
        error: error.message
      });
    }
  }
  
  // ============== OBTENER POR ID ==============
  async obtenerPorId(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await clientesRepository.findById(id);
      
      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: cliente
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente',
        error: error.message
      });
    }
  }
  
// ============== CREAR CLIENTE ==============
async crear(req, res) {
  try {
    console.log('📦 Datos recibidos del frontend:', req.body);
    console.log('👤 Usuario autenticado:', req.user?.id);  // ✅ CAMBIADO
    
    const { error, value } = validateCliente(req.body);
    
    if (error) {
      console.log('❌ Errores de validación:', error.details.map(d => d.message));
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: error.details.map(d => d.message)
      });
    }
    
    console.log('✅ Datos validados:', value);
    
    const usuarioId = req.user.id;  // ✅ CAMBIADO
    
    const nuevoCliente = await clientesRepository.create(value, usuarioId);
    
    console.log('✅ Cliente creado exitosamente ID:', nuevoCliente.id);
    
    res.status(201).json({
      success: true,
      message: 'Cliente registrado exitosamente',
      data: nuevoCliente
    });
    
  } catch (error) {
    console.error('🔥 Error en crear cliente:', error);
    console.error('🔥 Stack trace:', error.stack);
    
    if (error.message && error.message.includes('documento')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message
    });
  }
}

// ============== ACTUALIZAR CLIENTE ==============
async actualizar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;  // ✅ CAMBIADO
    
    const { error, value } = validateCliente(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: error.details.map(d => d.message)
      });
    }
    
    const clienteActualizado = await clientesRepository.update(id, value, usuarioId);
    
    res.json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: clienteActualizado
    });
    
  } catch (error) {
    if (error.message.includes('documento') || error.message.includes('encontrado')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message
    });
  }
}

// ============== CAMBIAR ESTADO ==============
async cambiarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const usuarioId = req.user.id;  // ✅ CAMBIADO
    
    if (!['activo', 'inactivo', 'eliminado'].includes(estado)) {
      return res.status(400).json({
        success: false,
        message: 'Estado no válido'
      });
    }
    
    const cliente = await clientesRepository.cambiarEstado(id, estado, usuarioId);
    
    res.json({
      success: true,
      message: `Cliente ${estado === 'activo' ? 'activado' : estado === 'inactivo' ? 'desactivado' : 'eliminado'} exitosamente`,
      data: cliente
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado',
      error: error.message
    });
  }
}

// ============== ELIMINAR (LÓGICA) ==============
async eliminar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;  // ✅ CAMBIADO
    
    // Verificar que sea admin
    if (req.user.rol !== 'admin') {  // ✅ CAMBIADO
      return res.status(403).json({
        success: false,
        message: 'Solo administradores pueden eliminar clientes'
      });
    }
    
    const cliente = await clientesRepository.delete(id, usuarioId);
    
    res.json({
      success: true,
      message: 'Cliente eliminado exitosamente (eliminación lógica)',
      data: cliente
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message
    });
  }
}

// ============== RESTAURAR ==============
async restaurar(req, res) {
  try {
    const { id } = req.params;
    const usuarioId = req.user.id;  // ✅ CAMBIADO
    
    const cliente = await clientesRepository.restore(id, usuarioId);
    
    res.json({
      success: true,
      message: 'Cliente restaurado exitosamente',
      data: cliente
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al restaurar cliente',
      error: error.message
    });
  }
}
  // ============== BÚSQUEDA RÁPIDA ==============
  async busquedaRapida(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 2) {
        return res.json({
          success: true,
          data: []
        });
      }
      
      const resultados = await clientesRepository.quickSearch(q);
      
      res.json({
        success: true,
        data: resultados
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda rápida',
        error: error.message
      });
    }
  }
}

module.exports = new ClientesController();