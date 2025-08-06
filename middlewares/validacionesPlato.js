// backend/middlewares/validacionesPlato.js
const { body, validationResult } = require('express-validator');

const validarPlatoCreacion = [
  body('nombre')
    .isString().withMessage('El nombre del plato es obligatorio y debe ser texto')
    .notEmpty().withMessage('El nombre no puede estar vacío'),
  body('categoria')
    .isString().withMessage('La categoría es obligatoria y debe ser texto')
    .notEmpty().withMessage('La categoría no puede estar vacía'),
  body('precio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0'),
  body('disponible')
    .optional()
    .isBoolean().withMessage('Disponible debe ser un valor booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarPlatoActualizacion = [
  body('nombre').optional().isString().withMessage('El nombre debe ser texto'),
  body('categoria').optional().isString().withMessage('La categoría debe ser texto'),
  body('precio').optional().isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0'),
  body('disponible').optional().isBoolean().withMessage('Disponible debe ser booleano'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = {
  validarPlatoCreacion,
  validarPlatoActualizacion,
};
