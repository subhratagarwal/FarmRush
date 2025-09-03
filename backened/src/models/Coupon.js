// src/models/Coupon.js
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define(
    "Coupon",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      discountPercent: { type: DataTypes.FLOAT, allowNull: false },
      maxDiscount: { type: DataTypes.FLOAT, allowNull: true },
      expiryDate: { type: DataTypes.DATE, allowNull: false },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    },
    { tableName: "coupons" }
  );

  return Coupon;
};
