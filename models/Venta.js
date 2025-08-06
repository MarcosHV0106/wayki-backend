const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venta = sequelize.define('Venta', {
  monto: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  platos: {
    type: DataTypes.JSON, // array de objetos con nombre, categoría y cantidad
    allowNull: false,
  }
});

module.exports = Venta;
