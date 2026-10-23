-- ============================================================
-- دیتابیس نوینیکس - نصب کامل از صفر (بدون داده پیش‌فرض)
-- ============================================================
-- تاریخ: ۱۴۰۵-۰۶-۰۱
-- نسخه: ۳.۰
-- ============================================================

-- ============================================================
-- 1. حذف دیتابیس قدیمی (اگر وجود دارد)
-- ============================================================
DROP DATABASE IF EXISTS novinix;

-- ============================================================
-- 2. ایجاد دیتابیس جدید
-- ============================================================
CREATE DATABASE novinix 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- ============================================================
-- 3. استفاده از دیتابیس
-- ============================================================
USE novinix;

-- ============================================================
-- 4. جدول کاربران (users)
-- ============================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) DEFAULT '',
    avatar VARCHAR(10) DEFAULT '👤',
    bio VARCHAR(500) DEFAULT '',
    profile_image VARCHAR(255) DEFAULT '',
    total_score INT DEFAULT 0,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_total_score (total_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. جدول امتیازات بازی‌ها (game_scores)
-- ============================================================
CREATE TABLE game_scores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    score INT DEFAULT 0,
    details JSON,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_game (user_id, game_id),
    INDEX idx_game_id (game_id),
    INDEX idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. جدول تاریخچه بازی‌ها (game_history)
-- ============================================================
CREATE TABLE game_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    score INT DEFAULT 0,
    details JSON,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_history (user_id, played_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. جدول تاریخچه کاربران (user_history)
-- ============================================================
CREATE TABLE user_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    action_type ENUM('tool', 'game', 'calculator', 'article', 'login', 'profile') NOT NULL,
    action_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    icon VARCHAR(10) DEFAULT NULL,
    details TEXT DEFAULT NULL,
    link VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_history (user_id),
    INDEX idx_action_type (action_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. جدول علاقه‌مندی‌های کاربران (user_favorites)
-- ============================================================
CREATE TABLE user_favorites (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('tool', 'game', 'article') NOT NULL,
    item_id VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_favorite (user_id, type, item_id),
    INDEX idx_user_favorites (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. جدول تنظیمات کاربران (user_settings)
-- ============================================================
CREATE TABLE user_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    setting_key VARCHAR(50) NOT NULL,
    setting_value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_setting (user_id, setting_key),
    INDEX idx_user_settings (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. جدول تاریخچه ماشین‌حساب (calculator_history)
-- ============================================================
CREATE TABLE calculator_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    expression VARCHAR(255) NOT NULL,
    result VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_calculator (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. جدول آمار استفاده از ابزارها (tool_usage)
-- ============================================================
CREATE TABLE tool_usage (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tool_id VARCHAR(50) NOT NULL,
    usage_count INT DEFAULT 1,
    last_used DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tool (user_id, tool_id),
    INDEX idx_user_tool_usage (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. جدول مقالات (blog_posts)
-- ============================================================
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    excerpt TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'تیم نوینیکس',
    icon VARCHAR(10) DEFAULT '📄',
    image VARCHAR(255) DEFAULT '',
    read_time VARCHAR(20) DEFAULT '۵ دقیقه',
    views INT DEFAULT 0,
    tags VARCHAR(255) DEFAULT '',
    is_published TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_category (category),
    INDEX idx_views (views),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. جدول نظرات مقالات (blog_comments)
-- ============================================================
CREATE TABLE blog_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    author_name VARCHAR(100) DEFAULT 'ناشناس',
    author_email VARCHAR(100) DEFAULT '',
    content TEXT NOT NULL,
    is_approved TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_post_comments (post_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. جدول پیشنهادات ابزارها (tool_suggestions)
-- ============================================================
CREATE TABLE tool_suggestions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    link VARCHAR(255) DEFAULT '',
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_note TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. جدول پیام‌های تماس (contact_messages)
-- ============================================================
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. نمایش نتیجه نهایی
-- ============================================================
SELECT '✅ دیتابیس با موفقیت ایجاد شد!' AS 'Status';

SELECT '📊 لیست جداول:' AS '';
SHOW TABLES;

SELECT '📋 ساختار جدول users:' AS '';
DESCRIBE users;

SELECT '📋 ساختار جدول tool_suggestions:' AS '';
DESCRIBE tool_suggestions;

SELECT '📊 تعداد جداول:' AS '';
SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = 'novinix';

SELECT '✅ نصب کامل شد! موفق باشید 🎉' AS 'Final';