// src/models/Cart.js
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  });

  // ✅ Add associations here
  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "customerId" });
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return Cart;
};
