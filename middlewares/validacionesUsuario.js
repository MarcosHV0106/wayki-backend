// backend/middlewares/validacionesUsuario.js
const { body, validationResult } = require('express-validator');

const validarUsuarioCreacion = [
  body('nombre')
    .isString().withMessage('El nombre es obligatorio y debe ser texto')
    .notEmpty().withMessage('El nombre no puede estar vacío'),
  body('rol')
    .isIn(['Programador', 'Mesero', 'Cocinero', 'Administradora']).withMessage('Rol inválido'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarUsuarioActualizacion = [
  body('nombre').optional().isString().withMessage('El nombre debe ser texto'),
  body('rol').optional().isIn(['Programador', 'Mesero', 'Cocinero', 'Administradora']).withMessage('Rol inválido'),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarLogin = [
  body('nombre')
    .isString().withMessage('El nombre es obligatorio')
    .notEmpty().withMessage('El nombre no puede estar vacío'),
  body('password')
    .isString().withMessage('La contraseña es obligatoria')
    .notEmpty().withMessage('La contraseña no puede estar vacía'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = {
  validarUsuarioCreacion,
  validarUsuarioActualizacion,
  validarLogin,
};
