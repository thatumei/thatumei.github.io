// マウスの動きに合わせて背景のグラデーション位置を微妙に変える演出
const bg = document.getElementById('bg-effect');

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    // 柔らかい動きにするために数値を調整
    bg.style.background = `radial-gradient(circle at ${x}% ${y}%, #f3f4f6 0%, #e5e7eb 100%)`;
});

// ボタンクリック時の簡単なフェードアウト演出（ログイン画面遷移用）
const loginBtn = document.querySelector('.btn-primary');
loginBtn.addEventListener('click', (e) => {
    // 実際にはリンクを飛ばす前にアニメーションを入れたりできます
    console.log('ログイン画面へ移動します...');
});