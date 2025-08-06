const imprimirComanda = require("../utils/imprimirComanda");
const { Comanda, ComandaItem, Plato, Usuario } = require("../models");

const imprimirComandaPorId = async (req, res) => {
  try {
    const { comandaId } = req.params;

    const comanda = await Comanda.findByPk(comandaId, {
      include: [
        { model: ComandaItem, as: "items", include: [{ model: Plato, as: "plato" }] },
        { model: Usuario, as: "usuario" },
      ],
    });

    if (!comanda) return res.status(404).json({ error: "Comanda no encontrada" });

    const data = {
      restaurante: "WAYKI RESTAURANT",
      mesa: comanda.mesaId || `Familiar #${comanda.mesaFamiliarId}`,
      mesero: comanda.usuario?.nombre || "Desconocido",
      fecha: new Date(comanda.createdAt).toLocaleString("es-PE"),
      platos: comanda.items.map(item => ({
        cantidad: item.cantidad,
        nombre: item.plato.nombre,
        observacion: item.notas || "",
      })),
      notaFinal: "¡Gracias por tu pedido!",
    };

    imprimirComanda(data);
    return res.json({ ok: true, message: "Comanda enviada a impresión" });

  } catch (err) {
    console.error("❌ Error al imprimir:", err);
    return res.status(500).json({ error: "Error interno al imprimir" });
  }
};
module.exports = { imprimirComandaPorId };
