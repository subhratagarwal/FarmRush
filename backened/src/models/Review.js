// src/models/Review.js
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
      comment: { type: DataTypes.TEXT, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "reviews" }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, { as: "user", foreignKey: "userId", onDelete: "CASCADE" });
    Review.belongsTo(models.Product, { as: "product", foreignKey: "productId", onDelete: "CASCADE" });
  };

  return Review;
};
