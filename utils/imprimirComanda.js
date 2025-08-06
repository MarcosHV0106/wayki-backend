const { SerialPort } = require("serialport");
const iconv = require("iconv-lite"); // 👈 Nuevo

const imprimirComanda = (comanda) => {
  try {
    const port = new SerialPort({
      path: 'COM6',
      baudRate: 9600,
      autoOpen: false,
    });

    port.open((err) => {
      if (err) {
        console.error("Error: No se pudo abrir el puerto:", err.message);
        return;
      }

      console.log("Conectado a la impresora...");

      const encabezado = `
============================
       ${comanda.restaurante}
============================

${comanda.fecha}
Mesa: ${comanda.mesa}
Mesero: ${comanda.mesero}

------ PEDIDO -------
`;

      const cuerpo = comanda.platos
        .map(p =>
          `${p.cantidad}x ${p.nombre}\n${p.observacion ? `   -> ${p.observacion}` : ""}`
        )
        .join("\n");

      const pie = `
----------------------------

${comanda.notaFinal}

\n\n\n\n\n`;

      const comandaCompleta = encabezado + cuerpo + pie;

      // 🧠 Codificamos en CP437 (o ISO-8859-1 si prefieres)
      const buffer = iconv.encode(comandaCompleta, 'CP437');

      port.write(buffer, (err) => {
        if (err) {
          console.error("Error al enviar datos:", err.message);
        } else {
          console.log("Comanda enviada con éxito");
        }

        port.close((closeErr) => {
          if (closeErr) {
            console.error("Error al cerrar el puerto:", closeErr.message);
          } else {
            console.log("Puerto cerrado correctamente");
          }
        });
      });
    });

    port.on("error", (error) => {
      console.error("Error de conexion con la impresora:", error.message);
    });

  } catch (e) {
    console.error("Excepcion no controlada:", e.message);
  }
};

module.exports = imprimirComanda;
