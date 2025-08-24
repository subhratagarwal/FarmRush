module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    farmerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    brokerage: DataTypes.FLOAT,
    productName: DataTypes.STRING,
    productImage: DataTypes.STRING,
    farmerContact: DataTypes.STRING,
    farmerAddress: DataTypes.STRING,
    userContact: DataTypes.STRING,
    userAddress: DataTypes.STRING,
    deliveryStatus: DataTypes.STRING,
    deliveryTime: DataTypes.DATE,
    paymentMode: {
      type: DataTypes.STRING,
      defaultValue: "COD",
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "Pending",
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { as: "customer", foreignKey: "customerId" });
    Order.belongsTo(models.User, { as: "farmer", foreignKey: "farmerId" });
    Order.belongsTo(models.Product, { as: "product", foreignKey: "productId" });
  };

  return Order;
};
