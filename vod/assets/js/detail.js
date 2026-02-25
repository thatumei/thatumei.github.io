async function loadDetail() {
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get('id');

    if (!videoId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('assets/data/videos.json');
        const videoData = await response.json();
        const video = videoData.find(v => v.id === videoId);

        if (video) {
            renderDetailPage(video);
        } else {
            document.body.innerHTML = "<div class='inner'><h1>動画が見つかりませんでした。</h1><a href='index.html'>ホームへ戻る</a></div>";
        }
    } catch (error) {
        console.error("データの読み込みに失敗しました:", error);
    }
}

function renderDetailPage(video) {
    // YouTube埋め込み
    const playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = `
        <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.youtubeID}?rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
    `;

    document.getElementById('detail-title').innerText = video.title;
    
    // エラーの直接原因：formatGradeLabelsを呼び出す
    document.getElementById('detail-grades').innerText = formatGradeLabels(video.grades);

    const subjectRow = document.getElementById('detail-subjects');
    subjectRow.innerHTML = ''; 
    video.subjects.forEach(s => {
        const span = document.createElement('span');
        // エラーの直接原因：getSubjectClassを呼び出す
        span.className = `subject-tag tag-${getSubjectClass(s)}`;
        span.innerText = s;
        subjectRow.appendChild(span);
    });

    // ねらい（箇条書き）
    const aimList = document.getElementById('detail-aim');
    aimList.innerHTML = '';
    if (video.aim && Array.isArray(video.aim)) {
        video.aim.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item;
            aimList.appendChild(li);
        });
    }

    // 教材リンク
    const linkList = document.getElementById('resource-links');
    linkList.innerHTML = '';
    if (video.links && video.links.length > 0) {
        video.links.forEach(link => {
            linkList.innerHTML += `
                <li>
                    <a href="${link.url}" target="_blank">
                        <i class="fa-solid fa-file-arrow-down"></i> ${link.text}
                    </a>
                </li>`;
        });
    }
}

// --- 共通ヘルパー関数（これらが不足していたためエラーが出ていました） ---

function formatGradeLabels(grades) {
    if (!grades || !Array.isArray(grades)) return "全学年";
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

window.onload = loadDetail;