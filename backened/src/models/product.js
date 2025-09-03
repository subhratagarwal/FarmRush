// src/models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      farmerId: { type: DataTypes.INTEGER, allowNull: true },
      image: { type: DataTypes.STRING, allowNull: true },
      stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
    },
    { 
      tableName: "products",
      timestamps: true,
      underscored: true,
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.User, {
      as: "farmer",
      foreignKey: "farmerId",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    Product.hasMany(models.OrderItem, { as: "orderItems", foreignKey: "productId" });
    Product.hasMany(models.Wishlist, { as: "wishlists", foreignKey: "productId" });
  };

  return Product;
};
