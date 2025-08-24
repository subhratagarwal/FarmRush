// models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("farmer", "customer", "admin"),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // ✅ Associations
    User.associate = (models) => {
    User.hasMany(models.Order, { as: "customerOrders", foreignKey: "customerId" });
    User.hasMany(models.Order, { as: "farmerOrders", foreignKey: "farmerId" });
    User.hasMany(models.Cart, { foreignKey: "customerId" });
    User.hasMany(models.Wishlist, { foreignKey: "userId" });
    User.hasMany(models.Review, { foreignKey: "userId" });
    User.hasMany(models.FarmerRating, { foreignKey: "userId" });
    User.hasMany(models.FarmerRating, { as: "receivedRatings", foreignKey: "farmerId" });
  };

  return User;
};
