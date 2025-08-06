// backend/controllers/platoController.js
const { Plato } = require('../models');

// Obtener todos los platos
const obtenerPlatos = async (req, res) => {
  try {
    const platos = await Plato.findAll();
    res.json(platos);
  } catch (error) {
    console.error('❌ Error al obtener platos:', error);
    res.status(500).json({ error: 'Error al obtener platos' });
  }
};

// Crear un nuevo plato
const crearPlato = async (req, res) => {
  const { nombre, categoria, precio, disponible } = req.body;
  try {
    const nuevoPlato = await Plato.create({ nombre, categoria, precio, disponible });
    res.status(201).json(nuevoPlato);
  } catch (error) {
    console.error('❌ Error al crear plato:', error);
    res.status(400).json({ error: 'Error al crear plato', detalles: error.message });
  }
};

// Actualizar un plato
const actualizarPlato = async (req, res) => {
  const { id } = req.params;
  try {
    const plato = await Plato.findByPk(id);
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    await plato.update(req.body);
    res.json(plato);
  } catch (error) {
    console.error('❌ Error al actualizar plato:', error);
    res.status(400).json({ error: 'Error al actualizar plato', detalles: error.message });
  }
};

// Eliminar un plato
const eliminarPlato = async (req, res) => {
  const { id } = req.params;
  try {
    const plato = await Plato.findByPk(id);
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    await plato.destroy();
    res.json({ mensaje: 'Plato eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar plato:', error);
    res.status(400).json({ error: 'Error al eliminar plato', detalles: error.message });
  }
};

module.exports = {
  obtenerPlatos,
  crearPlato,
  actualizarPlato,
  eliminarPlato,
};

