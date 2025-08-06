// controllers/mesaController.js
const { Mesa, MesaFamiliar } = require('../models');

// GET: Obtener todas las mesas
const obtenerMesas = async (_req, res) => {
  try {
    const mesas = await Mesa.findAll();
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las mesas' });
  }
};

// POST: Crear nueva mesa
const crearMesa = async (req, res) => {
  const { numero, estado } = req.body;
  try {
    const nuevaMesa = await Mesa.create({ numero, estado });
    res.status(201).json(nuevaMesa);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear la mesa' });
  }
};

// PUT: Actualizar mesa
const actualizarMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    await mesa.update(req.body);
    res.json(mesa);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la mesa' });
  }
};

// DELETE: Eliminar mesa
const eliminarMesa = async (req, res) => {
  const { id } = req.params;
  try {
    const mesa = await Mesa.findByPk(id);
    if (!mesa) {
      return res.status(404).json({ error: 'Mesa no encontrada' });
    }
    await mesa.destroy();
    res.json({ mensaje: 'Mesa eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar la mesa' });
  }
};

// En mesa.controller.js
const obtenerMesaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const mesa = await Mesa.findByPk(id, {
      include: {
        model: MesaFamiliar,
        as: 'familias',
        include: ['mesas']
      }
    });

    if (!mesa) {
      return res.status(404).json({ success: false, message: 'Mesa no encontrada' });
    }

    // Detectar si pertenece a una Mesa Familiar
    const esFamiliar = mesa.familias && mesa.familias.length > 0;
    const mesaFamiliar = esFamiliar ? mesa.familias[0] : null;

    // Enviar respuesta completa
    res.json({
      ...mesa.toJSON(),
      esFamiliar,
      mesaFamiliarId: mesaFamiliar?.id || null,
      mesaFamiliar: mesaFamiliar || null
    });
  } catch (error) {
    console.error("Error al obtener mesa:", error);
    res.status(500).json({ success: false, message: 'Error al obtener la mesa', error });
  }
};


module.exports = {
  obtenerMesas,
  crearMesa,
  actualizarMesa,
  eliminarMesa, 
  obtenerMesaPorId
};
