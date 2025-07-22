-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2025 at 01:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sports`
--

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `sport_id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `quantity` int(11) NOT NULL,
  `img` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`sport_id`, `name`, `quantity`, `img`, `status`) VALUES
(1, 'ตะกร้อ', 6, '33b88c6b-4451-41cf-a70a-a352054693011739784609228.jpg', 1),
(2, 'ฟุตบอล', 10, '1f43da74-3738-49d0-a02c-f971f85f21d91739805086544.jpg', 1),
(3, 'บาสเกตบอล', 8, '1ca210ac-5d89-43bb-bb40-e2cb1b94f9941739789252112.avif', 1),
(4, 'วอลเลย์บอล', 11, '87c71fbe-fdec-4ecb-8767-834eef56e7341739805174249.jpg', 1),
(5, 'แชร์บอล', 2, 'df8ea59a-4ba7-47d4-b390-d4bed1250af11740121157891.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `stadium`
--

CREATE TABLE `stadium` (
  `stadium_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `img` varchar(100) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stadium`
--

INSERT INTO `stadium` (`stadium_id`, `name`, `img`, `status`) VALUES
(6, 'สนามวิ่ง', 'fb89f94c-d9e6-499b-8986-29066f73f0f01739358025371.jpg', 1),
(7, 'สนามฟุตบอล', '4ecd0803-0215-4de7-84d5-38a7d18413901739981964370.jpg', 1),
(8, 'สนามบาส', 'f5cc2a29-be75-477f-9193-13ab9b4f77711739981957847.jpg', 1),
(9, 'ฟุตซอลโรงยิม', '840b6933-ae76-4147-b253-2062148bb0071739982002103.jpg', 1),
(10, 'สนามร่วมใจ', '802d8a65-2427-4568-a0b2-bfd923a90e301740121233492.jpg', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `first_name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `phonenumber` varchar(10) NOT NULL,
  `roles` enum('External','Internal','Division','Sports') NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `first_name`, `last_name`, `password`, `phonenumber`, `roles`, `email`) VALUES
(8, 'Sport', 'Admin', '123', '0321556458', 'Sports', 'sportadmin@lru.ac.th'),
(19, 'Division', 'Admin', '123', '0321556458', 'Division', 'divisionadmin@lru.ac.th'),
(24, 'Apinat', 'pimkhor', '123', '7894651320', 'Internal', 'sb6540248145@lru.ac.th'),
(25, 'test', 'test', '123', '1234567890', 'External', 'test@gmail.com');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`sport_id`);

--
-- Indexes for table `stadium`
--
ALTER TABLE `stadium`
  ADD PRIMARY KEY (`stadium_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `sport_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stadium`
--
ALTER TABLE `stadium`
  MODIFY `stadium_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
