const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

