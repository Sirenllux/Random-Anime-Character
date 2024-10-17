const translations = {
    en: {
        title: "Random Anime Character",
        shuffleBtn: "Shuffle Character",
        detailsBtn: "Show Details",
        hideDetailsBtn: "Hide Details",
        loadingText: "Loading...",
        bio: "Bio: ",
    },
    ko: {
        title: "랜덤 애니메이션 캐릭터", 
        shuffleBtn: "캐릭터 바꾸기",
        detailsBtn: "상세 보기",
        hideDetailsBtn: "상세 숨기기",
        loadingText: "로딩 중...",
        bio: "소개: ",
    },
    ja: {
        title: "ランダムアニメキャラクター",
        shuffleBtn: "キャラクターをシャッフル",
        detailsBtn: "詳細を表示",
        hideDetailsBtn: "詳細を隠す",
        loadingText: "読み込み中...",
        bio: "バイオ: ",
    },
};

let currentLanguage = 'ko'; 

async function fetchRandomCharacter() {
    const randomPage = Math.floor(Math.random() * 200) + 1;
    const randomCharacterIndex = Math.floor(Math.random() * 25);
    const url = `https://api.jikan.moe/v4/characters?page=${randomPage}&limit=25`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.data.length > 0) {
            const character = data.data[randomCharacterIndex];
            return character;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching random character:", error);
        return null;
    }
}

async function loadRandomCharacter() {
    const loadingText = document.getElementById('loading-text');
    loadingText.style.display = "block";

    const character = await fetchRandomCharacter();

    loadingText.style.display = "none";

    if (character) {
        document.getElementById('character-name').textContent = character.name;

        const characterImageURL = character.images.jpg.image_url;
        const characterImage = document.getElementById('character-image');
        
        if (characterImageURL) {
            characterImage.src = characterImageURL;
            characterImage.style.display = "block";
            characterImage.onerror = () => {
                characterImage.src = "default_image_url";
            };
        } else {
            characterImage.style.display = "none";
        }

        fetchCharacterDetails(character.mal_id);
    } else {
        loadingText.textContent = "No character found. Please try again.";
    }
}

async function fetchCharacterDetails(malId) {
    const detailsDiv = document.getElementById('character-details');
    const detailsButton = document.getElementById('details-btn');
    detailsDiv.style.display = "none";
    detailsButton.textContent = translations[currentLanguage].detailsBtn;

    try {
        const response = await fetch(`https://api.jikan.moe/v4/characters/${malId}`);
        const data = await response.json();
        if (data && data.data) {
            let about = data.data.about || "No additional details available.";
            about = trimTo500Bytes(about);

            document.getElementById('character-bio').textContent = about;

            detailsButton.onclick = function() {
                if (detailsDiv.style.display === "none") {
                    detailsDiv.style.display = "block";
                    detailsButton.textContent = translations[currentLanguage].hideDetailsBtn;
                } else {
                    detailsDiv.style.display = "none";
                    detailsButton.textContent = translations[currentLanguage].detailsBtn;
                }
            };
        }
    } catch (error) {
        console.error("Error fetching character details:", error);
    }
}

function trimTo500Bytes(text) {
    let trimmedText = text.slice(0, 500);
    const lastPeriod = trimmedText.lastIndexOf(".");
    if (lastPeriod !== -1) {
        return trimmedText.slice(0, lastPeriod + 1);
    }
    return trimmedText;
}

function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguage(); 
}

function updateLanguage() {
    document.title = translations[currentLanguage].title; 
    document.getElementById('page-title').textContent = translations[currentLanguage].title; 
    document.getElementById('shuffle-btn').textContent = translations[currentLanguage].shuffleBtn; 
    document.getElementById('details-btn').textContent = translations[currentLanguage].detailsBtn; 
    document.getElementById('loading-text').textContent = translations[currentLanguage].loadingText; 
    document.getElementById('character-details').style.display = "none";
    document.getElementById('details-btn').textContent = translations[currentLanguage].detailsBtn;
    document.documentElement.lang = currentLanguage; 
}

document.getElementById('shuffle-btn').addEventListener('click', loadRandomCharacter);

document.getElementById('lang-ko').addEventListener('click', function() {
    changeLanguage('ko');
});
document.getElementById('lang-en').addEventListener('click', function() {
    changeLanguage('en');
});
document.getElementById('lang-ja').addEventListener('click', function() {
    changeLanguage('ja');
});

updateLanguage(); 
loadRandomCharacter(); 