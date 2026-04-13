<?php
// ============================================================
// get_gemini_insight.php - Fetch market insight for area+type
// Method: GET
// Query: ?location=Andheri&type=1BHK
// Returns: { success, market_avg, best_cost, reasoning }
// ============================================================

require_once 'cors.php';
require_once 'config.php';

$location = trim($_GET['location'] ?? '');
$type     = trim($_GET['type']     ?? '');

if (empty($location) || empty($type)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'location and type query params are required.']);
    exit();
}

$apiKey = GEMINI_API_KEY;
if ($apiKey === 'YOUR_GEMINI_API_KEY') {
    echo json_encode(['success' => false, 'message' => 'Gemini API key not configured.']);
    exit();
}

$url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$apiKey";

$prompt = "Act as a real estate expert in India. Provide market pricing insights for a '{$type}' property in '{$location}'.
Return only a valid JSON response with these keys:
- market_avg: Estimated average monthly rent in INR (number).
- best_cost: Suggested competitive listing rent for a quick deal in INR (number).
- reasoning: A short one-sentence explanation for these values.

Do not include any markdown or extra text, just the JSON object.";

$data = [
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt]
            ]
        ]
    ]
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
    echo json_encode(['success' => false, 'message' => 'CURL error: ' . $err]);
    exit();
}

$result = json_decode($response, true);
$text = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

// Basic sanitization in case Gemini includes markdown code blocks
$text = preg_replace('/^```json\s*|\s*```$/i', '', trim($text));
$insight = json_decode($text, true);

if ($insight) {
    echo json_encode(['success' => true] + $insight);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to parse AI response.', 'raw' => $text]);
}
