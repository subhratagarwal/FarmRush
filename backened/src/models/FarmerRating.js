// src/models/FarmerRating.js
module.exports = (sequelize, DataTypes) => {
  const FarmerRating = sequelize.define(
    "FarmerRating",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      rating: { type: DataTypes.INTEGER, allowNull: false },
      comment: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      farmerId: { type: DataTypes.INTEGER, allowNull: true },
      orderId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { 
      tableName: "farmerratings",
      timestamps: true,
      underscored: true,
    }
  );

  FarmerRating.associate = (models) => {
    FarmerRating.belongsTo(models.User, { foreignKey: "userId" });
    FarmerRating.belongsTo(models.User, { as: "farmer", foreignKey: "farmerId" });
    FarmerRating.belongsTo(models.Order, { foreignKey: "orderId" });
  };

  return FarmerRating;
};
