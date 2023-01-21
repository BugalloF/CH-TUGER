const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  
  
  // ESTOS SERÍAN LOS DATOS DE FACTURACIÓN DEL CLIENTE.
  
  
  sequelize.define('client', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
