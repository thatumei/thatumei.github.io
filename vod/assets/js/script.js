let videoData = [];
let currentSubject = "すべて";
let currentGrade = "all";
let searchKeyword = "";

// 1. JSONの読み込み
async function loadVideos() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/thatumei/assets/refs/heads/main/videos.json');
        videoData = await response.json();
        renderVideos();
    } catch (error) {
        console.error("動画データの読み込みに失敗しました:", error);
        // デバッグ用ダミーデータ（必要に応じて削除してください）
        videoData = [
            { id: "1", title: "電池のしくみ", subjects: ["理科"], grades: ["4", "5"], ratio: "16:9", thumbnail: "https://via.placeholder.com/400x225", duration: "8:20" }
        ];
        renderVideos();
    }
}

// 2. フィルタリングと描画
function renderVideos() {
    const display = document.getElementById('video-display');
    const titleHeader = document.getElementById('current-category-name');
    
    // 表示タイトルの更新
    titleHeader.innerText = currentSubject === "すべて" ? "すべての動画" : `${currentSubject}の動画`;

    // フィルタリングロジック（教科 × 学年 × 検索キーワード）
    const filtered = videoData.filter(v => {
        const matchSubject = currentSubject === "すべて" || v.subjects.includes(currentSubject);
        const matchGrade = currentGrade === "all" || v.grades.includes(currentGrade);
        const matchSearch = v.title.toLowerCase().includes(searchKeyword.toLowerCase());
        
        return matchSubject && matchGrade && matchSearch;
    });

    // HTML生成
    if (filtered.length === 0) {
        display.innerHTML = '<p class="no-results">みつかりませんでした。ほかの言葉でさがしてみてね！</p>';
        return;
    }

    display.innerHTML = filtered.map(v => {
        const gradeLabels = formatGradeLabels(v.grades);
        const aspectValue = v.ratio.replace(':', '/');

        return `
        <article class="video-card" onclick="window.open('detail.html?id=${v.id}', '_blank')">
            <div class="thumb-container" style="aspect-ratio: ${aspectValue};">
                <img src="${v.thumbnail}" alt="" class="thumb-img">
            </div>
            <div class="card-content">
                <div class="tag-row">
                    ${v.subjects.map(s => `<span class="subject-tag tag-${getSubjectClass(s)}">${s}</span>`).join('')}
                </div>
                <h3>${v.title}</h3>
                <div class="grade-row">
                    <i class="fa-solid fa-user-graduate"></i> ${gradeLabels}<br>
                    <i class="fa-solid fa-clock"></i> ${v.duration}
                </div>
            </div>
        </article>
        `;
    }).join('');
}

// 3. イベントリスナーの設定
function setupEventListeners() {
    // 教科切り替え (サイドバー)
    const subjectItems = document.querySelectorAll('#subject-filter li');
    subjectItems.forEach(li => {
        li.addEventListener('click', (e) => {
            e.preventDefault();
            subjectItems.forEach(item => item.classList.remove('active'));
            li.classList.add('active');
            
            currentSubject = li.dataset.subject;
            document.body.setAttribute('data-current-subject', currentSubject);
            renderVideos();
        });
    });

    // 学年切り替え (ドロップダウン)
    const gradeSelect = document.getElementById('grade-select');
    if (gradeSelect) {
        gradeSelect.addEventListener('change', (e) => {
            currentGrade = e.target.value;
            renderVideos();
        });
    }

    // 検索機能
    const searchInput = document.getElementById('search-input');
    const searchSubmit = document.getElementById('search-submit');

    const handleSearch = () => {
        searchKeyword = searchInput.value;
        renderVideos();
    };

    if (searchSubmit) searchSubmit.addEventListener('click', handleSearch);
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

// 4. 補助関数
function formatGradeLabels(grades) {
    const numGrades = grades.filter(g => !isNaN(g)).map(Number).sort((a, b) => a - b);
    const specialGrades = grades.filter(g => isNaN(g));

    let result = [];
    if (numGrades.length > 0) {
        const min = numGrades[0];
        const max = numGrades[numGrades.length - 1];
        result.push(min === max ? `小${min}` : `小${min}〜${max}`);
    }
    return result.concat(specialGrades).join(' ・ ');
}

function getSubjectClass(subject) {
    const map = {
        "理科": "rika", "社会": "shakai", "国語": "kokugo", "算数・数学": "sansu",
        "生活": "seikatsu", "道徳": "doutoku", "音楽": "ongaku", "体育": "taiiku",
        "図工": "zukou", "技術": "gijutsu", "家庭": "katei", "総合": "sougou",
        "英語": "eigo", "特別活動": "tokukatsu", "特別支援": "tokushien", "その他": "sonota"
    };
    return map[subject] || "default";
}

// 5. 初期化
window.onload = async () => {
    await loadVideos();
    setupEventListeners();
};