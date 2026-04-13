<?php
// ============================================================
// register.php - User Registration
// Method: POST
// Body: { name, email, password, role }
// ============================================================

require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Read JSON body
$data = json_decode(file_get_contents('php://input'), true);

$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password = trim($data['password'] ?? '');
$role     = trim($data['role']     ?? 'user');

// --- Validation ---
if (empty($name) || empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name, email, and password are required.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit();
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters.']);
    exit();
}

if (!in_array($role, ['user', 'owner'])) {
    $role = 'user';
}

// --- Check duplicate email ---
$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);

if ($stmt->fetch()) {
    http_response_code(409);
    echo json_encode(['success' => false, 'message' => 'Email is already registered.']);
    exit();
}

// --- Insert user ---
$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt   = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
$stmt->execute([$name, $email, $hashed, $role]);

http_response_code(201);
echo json_encode([
    'success' => true,
    'message' => 'Registration successful. Please login.'
]);
