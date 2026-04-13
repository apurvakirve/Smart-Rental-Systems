<?php
// ============================================================
// Smart Rental Assistant - Database Connection (PDO)
// ============================================================

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'smart_rental_db');
define('DB_USER', 'root'); // Change if your MySQL user is different
define('DB_PASS', '12345'); // Change to your MySQL password
define('DB_PORT', '3301');

function getDB()
{
    static $pdo = null;

    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        }
        catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]);
            exit();
        }
    }

    return $pdo;
}
