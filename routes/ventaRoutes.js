const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas, obtenerVentasDelDia, obtenerVentasPorFecha} = require('../controllers/ventaController');

// Registrar una nueva venta
router.post('/', registrarVenta);

// Obtener todas las ventas
router.get('/', obtenerVentas);

// Obtener ventas del día
router.get('/hoy', obtenerVentasDelDia);

router.get("/por-fecha/:fecha", obtenerVentasPorFecha);

module.exports = router;
