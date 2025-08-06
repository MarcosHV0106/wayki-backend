const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comanda = sequelize.define('Comanda', {
  estado: {
    type: DataTypes.STRING,
    defaultValue: 'preparando' //preparando, entregado
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mesaId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Cambiar de false a true
    references: {
      model: 'Mesas',
      key: 'id'
    }
  },
  mesaFamiliarId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'mesa_familiar',
      key: 'id'
    }
  },
    total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  }
});

// Asociaciones
Comanda.associate = (models) => {
  Comanda.belongsTo(models.Mesa, {
    foreignKey: 'mesaId',
    as: 'mesa'
  });

  Comanda.belongsTo(models.Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario'
  });

  // ✅ Relación correcta con ComandaItem
  Comanda.hasMany(models.ComandaItem, {
    foreignKey: 'comandaId',
    as: 'items',
    onDelete: 'CASCADE'
  });

  Comanda.belongsTo(models.MesaFamiliar, { foreignKey: 'mesaFamiliarId', as: 'mesaFamiliar' });


};

module.exports = Comanda;

