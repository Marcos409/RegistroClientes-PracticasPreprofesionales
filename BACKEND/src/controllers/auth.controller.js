// controllers/auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // IMPORTANTE: Ajusta la ruta

console.log('🔍 Database config cargada desde:', require.resolve('../config/database'));

// Función mejorada de login
async function loginUser(username, password) {
  console.log(`\n=== INICIANDO LOGIN PARA: ${username} ===`);
  
  try {
    // 1. Verificar que pool funciona
    console.log('🔍 Probando conexión a BD...');
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a BD OK');

    // 2. Buscar usuario
    console.log(`🔍 Ejecutando: SELECT * FROM fn_login_usuario('${username}')`);
    const { rows } = await pool.query(
      'SELECT * FROM fn_login_usuario($1)', 
      [username]
    );

    if (rows.length === 0) {
      console.log('❌ No hay resultados para el usuario');
      return null;
    }

    const user = rows[0];
    console.log('✅ Usuario encontrado en BD:', {
      id: user.id,
      username: user.username,
      rol: user.rol,
      estado: user.estado,
      hash_inicio: user.password_hash?.substring(0, 30)
    });

    // 3. Debug: Listar todos los usuarios (temporal)
    const allUsers = await pool.query(
      'SELECT id, username FROM usuarios ORDER BY id'
    );
    console.log('📋 Usuarios en BD:', allUsers.rows.map(u => u.username));

    // 4. Verificar estado
    if (!user.estado) {
      console.log('❌ Usuario inactivo');
      return null;
    }

    // 5. Comparar contraseña
    console.log('🔍 Comparando contraseña...');
    console.log('🔍 Password recibida:', password);
    
    let isValid = false;
    
    try {
      // Intento 1: Usar bcrypt normal
      isValid = await bcrypt.compare(password, user.password_hash);
      console.log('🔍 Resultado bcrypt.compare():', isValid);
      
      if (!isValid) {
        // Intento 2: Verificar si el hash está corrupto
        console.log('⚠️  bcrypt falló. Verificando formato hash...');
        console.log('🔍 Hash length:', user.password_hash?.length);
        console.log('🔍 Hash starts with:', user.password_hash?.substring(0, 10));
        
        // Si el hash parece incorrecto, probar contraseñas comunes
        const commonPasswords = ['Admin2026!', 'admin123', 'password', '123456'];
        for (const commonPwd of commonPasswords) {
          console.log(`🔍 Probando contraseña común: "${commonPwd}"`);
          const tempHash = await bcrypt.hash(commonPwd, 10);
          console.log(`🔍 Hash de "${commonPwd}":`, tempHash.substring(0, 30));
        }
      }
    } catch (bcryptError) {
      console.error('🔥 Error en bcrypt:', bcryptError.message);
      
      // TEMPORAL: Para desarrollo, aceptar si password coincide con alguna conocida
      if (['Admin2026!', 'admin123'].includes(password)) {
        console.log('⚠️  MODO DEBUG: Contraseña aceptada (sin bcrypt)');
        isValid = true;
      }
    }

    if (!isValid) {
      console.log('❌ Contraseña inválida');
      return null;
    }

    console.log('✅ Login exitoso!');
    return {
      id: user.id,
      username: user.username,
      rol: user.rol,
      nombre_completo: user.nombre_completo,
      estado: user.estado
    };

  } catch (error) {
    console.error('🔥 Error en loginUser:', error.message);
    console.error(error.stack);
    return null;
  }
}

exports.login = async (req, res) => {
  console.log('\n=== PETICIÓN LOGIN RECIBIDA ===');
  console.log('📦 Body recibido:', req.body);
  
  try {
    const { username, password } = req.body;
    
    console.log('🔍 Usuario:', username);
    console.log('🔍 Password length:', password?.length);

    if (!username || !password) {
      console.log('❌ Credenciales incompletas');
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }

    console.log('🔍 Iniciando validación...');
    const user = await loginUser(username, password);
    
    if (!user) {
      console.log('❌ Validación fallida');
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    console.log('✅ Usuario validado:', user);
    
    // Normalizar rol
    const normalizedUser = {
      ...user,
      rol: user.rol ? user.rol.toLowerCase().trim() : 'user'
    };

    console.log('🔐 Generando token...');
    console.log('🔐 JWT_SECRET definido?', !!process.env.JWT_SECRET);
    
    const token = jwt.sign(
      {
        id: normalizedUser.id,
        username: normalizedUser.username,
        rol: normalizedUser.rol
      },
      process.env.JWT_SECRET || 'fallback_secret_123',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    console.log('✅ Token generado');
    console.log('📤 Enviando respuesta...');

    res.json({
      success: true,
      token,
      user: normalizedUser,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('🔥 ERROR EN CONTROLADOR:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};