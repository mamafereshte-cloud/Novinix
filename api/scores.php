<?php
/**
 * ============================================
 * API امتیازات نوینیکس
 * ============================================
 */

require_once __DIR__ . '/db.php';

$db = Database::getInstance();
$action = $_GET['action'] ?? '';

// ============================================
// ذخیره امتیاز بازی
// ============================================

if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();

    $username = trim($data['username'] ?? '');
    $gameId = trim($data['game_id'] ?? '');
    $score = (int)($data['score'] ?? 0);
    $details = isset($data['details']) ? json_encode($data['details']) : null;

    if (empty($username) || empty($gameId)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $user = $db->fetchOne(
        "SELECT id FROM users WHERE username = ?",
        [$username]
    );

    if (!$user) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $userId = $user['id'];

    // ذخیره امتیاز
    $db->query(
        "INSERT INTO game_scores (user_id, game_id, score, details, played_at) VALUES (?, ?, ?, ?, NOW())",
        [$userId, $gameId, $score, $details]
    );

    // ذخیره در تاریخچه
    $db->query(
        "INSERT INTO game_history (user_id, game_id, score, details, played_at) VALUES (?, ?, ?, ?, NOW())",
        [$userId, $gameId, $score, $details]
    );

    // به‌روزرسانی امتیاز کلی کاربر
    $db->query(
        "UPDATE users SET total_score = total_score + ?, games_played = games_played + 1 WHERE id = ?",
        [$score, $userId]
    );

    $newTotal = $db->fetchOne(
        "SELECT total_score FROM users WHERE id = ?",
        [$userId]
    );

    jsonResponse(true, 'امتیاز با موفقیت ثبت شد.', [
        'total_score' => $newTotal['total_score'],
        'game_score' => $score
    ]);
}

// ============================================
// دریافت امتیازات کاربر
// ============================================

if ($action === 'get' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $gameId = $_GET['game_id'] ?? '';

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $user = $db->fetchOne(
        "SELECT id FROM users WHERE username = ?",
        [$username]
    );

    if (!$user) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $userId = $user['id'];

    $sql = "SELECT game_id, score, details, played_at FROM game_scores WHERE user_id = ?";
    $params = [$userId];

    if (!empty($gameId)) {
        $sql .= " AND game_id = ?";
        $params[] = $gameId;
    }

    $sql .= " ORDER BY played_at DESC";

    $scores = $db->fetchAll($sql, $params);

    $bestScores = $db->fetchAll(
        "SELECT game_id, MAX(score) as best_score FROM game_scores WHERE user_id = ? GROUP BY game_id",
        [$userId]
    );

    jsonResponse(true, 'امتیازات دریافت شد.', [
        'scores' => $scores,
        'best_scores' => $bestScores
    ]);
}

// ============================================
// دریافت بهترین امتیاز یک بازی
// ============================================

if ($action === 'best' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $gameId = $_GET['game_id'] ?? '';

    if (empty($username) || empty($gameId)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $result = $db->fetchOne(
        "SELECT MAX(score) as best_score FROM game_scores
         WHERE user_id = (SELECT id FROM users WHERE username = ?) AND game_id = ?",
        [$username, $gameId]
    );

    jsonResponse(true, 'بهترین امتیاز دریافت شد.', [
        'best_score' => (int)($result['best_score'] ?? 0)
    ]);
}

// ============================================
// اگر هیچ عملیاتی انتخاب نشده باشد
// ============================================

jsonResponse(false, 'عملیات نامعتبر.', null, 400);