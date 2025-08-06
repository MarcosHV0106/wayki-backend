const express = require('express');
const router = express.Router();

// 🔧 CORRECTO: importamos el objeto con destructuring
const { imprimirComandaPorId } = require('../controllers/impresionController');

router.post('/:comandaId', imprimirComandaPorId);

module.exports = router;
