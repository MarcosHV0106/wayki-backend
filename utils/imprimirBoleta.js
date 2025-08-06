const { SerialPort } = require("serialport");
const iconv = require("iconv-lite");

const imprimirBoleta = (data) => {
  const port = new SerialPort({
    path: 'COM6',
    baudRate: 9600,
    autoOpen: false,
  });

  port.open((err) => {
    if (err) {
      return console.error("Error: No se pudo abrir el puerto:", err.message);
    }
    console.log("Conectado a la impresora...");

    const platosAProcesar = [...data.platos];
    const platosFinales = [];

    while (platosAProcesar.length > 0) {
    const entradaIndex = platosAProcesar.findIndex(p => p.categoria?.toLowerCase() === 'entrada');
    if (entradaIndex > -1) {
    const platoEntrada = platosAProcesar.splice(entradaIndex, 1)[0];

    const ejecutivoIndex = platosAProcesar.findIndex(p => p.categoria?.toLowerCase() === 'ejecutivo');
    const segundoIndex = platosAProcesar.findIndex(p => p.categoria?.toLowerCase() === 'segundo');

    if (ejecutivoIndex > -1) {
        platosAProcesar.splice(ejecutivoIndex, 1);
        platosFinales.push({ nombre: 'Menu E.', cantidad: 1, precioUnitario: 18.00 });
    } else if (segundoIndex > -1) {
        platosAProcesar.splice(segundoIndex, 1);
        platosFinales.push({ nombre: 'Menu C.', cantidad: 1, precioUnitario: 14.00 });
    } else {
        platosFinales.push(platoEntrada);
    }
    } else {
        // Lo que queda ya no tiene entrada para agrupar
        platosFinales.push(...platosAProcesar);
        platosAProcesar.length = 0;
    }
    }


    // Ajuste para 56mm (hasta ~32-36 caracteres por linea)
    const COL_PLATO = 12;
    const COL_CANT = 4;
    const COL_PU = 6;
    const COL_SUBT = 7;

    const encabezado = 
` RESTAURANTE WAYKI
 RUC: 12345678901
 Jr. Camana 791
 Tel: 01-1234567
------------------------------
Mesa: ${data.mesa}  Fecha: ${data.fecha}
------------------------------
${'Plato'.padEnd(COL_PLATO)}${'C'.padEnd(COL_CANT)}${'P/U'.padEnd(COL_PU)}${'Total'.padEnd(COL_SUBT)}
------------------------------\n`;

    const cuerpo = platosFinales.map(p => {
      const nombre = p.nombre.length > COL_PLATO ? p.nombre.slice(0, COL_PLATO - 1) + '.' : p.nombre;
      const cantidad = p.cantidad.toString();
      const precioU = `S/${p.precioUnitario.toFixed(2)}`;
      const subtotal = `S/${(p.cantidad * p.precioUnitario).toFixed(2)}`;

      return `${nombre.padEnd(COL_PLATO)}${cantidad.padEnd(COL_CANT)}${precioU.padEnd(COL_PU)}${subtotal.padEnd(COL_SUBT)}`;
    }).join('\n');

    const totalCalculado = platosFinales.reduce((acc, p) => acc + (p.precioUnitario * p.cantidad), 0);
    const totalFormateado = `S/${totalCalculado.toFixed(2)}`;
    const pie = `\n------------------------------
TOTAL:               ${totalFormateado}

Gracias por su preferencia
\n\n\n`;

    const textoFinal = encabezado + cuerpo + pie;

    const buffer = iconv.encode(textoFinal, 'CP437');

    port.write(buffer, (err) => {
      if (err) {
        console.error("Error al imprimir boleta:", err.message);
      } else {
        console.log("Boleta impresa con exito");
      }
      port.close();
    });
  });

  port.on("error", (err) => {
    console.error("Error de impresion:", err.message);
  });
};

module.exports = imprimirBoleta;
