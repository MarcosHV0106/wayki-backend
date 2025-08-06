const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true
},

  rol: {
    type: DataTypes.STRING, // 'mesero', 'cocina', 'admin'
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Hashear contraseña antes de crear
Usuario.beforeCreate(async (usuario) => {
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(usuario.password, salt);
});

module.exports = Usuario;
