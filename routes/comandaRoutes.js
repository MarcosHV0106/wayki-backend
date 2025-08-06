// routes/comandaRoutes.js
const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const autorizarPorRol = require('../middlewares/autorizarPorRol');
const obtenerComandaPorMesa = require('../controllers/comandaController').obtenerComandaPorMesa;
const { obtenerComandaPorMesaFamiliar } = require('../controllers/comandaController');


const {
  obtenerComandas,
  crearComanda,
  actualizarComanda,
  eliminarComanda
} = require('../controllers/comandaController');

const { validarCrearComanda, validarActualizarComanda } = require('../middlewares/validacionesComanda');

// 🔐 Rutas protegidas por token y rol
router.get(
  '/',
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  obtenerComandas
);

router.post(
  '/',
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  validarCrearComanda,
  crearComanda
);

router.put(
  '/:id',
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  validarActualizarComanda,
  actualizarComanda
);

router.delete(
  '/:id',
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  eliminarComanda
);

router.get("/mesa/:idMesa", verificarToken, autorizarPorRol('Administradora', 'Mesero'), obtenerComandaPorMesa);

// Al final de tus rutas:
router.get(
  "/familiar/:mesaFamiliarId",
  verificarToken,
  autorizarPorRol('Administradora', 'Mesero'),
  obtenerComandaPorMesaFamiliar
);


module.exports = router;
