<?php
// ============================================================
// get_average_rent.php - Fetch average rent for location+type
// Method: GET
// Query: ?location=Andheri&type=1BHK
// Returns: { success, avg_rent, count, status }
// ============================================================

require_once 'cors.php';
require_once 'db.php';

$location = trim($_GET['location'] ?? '');
$type     = trim($_GET['type']     ?? '');

if (empty($location) || empty($type)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'location and type query params are required.']);
    exit();
}

$pdo  = getDB();
$stmt = $pdo->prepare(
    'SELECT AVG(rent) AS avg_rent, COUNT(*) AS total
       FROM properties
      WHERE LOWER(location) = LOWER(?)
        AND type = ?'
);
$stmt->execute([$location, $type]);
$row = $stmt->fetch();

$avgRent = $row['avg_rent'] ? round((float)$row['avg_rent'], 2) : null;
$count   = (int)$row['total'];

echo json_encode([
    'success'  => true,
    'avg_rent' => $avgRent,
    'count'    => $count,
    'message'  => $avgRent
        ? "Average rent for {$type} in {$location} is ₹{$avgRent} (based on {$count} listing(s))."
        : 'No similar properties found yet. Be the first!'
]);
