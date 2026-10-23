<?php
/**
 * ============================================
 * تست اتصال به دیتابیس - نسخه JSON
 * ============================================
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

// غیرفعال کردن نمایش خطاها در خروجی
error_reporting(0);
ini_set('display_errors', 0);

try {
    require_once __DIR__ . '/db.php';
    
    $db = Database::getInstance();

    // دریافت کاربران
    $users = $db->fetchAll("SELECT id, username, email, total_score FROM users LIMIT 10");

    // پاسخ JSON
    echo json_encode([
        'success' => true,
        'message' => '✅ اتصال به دیتابیس با موفقیت برقرار شد!',
        'database' => DB_NAME,
        'users' => $users,
        'user_count' => count($users)
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '❌ خطا: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}