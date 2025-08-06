// backend/middlewares/validacionesMesa.js
const { body, validationResult } = require('express-validator');

const validarMesaCreacion = [
  body('numero')
    .isInt({ min: 1 }).withMessage('El número de mesa debe ser un entero positivo'),
  body('estado')
    .isIn(['Disponible', 'Preparando', 'Ocupada']).withMessage('Estado inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

const validarMesaActualizacion = [
  body('numero').optional().isInt({ min: 1 }).withMessage('El número de mesa debe ser un entero positivo'),
  body('estado').optional().isIn(['Disponible', 'Preparando', 'Ocupada']).withMessage('Estado inválido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errores: errors.array() });
    }
    next();
  }
];

module.exports = {
  validarMesaCreacion,
  validarMesaActualizacion,
};
