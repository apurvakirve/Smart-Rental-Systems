-- ============================================================
-- Smart Rental Assistant - Database Setup
-- Import this file via phpMyAdmin or MySQL CLI:
--   mysql -u root -p < database.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS smart_rental_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE smart_rental_db;

-- -------------------------------------------------------
-- Table: users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id         INT          NOT NULL AUTO_INCREMENT,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('user','owner') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Table: properties
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id          INT          NOT NULL AUTO_INCREMENT,
  owner_id    INT          NOT NULL,
  title       VARCHAR(200) NOT NULL,
  location    VARCHAR(150) NOT NULL,
  type        ENUM('1BHK','2BHK','PG') NOT NULL,
  rent        DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_property_owner
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- Seed Data: Sample users (passwords = "password123")
-- hash generated with PHP: password_hash('password123', PASSWORD_DEFAULT)
-- -------------------------------------------------------
INSERT INTO users (name, email, password, role) VALUES
('Amit Sharma',  'amit@example.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner'),
('Priya Mehta',  'priya@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'owner'),
('Rahul Verma',  'rahul@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user'),
('Neha Singh',   'neha@example.com',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- -------------------------------------------------------
-- Seed Data: Sample properties
-- -------------------------------------------------------
INSERT INTO properties (owner_id, title, location, type, rent, description) VALUES
(1, 'Cozy 1BHK in Andheri',        'Andheri',   '1BHK', 18000, 'Well-furnished flat near metro station. 24x7 security.'),
(1, 'Spacious 2BHK in Andheri',    'Andheri',   '2BHK', 32000, 'Modern kitchen, parking included, society amenities.'),
(1, 'PG for Working Professionals', 'Andheri',  'PG',   8500,  'AC room, meals included, WiFi. Girls only.'),
(2, 'Budget 1BHK in Thane',        'Thane',     '1BHK', 14000, 'Ground floor, east facing, close to railway station.'),
(2, 'Premium 2BHK in Thane',       'Thane',     '2BHK', 27000, 'New construction, modular kitchen, gym access.'),
(2, 'PG near IT Park Pune',        'Pune',      'PG',   7000,  'Near Hinjewadi IT park. AC with meals. Co-ed.'),
(1, 'Affordable 1BHK Thane',       'Thane',     '1BHK', 13500, 'Compact but complete. Ideal for single professional.'),
(2, 'Luxury 2BHK Bandra',         'Bandra',    '2BHK', 55000, 'Sea view, fully furnished. Premium society.'),
(1, '1BHK Bandra West',            'Bandra',    '1BHK', 28000, 'Prime location. Walking distance to market.'),
(2, 'Affordable PG Andheri',       'Andheri',   'PG',   7500,  'Triple sharing option available. Near bus stop.');

-- -------------------------------------------------------
-- Done
-- -------------------------------------------------------
