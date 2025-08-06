const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Plato = sequelize.define('Plato', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING, allowNull: false },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Plato;
