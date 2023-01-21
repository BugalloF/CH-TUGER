const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('room', {
    beds: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bathrooms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    has_fridge: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};
