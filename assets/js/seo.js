// seo.js - مدیریت سئو و متاتگ‌ها

(function() {
    'use strict';

    const SEO = {
        // ===== تنظیمات پیش‌فرض =====
        default: {
            title: 'نوینیکس | Novinix - مجموعه ابزارها و بازی‌های آنلاین',
            description: 'نوینیکس: مجموعه‌ای از ابزارهای آنلاین، ماشین‌حساب‌ها، بازی‌های نوستالژیک و سرگرمی‌های مفید',
            ogImage: 'https://novinix.ir/assets/images/og-image.jpg',
            ogUrl: 'https://novinix.ir',
            ogType: 'website',
            twitterCard: 'summary_large_image',
            keywords: 'ابزار آنلاین, ماشین حساب, بازی آنلاین, آموزش برنامه نویسی'
        },

        // ===== تنظیمات صفحات مختلف =====
        pages: {
            // صفحات اصلی
            'main.html': {
                title: 'نوینیکس | مجموعه ابزارها و بازی‌های آنلاین',
                description: 'مجموعه‌ای کامل از ابزارهای آنلاین، بازی‌های تعاملی و خدمات مفید',
                keywords: 'ابزار آنلاین, بازی آنلاین, ماشین حساب, آموزش برنامه نویسی'
            },
            'pages/online-tools.html': {
                title: 'ابزارهای آنلاین | نوینیکس',
                description: 'مجموعه‌ای از ابزارهای آنلاین کاربردی برای توسعه‌دهندگان، طراحان و کاربران عادی',
                keywords: 'ابزار آنلاین, ابزار توسعه, ابزار طراحی, برنامه نویسی'
            },
            'pages/calculator.html': {
                title: 'ماشین‌حساب مهندسی پیشرفته | نوینیکس',
                description: 'ماشین‌حساب مهندسی با قابلیت‌های پیشرفته شامل توابع مثلثاتی، لگاریتم، فاکتوریل و حافظه',
                keywords: 'ماشین حساب مهندسی, محاسبات پیشرفته, توابع مثلثاتی, ماشین حساب آنلاین'
            },
            'pages/games.html': {
                title: 'بازی‌های آنلاین | نوینیکس',
                description: 'مجموعه‌ای از بازی‌های کلاسیک و سرگرم‌کننده مانند مار، تتریس، دوز و حافظه',
                keywords: 'بازی آنلاین, بازی کلاسیک, سرگرمی, بازی رایگان'
            },
            'pages/education.html': {
                title: 'آموزش‌های برنامه‌نویسی | نوینیکس',
                description: 'آموزش جامع برنامه‌نویسی با پایتون، جاوا، React، فلاتر و هوش مصنوعی',
                keywords: 'آموزش برنامه نویسی, پایتون, جاوا, ری اکت, فلاتر, هوش مصنوعی'
            },
            'pages/blog.html': {
                title: 'وبلاگ نوینیکس | مقالات آموزشی و تکنولوژی',
                description: 'مجله نوینیکس: مقالات آموزشی، تکنولوژی، برنامه‌نویسی، طراحی و معرفی ابزارهای آنلاین',
                keywords: 'مقالات آموزشی, تکنولوژی, برنامه نویسی, طراحی وب, سئو'
            },
            'pages/entertainment.html': {
                title: 'سرگرمی | نوینیکس',
                description: 'موسیقی، فیلم، بازی‌های فکری و تفریحات جذاب در نوینیکس',
                keywords: 'سرگرمی, موسیقی, فیلم, بازی فکری, تفریح'
            },
            'pages/general-info.html': {
                title: 'اطلاعات عمومی | نوینیکس',
                description: 'دنیای شگفت‌انگیز حیوانات، پرندگان، آبزیان، ماشین‌ها و هواپیماها',
                keywords: 'اطلاعات عمومی, حیوانات, پرندگان, ماشین, هواپیما, آبزیان'
            },

            // صفحات اطلاعاتی
            'pages/about.html': {
                title: 'درباره ما | نوینیکس',
                description: 'با تیم نوینیکس آشنا شوید. مأموریت، ارزش‌ها و تیم ما',
                keywords: 'درباره ما, تیم نوینیکس, ماموریت'
            },
            'pages/contact.html': {
                title: 'تماس با ما | نوینیکس',
                description: 'ارسال پیام، پیشنهادات و انتقادات خود به تیم نوینیکس',
                keywords: 'تماس با ما, ارتباط با ما, ارسال پیام'
            },
            'pages/faq.html': {
                title: 'سوالات متداول | نوینیکس',
                description: 'پاسخ به سوالات رایج شما درباره نوینیکس',
                keywords: 'سوالات متداول, راهنما, پشتیبانی'
            },
            'pages/privacy.html': {
                title: 'حریم خصوصی | نوینیکس',
                description: 'سیاست حریم خصوصی نوینیکس - چگونه از اطلاعات شما محافظت می‌کنیم',
                keywords: 'حریم خصوصی, امنیت, حفاظت اطلاعات'
            },
            'pages/terms.html': {
                title: 'قوانین و مقررات | نوینیکس',
                description: 'قوانین و مقررات استفاده از خدمات نوینیکس',
                keywords: 'قوانین, مقررات, شرایط استفاده'
            },
            'pages/suggest-tool.html': {
                title: 'پیشنهاد ابزار جدید | نوینیکس',
                description: 'اگر ابزاری به ذهنتان می‌رسد که می‌تواند به دیگران کمک کند، آن را به ما پیشنهاد دهید',
                keywords: 'پیشنهاد ابزار, ابزار جدید, همکاری'
            },

            // صفحات ادمین
            'admin/suggestions.html': {
                title: 'مدیریت پیشنهادات | پنل ادمین نوینیکس',
                description: 'مدیریت و بررسی پیشنهادات ابزارهای جدید توسط کاربران',
                keywords: 'ادمین, مدیریت, پیشنهادات'
            },

            // صفحات احراز هویت
            'auth/login.html': {
                title: 'ورود | نوینیکس',
                description: 'وارد حساب کاربری خود در نوینیکس شوید',
                keywords: 'ورود, حساب کاربری'
            },
            'auth/register.html': {
                title: 'ثبت‌نام | نوینیکس',
                description: 'ایجاد حساب کاربری جدید در نوینیکس',
                keywords: 'ثبت نام, عضویت, حساب کاربری'
            },
            'auth/profile.html': {
                title: 'پروفایل کاربری | نوینیکس',
                description: 'مدیریت پروفایل کاربری، امتیازات و تاریخچه فعالیت‌ها',
                keywords: 'پروفایل, کاربری, امتیازات'
            },
            'auth/profile-edit.html': {
                title: 'ویرایش پروفایل | نوینیکس',
                description: 'ویرایش اطلاعات پروفایل کاربری',
                keywords: 'ویرایش پروفایل, تغییر اطلاعات'
            },
            'auth/leaderboard.html': {
                title: 'رتبه‌بندی | نوینیکس',
                description: 'جدول رتبه‌بندی کاربران بر اساس امتیازات',
                keywords: 'رتبه بندی, لیدربورد, امتیازات'
            },

            // صفحات خطا
            '404.html': {
                title: 'صفحه یافت نشد | نوینیکس',
                description: 'صفحه‌ای که به دنبال آن هستید پیدا نشد. به صفحه اصلی بازگردید.',
                keywords: 'خطا 404, صفحه پیدا نشد'
            }
        },

        // ===== دریافت تنظیمات صفحه =====
        getPageConfig: function(path) {
            // حذف slash ابتدا و انتها
            const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
            
            // بررسی تطابق دقیق
            if (this.pages[cleanPath]) {
                return this.pages[cleanPath];
            }
            
            // بررسی تطابق جزئی (برای صفحات با پارامتر)
            for (const [key, config] of Object.entries(this.pages)) {
                if (cleanPath.startsWith(key.replace(/\.html$/, ''))) {
                    return config;
                }
            }
            
            return this.default;
        },

        // ===== تنظیم متاتگ‌ها =====
        apply: function(path) {
            const pageConfig = this.getPageConfig(path);

            // به‌روزرسانی title
            document.title = pageConfig.title || this.default.title;

            // ===== متاتگ‌های اصلی =====
            const metaTags = {
                'description': pageConfig.description || this.default.description,
                'keywords': pageConfig.keywords || this.default.keywords,
                'viewport': 'width=device-width, initial-scale=1.0'
            };

            // ===== Open Graph =====
            const ogTags = {
                'og:title': pageConfig.title || this.default.title,
                'og:description': pageConfig.description || this.default.description,
                'og:url': (this.default.ogUrl + '/' + path).replace(/\/+/g, '/'),
                'og:image': this.default.ogImage,
                'og:type': this.default.ogType,
                'og:locale': 'fa_IR'
            };

            // ===== Twitter Cards =====
            const twitterTags = {
                'twitter:card': this.default.twitterCard,
                'twitter:title': pageConfig.title || this.default.title,
                'twitter:description': pageConfig.description || this.default.description,
                'twitter:image': this.default.ogImage
            };

            // ===== اعمال متاتگ‌ها =====
            this._setMetaTags(metaTags, 'name');
            this._setMetaTags(ogTags, 'property');
            this._setMetaTags(twitterTags, 'name');

            // ===== Canonical Link =====
            this._setCanonical((this.default.ogUrl + '/' + path).replace(/\/+/g, '/'));

            // ===== Structured Data (JSON-LD) =====
            this._setStructuredData(pageConfig);

            console.log('✅ متاتگ‌های سئو به‌روزرسانی شدند:', document.title);
        },

        // ===== تابع کمکی برای تنظیم متاتگ‌ها =====
        _setMetaTags: function(tags, attribute) {
            for (const [name, content] of Object.entries(tags)) {
                let meta = document.querySelector(`meta[${attribute}="${name}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute(attribute, name);
                    document.head.appendChild(meta);
                }
                meta.content = content;
            }
        },

        // ===== تنظیم Canonical Link =====
        _setCanonical: function(url) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.setAttribute('rel', 'canonical');
                document.head.appendChild(canonical);
            }
            canonical.href = url;
        },

        // ===== تنظیم Structured Data =====
        _setStructuredData: function(config) {
            // حذف داده‌های قبلی
            const oldScript = document.querySelector('script[type="application/ld+json"]');
            if (oldScript) {
                oldScript.remove();
            }

            const data = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                'name': config.title || this.default.title,
                'description': config.description || this.default.description,
                'url': this.default.ogUrl,
                'potentialAction': {
                    '@type': 'SearchAction',
                    'target': this.default.ogUrl + '/search?q={search_term_string}',
                    'query-input': 'required name=search_term_string'
                }
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(data, null, 2);
            document.head.appendChild(script);
        }
    };

    // ===== اجرا =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            const path = window.location.pathname.replace(/^\/+/, '') || 'main.html';
            SEO.apply(path);
        });
    } else {
        const path = window.location.pathname.replace(/^\/+/, '') || 'main.html';
        SEO.apply(path);
    }

    // ===== در معرض دید global =====
    window.SEO = SEO;

})();