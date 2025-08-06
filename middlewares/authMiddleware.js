// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'clave_secreta_wayki_2023';

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Espera formato "Bearer <token>"

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.usuario = decoded; // Ahora req.usuario tiene el ID y rol del usuario
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
};

module.exports = verificarToken;
