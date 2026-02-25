document.addEventListener('DOMContentLoaded', () => {
    // Lucideアイコンの初期化
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- メインメニュー: VODシステム ---
    const vodCard = document.getElementById('vod-system');
    if (vodCard) {
        vodCard.addEventListener('click', () => {
            console.log('VODシステムを起動します...');
            window.open('/vod', '_blank');
        });
    }

    // --- サブメニュー ---
    const subCards = document.querySelectorAll('.sub-card:not(.disabled-sub)');
    subCards.forEach(card => {
        card.addEventListener('click', () => {
            const label = card.querySelector('span').innerText;
            console.log(`${label} を開きます`);
        });
    });

    // --- ログアウト処理 (Cookie削除) ---
    const logoutBtn = document.getElementById('logout-trigger');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('ログアウトしてもよろしいですか？')) {
                // Cookieを削除（有効期限を過去に設定）
                // サーバー側のパス設定に合わせて path=/ を指定するのが確実です
                document.cookie = "auth_token=; path=/; max-age=0; samesite=lax";
                document.cookie = "user_session=; path=/; max-age=0; samesite=lax";

                console.log('Cookieを削除しました。ログイン画面へ遷移します。');
                
                // ログイン画面へリダイレクト
                window.location.href = '../';
            }
        });
    }
});