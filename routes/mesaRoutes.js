// routes/mesaRoutes.js
const express = require('express');
const router = express.Router();
const mesaController = require('../controllers/mesaController');
const verificarToken = require('../middlewares/authMiddleware');
const autorizarPorRol = require('../middlewares/autorizarPorRol');
const { validarMesaCreacion, validarMesaActualizacion } = require('../middlewares/validacionesMesa');

// 👀 Ver mesas (Admin o Mesero)
router.get('/', verificarToken, autorizarPorRol('Mesero', 'Administradora'), mesaController.obtenerMesas);



// ➕ Crear mesa (solo Admin)
router.post(
  '/',
  verificarToken,
  autorizarPorRol('Administradora'),
  validarMesaCreacion,
  mesaController.crearMesa
);

// ✏️ Actualizar mesa (solo Admin)
router.put(
  '/:id',
  verificarToken,
  autorizarPorRol('Mesero', 'Administradora'),
  validarMesaActualizacion,
  mesaController.actualizarMesa
);

// ❌ Eliminar mesa (solo Admin)
router.delete(
  '/:id',
  verificarToken,
  autorizarPorRol('Administradora'),
  mesaController.eliminarMesa
);

router.get('/:id', verificarToken, autorizarPorRol('Mesero', 'Administradora'), mesaController.obtenerMesaPorId);



module.exports = router;
