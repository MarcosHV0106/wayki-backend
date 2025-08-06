const { Comanda, ComandaItem, Usuario, Mesa, Plato, MesaFamiliar } = require('../models');
const { Op } = require('sequelize'); // Asegúrate de importar Op

const PRECIO_MENU = 14.00;

const obtenerComandas = async (_req, res) => {
  try {
    const comandas = await Comanda.findAll({
      include: [
        { model: Mesa, as: 'mesa' },
        { model: Usuario, as: 'usuario' },
        {
          model: ComandaItem,
          as: 'items',
          include: [{ model: Plato, as: 'plato' }]
        }
      ]
    });
    res.status(200).json(comandas);
  } catch (error) {
    console.error("Error al obtener comandas:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const calcularItemsConPrecio = async (items) => {
  const platosConDatos = await Promise.all(items.map(async (item) => {
    const plato = await Plato.findByPk(item.platoId);
    if (!plato) throw new Error(`Plato con id ${item.platoId} no encontrado`);
    return {
      ...item,
      categoria: plato.categoria,
      precioReal: parseFloat(plato.precio),
      plato
    };
  }));

  const entradas = platosConDatos.filter(p => p.categoria === 'Entrada');
  const segundos = platosConDatos.filter(p => p.categoria === 'Segundo');
  const cantidadMenus = Math.min(entradas.length, segundos.length);

  const usadosEnMenu = new Set();
  for (let i = 0; i < cantidadMenus; i++) {
    usadosEnMenu.add(entradas[i].platoId);
    usadosEnMenu.add(segundos[i].platoId);
  }

  let total = 0;

  const itemsFinales = platosConDatos.map(item => {
    const enMenu = usadosEnMenu.has(item.platoId);
    const precioUnitario = enMenu ? (PRECIO_MENU / 2) : item.precioReal;
    const subtotal = precioUnitario * item.cantidad;
    total += subtotal;

    return {
      ...item,
      precioUnitario,
      subtotal
    };
  });

  return { itemsConPrecio: itemsFinales, total };
};

const crearComanda = async (req, res) => {
  const { usuarioId, mesaId, mesaFamiliarId, tipo, items } = req.body;

  try {
    if (!usuarioId || (!mesaId && !mesaFamiliarId)) {
      return res.status(400).json({ error: 'usuarioId y mesaId o mesaFamiliarId son obligatorios' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Se requiere al menos un ítem válido' });
    }

    for (const item of items) {
      if (!item.platoId || typeof item.cantidad !== 'number' || item.cantidad <= 0) {
        return res.status(400).json({ error: 'Cada ítem debe tener un platoId válido y cantidad > 0' });
      }
    }

    const { itemsConPrecio, total } = await calcularItemsConPrecio(items);

    // Crear comanda con mesa o mesaFamiliar según el tipo
    const comanda = await Comanda.create({
      usuarioId,
      total,
      mesaId: tipo === 'familiar' ? null : mesaId,
      mesaFamiliarId: tipo === 'familiar' ? mesaFamiliarId : null
    });

    // Insertar ítems
    for (const item of itemsConPrecio) {
      await ComandaItem.create({
        comandaId: comanda.id,
        platoId: item.platoId,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        notas: item.notas || null
      });
    }

    // Cambiar estado de la mesa correspondiente
    if (tipo === 'familiar' && mesaFamiliarId) {
      await MesaFamiliar.update(
        { estado: 'Preparando' },
        { where: { id: mesaFamiliarId } }
      );
    } else if (mesaId) {
      await Mesa.update({ estado: 'Preparando' }, { where: { id: mesaId } });
    }

    // Cargar comanda completa con asociaciones
    const comandaCompleta = await Comanda.findByPk(comanda.id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Mesa, as: 'mesa' },
        { model: MesaFamiliar, as: 'mesaFamiliar' },
        {
          model: ComandaItem,
          as: 'items',
          include: [{ model: Plato, as: 'plato' }]
        }
      ]
    });

    res.status(201).json({ ok: true, comanda: comandaCompleta });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error al crear la comanda: ' + error.message });
  }
};


const actualizarComanda = async (req, res) => {
  const { id } = req.params;
  const { estado, items } = req.body;

  try {
    const comanda = await Comanda.findByPk(id);
    if (!comanda) return res.status(404).json({ error: 'Comanda no encontrada' });

    if (estado) comanda.estado = estado;

    if (items && Array.isArray(items)) {
      await ComandaItem.destroy({ where: { comandaId: comanda.id } });

      const { itemsConPrecio, total } = await calcularItemsConPrecio(items);

      for (const item of itemsConPrecio) {
        await ComandaItem.create({
          comandaId: comanda.id,
          platoId: item.platoId,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          notas: item.notas || null
        });
      }

      comanda.total = total;
    }

    await comanda.save();

    const comandaActualizada = await Comanda.findByPk(id, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Mesa, as: 'mesa' },
        {
          model: ComandaItem,
          as: 'items',
          include: [{ model: Plato, as: 'plato' }]
        }
      ]
    });

    res.json(comandaActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar comanda: ' + error.message });
  }
};

const eliminarComanda = async (req, res) => {
  const { id } = req.params;
  try {
    const comanda = await Comanda.findByPk(id);
    if (!comanda) return res.status(404).json({ error: 'Comanda no encontrada' });

    await ComandaItem.destroy({ where: { comandaId: id } });
    await comanda.destroy();

    res.json({ mensaje: 'Comanda eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la comanda' });
  }
};

const obtenerComandaPorMesa = async (req, res) => {
  const { idMesa, tipo } = req.params;

  try {
    const whereCondition = tipo === 'familiar'
      ? { mesaFamiliarId: idMesa }
      : { mesaId: idMesa };

    const includeMesa = tipo === 'familiar'
      ? {
          model: MesaFamiliar,
          as: 'mesaFamiliar',
          where: {
            [Op.or]: [{ estado: "Preparando" }, { estado: "Ocupada" }]
          }
        }
      : {
          model: Mesa,
          as: 'mesa',
          where: {
            [Op.or]: [{ estado: "Preparando" }, { estado: "Ocupada" }]
          }
        };

    const comanda = await Comanda.findOne({
      where: whereCondition,
      include: [
        includeMesa,
        {
          model: ComandaItem,
          as: "items",
          include: [{ model: Plato, as: "plato" }]
        }
      ]
    });

    if (!comanda) {
      return res.status(404).json({ mensaje: "No se encontró comanda activa para esta mesa" });
    }

    res.json(comanda);
  } catch (error) {
    console.error("Error al buscar comanda por mesa:", error);
    res.status(500).json({ mensaje: "Error del servidor" });
  }
};

// controllers/comandaController.js
const obtenerComandaPorMesaFamiliar = async (req, res) => {
  const { mesaFamiliarId } = req.params;

  try {
    const comanda = await Comanda.findOne({
      where: { mesaFamiliarId },
      include: [
        {
          model: ComandaItem,
          as: 'items',
          include: {
            model: Plato,
            as: 'plato'
          }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!comanda) {
      return res.status(404).json({ error: 'Comanda no encontrada para esta mesa familiar' });
    }

    res.json(comanda);
  } catch (error) {
    console.error('Error al obtener comanda por mesa familiar:', error);
    res.status(500).json({ error: 'Error al obtener la comanda' });
  }
};

module.exports = {
  obtenerComandas,
  crearComanda,
  actualizarComanda,
  eliminarComanda,
  obtenerComandaPorMesa, 
  obtenerComandaPorMesaFamiliar
};
