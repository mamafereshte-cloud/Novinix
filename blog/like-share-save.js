
function likePost(btn) {
            if (btn.classList.contains('liked')) {
                btn.classList.remove('liked');
                btn.innerHTML = '❤️ پسندیدن';
                btn.style.color = '';
                btn.style.borderColor = '';
                btn.style.background = '';
            } else {
                btn.classList.add('liked');
                btn.innerHTML = '❤️ پسندیده شد';
                btn.style.color = '#ef4444';
                btn.style.borderColor = 'rgba(239,68,68,0.2)';
                btn.style.background = 'rgba(239,68,68,0.05)';
            }
        }

function sharePost() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('✅ لینک مقاله کپی شد!');
        }).catch(() => {
            prompt('لینک مقاله را کپی کنید:', window.location.href);
        });
    }
}

function savePost() {
    const btn = document.querySelector('.post-actions button:last-child');
    if (btn.style.color === '#00ffcc') {
        btn.innerHTML = '⭐ ذخیره';
        btn.style.color = '';
        btn.style.background = '';
    } else {
        btn.innerHTML = '⭐ ذخیره شد';
        btn.style.color = '#00ffcc';
        btn.style.background = 'rgba(0,255,204,0.05)';
        const saved = JSON.parse(localStorage.getItem('novinix_saved_posts') || '[]');
        const slug = 'best-free-programming-learning-sites';
        if (!saved.includes(slug)) {
            saved.push(slug);
            localStorage.setItem('novinix_saved_posts', JSON.stringify(saved));
        }
    }
}
