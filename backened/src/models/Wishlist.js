// models/Wishlist.js
module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define("Wishlist", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // ✅ Associations
  Wishlist.associate = (models) => {
    Wishlist.belongsTo(models.User, { as: "user", foreignKey: "userId" });
    Wishlist.belongsTo(models.Product, { as: "product", foreignKey: "productId" });
  };

  return Wishlist;
};
