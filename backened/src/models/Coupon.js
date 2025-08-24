module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define("Coupon", {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return Coupon;
};
