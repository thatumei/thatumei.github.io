async function login(event) {
    // 1. Prevent the form from refreshing the page
    event.preventDefault();

    const username = document.querySelector(".login-form input[type='text']").value;
    const password = document.querySelector(".login-form input[type='password']").value;

    try {
        // 2. Await the fetch request
        const response = await fetch("assets/data/users.json");

        if (!response.ok) {
            alert("ユーザーデータの読み込みに失敗しました。");
            return;
        }

        // 3. Await the JSON parsing
        const users = await response.json();
        
        // 4. Find the user
        const user = users.find(u => u.username === username);

        if (!user || user.password !== password) {
            alert("ユーザー名またはパスワードが間違っています。");
            return;
        }

        // Login Success
        document.cookie = `auth_token=${username}_token; path=/; samesite=lax`;
        window.location.href = '../home/';

    } catch (error) {
        console.error("Login error:", error);
        alert("通信エラーが発生しました。");
    }
}