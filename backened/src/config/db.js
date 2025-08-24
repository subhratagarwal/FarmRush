// backend/src/config/db.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// Import models
const User = require('../models/User')(sequelize, DataTypes);
const Product = require('../models/Product')(sequelize, DataTypes);
const Order = require('../models/Order')(sequelize, DataTypes);
const Cart = require('../models/Cart')(sequelize, DataTypes);
const Wishlist = require('../models/Wishlist')(sequelize, DataTypes);
const Review = require('../models/Review')(sequelize, DataTypes);
const FarmerRating = require('../models/FarmerRating')(sequelize, DataTypes);
const Coupon = require('../models/Coupon')(sequelize, DataTypes);

// Setup associations if any
Object.values({ User, Product, Order, Cart, Wishlist, Review, FarmerRating, Coupon })
  .forEach(model => { if (model.associate) model.associate({ User, Product, Order, Cart, Wishlist, Review, FarmerRating, Coupon }) });

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Cart,
  Wishlist,
  Review,
  FarmerRating,
  Coupon
};
