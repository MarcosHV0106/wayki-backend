const express = require('express');
const router = express.Router();
const mesaFamiliarController = require('../controllers/mesaFamiliarController');

// Crear una mesa familiar a partir de varias mesas
router.post('/', mesaFamiliarController.crearMesaFamiliar);

// Obtener todas las mesas familiares
router.get('/', mesaFamiliarController.obtenerMesasFamiliares);

// Obtener una mesa familiar por ID
router.get('/:id', mesaFamiliarController.obtenerMesaFamiliarPorId);

// Actualizar una mesa familiar
router.put('/:id', mesaFamiliarController.actualizarMesaFamiliar);

// Eliminar una mesa familiar
router.delete('/:id', mesaFamiliarController.eliminarMesaFamiliar);

module.exports = router;
