// repositories/auth.repository.js
const pool = require('../config/database')

class AuthRepository {
  static async findByUsername(username) {
    console.log(`🔍 [AuthRepository] Buscando usuario: ${username}`)
    
    try {
      const query = `SELECT * FROM fn_login_usuario($1)`
      const { rows } = await pool.query(query, [username])
      
      console.log(`✅ [AuthRepository] Resultados: ${rows.length} filas`)
      
      if (rows.length === 0) {
        return null
      }
      
      // Debug: mostrar qué campos se están obteniendo
      console.log('🔍 [AuthRepository] Campos obtenidos:', Object.keys(rows[0]))
      
      return rows[0]
    } catch (error) {
      console.error('🔥 [AuthRepository] Error en findByUsername:', error.message)
      throw error
    }
  }
  
  // Método adicional para actualizar password
  static async updatePassword(username, newHash) {
    const query = `
      UPDATE usuarios 
      SET password_hash = $1 
      WHERE username = $2
      RETURNING id, username
    `
    
    const { rows } = await pool.query(query, [newHash, username])
    return rows[0]
  }
}

module.exports = AuthRepository