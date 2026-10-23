// ===== user-panel.js - پنل کاربری متصل به دیتابیس =====

(function() {
    'use strict';

    const UserPanel = {
        // ===== کلیدهای localStorage (فقط برای کش) =====
        keys: {
            CACHE_HISTORY: 'novinix_cache_history',
            CACHE_FAVORITES: 'novinix_cache_favorites',
            CACHE_SETTINGS: 'novinix_cache_settings',
            CACHE_SCORES: 'novinix_cache_scores',
            CACHE_USAGE: 'novinix_cache_usage'
        },

        // ===== دریافت username جاری =====
        getCurrentUsername: function() {
            try {
                const user = JSON.parse(localStorage.getItem('novinix_current_user') || 'null');
                return user?.username || null;
            } catch {
                return null;
            }
        },

        // ===== دریافت اطلاعات کاربر جاری =====
        getCurrentUser: function() {
            try {
                return JSON.parse(localStorage.getItem('novinix_current_user') || 'null');
            } catch {
                return null;
            }
        },

        // ===== بررسی وضعیت ورود =====
        isLoggedIn: function() {
            return this.getCurrentUsername() !== null;
        },

        // ===== تابع درخواست به API =====
        async apiRequest(endpoint, data = null, method = 'POST') {
            const username = this.getCurrentUsername();
            if (!username) {
                return { success: false, message: 'لطفاً وارد شوید.' };
            }

            const url = `/Novinix/api/user-panel.php?action=${endpoint}`;
            const options = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: data ? JSON.stringify({ username, ...data }) : null
            };

            try {
                const response = await fetch(url, options);
                const text = await response.text();
                try {
                    return JSON.parse(text);
                } catch {
                    return { success: false, message: 'خطا در پردازش پاسخ سرور' };
                }
            } catch (error) {
                return { success: false, message: 'خطا در ارتباط با سرور' };
            }
        },

        // ============================================================
        // تاریخچه فعالیت‌ها
        // ============================================================

        // ===== ذخیره تاریخچه =====
        async addHistory(item) {
            const result = await this.apiRequest('add_history', {
                action_type: item.type || 'tool',
                action_id: item.id || 'unknown',
                title: item.title,
                icon: item.icon || '📌',
                details: item.details || '',
                link: item.link || ''
            });

            if (result.success) {
                this.syncCache();
            }

            return result;
        },

        // ===== دریافت تاریخچه =====
        async getHistory(limit = 20) {
            const username = this.getCurrentUsername();
            if (!username) return [];

            try {
                const response = await fetch(
                    `/Novinix/api/user-panel.php?action=get_history&username=${username}&limit=${limit}`
                );
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem(this.keys.CACHE_HISTORY, JSON.stringify(result.data));
                    return result.data;
                }
            } catch (error) {
                console.warn('Error fetching history:', error);
            }

            try {
                return JSON.parse(localStorage.getItem(this.keys.CACHE_HISTORY) || '[]');
            } catch {
                return [];
            }
        },

        // ============================================================
        // علاقه‌مندی‌ها
        // ============================================================

        // ===== نشان‌گذاری =====
        async toggleFavorite(id, type) {
            const result = await this.apiRequest('toggle_favorite', {
                type: type,
                item_id: id
            });

            if (result.success) {
                this.syncCache();
            }

            return result;
        },

        // ===== بررسی نشان‌گذاری =====
        async isFavorite(id, type) {
            const favorites = await this.getFavorites(type);
            return favorites.some(f => f.item_id === id);
        },

        // ===== دریافت علاقه‌مندی‌ها =====
        async getFavorites(type = '') {
            const username = this.getCurrentUsername();
            if (!username) return [];

            try {
                const url = `/Novinix/api/user-panel.php?action=get_favorites&username=${username}` +
                           (type ? `&type=${type}` : '');
                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem(this.keys.CACHE_FAVORITES, JSON.stringify(result.data));
                    return result.data;
                }
            } catch (error) {
                console.warn('Error fetching favorites:', error);
            }

            try {
                return JSON.parse(localStorage.getItem(this.keys.CACHE_FAVORITES) || '[]');
            } catch {
                return [];
            }
        },

        // ============================================================
        // ماشین‌حساب
        // ============================================================

        // ===== ذخیره تاریخچه ماشین‌حساب =====
        async addCalculatorHistory(expression, result) {
            const response = await this.apiRequest('add_calculator', {
                expression: expression,
                result: result
            });
            return response;
        },

        // ===== دریافت تاریخچه ماشین‌حساب =====
        async getCalculatorHistory(limit = 20) {
            const username = this.getCurrentUsername();
            if (!username) return [];

            try {
                const response = await fetch(
                    `/Novinix/api/user-panel.php?action=get_calculator&username=${username}&limit=${limit}`
                );
                const result = await response.json();
                return result.success ? result.data : [];
            } catch {
                return [];
            }
        },

        // ============================================================
        // تنظیمات کاربر
        // ============================================================

        // ===== ذخیره تنظیمات =====
        async saveSettings(settings) {
            const result = await this.apiRequest('save_settings', {
                settings: settings
            });

            if (result.success) {
                localStorage.setItem(this.keys.CACHE_SETTINGS, JSON.stringify(settings));
            }

            return result;
        },

        // ===== دریافت تنظیمات =====
        async getSettings() {
            const username = this.getCurrentUsername();
            if (!username) return {};

            try {
                const response = await fetch(
                    `/Novinix/api/user-panel.php?action=get_settings&username=${username}`
                );
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem(this.keys.CACHE_SETTINGS, JSON.stringify(result.data));
                    return result.data;
                }
            } catch (error) {
                console.warn('Error fetching settings:', error);
            }

            try {
                return JSON.parse(localStorage.getItem(this.keys.CACHE_SETTINGS) || '{}');
            } catch {
                return {};
            }
        },

        // ============================================================
        // آمار استفاده از ابزارها
        // ============================================================

        // ===== به‌روزرسانی آمار استفاده از ابزار =====
        async updateToolUsage(toolId) {
            const result = await this.apiRequest('update_tool_usage', {
                tool_id: toolId
            });
            return result;
        },

        // ===== دریافت ابزارهای پرکاربرد =====
        async getMostUsedTools(limit = 5) {
            const username = this.getCurrentUsername();
            if (!username) return [];

            try {
                const response = await fetch(
                    `/Novinix/api/user-panel.php?action=get_tool_usage&username=${username}&limit=${limit}`
                );
                const result = await response.json();
                return result.success ? result.data : [];
            } catch {
                return [];
            }
        },

        // ============================================================
        // امتیازات بازی‌ها
        // ============================================================

        // ===== ذخیره امتیاز بازی =====
        async saveGameScore(gameId, score, details = {}) {
            const user = this.getCurrentUser();
            if (!user) {
                return { success: false, message: 'لطفاً ابتدا وارد شوید.' };
            }

            const result = await this.apiRequest('../../api/scores.php?action=save', {
                game_id: gameId,
                score: score,
                details: details
            }, 'POST');

            if (result.success && result.data) {
                // به‌روزرسانی کش
                this.syncCache();
            }

            return result;
        },

        // ===== دریافت امتیازات کاربر =====
        async getUserScores(gameId = null) {
            const username = this.getCurrentUsername();
            if (!username) return null;

            try {
                let url = `/Novinix/api/scores.php?action=get&username=${username}`;
                if (gameId) {
                    url += `&game_id=${gameId}`;
                }
                const response = await fetch(url);
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem(this.keys.CACHE_SCORES, JSON.stringify(result.data));
                    return result.data;
                }
            } catch (error) {
                console.warn('Error fetching scores:', error);
            }

            try {
                return JSON.parse(localStorage.getItem(this.keys.CACHE_SCORES) || '{}');
            } catch {
                return {};
            }
        },

        // ============================================================
        // همگام‌سازی کش
        // ============================================================

        async syncCache() {
            await this.getHistory(20);
            await this.getFavorites();
            await this.getSettings();
            await this.getUserScores();
        },

        // ============================================================
        // رندر کردن (Render Functions)
        // ============================================================

        // ===== رندر تاریخچه =====
        renderHistory: function(containerId, limit = 10) {
            const container = document.getElementById(containerId);
            if (!container) return;

            this.getHistory(limit).then(history => {
                if (!history || history.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <span class="empty-icon">🕊️</span>
                            <p>هنوز فعالیتی ثبت نشده است</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = history.map(item => `
                    <div class="history-item">
                        <span class="h-icon">${item.icon || '📌'}</span>
                        <div class="h-info">
                            <div class="h-title">${item.title}</div>
                            <div class="h-meta">${this._formatDate(item.created_at)}</div>
                        </div>
                        ${item.link ? `<a href="${item.link}" class="h-link">مشاهده →</a>` : ''}
                    </div>
                `).join('');
            });
        },

        // ===== رندر علاقه‌مندی‌ها =====
        renderFavorites: function(containerId, type = '') {
            const container = document.getElementById(containerId);
            if (!container) return;

            this.getFavorites(type).then(favorites => {
                if (!favorites || favorites.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <span class="empty-icon">⭐</span>
                            <p>هنوز موردی را نشان‌گذاری نکرده‌اید</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = favorites.map(fav => `
                    <div class="favorite-item">
                        <span class="f-icon">⭐</span>
                        <span class="f-name">${fav.item_id}</span>
                        <button class="f-remove" onclick="UserPanel.toggleFavorite('${fav.item_id}', '${type}').then(() => UserPanel.renderFavorites('${containerId}', '${type}'))">
                            ✕
                        </button>
                    </div>
                `).join('');
            });
        },

        // ===== رندر تاریخچه ماشین‌حساب =====
        renderCalculatorHistory: function(containerId, limit = 10) {
            const container = document.getElementById(containerId);
            if (!container) return;

            this.getCalculatorHistory(limit).then(history => {
                if (!history || history.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <span class="empty-icon">🧮</span>
                            <p>هنوز محاسبه‌ای ثبت نشده است</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = history.map(item => `
                    <div class="calc-history-item">
                        <span class="c-expr">${item.expression}</span>
                        <span class="c-result">= ${item.result}</span>
                        <span class="c-time">${this._formatDate(item.created_at)}</span>
                    </div>
                `).join('');
            });
        },

        // ===== رندر ابزارهای پرکاربرد =====
        renderMostUsedTools: function(containerId, limit = 5) {
            const container = document.getElementById(containerId);
            if (!container) return;

            this.getMostUsedTools(limit).then(tools => {
                if (!tools || tools.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <span class="empty-icon">🛠️</span>
                            <p>هنوز از ابزاری استفاده نکرده‌اید</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = tools.map(tool => `
                    <div class="tool-usage-item">
                        <span class="t-icon">🛠️</span>
                        <span class="t-name">${tool.tool_id}</span>
                        <span class="t-count">${tool.usage_count} بار</span>
                    </div>
                `).join('');
            });
        },

        // ===== رندر امتیازات بازی‌ها =====
        renderGameScores: function(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            this.getUserScores().then(data => {
                const scores = data?.best_scores || [];

                if (!scores || scores.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <span class="empty-icon">🎮</span>
                            <p>هنوز امتیازی ثبت نشده است</p>
                        </div>
                    `;
                    return;
                }

                const gameNames = {
                    'snake': '🐍 مار',
                    'tetris': '🧱 تتریس',
                    'flappy-bird': '🐦 فلپی برد',
                    'tic-tac-toe': '❌ دوز',
                    'memory': '🧠 حافظه',
                    'whack-mole': '🔨 موش‌کوب',
                    'pong': '🏓 پینگ پنگ',
                    '2048': '🔢 ۲۰۴۸',
                    'fruit-ninja': '🍉 برش میوه',
                    'catch-eggs': '🥚 تخم‌مرغ',
                    'puzzles': '🧩 معماها'
                };

                container.innerHTML = scores.map(score => `
                    <div class="score-item">
                        <span class="s-icon">${gameNames[score.game_id] || score.game_id}</span>
                        <span class="s-score">⭐ ${score.best_score}</span>
                    </div>
                `).join('');
            });
        },

        // ============================================================
        // توابع کمکی
        // ============================================================

        _formatDate: function(dateStr) {
            try {
                const date = new Date(dateStr);
                const now = new Date();
                const diff = now - date;

                if (diff < 60000) return 'چند لحظه پیش';
                if (diff < 3600000) return Math.floor(diff / 60000) + ' دقیقه پیش';
                if (diff < 86400000) return Math.floor(diff / 3600000) + ' ساعت پیش';
                if (diff < 172800000) return 'دیروز';

                return date.toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch {
                return dateStr || '';
            }
        }
    };

    // ===== اجرا =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // بررسی وضعیت ورود و همگام‌سازی
            if (UserPanel.isLoggedIn()) {
                UserPanel.syncCache();
            }
        });
    } else {
        if (UserPanel.isLoggedIn()) {
            UserPanel.syncCache();
        }
    }

    // ===== گوش دادن به تغییرات ورود/خروج =====
    document.addEventListener('authStatusChanged', function() {
        if (UserPanel.isLoggedIn()) {
            UserPanel.syncCache();
        }
    });

    // ===== در معرض دید global =====
    window.UserPanel = UserPanel;

    console.log('👤 User Panel (Database Version) loaded!');

})();