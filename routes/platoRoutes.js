// backend/routes/platoRoutes.js
const express = require('express');
const router = express.Router();
const {
  obtenerPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato,
} = require('../controllers/platoController');

const verificarToken = require('../middlewares/authMiddleware');
const autorizarPorRol = require('../middlewares/autorizarPorRol');
const { validarPlatoCreacion, validarPlatoActualizacion } = require('../middlewares/validacionesPlato');

// 👀 Obtener platos (solo Admin)
router.get(
  '/',
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  obtenerPlatos
);

// ➕ Crear plato (solo Admin)
router.post(
  '/',
  verificarToken,
  autorizarPorRol('Administradora'),
  validarPlatoCreacion,
  crearPlato
);

// ✏️ Actualizar plato (solo Admin)
router.put(
  '/:id',
  verificarToken,
  autorizarPorRol('Administradora'),
  validarPlatoActualizacion,
  actualizarPlato
);

// ❌ Eliminar plato (solo Admin)
router.delete(
  '/:id',
  verificarToken,
  autorizarPorRol('Administradora'),
  eliminarPlato
);

module.exports = router;
