<?php
/**
 * ============================================
 * API رتبه‌بندی نوینیکس
 * ============================================
 * مسیر: /api/leaderboard.php
 * متدها: GET
 * ============================================
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

$db = Database::getInstance();
$action = $_GET['action'] ?? '';

// ============================================
// دریافت رتبه‌بندی کلی
// ============================================

if (($action === 'all' || $action === '') && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $limit = (int)($_GET['limit'] ?? 50);
        $limit = min($limit, 100);

        $users = $db->fetchAll(
            "SELECT id, username, avatar, total_score, games_played, games_won, created_at
             FROM users WHERE is_active = 1
             ORDER BY total_score DESC
             LIMIT ?",
            [$limit]
        );

        // افزودن رتبه (با استفاده از alias به جای کلمه رزرو شده)
        $rank = 1;
        foreach ($users as &$user) {
            $user['user_rank'] = $rank++;  // تغییر نام از rank به user_rank
            // دریافت تعداد بازی‌های انجام شده از game_scores
            $gameCount = $db->fetchOne(
                "SELECT COUNT(DISTINCT game_id) as count FROM game_scores WHERE user_id = ?",
                [$user['id']]
            );
            $user['games_count'] = (int)($gameCount['count'] ?? 0);
        }

        jsonResponse(true, 'رتبه‌بندی دریافت شد.', $users);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// دریافت رتبه یک کاربر خاص
// ============================================

if ($action === 'rank' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $username = $_GET['username'] ?? '';

        if (empty($username)) {
            jsonResponse(false, 'نام کاربری وارد نشده است.');
        }

        // دریافت رتبه کاربر - اصلاح کوئری
        $rankResult = $db->fetchOne(
            "SELECT COUNT(*) + 1 as user_rank FROM users
             WHERE total_score > (SELECT total_score FROM users WHERE username = ?)
             AND is_active = 1",
            [$username]
        );

        $user = $db->fetchOne(
            "SELECT id, username, avatar, total_score, games_played, games_won
             FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );

        if (!$user) {
            jsonResponse(false, 'کاربر یافت نشد.');
        }

        $user['user_rank'] = (int)($rankResult['user_rank'] ?? 1);

        jsonResponse(true, 'رتبه کاربر دریافت شد.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// دریافت رتبه‌بندی یک بازی خاص
// ============================================

if ($action === 'game' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $gameId = $_GET['game_id'] ?? '';
        $limit = (int)($_GET['limit'] ?? 20);

        if (empty($gameId)) {
            jsonResponse(false, 'شناسه بازی وارد نشده است.');
        }

        $scores = $db->fetchAll(
            "SELECT u.username, u.avatar, MAX(gs.score) as best_score, COUNT(gs.id) as plays
             FROM game_scores gs
             JOIN users u ON gs.user_id = u.id
             WHERE gs.game_id = ? AND u.is_active = 1
             GROUP BY gs.user_id
             ORDER BY best_score DESC
             LIMIT ?",
            [$gameId, $limit]
        );

        $rank = 1;
        foreach ($scores as &$score) {
            $score['user_rank'] = $rank++;
        }

        jsonResponse(true, 'رتبه‌بندی بازی دریافت شد.', $scores);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// اگر هیچ عملیاتی انتخاب نشده باشد
// ============================================

jsonResponse(false, 'عملیات نامعتبر.', null, 400);