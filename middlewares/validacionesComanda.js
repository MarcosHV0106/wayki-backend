// backend/middlewares/validacionesComanda.js
const { body, validationResult } = require('express-validator');

const validarCrearComanda = [
  body('usuarioId')
    .isInt({ min: 1 }).withMessage('usuarioId debe ser un entero positivo'),

  // ✅ Validar mesaId solo si tipo es 'normal'
  body('mesaId')
    .if(body('tipo').equals('normal'))
    .isInt({ min: 1 }).withMessage('mesaId debe ser un entero positivo'),

  // ✅ Validar mesaFamiliarId solo si tipo es 'familiar'
  body('mesaFamiliarId')
    .if(body('tipo').equals('familiar'))
    .isInt({ min: 1 }).withMessage('mesaFamiliarId debe ser un entero positivo'),

  body('items')
    .isArray({ min: 1 }).withMessage('Se requiere al menos un ítem'),

  body('items.*.platoId')
    .isInt({ min: 1 }).withMessage('Cada ítem debe tener platoId entero positivo'),

  body('items.*.cantidad')
    .isInt({ min: 1 }).withMessage('Cada ítem debe tener cantidad mayor que 0'),

  body('items.*.notas')
    .optional()
    .isString().withMessage('Las notas deben ser texto'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarActualizarComanda = [
  body('estado')
    .optional()
    .isString().withMessage('El estado debe ser texto'),
  body('items')
    .optional()
    .isArray({ min: 1 }).withMessage('Si se envían ítems, debe ser un arreglo no vacío'),
  body('items.*.platoId')
    .optional()
    .isInt({ min: 1 }).withMessage('Cada ítem debe tener platoId entero positivo'),
  body('items.*.cantidad')
    .optional()
    .isInt({ min: 1 }).withMessage('Cada ítem debe tener cantidad mayor que 0'),
  body('items.*.notas')
    .optional()
    .isString().withMessage('Las notas deben ser texto'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = {
  validarCrearComanda,
  validarActualizarComanda,
};
