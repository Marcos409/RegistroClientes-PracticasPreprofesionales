// Validación de datos de cliente usando Joi
const Joi = require('joi');

const tipoClienteEnum = ['persona_natural', 'persona_juridica', 'empresa'];
const zonaEnum = ['norte', 'sur', 'este', 'oeste', 'centro'];
const estadoEnum = ['activo', 'inactivo', 'eliminado'];

const clienteSchema = Joi.object({
  id: Joi.number().integer().optional(),
  tipo_documento: Joi.string().valid('DNI', 'RUC', 'CE').required(),
  numero_documento: Joi.string().pattern(/^[0-9]{8,11}$/).required()
    .messages({
      'string.pattern.base': 'El documento debe tener entre 8 y 11 dígitos'
    }),
  razon_social: Joi.string().max(200).required(),
  nombre_comercial: Joi.string().max(200).allow('', null),
  telefono: Joi.string().pattern(/^[0-9]{9,15}$/).required(),
  email: Joi.string().email().allow('', null),
  direccion: Joi.string().max(255).allow('', null),
  zona: Joi.string().valid(...zonaEnum).allow(null),
  tipo_cliente: Joi.string().valid(...tipoClienteEnum).required(),
  preferencias: Joi.object({
    tipo_huevo: Joi.string().valid('blanco', 'rojo', 'mixto'),
    frecuencia_compra: Joi.string().valid('diario', 'semanal', 'quincenal', 'mensual'),
    horario_preferido: Joi.string().valid('mañana', 'tarde'),
    observaciones: Joi.string().max(500)
  }).allow(null),
  latitud: Joi.number().min(-90).max(90).allow(null),
  longitud: Joi.number().min(-180).max(180).allow(null),
  estado: Joi.string().valid(...estadoEnum).default('activo'),
  // ✅ CORREGIDO: cambiado de required() a optional()
  creado_por: Joi.number().integer().optional(),
  actualizado_por: Joi.number().integer().optional()
});

const validateCliente = (cliente) => {
  return clienteSchema.validate(cliente, { abortEarly: false });
};

module.exports = {
  validateCliente,
  tipoClienteEnum,
  zonaEnum,
  estadoEnum
};