const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MesaFamiliar = sequelize.define('MesaFamiliar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
    estado: {
    type: DataTypes.STRING,
    defaultValue: 'Disponible'
    }
}, {
  tableName: 'mesa_familiar', // ✅ nombre exacto de la tabla en PostgreSQL
  freezeTableName: true
});

module.exports = MesaFamiliar;
