const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('booking', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    arrival_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    departure_date: {
        type: DataTypes.STRING,
        allowNull: false,
      },

  });
};
