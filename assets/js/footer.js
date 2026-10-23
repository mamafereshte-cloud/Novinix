// footer.js - فوتر داینامیک

(function() {
    'use strict';

    // ===== تشخیص مسیر پایه =====
    function getBasePath() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();

        const isRoot = path === '/' ||
                       path.endsWith('/main.html') ||
                       path.endsWith('/index.html') ||
                       path.split('/').filter(p => p.length > 0).length === 1;

        if (isRoot) return '';

        const depth = (path.match(/\//g) || []).length - 1;

        if (path.includes('/pages/admin/')) return '../../';
        if (path.includes('/pages/')) return '../';
        if (path.includes('/game_page/')) return '../';
        if (path.includes('/online-tools_page/')) return '../';
        if (path.includes('/education_page/')) return '../';
        if (path.includes('/entertainment_page/')) return '../';
        if (path.includes('/general-info_page/')) return '../';
        if (path.includes('/auth/')) return '../';

        if (depth >= 2) {
            let base = '';
            for (let i = 0; i < depth; i++) {
                base += '../';
            }
            return base;
        }

        return '../';
    }

    // ===== ساخت فوتر =====
    function createFooter() {
        const base = getBasePath();

        return `
        <footer>
            <div class="footer-container">
                <!-- ستون اول: لوگو و توضیحات -->
                <div class="footer-col">
                    <div class="footer-logo">
                        <h2>نوینیکس <span>Novinix</span></h2>
                    </div>
                    <p class="footer-desc">
                        مجموعه‌ای کامل از ابزارهای آنلاین، بازی‌های تعاملی، 
                        آموزش‌های برنامه‌نویسی و خدمات مفید برای همه
                    </p>
                </div>

                <!-- ستون دوم: لینک‌های سریع -->
                <div class="footer-col">
                    <h4>🔗 لینک‌های سریع</h4>
                    <ul class="footer-links">
                        <li><a href="${base}main.html">🏠 خانه</a></li>
                        <li><a href="${base}pages/online-tools.html">🛠️ ابزارها</a></li>
                        <li><a href="${base}pages/games.html">🎮 بازی‌ها</a></li>
                        <li><a href="${base}pages/education.html">📚 آموزش‌ها</a></li>
                        <li><a href="${base}pages/blog.html">📝 وبلاگ</a></li>
                        <li><a href="${base}pages/entertainment.html">🎬 سرگرمی</a></li>
                    </ul>
                </div>

                <!-- ستون سوم: اطلاعات -->
                <div class="footer-col">
                    <h4>ℹ️ اطلاعات</h4>
                    <ul class="footer-links">
                        <li><a href="${base}pages/about.html">📖 درباره ما</a></li>
                        <li><a href="${base}pages/suggest-tool.html">💡 پیشنهاد ابزار</a></li>
                        <li><a href="${base}pages/contact.html">📬 تماس با ما</a></li>
                        <li><a href="${base}pages/privacy.html">🔒 حریم خصوصی</a></li>
                        <li><a href="${base}pages/terms.html">📝 قوانین</a></li>
                        <li><a href="${base}pages/faq.html">❓ سوالات متداول</a></li>
                    </ul>
                </div>

                <!-- ستون چهارم: تماس -->
                <div class="footer-col">
                    <h4>📬 ارتباط با ما</h4>
                    <div class="footer-contact">
                        <p>📧 <a href="mailto:info@novinix.ir">info@novinix.ir</a></p>
                        <p>📱 <a href="tel:+989356494021">۰۹۳۵-۶۴۹-۴۰۲۱</a></p>
                        <p>📍 قم، ایران</p>
                    </div>
                </div>
            </div>

            <!-- پایین فوتر -->
            <div class="footer-bottom">
                <p>
                    &copy; ۲۰۲۶ <strong>نوینیکس - Novinix</strong> | 
                    تمامی حقوق محفوظ است
                    <span class="footer-separator">•</span>
                    طراحی و توسعه توسط <strong>تیم نوینیکس</strong>
                </p>
            </div>
        </footer>
        `;
    }

    // ===== استایل فوتر =====
    function injectFooterStyles() {
        const styles = `
        /* ===== FOOTER ===== */
        footer {
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            margin-top: auto;
            padding-top: 0;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 50px 20px 30px;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 40px;
        }

        .footer-col h4 {
            color: #00ffcc;
            font-size: 1rem;
            font-weight: 700;
            margin-bottom: 18px;
            letter-spacing: 0.5px;
            position: relative;
            padding-bottom: 10px;
        }

        .footer-col h4::after {
            content: '';
            position: absolute;
            bottom: 0;
            right: 0;
            width: 30px;
            height: 2px;
            background: linear-gradient(90deg, #00ffcc, transparent);
            border-radius: 2px;
        }

        .footer-logo h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #00ffcc;
            text-shadow: 0 0 30px rgba(0, 255, 204, 0.15);
            margin-bottom: 12px;
        }

        .footer-logo h2 span {
            color: #a0b4c8;
            font-weight: 300;
            font-size: 0.8rem;
        }

        .footer-desc {
            color: #a0b4c8;
            font-size: 0.9rem;
            line-height: 1.8;
            max-width: 300px;
            margin-bottom: 18px;
        }

        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-links li {
            margin-bottom: 10px;
        }

        .footer-links li a {
            color: #a0b4c8;
            text-decoration: none;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .footer-links li a:hover {
            color: #00ffcc;
            transform: translateX(-5px);
        }

        .footer-contact p {
            color: #a0b4c8;
            font-size: 0.85rem;
            margin: 6px 0;
        }

        .footer-contact a {
            color: #a0b4c8;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer-contact a:hover {
            color: #00ffcc;
        }

        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.04);
            padding: 20px 20px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .footer-bottom p {
            color: rgba(160, 180, 200, 0.5);
            font-size: 0.8rem;
        }

        .footer-bottom p strong {
            color: rgba(160, 180, 200, 0.7);
        }

        .footer-separator {
            margin: 0 8px;
            color: rgba(255, 255, 255, 0.1);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 992px) {
            .footer-container {
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                padding: 40px 20px 25px;
            }
        }

        @media (max-width: 600px) {
            .footer-container {
                grid-template-columns: 1fr;
                gap: 25px;
                padding: 30px 16px 20px;
                text-align: center;
            }

            .footer-col h4::after {
                right: 50%;
                transform: translateX(50%);
            }

            .footer-desc {
                max-width: 100%;
                margin: 0 auto 18px;
            }

            .footer-links li a:hover {
                transform: none;
            }

            .footer-bottom {
                flex-direction: column;
                text-align: center;
                padding: 16px 16px 14px;
            }
        }
        `;

        if (!document.querySelector('style#footerStyles')) {
            const styleTag = document.createElement('style');
            styleTag.id = 'footerStyles';
            styleTag.textContent = styles;
            document.head.appendChild(styleTag);
        }
    }

    // ===== بارگذاری فوتر =====
    function loadFooter() {
        if (document.querySelector('footer')) return;

        injectFooterStyles();

        const footerHTML = createFooter();
        document.body.insertAdjacentHTML('beforeend', footerHTML);

        console.log('📌 Footer loaded!');
    }

    // ===== اجرا =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFooter);
    } else {
        loadFooter();
    }

})();