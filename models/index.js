// backend/models/index.js
const sequelize = require('../config/database');

const Usuario = require('./Usuario');
const Mesa = require('./Mesa');
const Plato = require('./Plato');
const Comanda = require('./Comanda');
const ComandaItem = require('./ComandaItem');
const MesaFamiliar = require('./MesaFamiliar');
const MesaFamiliarMesa = require('./MesaFamiliarMesa'); // Relación intermedia
const Venta = require('./Venta'); // ✅ NUEVO



// Relaciones

// Usuario -> Comanda
Usuario.hasMany(Comanda, { foreignKey: 'usuarioId' });
Comanda.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Mesa -> Comanda
Mesa.hasMany(Comanda, { foreignKey: 'mesaId' });
Comanda.belongsTo(Mesa, { foreignKey: 'mesaId', as: 'mesa' });

// MesaFamiliar -> Comanda
MesaFamiliar.hasMany(Comanda, { foreignKey: 'mesaFamiliarId' });
Comanda.belongsTo(MesaFamiliar, { foreignKey: 'mesaFamiliarId', as: 'mesaFamiliar' });

// Comanda -> ComandaItem
Comanda.hasMany(ComandaItem, {
  as: 'items',
  foreignKey: 'comandaId',
  onDelete: 'CASCADE'
});
ComandaItem.belongsTo(Comanda, {
  foreignKey: 'comandaId',
  as: 'comanda'
});

// Plato -> ComandaItem
Plato.hasMany(ComandaItem, { foreignKey: 'platoId' });
ComandaItem.belongsTo(Plato, { foreignKey: 'platoId', as: 'plato' });

// MesaFamiliar <-> Mesa (relación muchos a muchos)
Mesa.belongsToMany(MesaFamiliar, {
  through: MesaFamiliarMesa,
  foreignKey: 'mesaId',
  otherKey: 'mesaFamiliarId',
  as: 'familias'
});

MesaFamiliar.belongsToMany(Mesa, {
  through: MesaFamiliarMesa,
  foreignKey: 'mesaFamiliarId',
  otherKey: 'mesaId',
  as: 'mesas'
});

module.exports = {
  sequelize,
  Usuario,
  Mesa,
  Plato,
  Comanda,
  ComandaItem,
  MesaFamiliar,
  MesaFamiliarMesa,
  Venta
};
