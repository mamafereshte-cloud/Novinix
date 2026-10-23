<?php
/**
 * ============================================
 * API احراز هویت نوینیکس
 * ============================================
 */

// غیرفعال کردن نمایش خطاها
error_reporting(0);
ini_set('display_errors', 0);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

// اطمینان از اینکه هیچ خروجی دیگری قبل از JSON نباشد
if (ob_get_length()) ob_clean();

$db = Database::getInstance();
$action = $_GET['action'] ?? '';

// ============================================
// ثبت‌نام کاربر
// ============================================

if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = getJsonInput();

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';
        $email = trim($data['email'] ?? '');

        if (empty($username) || strlen($username) < 3) {
            jsonResponse(false, 'نام کاربری باید حداقل ۳ کاراکتر باشد.');
        }

        if (empty($password) || strlen($password) < 6) {
            jsonResponse(false, 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
        }

        // اصلاح regex برای پشتیبانی از حروف فارسی
        if (!preg_match('/^[a-zA-Z0-9_\x{0600}-\x{06FF}\x{FB50}-\x{FDFF}\x{FE70}-\x{FEFF}]+$/u', $username)) {
            jsonResponse(false, 'نام کاربری فقط می‌تواند شامل حروف و اعداد باشد.');
        }

        $existing = $db->fetchOne(
            "SELECT id FROM users WHERE username = ?",
            [$username]
        );

        if ($existing) {
            jsonResponse(false, 'این نام کاربری قبلاً ثبت شده است.');
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $avatar = getAvatar($username);

        // حذف bio از کوئری اگر ستون وجود ندارد
        $db->query(
            "INSERT INTO users (username, password, email, avatar, created_at, last_login) VALUES (?, ?, ?, ?, NOW(), NOW())",
            [$username, $hashedPassword, $email, $avatar]
        );

        $userId = $db->lastInsertId();

        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won 
             FROM users WHERE id = ?",
            [$userId]
        );

        jsonResponse(true, 'ثبت‌نام با موفقیت انجام شد.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// ورود کاربر
// ============================================

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = getJsonInput();

        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            jsonResponse(false, 'لطفاً نام کاربری و رمز عبور را وارد کنید.');
        }

        $user = $db->fetchOne(
            "SELECT * FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );

        if (!$user) {
            jsonResponse(false, 'نام کاربری یا رمز عبور اشتباه است.');
        }

        if (!password_verify($password, $user['password'])) {
            jsonResponse(false, 'نام کاربری یا رمز عبور اشتباه است.');
        }

        // به‌روزرسانی آخرین ورود
        $db->query(
            "UPDATE users SET last_login = NOW() WHERE id = ?",
            [$user['id']]
        );

        // دریافت مجدد کاربر (بدون bio)
        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won 
             FROM users WHERE id = ?",
            [$user['id']]
        );

        jsonResponse(true, 'ورود با موفقیت انجام شد.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// خروج کاربر
// ============================================

if ($action === 'logout') {
    jsonResponse(true, 'خروج با موفقیت انجام شد.');
}

// ============================================
// دریافت اطلاعات کاربر جاری
// ============================================

if ($action === 'current' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $username = $_GET['username'] ?? '';

        if (empty($username)) {
            jsonResponse(false, 'نام کاربری وارد نشده است.');
        }

        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won
             FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );

        if (!$user) {
            jsonResponse(false, 'کاربر یافت نشد.');
        }

        jsonResponse(true, 'اطلاعات کاربر دریافت شد.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// بررسی نشست کاربر
// ============================================

if ($action === 'check' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $username = $_GET['username'] ?? '';

        if (empty($username)) {
            jsonResponse(false, 'نام کاربری وارد نشده است.');
        }

        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won
             FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );

        if (!$user) {
            jsonResponse(false, 'کاربر یافت نشد.', null, 401);
        }

        jsonResponse(true, 'نشست معتبر است.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// به‌روزرسانی پروفایل کاربر
// ============================================

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = getJsonInput();
        $username = trim($data['username'] ?? '');
        $bio = trim($data['bio'] ?? '');
        $avatar = trim($data['avatar'] ?? '');

        if (empty($username)) {
            jsonResponse(false, 'نام کاربری وارد نشده است.');
        }

        if (strlen($bio) > 500) {
            $bio = substr($bio, 0, 500);
        }

        // بررسی وجود ستون bio
        $columns = $db->fetchAll("SHOW COLUMNS FROM users");
        $hasBio = false;
        foreach ($columns as $col) {
            if ($col['Field'] === 'bio') {
                $hasBio = true;
                break;
            }
        }

        $updates = [];
        $params = [];

        if ($hasBio) {
            $updates[] = "bio = ?";
            $params[] = $bio;
        }

        if (!empty($avatar) && strlen($avatar) <= 10) {
            $updates[] = "avatar = ?";
            $params[] = $avatar;
        }

        if (empty($updates)) {
            jsonResponse(false, 'هیچ تغییری اعمال نشد.');
        }

        $params[] = $username;
        $sql = "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE username = ?";
        
        $db->query($sql, $params);

        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won
             FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );

        jsonResponse(true, 'پروفایل با موفقیت به‌روزرسانی شد.', $user);
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// آپلود عکس پروفایل
// ============================================

if ($action === 'upload_image' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $username = $_POST['username'] ?? '';
        
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
        
        if (!isset($_FILES['avatar_file']) || $_FILES['avatar_file']['error'] !== UPLOAD_ERR_OK) {
            jsonResponse(false, 'خطا در آپلود فایل.');
        }
        
        $file = $_FILES['avatar_file'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 800 * 1024;
        
        if (!in_array($file['type'], $allowedTypes)) {
            jsonResponse(false, 'فرمت فایل پشتیبانی نمی‌شود.');
        }
        
        if ($file['size'] > $maxSize) {
            jsonResponse(false, 'حجم فایل نباید بیشتر از ۸۰۰ کیلوبایت باشد.');
        }
        
        $uploadDir = __DIR__ . '/../uploads/avatars/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = $username . '_' . time() . '.' . $extension;
        $uploadPath = $uploadDir . $filename;
        
        if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
            jsonResponse(false, 'خطا در ذخیره فایل.');
        }
        
        // ایجاد تصویر دایره‌ای
        $circleFilename = $username . '_' . time() . '_circle.png';
        $circlePath = $uploadDir . $circleFilename;
        $circleImagePath = '/Novinix/uploads/avatars/' . $circleFilename;
        
        createCircularImage($uploadPath, $circlePath);
        @unlink($uploadPath);
        
        $db->query(
            "UPDATE users SET profile_image = ? WHERE username = ?",
            [$circleImagePath, $username]
        );
        
        $user = $db->fetchOne(
            "SELECT id, username, email, avatar, profile_image, created_at, last_login, total_score, games_played, games_won
             FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );
        
        jsonResponse(true, 'عکس پروفایل با موفقیت آپلود شد.', $user);
        
    } catch (Exception $e) {
        jsonResponse(false, 'خطا: ' . $e->getMessage());
    }
}

// ============================================
// توابع کمکی
// ============================================

function createCircularImage($sourcePath, $destPath) {
    $imageInfo = getimagesize($sourcePath);
    $mime = $imageInfo['mime'];
    
    switch ($mime) {
        case 'image/jpeg':
            $src = imagecreatefromjpeg($sourcePath);
            break;
        case 'image/png':
            $src = imagecreatefrompng($sourcePath);
            break;
        case 'image/gif':
            $src = imagecreatefromgif($sourcePath);
            break;
        case 'image/webp':
            $src = imagecreatefromwebp($sourcePath);
            break;
        default:
            throw new Exception('فرمت تصویر پشتیبانی نمی‌شود.');
    }
    
    $width = imagesx($src);
    $height = imagesy($src);
    $size = min($width, $height);
    
    $dest = imagecreatetruecolor($size, $size);
    imagesavealpha($dest, true);
    $transparent = imagecolorallocatealpha($dest, 0, 0, 0, 127);
    imagefill($dest, 0, 0, $transparent);
    
    $srcX = ($width - $size) / 2;
    $srcY = ($height - $size) / 2;
    
    imagecopyresampled($dest, $src, 0, 0, $srcX, $srcY, $size, $size, $size, $size);
    
    $mask = imagecreatetruecolor($size, $size);
    imagesavealpha($mask, true);
    $maskTransparent = imagecolorallocatealpha($mask, 0, 0, 0, 127);
    imagefill($mask, 0, 0, $maskTransparent);
    
    $white = imagecolorallocate($mask, 255, 255, 255);
    imagefilledellipse($mask, $size/2, $size/2, $size, $size, $white);
    imagecopymerge($dest, $mask, 0, 0, 0, 0, $size, $size, 100);
    
    imagepng($dest, $destPath, 9);
    
    imagedestroy($src);
    imagedestroy($dest);
    imagedestroy($mask);
}

function getAvatar($username) {
    $emojis = ['😊', '😎', '🤩', '🦊', '🐱', '🐶', '🐼', '🐨', '🦁', '🐯',
               '🐮', '🐷', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉',
               '🐴', '🐺', '🐗', '🐭', '🐹', '🐰', '🐻', '🐨', '🐼', '🐾'];
    $index = strlen($username) % count($emojis);
    return $emojis[$index];
}

// ============================================
// اگر هیچ عملیاتی انتخاب نشده باشد
// ============================================

jsonResponse(false, 'عملیات نامعتبر.', null, 400);