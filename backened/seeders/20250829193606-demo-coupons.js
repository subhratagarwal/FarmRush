'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Coupons', [
      {
        code: 'DISCOUNT10',
        discountPercent: 10,
        expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Coupons', null, {});
  }
};
