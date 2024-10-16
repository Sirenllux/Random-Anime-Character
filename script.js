// Define the language strings for translation
const translations = {
    en: {
        title: "Random Anime Characters",
        shuffleBtn: "Shuffle Character",
        detailsBtn: "Show Details",
        hideDetailsBtn: "Hide Details",
        loadingText: "Loading...",
        bio: "Bio: ",
    },
    ko: {
        title: "랜덤 애니메이션 캐릭터",  // Korean default title
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

// Default language
let currentLanguage = 'ko'; // Start with Korean

// Function to fetch a random character using Jikan API
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

// Function to load and display character details
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
                characterImage.src = "default_image_url"; // Fallback image
            };
        } else {
            characterImage.style.display = "none";
        }

        fetchCharacterDetails(character.mal_id);
    } else {
        loadingText.textContent = "No character found. Please try again.";
    }
}

// Function to fetch detailed information from another source (Jikan API for details)
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

// Helper function to trim text to 500 bytes, ensuring it cuts at the end of a sentence
function trimTo500Bytes(text) {
    let trimmedText = text.slice(0, 500);
    const lastPeriod = trimmedText.lastIndexOf(".");
    if (lastPeriod !== -1) {
        return trimmedText.slice(0, lastPeriod + 1);
    }
    return trimmedText;
}

// Function to change the language
function changeLanguage(lang) {
    currentLanguage = lang;
    updateLanguage(); // Call the updateLanguage function to reflect changes
}

// Function to update text based on the selected language
function updateLanguage() {
    document.title = translations[currentLanguage].title; // Update page title
    document.getElementById('page-title').textContent = translations[currentLanguage].title; // Update the main title
    document.getElementById('shuffle-btn').textContent = translations[currentLanguage].shuffleBtn; // Update shuffle button text
    document.getElementById('details-btn').textContent = translations[currentLanguage].detailsBtn; // Update details button text
    document.getElementById('loading-text').textContent = translations[currentLanguage].loadingText; // Update loading text
    document.getElementById('character-details').style.display = "none";
    document.getElementById('details-btn').textContent = translations[currentLanguage].detailsBtn;
    document.documentElement.lang = currentLanguage; // Update the lang attribute of the HTML document
}

// Event listener for the shuffle button
document.getElementById('shuffle-btn').addEventListener('click', loadRandomCharacter);

// Event listeners for language buttons
document.getElementById('lang-ko').addEventListener('click', function() {
    changeLanguage('ko');
});
document.getElementById('lang-en').addEventListener('click', function() {
    changeLanguage('en');
});
document.getElementById('lang-ja').addEventListener('click', function() {
    changeLanguage('ja');
});

// Load a random character and set the default language to Korean when the page loads
updateLanguage(); // Ensure the page starts in Korean
loadRandomCharacter(); // Load a random character