// header.js - مدیریت هدر داینامیک با منوی همبرگری

(function() {
    'use strict';

    // ===== تشخیص مسیر پایه =====
    function getBasePath() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();

        // اگر در ریشه هستیم
        const isRoot = path === '/' ||
                       path.endsWith('/main.html') ||
                       path.endsWith('/index.html') ||
                       path.split('/').filter(p => p.length > 0).length === 1;
        console.log(0)
        if (isRoot) {
            return '';
        }

        // محاسبه عمق
        const depth = (path.match(/\//g) || []).length - 1;
        console.log(path)

        
        if (path.includes('/pages/admin/')) return '../../';
        console.log(2)
        if (path.includes('/pages/')) return '../';
        console.log(1)
        if (path.includes('/game_page/')) return '../';
        console.log(3)
        if (path.includes('/online-tools_page/')) return '../';
        console.log(4)
        if (path.includes('/education_page/')) return '../';
        console.log(5)
        if (path.includes('/entertainment_page/')) return '../';
        console.log(6)
        if (path.includes('/general-info_page/')) return '../';
        console.log(7)
        if (path.includes('/auth/')) return '../';
        console.log(8)

        if (depth >= 2) {
            let base = '';
            for (let i = 0; i < depth; i++) {
                base += '../';
            }
            console.log(9)

            return base;
        }

        return '../';
    }

    // ===== منوهای هدر =====
    const navItems = [
        { label: 'خانه', href: 'main.html', icon: '🏠' },
        { label: 'ابزارها', href: 'pages/online-tools.html', icon: '🛠️' },
        { label: 'ماشین‌حساب', href: 'pages/calculator.html', icon: '🧮' },
        { label: 'بازی‌ها', href: 'pages/games.html', icon: '🎮' },
        { label: 'آموزش ها', href: 'pages/education.html', icon: '📚' },
        { label: 'وبلاگ', href: 'pages/blog.html', icon: '📝' },
        { label: 'سرگرمی', href: 'pages/entertainment.html', icon: '🎬' },
        { label: 'اطلاعات عمومی', href: 'pages/general-info.html', icon: '🌍' }
    ];

    // ===== ساخت هدر =====
    function createHeader() {
        const base = getBasePath();
        const currentPath = window.location.pathname;

        let navHtml = '';
        navItems.forEach(item => {
            const href = item.href.startsWith('http') ? item.href : base + item.href;
            const isActive = currentPath.includes(item.href) ||
                           (item.href === 'main.html' && (currentPath === '/' || currentPath.endsWith('/main.html')));
            const activeClass = isActive ? ' class="active"' : '';
            navHtml += `<li><a href="${href}"${activeClass} data-page="${item.href}">${item.icon} ${item.label}</a></li>`;
        });

        // دکمه‌های احراز هویت (توسط auth.js مدیریت می‌شه)
        console.log(base + "auth/login.html")
        const authHtml = `
            <div class="auth-buttons" id="authButtonsHeader">
                <a href="${base}auth/login.html" class="btn-login">ورود</a>
                <a href="${base}auth/register.html" class="btn-register">ثبت نام</a>
            </div>
        `;

        // منوی موبایل
        const mobileMenuHtml = `
            <button class="hamburger" id="hamburgerBtn" aria-label="باز کردن منو">
                <span></span>
                <span></span>
                <span></span>
            </button>
        `;

        return `
        <header>
            <div class="header-left">
                <div class="logo">
                    <h1>نوینیکس <span>Novinix</span></h1>
                </div>
                <nav class="desktop-nav">
                    <ul>${navHtml}</ul>
                </nav>
            </div>
            <div class="header-right">
                ${authHtml}
                ${mobileMenuHtml}
            </div>
        </header>

        <!-- ===== منوی موبایل ===== -->
        <div class="mobile-menu-overlay" id="mobileOverlay"></div>
        <nav class="mobile-menu" id="mobileMenu">
            <button class="close-btn" id="closeMenuBtn">✕</button>

            <div class="mobile-user" id="mobileUser">
                <span class="avatar">👤</span>
                <div class="user-info">
                    <div class="name">کاربر مهمان</div>
                    <div class="email">برای استفاده کامل وارد شوید</div>
                </div>
            </div>

            <ul id="mobileNavList">
                ${navItems.map(item => {
                    const href = item.href.startsWith('http') ? item.href : base + item.href;
                    const isActive = currentPath.includes(item.href) ||
                                   (item.href === 'main.html' && (currentPath === '/' || currentPath.endsWith('/main.html')));
                    const activeClass = isActive ? ' class="active"' : '';
                    return `<li><a href="${href}"${activeClass}><span class="icon">${item.icon}</span> ${item.label}</a></li>`;
                }).join('')}
            </ul>

            <div class="mobile-auth" id="mobileAuth">
                <a href="${base}auth/login.html" class="btn-login-mobile">🚪 ورود</a>
                <a href="${base}auth/register.html" class="btn-register-mobile">📝 ثبت نام</a>
            </div>
        </nav>
        `;
    }

    // ===== استایل هدر =====
    function injectHeaderStyles() {
        const styles = `
        /* ===== HEADER ===== */
        header {
            background: rgba(255, 255, 255, 0.04);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 12px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            position: sticky;
            top: 0;
            z-index: 100;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .header-right {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .logo h1 {
            font-size: 1.2rem;
            font-weight: 700;
            color: #00ffcc;
            text-shadow: 0 0 30px rgba(0, 255, 204, 0.15);
        }

        .logo h1 span {
            color: #a0b4c8;
            font-weight: 300;
            font-size: 0.7rem;
        }

        /* ===== منوی دسکتاپ ===== */
        .desktop-nav ul {
            display: flex;
            list-style: none;
            gap: 5px;
            flex-wrap: wrap;
        }

        .desktop-nav ul li a {
            color: #a0b4c8;
            text-decoration: none;
            padding: 5px 12px;
            border-radius: 30px;
            font-size: 0.75rem;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            font-weight: 500;
        }

        .desktop-nav ul li a:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.08);
            color: #00ffcc;
        }

        .desktop-nav ul li a.active {
            background: rgba(0, 255, 204, 0.12);
            border-color: rgba(0, 255, 204, 0.2);
            color: #00ffcc;
        }

        /* ===== دکمه‌های احراز هویت ===== */
        .auth-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .btn-login {
            background: rgba(255, 255, 255, 0.06);
            color: #a0b4c8;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 6px 16px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 0.78rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }

        .btn-login:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #00ffcc;
            border-color: rgba(0, 255, 204, 0.2);
        }

        .btn-register {
            background: linear-gradient(135deg, #00ffcc, #00b4db);
            color: #0f0c29;
            padding: 6px 18px;
            border-radius: 30px;
            text-decoration: none;
            font-size: 0.78rem;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 15px rgba(0, 255, 204, 0.15);
        }

        .btn-register:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 255, 204, 0.25);
        }

        /* ===== دکمه همبرگری ===== */
        .hamburger {
            display: none;
            flex-direction: column;
            gap: 5px;
            cursor: pointer;
            padding: 5px;
            background: none;
            border: none;
            z-index: 200;
        }

        .hamburger span {
            display: block;
            width: 28px;
            height: 3px;
            background: #e8f5f0;
            border-radius: 3px;
            transition: all 0.3s ease;
            transform-origin: center;
        }

        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
            opacity: 0;
            transform: scaleX(0);
        }

        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }

        /* ===== منوی موبایل ===== */
        .mobile-menu-overlay {
            display: none;
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
            z-index: 150;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .mobile-menu-overlay.open {
            display: block;
            opacity: 1;
        }

        .mobile-menu {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 320px;
            height: 100%;
            background: linear-gradient(180deg, #1a1a2e, #0f0c29);
            padding: 80px 25px 30px;
            transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 200;
            box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
            overflow-y: auto;
        }

        .mobile-menu.open {
            right: 0;
        }

        .mobile-menu .close-btn {
            position: absolute;
            top: 15px;
            left: 20px;
            background: none;
            border: none;
            color: #a0b4c8;
            font-size: 1.8rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .mobile-menu .close-btn:hover {
            color: #00ffcc;
            transform: rotate(90deg);
        }

        .mobile-menu .mobile-user {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.04);
            border-radius: 12px;
            margin-bottom: 20px;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .mobile-menu .mobile-user .avatar {
            font-size: 2.5rem;
        }

        .mobile-menu .mobile-user .user-info {
            flex: 1;
        }

        .mobile-menu .mobile-user .user-info .name {
            font-weight: 600;
            color: #e8f5f0;
        }

        .mobile-menu .mobile-user .user-info .email {
            font-size: 0.8rem;
            color: rgba(160, 180, 200, 0.5);
        }

        .mobile-menu ul {
            list-style: none;
            padding: 0;
        }

        .mobile-menu ul li {
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .mobile-menu ul li a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 10px;
            color: #a0b4c8;
            text-decoration: none;
            font-size: 0.95rem;
            transition: all 0.3s ease;
            border-radius: 8px;
        }

        .mobile-menu ul li a:hover,
        .mobile-menu ul li a.active {
            background: rgba(0, 255, 204, 0.08);
            color: #00ffcc;
        }

        .mobile-menu ul li a .icon {
            font-size: 1.2rem;
            width: 30px;
            text-align: center;
        }

        .mobile-menu .mobile-auth {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .mobile-menu .mobile-auth a {
            padding: 12px;
            border-radius: 12px;
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: all 0.3s ease;
        }

        .mobile-menu .mobile-auth .btn-login-mobile {
            background: rgba(255, 255, 255, 0.06);
            color: #a0b4c8;
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobile-menu .mobile-auth .btn-login-mobile:hover {
            background: rgba(255, 255, 255, 0.1);
            color: #00ffcc;
        }

        .mobile-menu .mobile-auth .btn-register-mobile {
            background: linear-gradient(135deg, #00ffcc, #00b4db);
            color: #0f0c29;
        }

        .mobile-menu .mobile-auth .btn-register-mobile:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 25px rgba(0, 255, 204, 0.25);
        }

        /* ===== RESPONSIVE HEADER ===== */
        @media (max-width: 768px) {
            .desktop-nav {
                display: none;
            }

            .auth-buttons {
                display: none !important;
            }

            .hamburger {
                display: flex;
            }

            header {
                padding: 10px 16px;
            }

            .header-left {
                gap: 10px;
            }

            .logo h1 {
                font-size: 1rem;
            }
        }

        @media (min-width: 769px) {
            .mobile-menu-overlay,
            .mobile-menu {
                display: none !important;
            }

            .hamburger {
                display: none !important;
            }
        }
        `;

        if (!document.querySelector('style#headerStyles')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'headerStyles';
            styleTag.textContent = styles;
            document.head.appendChild(styleTag);
        }
    }

    // ===== کنترل منوی همبرگری =====
    function initHamburgerMenu() {
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileOverlay = document.getElementById('mobileOverlay');
        const closeMenuBtn = document.getElementById('closeMenuBtn');

        if (!hamburgerBtn || !mobileMenu) return;

        function openMenu() {
            hamburgerBtn.classList.add('active');
            mobileMenu.classList.add('open');
            if (mobileOverlay) mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            hamburgerBtn.classList.remove('active');
            mobileMenu.classList.remove('open');
            if (mobileOverlay) mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        hamburgerBtn.addEventListener('click', function() {
            if (mobileMenu.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeMenu);
        }

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', closeMenu);
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                closeMenu();
            }
        });

        document.querySelectorAll('.mobile-menu ul li a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // به‌روزرسانی وضعیت ورود در منوی موبایل
        updateMobileUser();
    }

    // ===== به‌روزرسانی منوی موبایل =====
    function updateMobileUser() {
        const user = window.NovinixAuth ? window.NovinixAuth.getCurrentUserLocal() : null;
        const mobileUser = document.getElementById('mobileUser');
        const mobileAuth = document.getElementById('mobileAuth');

        const base = getBasePath();

        if (!mobileUser || !mobileAuth) return;

        if (user) {
            mobileUser.innerHTML = `
                <span class="avatar">${user.avatar || '👤'}</span>
                <div class="user-info">
                    <div class="name">${user.username}</div>
                    <div class="email">${user.email || 'خوش آمدید'}</div>
                </div>
            `;

            mobileAuth.innerHTML = `
                <a href="${base}auth/profile.html" class="btn-register-mobile" style="background:rgba(0,255,204,0.1);color:#00ffcc;border:1px solid rgba(0,255,204,0.15);">👤 پروفایل</a>
                <a href="${base}auth/logout.html" class="btn-login-mobile" style="background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.15);">🚪 خروج</a>
            `;
        } else {
            mobileUser.innerHTML = `
                <span class="avatar">👤</span>
                <div class="user-info">
                    <div class="name">کاربر مهمان</div>
                    <div class="email">برای استفاده کامل وارد شوید</div>
                </div>
            `;

            mobileAuth.innerHTML = `
                <a href="${base}auth/login.html" class="btn-login-mobile">🚪 ورود</a>
                <a href="${base}auth/register.html" class="btn-register-mobile">📝 ثبت نام</a>
            `;
        }
    }

    // ===== به‌روزرسانی دکمه‌های احراز هویت =====
    function updateAuthButtons() {
        const container = document.getElementById('authButtonsHeader');
        if (!container) return;

        const user = window.NovinixAuth ? window.NovinixAuth.getCurrentUserLocal() : null;
        const base = getBasePath();

        if (user) {
            container.innerHTML = `
                <a href="${base}auth/profile.html" class="btn-login" style="border-color:rgba(0,255,204,0.15);color:#00ffcc;">
                    ${user.avatar || '👤'} ${user.username}
                </a>
                <a href="${base}auth/logout.html" class="btn-login" style="border-color:rgba(239,68,68,0.15);color:#f87171;">
                    🚪 خروج
                </a>
            `;
        } else {
            container.innerHTML = `
                <a href="${base}auth/login.html" class="btn-login">ورود</a>
                <a href="${base}auth/register.html" class="btn-register">ثبت نام</a>
            `;
        }

        updateMobileUser();
    }

    // ===== بارگذاری هدر =====
    function loadHeader() {
        if (document.querySelector('header')) return;

        injectHeaderStyles();

        const headerHTML = createHeader();
        document.body.insertAdjacentHTML('afterbegin', headerHTML);

        initHamburgerMenu();
        updateAuthButtons();

        // گوش دادن به تغییرات وضعیت ورود
        document.addEventListener('authStatusChanged', updateAuthButtons);

        // گوش دادن به تغییرات storage
        window.addEventListener('storage', function(e) {
            if (e.key === 'novinix_current_user' || e.key === 'novinix_auth_timestamp') {
                updateAuthButtons();
            }
        });

        console.log('📌 Header loaded with hamburger menu!');
    }

    // ===== اجرا =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadHeader);
    } else {
        loadHeader();
    }

})();