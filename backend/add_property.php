<?php
// ============================================================
// add_property.php - Add a new property listing
// Method: POST
// Body: { owner_id, title, location, type, rent, description }
// ============================================================

require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$data        = json_decode(file_get_contents('php://input'), true);
$owner_id    = (int)($data['owner_id']    ?? 0);
$title       = trim($data['title']        ?? '');
$location    = trim($data['location']     ?? '');
$type        = trim($data['type']         ?? '');
$rent        = (float)($data['rent']      ?? 0);
$description = trim($data['description']  ?? '');

// --- Validation ---
if (!$owner_id || empty($title) || empty($location) || empty($type) || $rent <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required and rent must be > 0.']);
    exit();
}

if (!in_array($type, ['1BHK', '2BHK', 'PG'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid property type. Must be 1BHK, 2BHK, or PG.']);
    exit();
}

// --- Verify owner exists and has owner role ---
$pdo  = getDB();
$stmt = $pdo->prepare('SELECT id FROM users WHERE id = ? AND role = ?');
$stmt->execute([$owner_id, 'owner']);

if (!$stmt->fetch()) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Only registered owners can add properties.']);
    exit();
}

// --- Insert property ---
$stmt = $pdo->prepare(
    'INSERT INTO properties (owner_id, title, location, type, rent, description)
     VALUES (?, ?, ?, ?, ?, ?)'
);
$stmt->execute([$owner_id, $title, $location, $type, $rent, $description]);

$newId = $pdo->lastInsertId();

http_response_code(201);
echo json_encode([
    'success'     => true,
    'message'     => 'Property listed successfully!',
    'property_id' => $newId
]);
