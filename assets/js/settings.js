// settings.js - مدیریت تنظیمات کاربر (تم، فونت، زبان و ...)

(function() {
    'use strict';

    const Settings = {
        // ===== کلیدهای localStorage =====
        keys: {
            THEME: 'novinix_theme',
            FONT_SIZE: 'novinix_font_size',
            LANGUAGE: 'novinix_language',
            FAVORITES: 'novinix_favorites',
            HISTORY: 'novinix_history',
            NOTIFICATIONS: 'novinix_notifications',
            LAST_VISIT: 'novinix_last_visit'
        },

        // ===== تنظیمات پیش‌فرض =====
        defaults: {
            theme: 'dark',      // 'dark' | 'light' | 'system'
            fontSize: 'medium', // 'small' | 'medium' | 'large'
            language: 'fa',     // 'fa' | 'en'
            notifications: true
        },

        // ===== دریافت تنظیمات =====
        get: function(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                if (value === null) return defaultValue;
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            } catch {
                return defaultValue;
            }
        },

        // ===== ذخیره تنظیمات =====
        set: function(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch {
                return false;
            }
        },

        // ===== دریافت با fallback به پیش‌فرض =====
        getWithDefault: function(key) {
            const value = this.get(key);
            if (value === null || value === undefined) {
                return this.defaults[key] || null;
            }
            return value;
        },

        // ===== دریافت همه تنظیمات =====
        getAll: function() {
            const result = {};
            for (const key of Object.keys(this.defaults)) {
                result[key] = this.getWithDefault(key);
            }
            return result;
        },

        // ===== ذخیره همه تنظیمات =====
        setAll: function(settings) {
            for (const [key, value] of Object.entries(settings)) {
                if (key in this.defaults) {
                    this.set(key, value);
                }
            }
            this.applyAll();
            return true;
        },

        // ===== اعمال همه تنظیمات =====
        applyAll: function() {
            const theme = this.getWithDefault('theme');
            this.applyTheme(theme);

            const fontSize = this.getWithDefault('fontSize');
            this.applyFontSize(fontSize);

            const language = this.getWithDefault('language');
            this.applyLanguage(language);

            const notifications = this.getWithDefault('notifications');
            this.applyNotifications(notifications);
        },

        // ===== تم =====
        toggleTheme: function() {
            const current = this.getWithDefault('theme');
            const themes = ['dark', 'light', 'system'];
            const currentIndex = themes.indexOf(current);
            const nextIndex = (currentIndex + 1) % themes.length;
            const newTheme = themes[nextIndex];
            this.set('theme', newTheme);
            this.applyTheme(newTheme);
            return newTheme;
        },

        applyTheme: function(theme) {
            // تنظیم attribute روی html
            document.documentElement.setAttribute('data-theme', theme);

            // تشخیص تم سیستم
            let actualTheme = theme;
            if (theme === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            // اعمال تم
            if (actualTheme === 'light') {
                document.body.style.background = '#f0f2f5';
                document.body.style.color = '#1a1a2e';
                document.documentElement.style.setProperty('--bg-primary', '#ffffff');
                document.documentElement.style.setProperty('--bg-secondary', '#f8f9fa');
                document.documentElement.style.setProperty('--text-primary', '#1a1a2e');
                document.documentElement.style.setProperty('--text-secondary', '#4a5a6e');
                document.documentElement.style.setProperty('--border-color', '#e0e5ec');
                document.documentElement.style.setProperty('--card-bg', '#ffffff');
                document.documentElement.style.setProperty('--shadow', '0 2px 20px rgba(0,0,0,0.08)');
            } else {
                document.body.style.background = '#0f0c29';
                document.body.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
                document.body.style.color = '#e8f5f0';
                document.documentElement.style.setProperty('--bg-primary', '#0f0c29');
                document.documentElement.style.setProperty('--bg-secondary', '#1a1a2e');
                document.documentElement.style.setProperty('--text-primary', '#e8f5f0');
                document.documentElement.style.setProperty('--text-secondary', '#a0b4c8');
                document.documentElement.style.setProperty('--border-color', 'rgba(255,255,255,0.06)');
                document.documentElement.style.setProperty('--card-bg', 'rgba(255,255,255,0.04)');
                document.documentElement.style.setProperty('--shadow', '0 10px 40px rgba(0,0,0,0.2)');
            }

            // به‌روزرسانی دکمه تم
            this._updateThemeButton(theme);

            // رویداد تغییر تم
            document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme, actualTheme } }));
        },

        _updateThemeButton: function(theme) {
            const btn = document.getElementById('themeToggleBtn');
            if (!btn) return;

            const icons = {
                dark: '🌙',
                light: '☀️',
                system: '💻'
            };
            const labels = {
                dark: 'تاریک',
                light: 'روشن',
                system: 'سیستم'
            };
            btn.textContent = `${icons[theme] || '🌙'} ${labels[theme] || 'تاریک'}`;
        },

        // ===== اندازه فونت =====
        setFontSize: function(size) {
            if (['small', 'medium', 'large'].includes(size)) {
                this.set('fontSize', size);
                this.applyFontSize(size);
                return true;
            }
            return false;
        },

        applyFontSize: function(size) {
            const sizes = {
                small: '0.85rem',
                medium: '1rem',
                large: '1.2rem'
            };
            document.documentElement.style.fontSize = sizes[size] || '1rem';
            document.dispatchEvent(new CustomEvent('fontSizeChanged', { detail: { size } }));
        },

        // ===== زبان =====
        setLanguage: function(lang) {
            if (['fa', 'en'].includes(lang)) {
                this.set('language', lang);
                this.applyLanguage(lang);
                return true;
            }
            return false;
        },

        applyLanguage: function(lang) {
            document.documentElement.setAttribute('lang', lang);
            document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
            document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        },

        // ===== اعلان‌ها =====
        setNotifications: function(enabled) {
            this.set('notifications', enabled);
            this.applyNotifications(enabled);
            return true;
        },

        applyNotifications: function(enabled) {
            document.dispatchEvent(new CustomEvent('notificationsChanged', { detail: { enabled } }));
        },

        // ===== تاریخچه =====
        addHistory: function(item) {
            const history = this.get(this.keys.HISTORY, []);
            const filtered = history.filter(h => h.id !== item.id);
            filtered.unshift({
                ...item,
                timestamp: new Date().toISOString()
            });
            if (filtered.length > 100) {
                filtered.length = 100;
            }
            this.set(this.keys.HISTORY, filtered);
            return filtered;
        },

        getHistory: function(limit = 20) {
            const history = this.get(this.keys.HISTORY, []);
            return history.slice(0, limit);
        },

        clearHistory: function() {
            this.set(this.keys.HISTORY, []);
        },

        // ===== علاقه‌مندی‌ها =====
        toggleFavorite: function(id, type = 'tool') {
            const favorites = this.get(this.keys.FAVORITES, []);
            const index = favorites.findIndex(f => f.id === id && f.type === type);
            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push({ id, type, added: new Date().toISOString() });
            }
            this.set(this.keys.FAVORITES, favorites);
            return favorites;
        },

        isFavorite: function(id, type = 'tool') {
            const favorites = this.get(this.keys.FAVORITES, []);
            return favorites.some(f => f.id === id && f.type === type);
        },

        getFavorites: function(type = null) {
            const favorites = this.get(this.keys.FAVORITES, []);
            if (type) {
                return favorites.filter(f => f.type === type);
            }
            return favorites;
        },

        // ===== آخرین بازدید =====
        updateLastVisit: function() {
            this.set(this.keys.LAST_VISIT, new Date().toISOString());
        },

        getLastVisit: function() {
            return this.get(this.keys.LAST_VISIT);
        },

        // ===== بوت‌استرپ =====
        init: function() {
            this.applyAll();
            this.updateLastVisit();

            // گوش دادن به تغییرات تم سیستم
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                const theme = this.getWithDefault('theme');
                if (theme === 'system') {
                    this.applyTheme('system');
                }
            });

            console.log('⚙️ تنظیمات کاربر بارگذاری شد:', this.getAll());
        }
    };

    // ===== اجرا =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            Settings.init();
        });
    } else {
        Settings.init();
    }

    // ===== در معرض دید global =====
    window.Settings = Settings;

})();