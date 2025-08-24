  // src/models/Farmer.js
  'use strict';

  module.exports = (sequelize, DataTypes) => {
    const Farmer = sequelize.define('Farmer', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });

    return Farmer;
  };
