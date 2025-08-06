const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mesa = sequelize.define('Mesa', {
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  estado: {
    type: DataTypes.STRING, // 'Disponible'
    defaultValue: 'Disponible'
  }
});

module.exports = Mesa;
