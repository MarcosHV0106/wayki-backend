const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ComandaItem = sequelize.define('ComandaItem', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notas: {
    type: DataTypes.STRING,
    allowNull: true
  },
  precioUnitario: {
  type: DataTypes.DECIMAL(10, 2),
  allowNull: false
  }
});

// Asociaciones
ComandaItem.associate = (models) => {
  ComandaItem.belongsTo(models.Comanda, {
    foreignKey: 'comandaId'
  });

  ComandaItem.belongsTo(models.Plato, {
    foreignKey: 'platoId',
    as: 'plato'
  });
};

module.exports = ComandaItem;
