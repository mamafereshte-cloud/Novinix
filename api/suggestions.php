<?php
/**
 * ============================================
 * API پیشنهادات ابزارها - نوینیکس
 * ============================================
 * مسیر: /api/suggestions.php
 * ============================================
 */

require_once __DIR__ . '/db.php';

$db = Database::getInstance();
$action = $_GET['action'] ?? '';

// ============================================
// دریافت کاربر جاری
// ============================================

function getUserId($username) {
    global $db;
    $user = $db->fetchOne("SELECT id, username FROM users WHERE username = ?", [$username]);
    return $user;
}

// ============================================
// POST: ثبت پیشنهاد جدید
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonInput();
    
    $username = trim($data['username'] ?? '');
    $tool_name = trim($data['tool_name'] ?? '');
    $category = trim($data['category'] ?? '');
    $description = trim($data['description'] ?? '');
    $link = trim($data['link'] ?? '');

    // اعتبارسنجی
    if (empty($username)) {
        jsonResponse(false, 'لطفاً وارد شوید.');
    }

    if (empty($tool_name) || strlen($tool_name) < 2) {
        jsonResponse(false, 'نام ابزار باید حداقل ۲ کاراکتر باشد.');
    }

    if (empty($category)) {
        jsonResponse(false, 'لطفاً دسته‌بندی را انتخاب کنید.');
    }

    if (empty($description) || strlen($description) < 5) {
        jsonResponse(false, 'توضیحات باید حداقل ۵ کاراکتر باشد.');
    }

    if (strlen($description) > 500) {
        jsonResponse(false, 'توضیحات نباید بیشتر از ۵۰۰ کاراکتر باشد.');
    }

    // دریافت اطلاعات کاربر
    $user = getUserId($username);
    if (!$user) {
        jsonResponse(false, 'کاربر یافت نشد.');
    }

    // ذخیره در دیتابیس
    try {
        $db->query(
            "INSERT INTO tool_suggestions (user_id, tool_name, category, description, link, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')",
            [$user['id'], $tool_name, $category, $description, $link]
        );

        jsonResponse(true, 'پیشنهاد شما با موفقیت ثبت شد و در انتظار بررسی است.');
    } catch (PDOException $e) {
        jsonResponse(false, 'خطا در ذخیره پیشنهاد: ' . $e->getMessage());
    }
}

// ============================================
// GET: دریافت پیشنهادات (فقط ادمین)
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $username = $_GET['username'] ?? '';
    
    // بررسی ادمین بودن
    if ($username !== 'admin') {
        jsonResponse(false, 'شما دسترسی به این بخش ندارید.', null, 403);
    }

    $status = $_GET['status'] ?? '';
    $limit = (int)($_GET['limit'] ?? 50);
    $limit = min($limit, 100);

    $sql = "
        SELECT 
            ts.*,
            u.username,
            u.email,
            u.avatar
        FROM tool_suggestions ts
        JOIN users u ON ts.user_id = u.id
        WHERE 1=1
    ";
    $params = [];

    if (!empty($status) && in_array($status, ['pending', 'approved', 'rejected'])) {
        $sql .= " AND ts.status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY ts.created_at DESC LIMIT ?";
    $params[] = $limit;

    $suggestions = $db->fetchAll($sql, $params);

    // آمار
    $stats = $db->fetchAll(
        "SELECT status, COUNT(*) as count FROM tool_suggestions GROUP BY status"
    );
    $statsMap = [];
    foreach ($stats as $stat) {
        $statsMap[$stat['status']] = $stat['count'];
    }

    jsonResponse(true, 'پیشنهادات دریافت شد.', [
        'suggestions' => $suggestions,
        'stats' => [
            'total' => array_sum($statsMap),
            'pending' => $statsMap['pending'] ?? 0,
            'approved' => $statsMap['approved'] ?? 0,
            'rejected' => $statsMap['rejected'] ?? 0
        ]
    ]);
}

// ============================================
// PUT: به‌روزرسانی وضعیت پیشنهاد (فقط ادمین)
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonInput();
    
    $username = trim($data['username'] ?? '');
    $suggestion_id = (int)($data['id'] ?? 0);
    $status = trim($data['status'] ?? '');
    $admin_note = trim($data['admin_note'] ?? '');

    // بررسی ادمین
    if ($username !== 'admin') {
        jsonResponse(false, 'شما دسترسی به این بخش ندارید.', null, 403);
    }

    if (!$suggestion_id || !in_array($status, ['pending', 'approved', 'rejected'])) {
        jsonResponse(false, 'اطلاعات نامعتبر.');
    }

    try {
        $db->query(
            "UPDATE tool_suggestions SET status = ?, admin_note = ?, updated_at = NOW() WHERE id = ?",
            [$status, $admin_note, $suggestion_id]
        );

        jsonResponse(true, 'وضعیت پیشنهاد به‌روزرسانی شد.');
    } catch (PDOException $e) {
        jsonResponse(false, 'خطا در به‌روزرسانی: ' . $e->getMessage());
    }
}

// ============================================
// DELETE: حذف پیشنهاد (فقط ادمین)
// ============================================

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonInput();
    
    $username = trim($data['username'] ?? '');
    $suggestion_id = (int)($data['id'] ?? 0);

    if ($username !== 'admin') {
        jsonResponse(false, 'شما دسترسی به این بخش ندارید.', null, 403);
    }

    if (!$suggestion_id) {
        jsonResponse(false, 'شناسه پیشنهاد وارد نشده است.');
    }

    try {
        $db->query("DELETE FROM tool_suggestions WHERE id = ?", [$suggestion_id]);
        jsonResponse(true, 'پیشنهاد با موفقیت حذف شد.');
    } catch (PDOException $e) {
        jsonResponse(false, 'خطا در حذف: ' . $e->getMessage());
    }
}

// ============================================
// عملیات نامعتبر
// ============================================

jsonResponse(false, 'عملیات نامعتبر.', null, 400);