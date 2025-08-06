const { MesaFamiliar, Mesa, MesaFamiliarMesa } = require('../models');

// Crear una Mesa Familiar
exports.crearMesaFamiliar = async (req, res) => {
  try {
    const { nombre, estado = 'Disponible', mesasIds = [] } = req.body;

    if (!nombre || !Array.isArray(mesasIds)) {
      return res.status(400).json({ mensaje: 'Nombre y arreglo de mesasIds son requeridos' });
    }

    const mesaFamiliar = await MesaFamiliar.create({ nombre, estado });

    // Asociar mesas si se proporcionan
    if (mesasIds.length > 0) {
      const relaciones = mesasIds.map(mesaId => ({
        mesaFamiliarId: mesaFamiliar.id,
        mesaId
      }));
      await MesaFamiliarMesa.bulkCreate(relaciones);
    }

    res.status(201).json({ mensaje: 'Mesa familiar creada correctamente', mesaFamiliar });
  } catch (error) {
    console.error('Error al crear mesa familiar:', error);
    res.status(500).json({ mensaje: 'Error al crear mesa familiar' });
  }
};

// Obtener todas las Mesas Familiares
exports.obtenerMesasFamiliares = async (req, res) => {
  try {
    const mesasFamiliares = await MesaFamiliar.findAll({
      include: {
        model: Mesa,
        as: 'mesas',
        through: { attributes: [] }
      }
    });

    res.json(mesasFamiliares);
  } catch (error) {
    console.error('Error al obtener mesas familiares:', error);
    res.status(500).json({ mensaje: 'Error al obtener mesas familiares' });
  }
};

// Obtener una Mesa Familiar por ID
exports.obtenerMesaFamiliarPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const mesaFamiliar = await MesaFamiliar.findByPk(id, {
      include: {
        model: Mesa,
        as: 'mesas',
        through: { attributes: [] }
      }
    });

    if (!mesaFamiliar) {
      return res.status(404).json({ mensaje: 'Mesa familiar no encontrada' });
    }

    res.json(mesaFamiliar);
  } catch (error) {
    console.error('Error al obtener mesa familiar:', error);
    res.status(500).json({ mensaje: 'Error al obtener mesa familiar' });
  }
};

// Actualizar una Mesa Familiar
exports.actualizarMesaFamiliar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, estado, mesasIds = [] } = req.body;

    const mesaFamiliar = await MesaFamiliar.findByPk(id);
    if (!mesaFamiliar) {
      return res.status(404).json({ mensaje: 'Mesa familiar no encontrada' });
    }

    // 1. Actualiza la mesa familiar
    await mesaFamiliar.update({ nombre, estado });

    if (Array.isArray(mesasIds)) {
      // 2. Elimina relaciones previas
      await MesaFamiliarMesa.destroy({ where: { mesaFamiliarId: id } });

      // 3. Crea nuevas relaciones
      const relaciones = mesasIds.map(mesaId => ({
        mesaFamiliarId: id,
        mesaId
      }));
      await MesaFamiliarMesa.bulkCreate(relaciones);

      // 4. También actualiza el estado de todas las mesas hijas (mesa)
      await Mesa.update(
        { estado }, // nuevo estado
        { where: { id: mesasIds } } // aplica a todas las mesas asociadas
      );
    }

    res.json({ mensaje: 'Mesa familiar actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar mesa familiar:', error);
    res.status(500).json({ mensaje: 'Error al actualizar mesa familiar' });
  }
};


// Eliminar una Mesa Familiar
exports.eliminarMesaFamiliar = async (req, res) => {
  try {
    const { id } = req.params;

    const mesaFamiliar = await MesaFamiliar.findByPk(id);
    if (!mesaFamiliar) {
      return res.status(404).json({ mensaje: 'Mesa familiar no encontrada' });
    }

    await mesaFamiliar.destroy(); // Elimina con CASCADE si está definido

    res.json({ mensaje: 'Mesa familiar eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar mesa familiar:', error);
    res.status(500).json({ mensaje: 'Error al eliminar mesa familiar' });
  }
};
