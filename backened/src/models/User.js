// src/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("customer", "farmer", "admin"), defaultValue: "customer" },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.TEXT, allowNull: true },
    },
    { tableName: "users" }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { as: "customerOrders", foreignKey: "customerId" });
    User.hasMany(models.Order, { as: "farmerOrders", foreignKey: "farmerId" });
    User.hasMany(models.Cart, { as: "cartItems", foreignKey: "customerId" });
    User.hasMany(models.Wishlist, { as: "wishlistItems", foreignKey: "userId" });
    User.hasMany(models.Review, { as: "reviews", foreignKey: "userId" });
    User.hasMany(models.FarmerRating, { as: "ratingsGiven", foreignKey: "userId" });
    User.hasMany(models.FarmerRating, { as: "ratingsReceived", foreignKey: "farmerId" });
  };

  return User;
};
