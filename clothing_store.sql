-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 27, 2025 lúc 04:10 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `clothing_store`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `brand`
--

INSERT INTO `brand` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Nike', 'Thương hiệu thể thao nổi tiếng', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Adidas', 'Thương hiệu thể thao quốc tế', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'YODY', 'Thời trang cao cấp', 'active', '2025-05-22 14:01:57', '2025-05-26 19:36:12'),
(4, 'POLOMAN', 'Thời trang phổ thông', 'active', '2025-05-22 14:01:57', '2025-05-26 19:36:24'),
(6, 'Teelab', 'Thời trang giới trẻ', 'active', '2025-05-26 18:02:58', '2025-05-26 18:02:58'),
(7, 'CLOUDZY', 'unisex', 'active', '2025-05-26 18:31:31', '2025-05-26 18:31:31'),
(8, 'Miucho', 'form vừa', 'active', '2025-05-26 18:33:03', '2025-05-26 18:33:03'),
(9, 'VESCA', 'Dáng suông', 'active', '2025-05-26 18:36:48', '2025-05-26 18:36:48'),
(10, 'VIENDO', 'Kính mắt', 'active', '2025-05-26 18:38:04', '2025-05-26 18:38:04'),
(11, 'BlueWind', 'Giày thể thao', 'active', '2025-05-26 18:41:30', '2025-05-26 18:41:30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` bigint(20) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `total_amount`, `created_at`, `updated_at`) VALUES
(1, 2, 279999, '2025-05-25 11:59:27', '2025-05-27 00:54:49'),
(2, 3, 450000, '2025-05-26 00:40:15', '2025-05-26 02:56:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cartdetail`
--

CREATE TABLE `cartdetail` (
  `id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` bigint(20) NOT NULL,
  `total_price` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `cartdetail`
--

INSERT INTO `cartdetail` (`id`, `cart_id`, `product_id`, `color_id`, `size_id`, `quantity`, `unit_price`, `total_price`, `created_at`, `updated_at`) VALUES
(17, 1, 12, 1, 5, 1, 139999, 139999, '2025-05-27 00:53:10', '2025-05-27 00:53:10');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `category`
--

INSERT INTO `category` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Áo thun', 'Các loại áo thun nam nữ', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Áo sơ mi', 'Các loại áo sơ mi công sở', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'Quần jean', 'Quần jean thời trang', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(6, 'Áo phông', 'good', 'active', '2025-05-26 17:55:24', '2025-05-26 17:55:24'),
(7, 'Giày ', 'hihi', 'active', '2025-05-26 17:57:51', '2025-05-26 17:57:51'),
(8, 'Kính mắt', 'Chói sáng tương lai', 'active', '2025-05-26 18:43:38', '2025-05-26 18:43:38'),
(9, 'Áo khoác', 'Thoải mái, dễ chịu', 'active', '2025-05-26 18:45:14', '2025-05-26 18:45:14'),
(10, 'Áo polo', 'Phong cách thời trang', 'active', '2025-05-26 18:45:41', '2025-05-26 18:45:41'),
(11, 'Hoodie', 'mềm mại ấm áp', 'active', '2025-05-26 18:46:50', '2025-05-26 18:46:50'),
(12, 'Quần Short', 'thoáng mát ', 'active', '2025-05-26 18:47:11', '2025-05-26 18:47:11');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `color`
--

CREATE TABLE `color` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `hex_code` varchar(7) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `color`
--

INSERT INTO `color` (`id`, `name`, `hex_code`, `created_at`, `updated_at`) VALUES
(1, 'Đen', '#000000', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Trắng', '#FFFFFF', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'Đỏ', '#FF0000', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(4, 'Xanh dương', '#0000FF', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(5, 'Xanh lá', '#00FF00', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(6, 'Vàng', '#FFFF00', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(7, 'Xám', '#808080', '2025-05-26 19:44:41', '2025-05-26 21:12:23'),
(8, 'Nâu', '#8B4513', '2025-05-26 19:44:41', '2025-05-26 21:14:00'),
(9, 'Hồng', '#FFC0CB', '2025-05-26 19:44:41', '2025-05-26 21:14:44'),
(10, 'Xanh Đen', '#00008B', '2025-05-26 19:44:41', '2025-05-26 21:15:02'),
(11, 'Xanh Rêu', '#556B2F', '2025-05-26 19:44:41', '2025-05-26 21:15:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `cart_id` int(11) DEFAULT NULL,
  `order_status_id` int(11) NOT NULL,
  `payment_method_id` int(11) NOT NULL,
  `payment_status_id` int(11) NOT NULL,
  `shipment_id` int(11) NOT NULL,
  `voucher_id` int(11) DEFAULT NULL,
  `user_address_id` int(11) NOT NULL,
  `subtotal` bigint(20) NOT NULL,
  `shipping_fee` bigint(20) NOT NULL,
  `discount_amount` bigint(20) DEFAULT 0,
  `total_amount` bigint(20) NOT NULL,
  `note` text DEFAULT NULL,
  `order_date` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `vnpay_transaction_ref` varchar(100) DEFAULT NULL,
  `vnpay_transaction_no` varchar(100) DEFAULT NULL,
  `vnpay_response_code` varchar(10) DEFAULT NULL,
  `vnpay_bank_code` varchar(20) DEFAULT NULL,
  `vnpay_pay_date` varchar(14) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order`
--

INSERT INTO `order` (`id`, `user_id`, `cart_id`, `order_status_id`, `payment_method_id`, `payment_status_id`, `shipment_id`, `voucher_id`, `user_address_id`, `subtotal`, `shipping_fee`, `discount_amount`, `total_amount`, `note`, `order_date`, `created_at`, `updated_at`, `vnpay_transaction_ref`, `vnpay_transaction_no`, `vnpay_response_code`, `vnpay_bank_code`, `vnpay_pay_date`) VALUES
(1, 2, NULL, 1, 1, 1, 4, NULL, 2, 900000, 0, 0, 9000000, '', '2025-05-25 20:02:12', '2025-05-25 20:02:12', '2025-05-25 20:02:12', NULL, NULL, NULL, NULL, NULL),
(2, 2, NULL, 2, 1, 2, 4, NULL, 2, 450000, 0, 0, 4500000, '', '2025-05-25 20:44:45', '2025-05-25 20:44:45', '2025-05-26 07:40:56', NULL, NULL, NULL, NULL, NULL),
(3, 2, NULL, 1, 1, 1, 4, NULL, 2, 900000, 0, 0, 9000000, '', '2025-05-25 20:58:48', '2025-05-25 20:58:48', '2025-05-25 20:58:48', NULL, NULL, NULL, NULL, NULL),
(4, 3, NULL, 1, 5, 1, 4, NULL, 4, 450000, 0, 0, 450000, '', '2025-05-26 10:04:38', '2025-05-26 10:04:38', '2025-05-26 10:04:38', NULL, NULL, NULL, NULL, NULL),
(5, 2, NULL, 1, 5, 1, 4, NULL, 2, 450000, 0, 0, 450000, '', '2025-05-26 10:32:15', '2025-05-26 10:32:15', '2025-05-26 10:32:15', NULL, NULL, NULL, NULL, NULL),
(6, 2, NULL, 6, 5, 1, 4, NULL, 2, 450000, 0, 0, 450000, '', '2025-05-26 15:15:14', '2025-05-26 15:15:14', '2025-05-26 15:16:32', NULL, NULL, NULL, NULL, NULL),
(7, 2, NULL, 1, 5, 1, 4, NULL, 2, 450000, 0, 0, 450000, '', '2025-05-26 15:16:58', '2025-05-26 15:16:58', '2025-05-26 15:16:58', NULL, NULL, NULL, NULL, NULL),
(8, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:23:41', '2025-05-26 15:23:41', '2025-05-26 15:23:41', NULL, NULL, NULL, NULL, NULL),
(9, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:24:17', '2025-05-26 15:24:17', '2025-05-26 15:24:17', NULL, NULL, NULL, NULL, NULL),
(10, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:30:33', '2025-05-26 15:30:33', '2025-05-26 15:30:33', NULL, NULL, NULL, NULL, NULL),
(11, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:34:51', '2025-05-26 15:34:51', '2025-05-26 15:34:51', NULL, NULL, NULL, NULL, NULL),
(12, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:53:15', '2025-05-26 15:53:15', '2025-05-26 15:53:15', NULL, NULL, NULL, NULL, NULL),
(13, 2, NULL, 1, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:58:19', '2025-05-26 15:58:19', '2025-05-26 15:58:19', NULL, NULL, NULL, NULL, NULL),
(14, 2, NULL, 2, 5, 1, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 15:58:53', '2025-05-26 15:58:53', '2025-05-26 18:07:47', NULL, NULL, NULL, NULL, NULL),
(15, 2, NULL, 1, 5, 2, 4, NULL, 2, 80000, 0, 0, 80000, '', '2025-05-26 16:01:39', '2025-05-26 16:01:39', '2025-05-26 16:01:51', '15_1748275311697', 'MOCK1748275311697', '00', NULL, '20250526160151'),
(16, 2, NULL, 1, 1, 1, 4, NULL, 2, 140000, 0, 0, 140000, '', '2025-05-27 00:58:53', '2025-05-27 00:58:53', '2025-05-27 00:58:53', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderdetail`
--

CREATE TABLE `orderdetail` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) DEFAULT NULL,
  `size_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` bigint(20) NOT NULL,
  `total_price` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderdetail`
--

INSERT INTO `orderdetail` (`id`, `order_id`, `product_id`, `color_id`, `size_id`, `quantity`, `unit_price`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 1, 2, 450000, 900000, '2025-05-25 20:02:12', '2025-05-25 20:02:12'),
(2, 2, 1, 2, 1, 1, 450000, 450000, '2025-05-25 20:44:45', '2025-05-25 20:44:45'),
(3, 3, 1, 1, 1, 1, 450000, 450000, '2025-05-25 20:58:48', '2025-05-25 20:58:48'),
(4, 3, 1, 2, 1, 1, 450000, 450000, '2025-05-25 20:58:48', '2025-05-25 20:58:48'),
(5, 4, 1, 1, 1, 1, 450000, 450000, '2025-05-26 10:04:38', '2025-05-26 10:04:38'),
(6, 5, 1, 1, 1, 1, 450000, 450000, '2025-05-26 10:32:15', '2025-05-26 10:32:15'),
(7, 6, 1, 1, 1, 1, 450000, 450000, '2025-05-26 15:15:14', '2025-05-26 15:15:14'),
(8, 7, 1, 1, 1, 1, 450000, 450000, '2025-05-26 15:16:58', '2025-05-26 15:16:58'),
(9, 8, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:23:41', '2025-05-26 15:23:41'),
(10, 9, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:24:17', '2025-05-26 15:24:17'),
(11, 10, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:30:33', '2025-05-26 15:30:33'),
(12, 11, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:34:51', '2025-05-26 15:34:51'),
(13, 12, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:53:15', '2025-05-26 15:53:15'),
(14, 13, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:58:19', '2025-05-26 15:58:19'),
(15, 14, 2, 6, 2, 1, 80000, 80000, '2025-05-26 15:58:53', '2025-05-26 15:58:53'),
(16, 15, 2, 6, 2, 1, 80000, 80000, '2025-05-26 16:01:39', '2025-05-26 16:01:39'),
(17, 16, 10, 1, 2, 1, 140000, 140000, '2025-05-27 00:58:53', '2025-05-27 00:58:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orderstatus`
--

CREATE TABLE `orderstatus` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orderstatus`
--

INSERT INTO `orderstatus` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pending', 'Chờ xử lý', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Confirmed', 'Đã xác nhận', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'Processing', 'Đang xử lý', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(4, 'Shipping', 'Đang giao hàng', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(5, 'Delivered', 'Đã giao hàng', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(6, 'Cancelled', 'Đã hủy', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(7, 'Returned', 'Đã trả hàng', '2025-05-25 17:43:54', '2025-05-25 17:43:54');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `paymentmethod`
--

INSERT INTO `paymentmethod` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'COD', 'Thanh toán khi nhận hàng', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Bank Transfer', 'Chuyển khoản ngân hàng', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'Credit Card', 'Thẻ tín dụng', 'active', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(4, 'MoMo', 'Ví điện tử', 'active', '2025-05-22 14:01:57', '2025-05-25 17:41:04'),
(5, 'VNPay', 'Thanh toán qua cổng VNPay', 'active', '2025-05-25 17:42:13', '2025-05-25 17:42:13');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `paymentstatus`
--

CREATE TABLE `paymentstatus` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `paymentstatus`
--

INSERT INTO `paymentstatus` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Pending', 'Chờ thanh toán', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'Paid', 'Đã thanh toán', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'Failed', 'Thanh toán thất bại', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(4, 'Refunded', 'Đã hoàn tiền', '2025-05-22 14:01:57', '2025-05-22 14:01:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `short_description` text DEFAULT NULL,
  `long_description` text DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) DEFAULT NULL,
  `origin` varchar(100) DEFAULT NULL,
  `material` varchar(100) DEFAULT NULL,
  `original_price` bigint(20) NOT NULL,
  `sale_price` bigint(20) DEFAULT NULL,
  `view_count` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `product`
--

INSERT INTO `product` (`id`, `name`, `short_description`, `long_description`, `category_id`, `brand_id`, `origin`, `material`, `original_price`, `sale_price`, `view_count`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Áo Thun Nike', 'Áo thun thể thao', 'Áo thun thể thao chất lượng cao', 1, 1, 'Vietnam', 'Cotton', 500000, 450000, 133, 'active', '2025-05-25 01:23:45', '2025-05-26 15:23:26'),
(2, 'Áo ngắn tay', 'hihi', 'hihi', 1, 1, 'Việt Nam', 'Cotton', 100000, 79999, 18, 'active', '2025-05-26 10:29:22', '2025-05-27 00:42:37'),
(3, 'Quần Shorts Teelab Kaki Basic Logo Unisex Form Oversize Local Brand PS060', 'You will never be younger than you are at this very moment “Enjoy Your Youth!”', 'Hướng dẫn sử dụng sản phẩm Teelab:\n- Ngâm áo vào NƯỚC LẠNH có pha giấm hoặc phèn chua từ trong 2 tiếng đồng hồ\n- Giặt ở nhiệt độ bình thường, với đồ có màu tương tự.\n- Không dùng hóa chất tẩy.\n- Hạn chế sử dụng máy sấy và ủi (nếu có) thì ở nhiệt độ thích hợp.\nChính sách bảo hành:\n- Miễn phí đổi hàng cho khách mua ở TEELAB trong trường hợp bị lỗi từ nhà sản xuất, giao nhầm hàng, bị hư hỏng trong quá trình vận chuyển hàng.\n- Sản phẩm đổi trong thời gian 3 ngày kể từ ngày nhận hàng\n- Sản phẩm còn mới nguyên tem, tags và mang theo hoá đơn mua hàng, sản phẩm chưa giặt và không dơ bẩn, hư hỏng bởi những tác nhân bên ngoài cửa hàng sau khi mua hàng.', 12, 6, ' Việt Nam', ' kaki', 350000, 160000, 0, 'active', '2025-05-26 19:12:08', '2025-05-26 19:12:08'),
(4, 'Áo Hoodie  Form Rộng Mũ Trùm 2 Lớp Nam Nữ Unisex', 'Áo Hoodie Teelab Special Colection Có Khóa Và Không Khóa Vải Nỉ Bông Ấm Áp, Form Rộng Dáng Unisex', 'HƯỚNG DẪN CHỌN SIZE ÁO\n- Bảng Size:\n✔ Size M: Nặng 40-50kg ~ Cao 1m5-1m63\n✔ Size L: Nặng 50-65kg ~ Cao 1m63-1m75\n✔ Size XL: Nặng 65-80kg ~ Cao 1m75-1m85\n3.HƯỚNG DẪN SỬ DỤNG\n- Khuyến khích giặt tay với nước ở nhiệt độ thường, hạn chế để sản phẩm tiếp xúc với chất tẩy hoặc nước giặt có độ tẩy mạnh.\n- Nếu giặt máy, sản phẩm nên được lộn trái và cho vào túi giặt.\n- Phơi ở nơi bóng râm, tránh ánh nắng trực tiếp. \n4. QUY ĐỊNH ĐỔI TRẢ CỦA SHOPEE\n* Điều kiện áp dụng (trong vòng 03 ngày kể từ khi nhận sản phẩm):\n	- Hàng hoá vẫn còn mới, chưa qua sử dụng \n	- Hàng hóa hư hỏng do vận chuyển hoặc do nhà sản xuất. \n*Trường hợp được chấp nhận: \n-  Hàng không đúng size, kiểu dáng như quý khách đặt hàng \n-  Không đủ số lượng như trong đơn hàng \n* Trường hợp không đủ điều kiện áp dụng chính sách Đổi/Trả : \n- Quá 03 ngày kể từ khi Quý khách nhận hàng \n- Gửi lại hàng không đúng mẫu mã, không phải hàng của shop ', 11, 6, 'Việt Nam', 'Nỉ', 230000, 165000, 2, 'active', '2025-05-26 19:24:44', '2025-05-26 19:26:43'),
(5, 'Áo thun POLO ONG nam cổ bẻ BASIC CVC', 'POLOMAN là một thương hiệu thời trang thời thượng mang phong cách tối giản & thanh lịch', 'I. CHI TIẾT SẢN PHẨM ÁO THUN POLO NAM CỔ BẺ BASIC CVC:\n- Chât vải 55% Cotton, 15 % Spandex, 30% Poly cho độ  dày dặn, co giãn tốt và quan trọng độ bền màu cao\n- Giặt không  đổ lông hay bay màu, thấm hút mồ hôi và thoải mái ko gò bó khi vận động\n- Thiết kế cấu trúc lỗ thoáng, mắt vải to tạo sự thoáng mát cho người mặc  \n- Đặc biệt sợi Cotton pha Spandex đc xử lí giúp chống tia UV và kháng khuẩn.\n- Màu sắc & kích cỡ Áo thun POLO nam cổ bẻ BASIC CVC : form áo regular-fit thoải mái ko gò bó khi vận động tạo nên sự nặng động,trẻ trung,...\n\nII. HƯỚNG DẪN CHỌN SIZE:\nÁo có đủ size : S - M - L - XL - 2XL - 3XL - 4XL\nSize S: Từ 33 - 43kg\nSize  M: Từ  44 - 55kg\nSize L: Từ 56 - 62kg\nSize XL: Từ 63 - 69kg\nSize 2XL: Từ 70 - 81kg\nSize 3XL: Từ 82 - 93kg\nSize 4XL: Từ 94 - 102kg\nQuý khách chọn size theo CÂN NẶNG theo BẢNG SIZE ở trên, hoặc đo theo áo hiện tại đang mặc và so sánh để chọn là chính xác nhất\n\nIII. HƯỚNG DẪN SỬ DỤNG VÀ BẢO QUẢN ÁO THUN POLO NAM CỔ BẺ BASIC:\n- Giặt ở nhiệt độ bình thường, với đồ có màu tương tự.\n- Không được dùng hóa chất tẩy.\n- Khi áo in giặt nhớ giũ thẳng áo để hình in không  bị dính vào nhau\n- Hạn chế sử dụng máy sấy và ủi ở nhiệt độ thích hợp.  \n- Lộn mặt trái khi phơi tránh bị nhanh phai màu', 10, 4, ' Việt Nam', ' Cotton', 278000, 139000, 2, 'active', '2025-05-26 19:51:12', '2025-05-26 21:16:23'),
(6, 'Áo Khoác Gió Nam Nữ Chống Nước Chống Nắng', 'Áo được thiết kế form rộng tạo cảm giá thoải mái trong quá trình hoạt động. ', 'Áo Khoác Gió Nam Nữ Mũ Cao Cấp 2 Lớp chất dù mềm có lớp lót trong, đường may  tỉ mỉ, mặc đứng dáng, không xù, không phai màu, có khả năng cả gió, chống nắng.\nÁo được thiết kế form rộng tạo cảm giá thoải mái trong quá trình hoạt động. năng động.  Áo khoác gió nam nữ mũ cao cấp 2 lớp mặc được 4 mùa,  dành cho cả nam và nữ, ở nhà, đi học, di du lịch, dạo phố, hẹn hò,.', 9, 3, ' Việt Nam', 'Gió', 250000, 165000, 0, 'active', '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(7, 'Gọng Kiếng Cận Nam Nữ ', 'Kính Cận Gọng Vuông Đổi Màu Khi Ra Nắng Chống Ánh Sáng Xanh Tia UV Thời Trang', 'Thời gian giao hàng dự kiến cho sản phẩm này là từ 7-9 ngày\n❤️️Quý khách thân mến, chào mừng bạn đến với [Viendo] ❤️️\n❤️️Theo dõi cửa hàng của chúng tôi nhé❤️️\nThông tin chi tiết:\nĐộ tuổi phù hợp: Người trưởng thành\nDành cho: Nam, nữ\nChất liệu tròng kính: Nhựa\nChất liệu gọng: TR + Kim loại\nChiều dài gọng: 145mm\nChiều dài càng kính: 146mm\nChiều cao tròng kính: 50mm\nChiều rộng tròng kính: 53mm\nCầu mũi: 21mm\nKhối lượng tịnh(không bao gồm ống kính): 12.8G\nGói hàng bao gồm: 1 x Mắt kính\nLưu ý: Các kích thước trên được đo bằng tay, lỗi đo 1-3mm, nếu có bất kỳ sai lầm nào, hy vọng bạn hiểu.', 8, 10, ' Trung Quốc', ' Kim loại', 139000, 114000, 0, 'active', '2025-05-26 20:12:29', '2025-05-26 20:12:44'),
(8, 'Giày Thể Thao Nữ BLUEWIND', 'Giày Tập Luyện Thoáng Khí Đế Cao Trẻ Trung Tôn Dáng 68888', ' Chất liệu: Textile, Microfiber \n- Công nghệ: NATURAL MOTION \n- Dòng sản phẩm: Classic, Fashion\n- Độ cao: 5cm\n- Trọng lượng: 800g\n- Size: 35-40\n- Màu sắc: 2 màu Trắng Đen và Trắng Nâu\n- Box: Full box', 7, 11, 'Việt Nam', 'Textile, Microfiber ', 650000, 350000, 0, 'active', '2025-05-26 20:16:17', '2025-05-26 20:16:36'),
(9, 'Quần Jean Ống Rộng Nữ Wash Bụi', 'Quần Jean Ống Rộng Nữ Wash Bụi Màu Đen Và Xanh Lưng Cao Phong Cách Retro Ulzzang Hàn Quốc', '❌ THÔNG TIN SẢN PHẨM : Quần Jean Ống Rộng Nữ Màu Đen Wash Bụi Lưng Cao Phong Cách Retro Ulzzang Hàn Quốc 315\n\n✔ Màu sắc: Đen Wash Bụi 315 - X.Đậm Wash Bụi 552 - X.Nhạt Wash Bụi 317 - X.Đậm Wash Túi Xéo 460.1 - Xám Wash Túi Xéo 460.2 - Râu Mèo Wash Dơ 469 - Đen Túi Xéo 460.3 -X.Nhạt Wash Túi Xéo 460.4 - Xanh Nhạt Trơn 420.1 - Xanh Đậm Trơn 420.2 - Đen Trơn 522.2 - Trắng Trơn 522.1\n✔ Kiểu dáng: Quần ống suông rộng, không xù lông, có thể giặt máy và không ra màu\n✔ Kích thước: 4 Size S,M,L,XL  tương ứng:\nSize S: eo (64), mông (dưới 90), cân nặng (38 - 44kg) Chiều Dài 100cm\nSize M: eo (68), mông (Dưới 93),, cân nặng (46 - 49kg) Chiều Dài 100cm\nSize L: eo (72), mông (dưới 96),  cân nặng (50 - 54kg) Chiều  Dài 100cm\nSize XL: eo (76), mông (dưới 99),  cân nặng (55 - 58kg) Chiều  Dài 100cm', 3, 8, ' Việt Nam', ' Denim', 158998, 88000, 0, 'active', '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(10, 'Áo phông local brand nam nữ unisex', 'tay lỡ thun form rộng teen cổ tròn oversize cotton CLOUDZY CRAYON', 'Phong cách\nThể thao, Cơ bản, Hàn Quốc, Đường phố, Nhiệt đới\nTall Fit\nCó\nChiều dài áo\nDài\nXuất xứ\nViệt Nam\nChiều dài tay áo\nDài 3/4\nDáng kiểu áo\nOversized\nCổ áo\nCổ tròn\nChất liệu\nCotton\nMẫu\nIn\nMùa\nMùa hè\nRất lớn\nCó\nTên tổ chức chịu trách nhiệm sản xuất\nCông ty CLOUDZY\nĐịa chỉ tổ chức chịu trách nhiệm sản xuất\nP. Đông Hưng Thuận, Q.12\nGửi từ\nTP. Hồ Chí Minh', 6, 7, ' Việt Nam', 'Cotton', 257999, 139000, 4, 'active', '2025-05-26 20:26:53', '2025-05-27 00:54:47'),
(11, 'Áo thun nữ form rộng ATD308 Miucho cotton cổ tròn in graphic', 'Miucho tự hào là thương hiệu thời trang nữ hàng đầu, đa dạng mẫu áo thun hot trend. ', '🏷️ Thông tin sản phẩm:\nKích cỡ: S, M, L, XL, 2XL, 3XL\nMàu sắc: Trắng, đen và nhiều màu sắc đa dạng khác\nKiểu dáng: From rộng tay lỡ\nPhong cách: Unisex\nThương hiệu: Miucho\nHình in: Áo thun nữ Mucho sử dụng công nghệ in ấn tiên tiến và mực in chất lượng cao đảm bảo hình ảnh sắc nét, bền đẹp sau mỗi lần giặt. Hình in không nứt, bong tróc, giữ được độ tươi mới lâu dài.\nLoại cổ áo: Cổ tròn\nTay áo: Ngắn tay\nNơi sản xuất: Việt Nam', 1, 8, ' Việt Nam', ' Cotton', 220000, 149000, 4, 'active', '2025-05-26 20:33:55', '2025-05-26 21:16:01'),
(12, 'Áo sơ mi nam cổ bẻ', '', 'thông tin chi tiết sản phẩm:\n--Chất vải lụa, mềm , mịn , thoáng mát\n--Mếch cổ và tay làm bằng chất liệu cao cấp, không sợ bong tróc.\n--Fom Body cực chuẩn, ôm trọn bờ vai mặc cực trẻ trung và phong cách, phù hợp mọi hoàn cảnh kể cả đi chơi và đi làm.\n-----------------------------------------------------------------------------------------------------------\nBẢNG SIZE:\nM 48- 55kg \nL 56-65KG\nXL 66-74KG\n2XL 75-80KG\n3XL 80-85KG', 2, 9, ' Việt Nam', 'ĐŨI', 200000, 115000, 12, 'active', '2025-05-26 20:39:26', '2025-05-27 00:55:49');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productcolor`
--

CREATE TABLE `productcolor` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `color_id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `productcolor`
--

INSERT INTO `productcolor` (`id`, `product_id`, `color_id`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748136227/product_colors/ajqzqncq8zbsrepumeqy.jpg', '2025-05-25 01:23:49', '2025-05-25 01:23:49'),
(2, 1, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748136228/product_colors/p7xj86gngrxxd8wrecl8.webp', '2025-05-25 01:23:50', '2025-05-25 01:23:50'),
(6, 3, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748286599/product_colors/dhylbsr3hadnnxjeqbeq.webp', '2025-05-26 19:12:08', '2025-05-26 19:12:08'),
(7, 4, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748287346/product_colors/t5csnyh7fgqzxjko0q5z.webp', '2025-05-26 19:24:44', '2025-05-26 19:24:44'),
(8, 4, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748287372/product_colors/is6h1hc5ottcu3ictmod.webp', '2025-05-26 19:24:44', '2025-05-26 19:24:44'),
(9, 5, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748288349/product_colors/evfhjpwkqrt8igsydph3.webp', '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(10, 5, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748288369/product_colors/gfxo1kjulrmzasapccq6.webp', '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(11, 5, 4, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748288777/product_colors/tqvodu0neaeelcvceocy.webp', '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(12, 5, 6, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748288798/product_colors/iibfkcuwukyyo1fxcscm.webp', '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(13, 6, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290004/product_colors/mvfg6lowslulyea5tkti.webp', '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(14, 6, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290027/product_colors/mfauclkyrpvfqmyaavve.webp', '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(17, 7, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290319/product_colors/xrrakaxrzcdwcvnrj16h.webp', '2025-05-26 20:12:44', '2025-05-26 20:12:44'),
(18, 7, 7, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290335/product_colors/rmxim3c857kwkvcifzbk.webp', '2025-05-26 20:12:44', '2025-05-26 20:12:44'),
(20, 8, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290590/product_colors/z2kqb37vn72ssl8mo9ws.webp', '2025-05-26 20:16:36', '2025-05-26 20:16:36'),
(21, 9, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290830/product_colors/kgx4iwjp92uumfnt095l.webp', '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(22, 9, 4, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748290862/product_colors/yrd6fmsmbmqhnrkmd2sn.webp', '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(23, 10, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291108/product_colors/oylq98inckx0ffvhbb19.webp', '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(24, 10, 7, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291128/product_colors/v0eskydr7w0dr0hw3fxr.webp', '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(25, 10, 3, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291143/product_colors/xsexf29jrnznucqhmhre.webp', '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(26, 10, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291167/product_colors/rhvnyut7dfpiapoqdcoj.webp', '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(27, 11, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291444/product_colors/beyujkwca29nxyjd7puv.webp', '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(28, 11, 6, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291470/product_colors/fdydyoryodzhkdszyqy4.webp', '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(29, 11, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291493/product_colors/jlrcljtgkoiz82yh4a2l.webp', '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(30, 11, 9, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291511/product_colors/hidjrgg6py7k032gqpdz.webp', '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(31, 12, 4, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291803/product_colors/zsz9puxznysoct7r11ix.webp', '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(32, 12, 2, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291824/product_colors/qdz8wsl6hbyeco928cba.webp', '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(33, 12, 1, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748291842/product_colors/ixxmymwqvas5za9sl9e2.webp', '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(37, 2, 6, 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748306538/product_colors/xrqoj0odo1ovgfrtnnpe.webp', '2025-05-27 00:42:37', '2025-05-27 00:42:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `productsize`
--

CREATE TABLE `productsize` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `size_id` int(11) NOT NULL,
  `original_price` bigint(20) NOT NULL,
  `sale_price` bigint(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `productsize`
--

INSERT INTO `productsize` (`id`, `product_id`, `size_id`, `original_price`, `sale_price`, `quantity`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 500000, 450000, 2, '2025-05-25 01:23:50', '2025-05-26 15:16:58'),
(4, 3, 2, 350000, 160000, 20, '2025-05-26 19:12:08', '2025-05-26 19:12:08'),
(5, 3, 3, 350000, 170000, 20, '2025-05-26 19:12:08', '2025-05-26 19:12:08'),
(6, 3, 4, 350000, 180000, 20, '2025-05-26 19:12:08', '2025-05-26 19:12:08'),
(7, 4, 2, 230000, 160000, 20, '2025-05-26 19:24:44', '2025-05-26 19:24:44'),
(8, 4, 3, 230000, 170000, 20, '2025-05-26 19:24:44', '2025-05-26 19:24:44'),
(9, 4, 4, 230000, 175000, 20, '2025-05-26 19:24:44', '2025-05-26 19:24:44'),
(10, 5, 1, 278000, 139000, 20, '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(11, 5, 2, 278000, 139000, 20, '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(12, 5, 3, 278000, 139000, 10, '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(13, 5, 4, 278000, 142000, 90, '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(14, 5, 5, 278000, 145000, 30, '2025-05-26 19:51:12', '2025-05-26 19:51:12'),
(15, 6, 2, 250000, 165000, 19, '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(16, 6, 3, 250000, 170000, 40, '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(17, 6, 4, 250000, 175000, 10, '2025-05-26 20:08:47', '2025-05-26 20:08:47'),
(18, 9, 1, 159000, 90000, 10, '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(19, 9, 2, 159000, 92000, 19, '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(20, 9, 3, 158999, 94000, 30, '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(21, 9, 4, 159000, 96000, 40, '2025-05-26 20:21:57', '2025-05-26 20:21:57'),
(22, 10, 2, 258000, 140000, 9, '2025-05-26 20:26:53', '2025-05-27 00:58:53'),
(23, 10, 3, 257998, 142000, 20, '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(24, 10, 4, 258000, 145000, 30, '2025-05-26 20:26:53', '2025-05-26 20:26:53'),
(25, 11, 2, 220000, 134999, 10, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(26, 11, 3, 220000, 140000, 0, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(27, 11, 4, 220000, 140000, 1, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(28, 11, 1, 219999, 135000, 0, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(29, 11, 5, 220001, 149999, 10, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(30, 11, 6, 220000, 150000, 10, '2025-05-26 20:33:55', '2025-05-26 20:33:55'),
(31, 12, 2, 200000, 115000, 0, '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(32, 12, 3, 200000, 119999, 10, '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(33, 12, 4, 200000, 130000, 49, '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(34, 12, 5, 200000, 139999, 70, '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(35, 12, 6, 200000, 150000, 77, '2025-05-26 20:39:26', '2025-05-26 20:39:26'),
(39, 2, 2, 100000, 80000, 82, '2025-05-27 00:42:37', '2025-05-27 00:42:37');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `review`
--

CREATE TABLE `review` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `title` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `review`
--

INSERT INTO `review` (`id`, `product_id`, `user_id`, `rating`, `title`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 5, 'sản phẩm tốt', 'hay\n', '2025-05-25 09:46:49', '2025-05-25 09:46:49'),
(2, 12, 2, 5, 'ac', 'ac', '2025-05-27 00:55:06', '2025-05-27 00:55:06');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'Quản trị viên hệ thống', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'customer', 'Khách hàng', '2025-05-22 14:01:57', '2025-05-22 14:01:57');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `roleuser`
--

CREATE TABLE `roleuser` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `roleuser`
--

INSERT INTO `roleuser` (`id`, `user_id`, `role_id`, `created_at`, `updated_at`) VALUES
(7, 3, 1, '2025-05-26 04:54:24', '2025-05-26 04:54:24'),
(9, 2, 2, '2025-05-26 04:54:50', '2025-05-26 04:54:50'),
(10, 1, 2, '2025-05-26 05:07:25', '2025-05-26 05:07:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `shipment`
--

CREATE TABLE `shipment` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` bigint(20) NOT NULL,
  `estimated_days` int(11) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `shipment`
--

INSERT INTO `shipment` (`id`, `name`, `description`, `price`, `estimated_days`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Giao hàng tiêu chuẩn', 'Giao hàng trong 3-5 ngày', 30000, 5, 'active', '2025-05-22 14:01:57', '2025-05-25 17:45:38'),
(2, 'Giao hàng nhanh', 'Giao hàng trong 1-2 ngày', 50000, 2, 'active', '2025-05-22 14:01:57', '2025-05-25 17:45:43'),
(3, 'Giao hàng hỏa tốc', 'Giao hàng trong ngày', 100000, 1, 'active', '2025-05-22 14:01:57', '2025-05-25 17:45:49'),
(4, 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 500k', 0, 7, 'active', '2025-05-25 17:47:34', '2025-05-25 17:47:34'),
(5, 'Giao hàng tiết kiệm', 'Giao hàng trong 2-3 ngày', 25000, 3, 'active', '2025-05-26 18:07:16', '2025-05-26 18:07:16');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `size`
--

CREATE TABLE `size` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `size`
--

INSERT INTO `size` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'S', 'Size nhỏ', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(2, 'M', 'Size vừa', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(3, 'L', 'Size lớn', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(4, 'XL', 'Size rất lớn', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(5, 'XXL', 'Size cực lớn', '2025-05-22 14:01:57', '2025-05-22 14:01:57'),
(6, '3XL', NULL, '2025-05-26 19:49:14', '2025-05-26 19:49:14'),
(7, '4XL', NULL, '2025-05-26 19:49:14', '2025-05-26 19:49:14'),
(8, '5XL', NULL, '2025-05-26 19:49:14', '2025-05-26 19:49:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive','banned') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `first_name`, `last_name`, `phone`, `avatar`, `status`, `created_at`, `updated_at`) VALUES
(1, 'testuser1', 'test1@example.com', '$2a$10$wEuD0yQsu2RiKjC4DQtVs.60Paj9sH/p6JqaqRcmE/UM.8NmupxvK', 'Test', 'User', '0945698744', '', 'active', '2025-05-23 05:56:01', '2025-05-26 05:07:24'),
(2, 'Trần Đức Dũng', 'tranducdung17042004@gmail.com', '$2a$10$slt7Pc3ugBb2z.qw.IOfUeW4wxZBuXZ1HuYb8dqTxDEd8sPD/20Vy', 'Trần Đức', 'Dũng', '0123456789', 'https://res.cloudinary.com/dzfqqwnvl/image/upload/v1748026387/avatars/hhjc9jjeiowqfix6bsfy.jpg', 'active', '2025-05-23 11:46:19', '2025-05-26 09:34:48'),
(3, 'admin', 'admin@gmail.com', '$2a$10$U9K47eU0uWGFhVWk6OBSDu6fAZv3kVd/hnDeatUBicxTto0SS2hKq', 'Admin', 'User', '0934987346', 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIALcAxgMBIgACEQEDEQH/', 'active', '2025-05-24 16:31:31', '2025-05-26 04:54:24');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `useraddress`
--

CREATE TABLE `useraddress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `recipient_phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `useraddress`
--

INSERT INTO `useraddress` (`id`, `user_id`, `recipient_name`, `recipient_phone`, `address`, `is_default`, `created_at`, `updated_at`) VALUES
(1, 2, 'Trần Thị B', '0987654321', '456 Đường XYZ, Phường P, Quận Q, TP.HCM', 0, '2025-05-23 16:45:21', '2025-05-23 17:34:03'),
(2, 2, 'Nguyễn Văn B', '0901234567', '123 Đường ABC, Phường X, Quận Y, TP.HCM', 1, '2025-05-23 16:54:43', '2025-05-23 17:34:03'),
(3, 2, 'Nguyễn Thị Linh', '092528592', 'Thanh Xuân', 0, '2025-05-23 18:56:59', '2025-05-23 18:56:59'),
(4, 3, 'Dũng', '0234589732', 'Thanh Xuân', 0, '2025-05-26 10:04:31', '2025-05-26 10:04:31');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher`
--

CREATE TABLE `voucher` (
  `id` int(11) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` bigint(20) NOT NULL,
  `min_order_amount` bigint(20) DEFAULT 0,
  `max_discount_amount` bigint(20) DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `used_count` int(11) DEFAULT 0,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `status` enum('active','inactive','expired') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `voucher`
--

INSERT INTO `voucher` (`id`, `code`, `name`, `description`, `discount_type`, `discount_value`, `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`, `start_date`, `end_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10, 200000, 50000, 100, 0, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 'active', '2025-05-25 17:49:17', '2025-05-25 20:00:11'),
(2, 'SAVE50K', 'Giảm 50K', 'Giảm 50K cho đơn hàng từ 500K', 'fixed', 50000, 500000, NULL, 50, 0, '2024-01-01 00:00:00', '2025-12-31 23:59:59', 'active', '2025-05-25 17:49:17', '2025-05-25 20:00:55'),
(3, 'SUMMER20', 'Khuyến mãi hè', 'Giảm 20% tối đa 100K', 'percentage', 20, 300000, 100000, 200, 0, '2024-05-01 00:00:00', '2025-08-31 23:59:59', 'active', '2025-05-25 17:49:17', '2025-05-25 20:01:11'),
(4, 'CD7VIMP7', 'Giảm giá sâu', 'Giảm 30% cho đơn từ 400.000đ', 'percentage', 30, 400000, 150000, 70, 0, '2024-05-26 18:05:00', '2026-02-26 18:05:00', 'active', '2025-05-26 18:05:43', '2025-05-26 18:05:43');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `cartdetail`
--
ALTER TABLE `cartdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Chỉ mục cho bảng `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `color`
--
ALTER TABLE `color`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `order_status_id` (`order_status_id`),
  ADD KEY `payment_method_id` (`payment_method_id`),
  ADD KEY `payment_status_id` (`payment_status_id`),
  ADD KEY `shipment_id` (`shipment_id`),
  ADD KEY `voucher_id` (`voucher_id`),
  ADD KEY `user_address_id` (`user_address_id`);

--
-- Chỉ mục cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `color_id` (`color_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Chỉ mục cho bảng `orderstatus`
--
ALTER TABLE `orderstatus`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `paymentstatus`
--
ALTER TABLE `paymentstatus`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- Chỉ mục cho bảng `productcolor`
--
ALTER TABLE `productcolor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_color` (`product_id`,`color_id`),
  ADD UNIQUE KEY `productcolor_product_id_color_id` (`product_id`,`color_id`),
  ADD KEY `color_id` (`color_id`);

--
-- Chỉ mục cho bảng `productsize`
--
ALTER TABLE `productsize`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_product_size` (`product_id`,`size_id`),
  ADD UNIQUE KEY `productsize_product_id_size_id` (`product_id`,`size_id`),
  ADD KEY `size_id` (`size_id`);

--
-- Chỉ mục cho bảng `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Chỉ mục cho bảng `roleuser`
--
ALTER TABLE `roleuser`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_role` (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`);

--
-- Chỉ mục cho bảng `shipment`
--
ALTER TABLE `shipment`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `size`
--
ALTER TABLE `size`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Chỉ mục cho bảng `useraddress`
--
ALTER TABLE `useraddress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `cartdetail`
--
ALTER TABLE `cartdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `color`
--
ALTER TABLE `color`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `orderstatus`
--
ALTER TABLE `orderstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `paymentstatus`
--
ALTER TABLE `paymentstatus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `productcolor`
--
ALTER TABLE `productcolor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT cho bảng `productsize`
--
ALTER TABLE `productsize`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT cho bảng `review`
--
ALTER TABLE `review`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `roleuser`
--
ALTER TABLE `roleuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `shipment`
--
ALTER TABLE `shipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `size`
--
ALTER TABLE `size`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `useraddress`
--
ALTER TABLE `useraddress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `voucher`
--
ALTER TABLE `voucher`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `cartdetail`
--
ALTER TABLE `cartdetail`
  ADD CONSTRAINT `cartdetail_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartdetail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartdetail_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `cartdetail_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `order_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_ibfk_3` FOREIGN KEY (`order_status_id`) REFERENCES `orderstatus` (`id`),
  ADD CONSTRAINT `order_ibfk_4` FOREIGN KEY (`payment_method_id`) REFERENCES `paymentmethod` (`id`),
  ADD CONSTRAINT `order_ibfk_5` FOREIGN KEY (`payment_status_id`) REFERENCES `paymentstatus` (`id`),
  ADD CONSTRAINT `order_ibfk_6` FOREIGN KEY (`shipment_id`) REFERENCES `shipment` (`id`),
  ADD CONSTRAINT `order_ibfk_7` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `order_ibfk_8` FOREIGN KEY (`user_address_id`) REFERENCES `useraddress` (`id`);

--
-- Các ràng buộc cho bảng `orderdetail`
--
ALTER TABLE `orderdetail`
  ADD CONSTRAINT `orderdetail_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orderdetail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `orderdetail_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orderdetail_ibfk_4` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `product_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `productcolor`
--
ALTER TABLE `productcolor`
  ADD CONSTRAINT `productcolor_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productcolor_ibfk_2` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `productsize`
--
ALTER TABLE `productsize`
  ADD CONSTRAINT `productsize_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `productsize_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `size` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `roleuser`
--
ALTER TABLE `roleuser`
  ADD CONSTRAINT `roleuser_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `roleuser_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `useraddress`
--
ALTER TABLE `useraddress`
  ADD CONSTRAINT `useraddress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
