const pool = require('../config/database')
const bcrypt = require('bcrypt')

class UsuariosModel {

  // 🔹 LISTAR USUARIOS (ADMIN)
  static async getAll() {
    const { rows } = await pool.query(`
      SELECT
        id,
        username,
        rol,
        nombre_completo,
        correo,
        telefono_movil,
        estado,
        created_at
      FROM usuarios
      ORDER BY id
    `)

    return rows
  }

  // 🔹 CREAR USUARIO (ADMIN)
  static async create({
    username,
    password,
    rol,
    nombre_completo,
    correo,
    telefono_movil
  }) {
    const passwordHash = await bcrypt.hash(password, 10)

    await pool.query(
      `
      INSERT INTO usuarios (
        username,
        password_hash,
        rol,
        nombre_completo,
        correo,
        telefono_movil
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        username,
        passwordHash,
        rol,
        nombre_completo,
        correo,
        telefono_movil
      ]
    )
  }

  // 🔹 EDITAR USUARIO
static async update(id, data) {
  const {
    username,
    rol,
    nombre_completo,
    correo,
    telefono_movil
  } = data

  await pool.query(
    `
    UPDATE usuarios
    SET
      username = $1,
      rol = $2,
      nombre_completo = $3,
      correo = $4,
      telefono_movil = $5
    WHERE id = $6
    `,
    [username, rol, nombre_completo, correo, telefono_movil, id]
  )
}

// 🔹 ACTIVAR / DESACTIVAR
static async toggleEstado(id) {
  await pool.query(
    `
    UPDATE usuarios
    SET estado = NOT estado
    WHERE id = $1
    `,
    [id]
  )
}

}

module.exports = UsuariosModel
