'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword', // make sure it matches your hash logic
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Farmer One',
        email: 'farmer1@example.com',
        password: 'hashedpassword',
        role: 'farmer',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
