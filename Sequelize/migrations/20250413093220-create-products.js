'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imagePath: {
        type: Sequelize.TEXT
      },
      oldPrice: {
        type: Sequelize.DECIMAL(10, 2)
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      summary: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.TEXT
      },
      specification: {
        type: Sequelize.TEXT
      },
      stars: {
        type: Sequelize.DECIMAL(2, 1),
        defaultValue: 0.0
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      brandId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('products');
  }
};
