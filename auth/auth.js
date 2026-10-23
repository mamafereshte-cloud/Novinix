/**
 * ============================================================
 * Novinix - سیستم احراز هویت (Client Side)
 * ============================================================
 */


(function() {
    'use strict';

    // ============================================================
    // تنظیمات
    // ============================================================

    const API_BASE = '/Novinix/api/';
    const STORAGE_KEY = 'novinix_current_user';

    // ============================================================
    // توابع اصلی
    // ============================================================

    const NovinixAuth = {

        /**
         * ثبت‌نام کاربر جدید
         */
        async register(username, password, email = '') {
            try {
                const response = await fetch(API_BASE + 'auth.php?action=register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password,
                        email: email.trim()
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // ذخیره اطلاعات کاربر
                    this.setCurrentUser(data.data);
                    this.dispatchAuthEvent('register', data.data);
                }

                return data;
            } catch (error) {
                console.error('Register error:', error);
                return { success: false, message: 'خطا در ارتباط با سرور' };
            }
        },

        /**
         * ورود کاربر
         */
        async login(username, password) {
            try {
                const response = await fetch(API_BASE + 'auth.php?action=login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username.trim(),
                        password: password
                    })
                });

                const data = await response.json();

                if (data.success) {
                    // ذخیره اطلاعات کاربر
                    this.setCurrentUser(data.data);
                    this.dispatchAuthEvent('login', data.data);
                }

                return data;
            } catch (error) {
                console.error('Login error:', error);
                return { success: false, message: 'خطا در ارتباط با سرور' };
            }
        },

        /**
         * خروج از حساب
         */
        async logout() {
            try {
                await fetch(API_BASE + 'auth.php?action=logout', {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Logout error:', error);
            }

            // پاک کردن اطلاعات محلی
            this.clearCurrentUser();
            this.dispatchAuthEvent('logout', null);
        },

        /**
         * دریافت اطلاعات کاربر جاری (از سرور)
         */
        async getCurrentUser() {
            const local = this.getCurrentUserLocal();
            if (!local || !local.username) return null;

            try {
                const response = await fetch(
                    API_BASE + 'auth.php?action=current&username=' + encodeURIComponent(local.username)
                );

                const data = await response.json();

                if (data.success && data.data) {
                    // به‌روزرسانی اطلاعات محلی
                    this.setCurrentUser(data.data);
                    return data.data;
                }

                // اگر کاربر در سرور یافت نشد، اطلاعات محلی را پاک کن
                if (!data.success) {
                    this.clearCurrentUser();
                }

                return null;
            } catch (error) {
                console.error('Get current user error:', error);
                return local || null;
            }
        },

        /**
         * دریافت اطلاعات کاربر جاری (از localStorage)
         */
        getCurrentUserLocal() {
            try {
                const data = localStorage.getItem(STORAGE_KEY);
                return data ? JSON.parse(data) : null;
            } catch (e) {
                return null;
            }
        },

        /**
         * ذخیره اطلاعات کاربر در localStorage
         */
        setCurrentUser(user) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            } catch (e) {
                console.error('Error saving user:', e);
            }
        },

        /**
         * پاک کردن اطلاعات کاربر از localStorage
         */
        clearCurrentUser() {
            try {
                localStorage.removeItem(STORAGE_KEY);
                // پاک کردن کوکی هم (در صورت وجود)
                document.cookie = 'novinix_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            } catch (e) {
                console.error('Error clearing user:', e);
            }
        },

        /**
         * بررسی وضعیت ورود
         */
        isLoggedIn() {
            const user = this.getCurrentUserLocal();
            return user !== null && user.username !== undefined;
        },

        /**
         * به‌روزرسانی پروفایل کاربر
         */
        async updateProfile(username, data) {
            try {
                const response = await fetch(API_BASE + 'auth.php?action=update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        bio: data.bio || '',
                        avatar: data.avatar || ''
                    })
                });

                const result = await response.json();

                if (result.success && result.data) {
                    this.setCurrentUser(result.data);
                    this.dispatchAuthEvent('update', result.data);
                }

                return result;
            } catch (error) {
                console.error('Update profile error:', error);
                return { success: false, message: 'خطا در ارتباط با سرور' };
            }
        },

        /**
         * آپلود عکس پروفایل با برش دایره‌ای
         */
        async uploadAvatar(formData) {
            try {
                const response = await fetch(API_BASE + 'auth.php?action=upload_image', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success && result.data) {
                    this.setCurrentUser(result.data);
                    this.dispatchAuthEvent('update', result.data);
                }

                return result;
            } catch (error) {
                console.error('Upload avatar error:', error);
                return { success: false, message: 'خطا در آپلود عکس' };
            }
        },

        /**
         * دریافت رتبه کاربر
         */
        async getUserRank(username) {
            try {
                const response = await fetch(
                    API_BASE + 'leaderboard.php?action=rank&username=' + encodeURIComponent(username)
                );
                const data = await response.json();
                return data.success ? data.data : null;
            } catch (error) {
                console.error('Get user rank error:', error);
                return null;
            }
        },

        /**
         * دریافت رتبه‌بندی
         */
        async getLeaderboard(limit = 50) {
            try {
                const response = await fetch(
                    API_BASE + 'leaderboard.php?action=all&limit=' + limit
                );
                const data = await response.json();
                return data.success ? data.data : [];
            } catch (error) {
                console.error('Get leaderboard error:', error);
                return [];
            }
        },

        /**
         * دریافت امتیازات کاربر
         */
        async getUserScores(username) {
            try {
                const response = await fetch(
                    API_BASE + 'scores.php?action=get&username=' + encodeURIComponent(username)
                );
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Get user scores error:', error);
                return { success: false, data: { scores: [], best_scores: [] } };
            }
        },

        /**
         * ذخیره امتیاز بازی
         */
        async saveScore(username, gameId, score, details = null) {
            try {
                const response = await fetch(API_BASE + 'scores.php?action=save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: username,
                        game_id: gameId,
                        score: score,
                        details: details
                    })
                });

                return await response.json();
            } catch (error) {
                console.error('Save score error:', error);
                return { success: false, message: 'خطا در ذخیره امتیاز' };
            }
        },

        /**
         * دریافت بهترین امتیاز یک بازی
         */
        async getBestScore(username, gameId) {
            try {
                const response = await fetch(
                    API_BASE + 'scores.php?action=best&username=' + encodeURIComponent(username) +
                    '&game_id=' + encodeURIComponent(gameId)
                );
                const data = await response.json();
                return data.success ? data.data.best_score : 0;
            } catch (error) {
                console.error('Get best score error:', error);
                return 0;
            }
        },

        /**
         * ارسال رویداد تغییر وضعیت احراز هویت
         */
        dispatchAuthEvent(event, data) {
            const customEvent = new CustomEvent('authStatusChanged', {
                detail: {
                    event: event,
                    user: data,
                    isLoggedIn: !!data
                }
            });
            document.dispatchEvent(customEvent);
        },

        /**
         * بررسی و تمدید نشست (در صورت نیاز)
         */
        async refreshSession() {
            const user = this.getCurrentUserLocal();
            if (!user) return false;

            try {
                const response = await fetch(
                    API_BASE + 'auth.php?action=check&username=' + encodeURIComponent(user.username)
                );
                const data = await response.json();

                if (data.success && data.data) {
                    this.setCurrentUser(data.data);
                    return true;
                } else {
                    this.clearCurrentUser();
                    return false;
                }
            } catch (error) {
                console.error('Refresh session error:', error);
                return false;
            }
        }
    };

    // ============================================================
    // صادر کردن به صورت global
    // ============================================================

    window.NovinixAuth = NovinixAuth;

    // ============================================================
    // رویدادهای خودکار
    // ============================================================

    // بررسی نشست در هنگام بارگذاری صفحه
    document.addEventListener('DOMContentLoaded', function() {
        // اگر کاربر محلی وجود داشته باشد، نشست را بررسی کن
        if (NovinixAuth.getCurrentUserLocal()) {
            NovinixAuth.refreshSession();
        }
    });

    // ============================================================
    // راهنمای استفاده
    // ============================================================

    console.log('🔐 NovinixAuth loaded!');
    console.log('📖 Methods:', Object.keys(NovinixAuth).filter(k => typeof NovinixAuth[k] === 'function').join(', '));

})();