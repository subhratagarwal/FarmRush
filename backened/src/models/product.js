module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    price: { type: DataTypes.FLOAT, allowNull: false },
    farmerId: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
  });

  Product.associate = (models) => {
    // Use 'models.X' passed from index.js only
    if (models.Order) {
      Product.hasMany(models.Order, { as: "orders", foreignKey: "productId" });
    }

    if (models.User) {
      Product.belongsTo(models.User, { as: "farmer", foreignKey: "farmerId" });
    }

    if (models.Wishlist) {
      Product.hasMany(models.Wishlist, { as: "wishlists", foreignKey: "productId" });
    }
  };

  return Product;
};
