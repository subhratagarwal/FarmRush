// src/models/FarmerRating.js
module.exports = (sequelize, DataTypes) => {
  const FarmerRating = sequelize.define("FarmerRating", {
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  });

  // ✅ Add associations here
  FarmerRating.associate = (models) => {
    FarmerRating.belongsTo(models.User, { foreignKey: "userId" });
    FarmerRating.belongsTo(models.User, { as: "farmer", foreignKey: "farmerId" });
    FarmerRating.belongsTo(models.Order, { foreignKey: "orderId" });
  };

  return FarmerRating;
};
