const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validarUsuarioCreacion, validarUsuarioActualizacion, validarLogin } = require('../middlewares/validacionesUsuario');
const verificarToken = require('../middlewares/authMiddleware'); // 🔐 Nuevo
const autorizarPorRol = require('../middlewares/autorizarPorRol');


// 🔓 Rutas públicas
router.post('/registrar', validarUsuarioCreacion, usuarioController.registrarUsuario);
router.post('/login', usuarioController.loginUsuario);

// 🔐 Rutas protegidas solo para Administradores
router.get('/', verificarToken, autorizarPorRol('Administradora', 'Programador'), usuarioController.obtenerUsuarios);
router.post('/', verificarToken, autorizarPorRol('Administradora', 'Programador'), validarUsuarioCreacion, usuarioController.crearUsuario);
router.put('/:id', verificarToken, autorizarPorRol('Administradora', 'Programador'), validarUsuarioActualizacion, usuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, autorizarPorRol('Administradora', 'Programador'), usuarioController.eliminarUsuario);


// 🔐 Rutas protegidas con JWT
router.get('/', verificarToken, usuarioController.obtenerUsuarios);
router.post('/', verificarToken, validarUsuarioCreacion, usuarioController.crearUsuario);
router.put('/:id', verificarToken, validarUsuarioActualizacion, usuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, usuarioController.eliminarUsuario);
// Ejemplo de ruta solo para Admin
router.get('/admin-only', verificarToken, autorizarPorRol('Admin'), (req, res) => {
  res.json({ message: 'Bienvenido, Admin' });
});

module.exports = router;
