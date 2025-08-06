// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // 👈 necesario para usar socket.io
const { Server } = require('socket.io'); // 👈 importamos socket.io


dotenv.config();
const app = express();
const server = http.createServer(app); // 👈 creamos servidor HTTP
const io = new Server(server, {
  cors: {
    origin: '*', // Puedes limitarlo a tu frontend (ej: http://localhost:5173)
  }
});
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// DB y modelos
const { sequelize } = require('./models');
const { Venta } = require('./models'); // 👈 Asegúrate que esto esté justo después de importar sequelize

// Rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const mesaRoutes = require('./routes/mesaRoutes');
const platoRoutes = require('./routes/platoRoutes');
const comandaRoutes = require('./routes/comandaRoutes');
const authRoutes = require('./routes/authRoutes');
const mesaFamiliarRoutes = require('./routes/mesaFamiliarRoutes');
const ventaRoutes = require('./routes/ventaRoutes'); // 👈 importar rutas
const impresionRoutes = require('./routes/impresionRoutes');
const boletaRoutes = require('./routes/boletaRoutes'); // 👈 importar rutas de boleta

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/platos', platoRoutes);
app.use('/api/comandas', comandaRoutes);
app.use('/api/mesas-familiares', mesaFamiliarRoutes);
app.use('/api/usuarios', authRoutes);
app.use('/api/ventas', ventaRoutes); // 👈 usar rutas de ventas
app.use('/api/impresion', impresionRoutes);
app.use('/api/boleta', boletaRoutes); // 👈 usar rutas de boleta
// Ruta principal
app.get('/', (_req, res) => {
  res.send('✅ API de Comandas funcionando desde PROYECTO WAYKI');
});

// Middlewares de error
const notFoundHandler = require('./middlewares/notFoundHandler');
const errorHandler = require('./middlewares/errorHandler');
app.use(notFoundHandler);
app.use(errorHandler);

// 🔌 Conexión WebSocket
io.on("connection", (socket) => {
  console.log("🟢 Usuario conectado vía WebSocket:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Usuario desconectado:", socket.id);
  });

  socket.on("nueva-comanda", (data) => {
    io.emit("cocina-nueva-comanda", data); // Cocina escucha esto
  });

  socket.on("venta-confirmada", async (venta) => {
    try {
      // Guardar en base de datos
      const nuevaVenta = await Venta.create({
        monto: venta.monto,
        fecha: venta.fecha,
        platos: venta.platos // debe ser array JSON, Sequelize lo acepta
      });

      console.log("💾 Venta registrada:", nuevaVenta.toJSON());

      // Emitir al panel admin
      io.emit("admin-nueva-venta", nuevaVenta);

    } catch (error) {
      console.error("❌ Error al guardar venta desde WebSocket:", error);
    }
  });
});

// Guardar instancia de io para usar en controladores si quieres
app.set("io", io);

// 🔄 Sincronizar base de datos y levantar servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('🟢 Base de datos sincronizada correctamente');
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor activo en http://0.0.0.0:${PORT}`);
  });
});
