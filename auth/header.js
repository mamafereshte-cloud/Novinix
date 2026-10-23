/**
 * مدیریت هدر داینامیک نوینیکس
 */

(function() {
    'use strict';

    /**
     * تشخیص موقعیت فایل و ساخت مسیر
     */
    function getBasePath() {
        const path = window.location.pathname;

        // اگر در ریشه هستیم
        const isRoot = path === '/' ||
                       path.endsWith('/main.html') ||
                       path.endsWith('/index.html') ||
                       path.split('/').filter(p => p.length > 0).length === 1;

        if (isRoot) {
            return '';
        }

        // هر جای دیگری → '../'
        return '../';
    }

    function getFullPath(path) {
        const base = getBasePath();

        if (path.startsWith('/') || path.startsWith('../')) {
            return path;
        }

        return base + path;
    }

    /**
     * به‌روزرسانی هدر بر اساس وضعیت ورود کاربر
     */
    function updateHeader() {
        const authButtons = document.querySelector('.auth-buttons');
        if (!authButtons) {
            console.warn('⚠️ .auth-buttons not found');
            return;
        }

        const isLoggedIn = window.NovinixAuth && window.NovinixAuth.isLoggedIn();
        const user = window.NovinixAuth ? window.NovinixAuth.getCurrentUserLocal() : null;

        const base = getBasePath();

        if (isLoggedIn && user) {
            // کاربر وارد شده
            authButtons.innerHTML = `
                <a href="${base}auth/profile.html" class="btn-profile" style="
                    background: rgba(0, 255, 204, 0.08);
                    color: #00ffcc;
                    border: 1px solid rgba(0, 255, 204, 0.15);
                    padding: 6px 16px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.78rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                ">
                    ${user.avatar || '👤'} ${user.username}
                </a>
                <a href="${base}auth/logout.html" class="btn-logout" style="
                    background: rgba(239, 68, 68, 0.12);
                    color: #f87171;
                    border: 1px solid rgba(239, 68, 68, 0.15);
                    padding: 6px 16px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.78rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">
                    🚪 خروج
                </a>
            `;
        } else {
            // کاربر وارد نشده
            authButtons.innerHTML = `
                <a href="${base}auth/login.html" class="btn-login" style="
                    background: rgba(255, 255, 255, 0.06);
                    color: #a0b4c8;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 6px 16px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.78rem;
                    font-weight: 500;
                    transition: all 0.3s ease;
                ">
                    ورود
                </a>
                <a href="${base}auth/register.html" class="btn-register" style="
                    background: linear-gradient(135deg, #00ffcc, #00b4db);
                    color: #0f0c29;
                    padding: 6px 18px;
                    border-radius: 30px;
                    text-decoration: none;
                    font-size: 0.78rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 15px rgba(0, 255, 204, 0.15);
                ">
                    ثبت نام
                </a>
            `;
        }
    }

    // ============================================================
    // بارگذاری اولیه
    // ============================================================

    function init() {
        if (typeof window.NovinixAuth !== 'undefined') {
            updateHeader();
        } else {
            setTimeout(init, 200);
        }
    }

    document.addEventListener('authStatusChanged', updateHeader);

    window.addEventListener('storage', function(e) {
        if (e.key === 'novinix_current_user' || e.key === 'novinix_auth_timestamp') {
            updateHeader();
        }
    });

    if (document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    window.addEventListener('load', function() {
        setTimeout(updateHeader, 300);
    });

    console.log('🔄 Header Manager loaded!');
})();