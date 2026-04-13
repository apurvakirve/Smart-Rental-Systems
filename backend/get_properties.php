<?php
// ============================================================
// get_properties.php - Fetch/filter properties
// Method: GET
// Query params (all optional): location, type, max_budget
// Returns: { success, properties: [...] }
// Each property includes computed price_status
// ============================================================

require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

$location   = trim($_GET['location']   ?? '');
$type       = trim($_GET['type']       ?? '');
$max_budget = isset($_GET['max_budget']) && $_GET['max_budget'] !== ''
              ? (float)$_GET['max_budget']
              : null;

// --- Build dynamic query ---
$where  = [];
$params = [];

if (!empty($location)) {
    $where[]  = 'LOWER(p.location) = LOWER(?)';
    $params[] = $location;
}
if (!empty($type)) {
    $where[]  = 'p.type = ?';
    $params[] = $type;
}
if ($max_budget !== null) {
    $where[]  = 'p.rent <= ?';
    $params[] = $max_budget;
}

$whereClause = count($where) ? 'WHERE ' . implode(' AND ', $where) : '';

$sql = "
    SELECT
        p.id,
        p.owner_id,
        p.title,
        p.location,
        p.type,
        p.rent,
        p.description,
        p.created_at,
        u.name AS owner_name,
        (SELECT AVG(p2.rent)
           FROM properties p2
          WHERE LOWER(p2.location) = LOWER(p.location)
            AND p2.type = p.type
            AND p2.id != p.id) AS avg_rent
    FROM properties p
    JOIN users u ON u.id = p.owner_id
    $whereClause
    ORDER BY p.created_at DESC
";

$pdo  = getDB();
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

// --- Compute price_status for each property ---
foreach ($rows as &$row) {
    $rent    = (float)$row['rent'];
    $avgRent = (float)$row['avg_rent'];

    if ($avgRent > 0) {
        if ($rent > $avgRent * 1.20) {
            $row['price_status'] = 'Overpriced';
        } elseif ($rent < $avgRent * 0.80) {
            $row['price_status'] = 'Underpriced';
        } else {
            $row['price_status'] = 'Fair';
        }
    } else {
        $row['price_status'] = 'Market New'; // First listing in this area/type
    }

    $row['avg_rent'] = $avgRent ? round($avgRent, 2) : null;
}
unset($row);

echo json_encode([
    'success'    => true,
    'count'      => count($rows),
    'properties' => $rows
]);
