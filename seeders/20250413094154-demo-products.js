'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'iPhone 15 Pro',
        imagePath: 'https://example.com/images/iphone15.jpg',
        oldPrice: 30000000,
        price: 28000000,
        summary: 'iPhone 15 Pro mới nhất với phủ titanium chuyên nghiệp',
        description: 'iPhone 15 Pro là một chiếc điện thoại thông minh cao cấp nhất từ Apple...',
        specification: 'Chip A17 Pro, 8GB RAM, 256GB Storage',
        stars: 4.8,
        quantity: 50,
        brandId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'MacBook Pro M3',
        imagePath: 'https://example.com/images/macbookm3.jpg',
        oldPrice: 45000000,
        price: 42000000,
        summary: 'MacBook Pro M3 mới nhất mạnh mẹ nhất',
        description: 'MacBook Pro M3 trang bị chip M3 Pro mới nhất từ Apple với hiệu năng xử lý đáng kích...',
        specification: 'Chip M3 Pro, 32GB RAM, 512GB SSD',
        stars: 4.9,
        quantity: 30,
        brandId: 1,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
