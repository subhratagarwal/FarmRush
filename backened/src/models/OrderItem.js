// src/models/OrderItem.js
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      orderId: { type: DataTypes.INTEGER, allowNull: false },
      productId: { type: DataTypes.INTEGER, allowNull: true },
      farmerId: { type: DataTypes.INTEGER, allowNull: true },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      lineTotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      brokerage: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0.0 },
      productName: { type: DataTypes.STRING, allowNull: true },
      productImage: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "Accepted",
          "Preparing",
          "Shipped",
          "Delivered",
          "Cancelled"
        ),
        defaultValue: "Pending",
      },
    },
    { 
      tableName: "orderitems",
      timestamps: true,
      underscored: true,
    }
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      as: "order",
      foreignKey: "orderId",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    OrderItem.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    OrderItem.belongsTo(models.User, {
      as: "farmer",
      foreignKey: "farmerId",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return OrderItem;
};
