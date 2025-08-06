const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Mesa = require('./Mesa');
const MesaFamiliar = require('./MesaFamiliar');

const MesaFamiliarMesa = sequelize.define('MesaFamiliarMesa', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mesaId: {
    type: DataTypes.INTEGER,
    references: {
      model: Mesa,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  mesaFamiliarId: {
    type: DataTypes.INTEGER,
    references: {
      model: MesaFamiliar,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'mesa_familiar_mesa', // Opcionalmente especificar nombre tabla real
  freezeTableName: true
});

Mesa.belongsToMany(MesaFamiliar, {
  through: MesaFamiliarMesa,
  foreignKey: 'mesaId',
  otherKey: 'mesaFamiliarId'
});

MesaFamiliar.belongsToMany(Mesa, {
  through: MesaFamiliarMesa,
  foreignKey: 'mesaFamiliarId',
  otherKey: 'mesaId'
});

module.exports = MesaFamiliarMesa;
