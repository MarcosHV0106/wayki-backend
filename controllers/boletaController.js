const imprimirBoleta = require("../utils/imprimirBoleta");
const { Mesa, MesaFamiliar, Comanda, ComandaItem, Plato, Usuario } = require("../models");


const imprimirBoletaPorId = async (req, res) => {
  try {
    const { comandaId } = req.params;

    const comanda = await Comanda.findByPk(comandaId, {
      include: [
        { model: ComandaItem, as: "items", include: [{ model: Plato, as: "plato" }] },
        { model: Usuario, as: "usuario" },
        { model: Mesa, as: "mesa" },
        { model: MesaFamiliar, as: "mesaFamiliar" },
      ],
    });

    if (!comanda) return res.status(404).json({ error: "Comanda no encontrada" });

    const data = {
      restaurante: "WAYKI RESTAURANT",
      mesa: comanda.mesa?.numero || `Familiar #${comanda.mesaFamiliarId}`,
      mesero: comanda.usuario?.nombre || "Desconocido",
      fecha: new Date(comanda.createdAt).toLocaleString("es-PE"),
      platos: comanda.items.map(item => ({
        cantidad: item.cantidad,
        nombre: item.plato.nombre,
        precioUnitario: parseFloat(item.precioUnitario),
        observacion: item.notas || "",
        categoria: item.plato.categoria, // <-- ¡LÍNEA CLAVE AÑADIDA!

      })),
      total: parseFloat(comanda.total),
      notaFinal: "¡Gracias por su visita!",
    };

    imprimirBoleta(data);
    return res.json({ ok: true, message: "Boleta enviada a impresión" });

  } catch (error) {
    console.error("❌ Error al imprimir boleta:", error);
    return res.status(500).json({ error: "Error interno al imprimir boleta" });
  }
};

module.exports = { imprimirBoletaPorId };
