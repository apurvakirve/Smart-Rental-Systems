<?php
// ============================================================
// get_news.php - Fetch latest real estate news for India
// Method: GET
// URL: https://newsapi.org/v2/everything?q=real+estate+India&pageSize=5&apiKey=...
// Returns: { success, articles: [ { title, description, url, urlToImage, publishedAt, source: { name } } ] }
// ============================================================

require_once 'cors.php';
require_once 'config.php';

$apiKey = NEWS_API_KEY;
if ($apiKey === 'YOUR_NEWS_API_KEY') {
    echo json_encode(['success' => false, 'message' => 'News API key not configured.']);
    exit();
}

// Detect which API to use based on key format
// NewsData.io keys typically start with "pub_"
if (substr($apiKey, 0, 4) === 'pub_') {
    // --- NewsData.io Implementation ---
    // Use exact match for "real estate" and add "India" to ensure relevance
    $query = urlencode('"real estate" India');
    $url = "https://newsdata.io/api/1/news?apikey=$apiKey&q=$query&language=en&country=in";
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo json_encode(['success' => false, 'message' => 'CURL error: ' . $err]);
        exit();
    }

    $result = json_decode($response, true);
    if ($result['status'] === 'success') {
        $articles = array_map(function($a) {
            return [
                'title'        => $a['title'],
                'description'  => $a['description'] ?? '',
                'url'          => $a['link'],
                'urlToImage'   => $a['image_url'] ?? '',
                'publishedAt'  => $a['pubDate'],
                'sourceName'   => $a['source_id'] ?? 'News'
            ];
        }, array_slice($result['results'], 0, 6));

        echo json_encode(['success' => true, 'articles' => $articles]);
    } else {
        echo json_encode(['success' => false, 'message' => $result['results']['message'] ?? 'Failed to fetch news from NewsData.io']);
    }

} else {
    // --- NewsAPI.org Implementation ---
    $url = "https://newsapi.org/v2/everything?q=real+estate+India&pageSize=6&sortBy=publishedAt&apiKey=$apiKey";

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['User-Agent: SmartRentalAssistant/1.0']); 

    $response = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($err) {
        echo json_encode(['success' => false, 'message' => 'CURL error: ' . $err]);
        exit();
    }

    $result = json_decode($response, true);

    if (isset($result['status']) && $result['status'] === 'ok') {
        $articles = array_map(function($a) {
            return [
                'title'        => $a['title'],
                'description'  => $a['description'],
                'url'          => $a['url'],
                'urlToImage'   => $a['urlToImage'],
                'publishedAt'  => $a['publishedAt'],
                'sourceName'   => $a['source']['name']
            ];
        }, $result['articles']);

        echo json_encode(['success' => true, 'articles' => $articles]);
    } else {
        echo json_encode(['success' => false, 'message' => $result['message'] ?? 'Failed to fetch news from NewsAPI.org']);
    }
}
