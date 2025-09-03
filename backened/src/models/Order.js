// src/models/Order.js
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      customerId: { type: DataTypes.INTEGER, allowNull: false },
      totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      brokerage: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
      status: {
        type: DataTypes.ENUM("Pending","Accepted","Preparing","Out for Delivery","Delivered","Cancelled"),
        defaultValue: "Pending"
      },
      deliveryStatus: { type: DataTypes.STRING, defaultValue: "Processing" },
      deliveryTime: { type: DataTypes.DATE, allowNull: true },
      paymentMode: { type: DataTypes.ENUM("COD","ONLINE"), defaultValue: "COD" },
      paymentStatus: { type: DataTypes.STRING, defaultValue: "Pending" },
      couponId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "orders" }
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { as: "customer", foreignKey: "customerId", onDelete: "CASCADE" });
    Order.hasMany(models.OrderItem, { as: "items", foreignKey: "orderId", onDelete: "CASCADE" });
    Order.hasMany(models.FarmerRating, { as: "ratings", foreignKey: "orderId", onDelete: "CASCADE" });
    Order.belongsTo(models.Coupon, { as: "coupon", foreignKey: "couponId" });
  };

  return Order;
};
