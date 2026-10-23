<?php
/**
 * ============================================
 * API پنل کاربری نوینیکس
 * ============================================
 * مسیر: /api/user-panel.php
 * ============================================
 */

require_once __DIR__ . '/db.php';

$db = Database::getInstance();
$action = $_GET['action'] ?? '';
$username = $_GET['username'] ?? '';

// دریافت user_id از username
function getUserId($username) {
    global $db;
    $user = $db->fetchOne("SELECT id FROM users WHERE username = ?", [$username]);
    return $user ? $user['id'] : null;
}

// ============================================
// ذخیره تاریخچه
// ============================================

if ($action === 'add_history' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $action_type = trim($data['action_type'] ?? '');
    $action_id = trim($data['action_id'] ?? '');
    $title = trim($data['title'] ?? '');
    $icon = trim($data['icon'] ?? '');
    $details = trim($data['details'] ?? '');
    $link = trim($data['link'] ?? '');

    if (empty($username) || empty($action_type) || empty($title)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $db->query(
        "INSERT INTO user_history (user_id, action_type, action_id, title, icon, details, link) 
         VALUES (?, ?, ?, ?, ?, ?, ?)",
        [$userId, $action_type, $action_id, $title, $icon, $details, $link]
    );

    // محدود کردن به ۱۰۰ آیتم
    $db->query(
        "DELETE FROM user_history WHERE user_id = ? AND id NOT IN (
            SELECT id FROM (
                SELECT id FROM user_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 100
            ) AS tmp
        )",
        [$userId, $userId]
    );

    jsonResponse(true, 'تاریخچه ذخیره شد.');
}

// ============================================
// دریافت تاریخچه
// ============================================

if ($action === 'get_history' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $limit = (int)($_GET['limit'] ?? 20);

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $history = $db->fetchAll(
        "SELECT id, action_type, action_id, title, icon, details, link, created_at 
         FROM user_history 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?",
        [$userId, $limit]
    );

    jsonResponse(true, 'تاریخچه دریافت شد.', $history);
}

// ============================================
// نشان‌گذاری
// ============================================

if ($action === 'toggle_favorite' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $type = trim($data['type'] ?? '');
    $item_id = trim($data['item_id'] ?? '');

    if (empty($username) || empty($type) || empty($item_id)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    // بررسی وجود
    $exists = $db->fetchOne(
        "SELECT id FROM user_favorites WHERE user_id = ? AND type = ? AND item_id = ?",
        [$userId, $type, $item_id]
    );

    if ($exists) {
        // حذف
        $db->query(
            "DELETE FROM user_favorites WHERE user_id = ? AND type = ? AND item_id = ?",
            [$userId, $type, $item_id]
        );
        jsonResponse(true, 'از علاقه‌مندی‌ها حذف شد.', ['action' => 'removed']);
    } else {
        // افزودن
        $db->query(
            "INSERT INTO user_favorites (user_id, type, item_id) VALUES (?, ?, ?)",
            [$userId, $type, $item_id]
        );
        jsonResponse(true, 'به علاقه‌مندی‌ها اضافه شد.', ['action' => 'added']);
    }
}

// ============================================
// دریافت علاقه‌مندی‌ها
// ============================================

if ($action === 'get_favorites' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $type = $_GET['type'] ?? '';

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $sql = "SELECT type, item_id FROM user_favorites WHERE user_id = ?";
    $params = [$userId];

    if (!empty($type)) {
        $sql .= " AND type = ?";
        $params[] = $type;
    }

    $favorites = $db->fetchAll($sql, $params);

    jsonResponse(true, 'علاقه‌مندی‌ها دریافت شد.', $favorites);
}

// ============================================
// ذخیره تاریخچه ماشین‌حساب
// ============================================

if ($action === 'add_calculator' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $expression = trim($data['expression'] ?? '');
    $result = trim($data['result'] ?? '');

    if (empty($username) || empty($expression)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $db->query(
        "INSERT INTO calculator_history (user_id, expression, result) VALUES (?, ?, ?)",
        [$userId, $expression, $result]
    );

    // محدود به ۵۰ آیتم
    $db->query(
        "DELETE FROM calculator_history WHERE user_id = ? AND id NOT IN (
            SELECT id FROM (
                SELECT id FROM calculator_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50
            ) AS tmp
        )",
        [$userId, $userId]
    );

    jsonResponse(true, 'تاریخچه محاسبه ذخیره شد.');
}

// ============================================
// دریافت تاریخچه ماشین‌حساب
// ============================================

if ($action === 'get_calculator' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $limit = (int)($_GET['limit'] ?? 20);

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $history = $db->fetchAll(
        "SELECT id, expression, result, created_at 
         FROM calculator_history 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?",
        [$userId, $limit]
    );

    jsonResponse(true, 'تاریخچه ماشین‌حساب دریافت شد.', $history);
}

// ============================================
// ذخیره تنظیمات
// ============================================

if ($action === 'save_settings' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $settings = $data['settings'] ?? [];

    if (empty($username) || empty($settings)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    foreach ($settings as $key => $value) {
        $db->query(
            "INSERT INTO user_settings (user_id, setting_key, setting_value) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE setting_value = ?",
            [$userId, $key, $value, $value]
        );
    }

    jsonResponse(true, 'تنظیمات ذخیره شد.');
}

// ============================================
// دریافت تنظیمات
// ============================================

if ($action === 'get_settings' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $settings = $db->fetchAll(
        "SELECT setting_key, setting_value FROM user_settings WHERE user_id = ?",
        [$userId]
    );

    $result = [];
    foreach ($settings as $item) {
        $result[$item['setting_key']] = $item['setting_value'];
    }

    jsonResponse(true, 'تنظیمات دریافت شد.', $result);
}

// ============================================
// به‌روزرسانی استفاده از ابزار
// ============================================

if ($action === 'update_tool_usage' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    $username = trim($data['username'] ?? '');
    $tool_id = trim($data['tool_id'] ?? '');

    if (empty($username) || empty($tool_id)) {
        jsonResponse(false, 'اطلاعات ناقص است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $db->query(
        "INSERT INTO tool_usage (user_id, tool_id, usage_count, last_used) 
         VALUES (?, ?, 1, NOW()) 
         ON DUPLICATE KEY UPDATE usage_count = usage_count + 1, last_used = NOW()",
        [$userId, $tool_id]
    );

    jsonResponse(true, 'آمار استفاده به‌روزرسانی شد.');
}

// ============================================
// دریافت آمار استفاده از ابزارها
// ============================================

if ($action === 'get_tool_usage' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    $limit = (int)($_GET['limit'] ?? 10);

    if (empty($username)) {
        jsonResponse(false, 'نام کاربری وارد نشده است.');
    }

    $userId = getUserId($username);
    if (!$userId) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    $usage = $db->fetchAll(
        "SELECT tool_id, usage_count, last_used 
         FROM tool_usage 
         WHERE user_id = ? 
         ORDER BY usage_count DESC 
         LIMIT ?",
        [$userId, $limit]
    );

    jsonResponse(true, 'آمار استفاده دریافت شد.', $usage);
}

// ============================================
// عملیات نامعتبر
// ============================================

jsonResponse(false, 'عملیات نامعتبر.', null, 400);