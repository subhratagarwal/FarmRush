'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_items', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      orderId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'orders', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      productId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'products', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      farmerId: { 
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' }, // assuming farmer is a user
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      unitPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      lineTotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      brokerage: { type: Sequelize.DECIMAL(10, 2), allowNull: true, defaultValue: 0.00 },
      productName: { type: Sequelize.STRING, allowNull: true },
      productImage: { type: Sequelize.STRING, allowNull: true },
      status: { 
        type: Sequelize.ENUM("Pending", "Accepted", "Preparing", "Shipped", "Delivered", "Cancelled"),
        defaultValue: "Pending",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_items');
  }
};
