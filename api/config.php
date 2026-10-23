<?php
/**
 * ============================================
 * تنظیمات دیتابیس نوینیکس
 * ============================================
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'novinix');
define('DB_USER', 'root');
define('DB_PASS', '');

define('JWT_SECRET', 'novinix_super_secret_key_2026');

// ===== غیرفعال کردن نمایش خطاها در خروجی =====
error_reporting(0);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

// ===== لاگ خطاها در فایل =====
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// ===== تنظیمات CORS =====
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Username');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ===== زمان ایران =====
date_default_timezone_set('Asia/Tehran');

// ===== توابع کمکی =====
function jsonResponse($success, $message, $data = null, $statusCode = 200) {
    // پاک کردن بافر قبل از ارسال JSON
    if (ob_get_length()) {
        ob_clean();
    }
    
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?: [];
}