(function() {
    // 1. クッキーから特定の名前の値を取り出す関数
    function getAuthToken() {
      const b = document.cookie.match('(^|;)\\s*auth_token\\s*=\\s*([^;]+)');
      return b ? b.pop() : null;
    }

    // 2. チェック実行
    const token = getAuthToken();

    // トークンが存在しない = 未ログイン、または期限切れで削除された状態
    if (!token) {
      console.warn("認証トークンが見つかりません。リダイレクトします。");
      // ログインページへ強制移動
      window.location.replace('../login.html'); 
    }
  })();