'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Điện thoại',
        imagePath: 'https://example.com/images/phones.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Laptop',
        imagePath: 'https://example.com/images/laptops.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
