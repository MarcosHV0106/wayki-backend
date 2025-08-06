const { Venta } = require('../models');
const { Op } = require('sequelize');


// ✅ Crear una nueva venta
const registrarVenta = async (req, res) => {
  try {
    const { monto, fecha, platos } = req.body;

    if (!monto || !fecha || !platos) {
    return res.status(400).json({ message: 'Monto, fecha y platos son obligatorios' });
    }

    const nuevaVenta = await Venta.create({
    monto,
    fecha,
    platos // se guarda como JSON directamente
    });


    return res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error("❌ Error al registrar venta:", error);
    return res.status(500).json({ message: "Error al registrar venta" });
  }
};

// ✅ Obtener todas las ventas (opcional, útil para admin)
const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll({ order: [['fecha', 'DESC']] });
    return res.json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas:", error);
    return res.status(500).json({ message: "Error al obtener ventas" });
  }
};

// ✅ Obtener ventas del día
const obtenerVentasDelDia = async (req, res) => {
  try {
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);

    const totalVentas = await Venta.sum('monto', {
      where: {
        createdAt: {
          [Op.between]: [inicioDelDia, finDelDia],
        },
      },
    });

    res.json({ total: totalVentas || 0 });
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

const obtenerVentasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;

    // Convertir fecha base (YYYY-MM-DD) en formato hora local de Perú
    const inicioLima = new Date(`${fecha}T00:00:00-05:00`);
    const finLima = new Date(`${fecha}T23:59:59.999-05:00`);

    const ventas = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioLima, finLima]
        }
      }
    });

    const total = ventas.reduce((acc, venta) => acc + venta.monto, 0);

    res.json({ total });
  } catch (error) {
    console.error("❌ Error al obtener ventas por fecha:", error);
    res.status(500).json({ message: "Error al obtener ventas por fecha" });
  }
};

module.exports = {
  registrarVenta,
  obtenerVentas,
  obtenerVentasDelDia,
  obtenerVentasPorFecha
};
