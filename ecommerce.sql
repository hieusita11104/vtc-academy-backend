-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for ecommerce
CREATE DATABASE IF NOT EXISTS `ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `ecommerce`;

-- Dumping structure for table ecommerce.addresses
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text,
  `country` varchar(50) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zipCode` varchar(20) DEFAULT NULL,
  `isDefault` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.addresses: ~0 rows (approximately)
DELETE FROM `addresses`;
INSERT INTO `addresses` (`id`, `firstName`, `lastName`, `email`, `mobile`, `address`, `country`, `city`, `state`, `zipCode`, `isDefault`, `createdAt`, `updatedAt`, `userId`) VALUES
	(1, 'John', 'Doe', 'john.doe@example.com', '123456789', '123 Main St', 'USA', 'New York', 'NY', '10001', 1, '2025-04-13 14:10:41', '2025-04-13 14:10:41', 2);

-- Dumping structure for table ecommerce.brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `imagePath` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.brands: ~0 rows (approximately)
DELETE FROM `brands`;
INSERT INTO `brands` (`id`, `name`, `imagePath`, `createdAt`, `updatedAt`) VALUES
	(1, 'Apple', 'images/brands/apple.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 'Samsung', 'images/brands/samsung.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `imagePath` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.categories: ~0 rows (approximately)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`, `imagePath`, `createdAt`, `updatedAt`) VALUES
	(1, 'Electronics', 'images/categories/electronics.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 'Fashion', 'images/categories/fashion.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(3, 'Điện thoại', 'https://example.com/images/phones.jpg', '2025-04-13 09:43:07', '2025-04-13 09:43:07'),
	(4, 'Laptop', 'https://example.com/images/laptops.jpg', '2025-04-13 09:43:07', '2025-04-13 09:43:07');

-- Dumping structure for table ecommerce.images
CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `imagePath` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `productId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.images: ~0 rows (approximately)
DELETE FROM `images`;
INSERT INTO `images` (`id`, `name`, `imagePath`, `createdAt`, `updatedAt`, `productId`) VALUES
	(1, 'iPhone Front', 'images/products/iphone14-front.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41', 1),
	(2, 'Galaxy Back', 'images/products/galaxys22-back.jpg', '2025-04-13 14:10:41', '2025-04-13 14:10:41', 2);

-- Dumping structure for table ecommerce.messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.messages: ~0 rows (approximately)
DELETE FROM `messages`;
INSERT INTO `messages` (`id`, `name`, `subject`, `message`, `createdAt`, `updatedAt`) VALUES
	(1, 'Visitor', 'Product Inquiry', 'I want to know more about iPhone 14.', '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.orderdetails
CREATE TABLE IF NOT EXISTS `orderdetails` (
  `orderId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`orderId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `orderdetails_ibfk_1` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`),
  CONSTRAINT `orderdetails_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.orderdetails: ~0 rows (approximately)
DELETE FROM `orderdetails`;
INSERT INTO `orderdetails` (`orderId`, `productId`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES
	(1, 1, 1, 899.99, '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(1, 2, 1, 899.99, '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `shipping` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `couponCode` varchar(50) DEFAULT NULL,
  `shippingAddress` text,
  `paymentMethod` varchar(50) DEFAULT NULL,
  `paymentDetails` text,
  `status` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.orders: ~0 rows (approximately)
DELETE FROM `orders`;
INSERT INTO `orders` (`id`, `quantity`, `total`, `subtotal`, `shipping`, `discount`, `couponCode`, `shippingAddress`, `paymentMethod`, `paymentDetails`, `status`, `createdAt`, `updatedAt`, `userId`) VALUES
	(1, 2, 1799.98, 1799.98, 0.00, 0.00, '', '123 Main St, NY', 'Credit Card', 'Paid in full', 'Shipped', '2025-04-13 14:10:41', '2025-04-13 14:10:41', 2);

-- Dumping structure for table ecommerce.products
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `imagePath` text,
  `oldPrice` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `summary` text,
  `description` text,
  `specification` text,
  `stars` decimal(2,1) DEFAULT '0.0',
  `quantity` int DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `brandId` int NOT NULL,
  `categoryId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `brandId` (`brandId`),
  KEY `categoryId` (`categoryId`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`),
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.products: ~0 rows (approximately)
DELETE FROM `products`;
INSERT INTO `products` (`id`, `name`, `imagePath`, `oldPrice`, `price`, `summary`, `description`, `specification`, `stars`, `quantity`, `createdAt`, `updatedAt`, `brandId`, `categoryId`) VALUES
	(1, 'iPhone 14', 'images/products/iphone14.jpg', 999.99, 899.99, 'Latest iPhone model', 'Full description...', 'Specs...', 4.5, 100, '2025-04-13 14:10:41', '2025-04-13 14:10:41', 1, 1),
	(2, 'Galaxy S22', 'images/products/galaxys22.jpg', 899.99, 799.99, 'New Galaxy phone', 'Full description...', 'Specs...', 4.3, 120, '2025-04-13 14:10:41', '2025-04-13 14:10:41', 2, 1),
	(3, 'iPhone 15 Pro', 'https://example.com/images/iphone15.jpg', 30000000.00, 28000000.00, 'iPhone 15 Pro mới nhất với phủ titanium chuyên nghiệp', 'iPhone 15 Pro là một chiếc điện thoại thông minh cao cấp nhất từ Apple...', 'Chip A17 Pro, 8GB RAM, 256GB Storage', 4.8, 50, '2025-04-13 09:43:07', '2025-04-13 09:43:07', 1, 1),
	(4, 'MacBook Pro M3', 'https://example.com/images/macbookm3.jpg', 45000000.00, 42000000.00, 'MacBook Pro M3 mới nhất mạnh mẹ nhất', 'MacBook Pro M3 trang bị chip M3 Pro mới nhất từ Apple với hiệu năng xử lý đáng kích...', 'Chip M3 Pro, 32GB RAM, 512GB SSD', 4.9, 30, '2025-04-13 09:43:07', '2025-04-13 09:43:07', 1, 2);

-- Dumping structure for table ecommerce.producttags
CREATE TABLE IF NOT EXISTS `producttags` (
  `productId` int NOT NULL,
  `tagId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`,`tagId`),
  KEY `tagId` (`tagId`),
  CONSTRAINT `producttags_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `producttags_ibfk_2` FOREIGN KEY (`tagId`) REFERENCES `tags` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.producttags: ~0 rows (approximately)
DELETE FROM `producttags`;
INSERT INTO `producttags` (`productId`, `tagId`, `createdAt`, `updatedAt`) VALUES
	(1, 1, '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 2, '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review` text,
  `stars` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `productId` int DEFAULT NULL,
  `userId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `productId` (`productId`),
  KEY `userId` (`userId`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.reviews: ~0 rows (approximately)
DELETE FROM `reviews`;
INSERT INTO `reviews` (`id`, `review`, `stars`, `createdAt`, `updatedAt`, `productId`, `userId`) VALUES
	(1, 'Great phone!', 5, '2025-04-13 14:10:41', '2025-04-13 14:10:41', 1, 2),
	(2, 'Not bad', 4, '2025-04-13 14:10:41', '2025-04-13 14:10:41', 2, 3);

-- Dumping structure for table ecommerce.sequelizemeta
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- Dumping data for table ecommerce.sequelizemeta: ~2 rows (approximately)
DELETE FROM `sequelizemeta`;
INSERT INTO `sequelizemeta` (`name`) VALUES
	('20250413093220-create-products.js'),
	('20250413093259-create-category.js');

-- Dumping structure for table ecommerce.subscribes
CREATE TABLE IF NOT EXISTS `subscribes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.subscribes: ~0 rows (approximately)
DELETE FROM `subscribes`;
INSERT INTO `subscribes` (`id`, `email`, `createdAt`, `updatedAt`) VALUES
	(1, 'newsletter@sample.com', '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.tags
CREATE TABLE IF NOT EXISTS `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.tags: ~0 rows (approximately)
DELETE FROM `tags`;
INSERT INTO `tags` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
	(1, 'New', '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 'Popular', '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT '0',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.users: ~0 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `isAdmin`, `createdAt`, `updatedAt`) VALUES
	(1, 'admin@example.com', 'hashedpassword1', 'Admin', 'User', 1, '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 'john.doe@example.com', 'hashedpassword2', 'John', 'Doe', 0, '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(3, 'jane.smith@example.com', 'hashedpassword3', 'Jane', 'Smith', 0, '2025-04-13 14:10:41', '2025-04-13 14:10:41');

-- Dumping structure for table ecommerce.wishlists
CREATE TABLE IF NOT EXISTS `wishlists` (
  `productId` int NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`,`userId`),
  KEY `userId` (`userId`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table ecommerce.wishlists: ~0 rows (approximately)
DELETE FROM `wishlists`;
INSERT INTO `wishlists` (`productId`, `userId`, `createdAt`, `updatedAt`) VALUES
	(1, 2, '2025-04-13 14:10:41', '2025-04-13 14:10:41'),
	(2, 3, '2025-04-13 14:10:41', '2025-04-13 14:10:41');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
