/**
 * ============================================================
 * توابع مشترک برای ثبت امتیاز در بازی‌ها
 * ============================================================
 */

(function() {
    'use strict';

    /**
     * ثبت امتیاز بازی در دیتابیس
     * @param {string} gameId - شناسه بازی (snake, tetris, ...)
     * @param {number} score - امتیاز کسب شده
     * @param {object} details - اطلاعات اضافی (سطح، زمان، ...)
     * @returns {Promise<object>} - نتیجه ثبت
     */
    window.saveGameScore = async function(gameId, score, details = {}) {
        if (typeof NovinixAuth === 'undefined') {
            console.warn('⚠️ NovinixAuth not loaded!');
            return { success: false, message: 'سیستم احراز هویت در دسترس نیست.' };
        }

        if (!NovinixAuth.isLoggedIn()) {
            console.warn('⚠️ User not logged in!');
            return { success: false, message: 'لطفاً ابتدا وارد شوید.' };
        }

        try {
            const result = await NovinixAuth.saveGameScore(gameId, score, details);

            if (result.success) {
                console.log(`✅ Score saved: ${gameId} = ${score}`);
            } else {
                console.warn(`⚠️ Failed to save score: ${result.message}`);
            }

            return result;
        } catch (error) {
            console.error('❌ Error saving score:', error);
            return { success: false, message: 'خطا در ارتباط با سرور.' };
        }
    };

    /**
     * نمایش پیام ثبت امتیاز به کاربر
     */
    window.showScoreSavedMessage = function(result, gameName) {
        if (result.success) {
            // نمایش پیام موفقیت (می‌توانید با toast جایگزین کنید)
            const msg = `✅ امتیاز شما در ${gameName} ثبت شد! ⭐ ${result.data?.game_score || 0}`;
            console.log(msg);

            // نمایش در status message اگر وجود داشته باشد
            const statusEl = document.querySelector('.status-message');
            if (statusEl) {
                statusEl.textContent = msg;
                statusEl.className = 'status-message success';
                setTimeout(() => {
                    statusEl.className = 'status-message';
                }, 3000);
            }
        } else if (result.message) {
            const msg = `⚠️ ${result.message}`;
            console.warn(msg);
            const statusEl = document.querySelector('.status-message');
            if (statusEl) {
                statusEl.textContent = msg;
                statusEl.className = 'status-message error';
                setTimeout(() => {
                    statusEl.className = 'status-message';
                }, 3000);
            }
        }
    };

    console.log('🎮 Game Score API loaded!');
    console.log('💡 Use: saveGameScore("gameId", score, {level: 1})');

})();