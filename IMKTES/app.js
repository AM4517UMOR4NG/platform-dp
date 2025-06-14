// app.js
const state = {
    currentUser: null,
    users: [],
    currentGameType: "sentence",
    gameProgress: 0,
    tutorialStep: 0,
    currentPage: "splash",
    isHighContrast: false,
    dailyGoal: { reading: 10, completed: false, progress: 0 },
    darkMode: false
};

// Inisialisasi
function initApp() {
    loadProfiles();
    checkLocalStorage();
    setupEventListeners();
    renderNavigation();
    showSplashScreen();
    setupServiceWorker();
    initMultiplayer();
}

// Tambahkan efek animasi saat halaman aktif
function showPage(page) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(`${page}Page`).classList.add("active");
    state.currentPage = page;
    playClickSound();
}

// Toggle Mode Gelap
function toggleTheme() {
    state.darkMode = !state.darkMode;
    document.body.classList.toggle("dark-mode", state.darkMode);
    localStorage.setItem("darkMode", state.darkMode);
}

// Tampilkan Notifikasi
function showNotification(message) {
    const notif = document.getElementById("notification");
    notif.textContent = message;
    notif.style.display = "block";
    setTimeout(() => notif.style.display = "none", 3000);
}

// Simpan ke LocalStorage
function saveToStorage() {
    try {
        localStorage.setItem("users", JSON.stringify(state.users));
        localStorage.setItem("darkMode", state.darkMode);
    } catch (e) {
        console.error("LocalStorage gagal:", e);
        showNotification("Penyimpanan gagal");
    }
}

// Load Data
function loadProfiles() {
    const profileGrid = document.getElementById("profileGrid");
    profileGrid.innerHTML = "";
    state.users.forEach((user, index) => {
        const card = document.createElement("div");
        card.className = "story-card";
        card.innerHTML = `
            <div class="avatar">${user.avatar}</div>
            <h3>${user.name}</h3>
            <p>Level ${user.level}</p>
        `;
        card.onclick = () => selectProfile(index);
        profileGrid.appendChild(card);
    });
}

// Pilih Profil
function selectProfile(index) {
    state.currentUser = state.users[index];
    showHome();
}

// Dashboard Interaktif
function updateDashboard() {
    if (state.currentUser) {
        document.getElementById("wordsLearned").textContent = state.currentUser.wordsLearned || 0;
        document.getElementById("storiesCompleted").textContent = state.currentUser.storiesCompleted || 0;
        document.getElementById("minutesToday").textContent = state.currentUser.minutesToday || 0;
        document.getElementById("userLevel").textContent = `Level ${state.currentUser.level}`;
        document.getElementById("storyCoins").textContent = state.currentUser.storyCoins || 100;
        renderSkillChart();
        renderTimeHeatmap();
        updateDailyGoalStatus();
    }
}

// Grafik Kemampuan
function renderSkillChart() {
    const ctx = document.getElementById("skillChart").getContext("2d");
    if (window.skillChart) window.skillChart.destroy();

    window.skillChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: ["Membaca", "Kosakata", "Ejaan", "Logika"],
            datasets: [{
                label: "Kemampuan",
                data: [
                    state.currentUser.readingScore || 50,
                    state.currentUser.vocabScore || 60,
                    state.currentUser.spellingScore || 45,
                    state.currentUser.logicScore || 70
                ],
                backgroundColor: "rgba(139, 195, 74, 0.2)",
                borderColor: "#8BC34A"
            }]
        },
        options: {
            scale: { ticks: { beginAtZero: true, max: 100 } },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Heatmap Waktu Membaca
function renderTimeHeatmap() {
    const ctx = document.getElementById("timeHeatmap").getContext("2d");
    const hoursData = Array(24).fill(0);
    
    state.currentUser.readingHistory?.forEach(entry => {
        const hour = new Date(entry.time).getHours();
        hoursData[hour] += entry.duration;
    });

    new Chart(ctx, {
        type: "heatmap",
        data: {
            labels: { 
                xLabels: [...Array(24).keys()].map(h => `${h}:00`),
                yLabels: ["Durasi (menit)"]
            },
            datasets: [{
                data: hoursData.map((val, i) => ({ x: i, y: 0, v: val })),
                borderWidth: 1
            }]
        },
        options: {
            colorScale: { 
                colors: ["#eee", "#FFD54F", "#8BC34A"] 
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Sistem Rekomendasi Cerita
function recommendStories() {
    const history = state.currentUser.readHistory || [];
    const recentThemes = history.slice(-5).map(id => stories[id]?.title || "").filter(Boolean);
    const recommendations = Object.values(stories).filter(story => 
        recentThemes.some(theme => story.title.includes(theme))
    );
    return recommendations;
}

// Game Tebak Gambar
function startImageGuessGame(imageUrl, correctAnswer) {
    document.getElementById("gameArea").innerHTML = `
        <div class="image-guess">
            <img src="${imageUrl}" alt="Gambar" style="max-width: 80%">
            <input type="text" id="guessInput" placeholder="Tebak kata...">
            <button onclick="checkImageGuess('${correctAnswer}')">Periksa</button>
        </div>
    `;
}

function checkImageGuess(answer) {
    const userGuess = document.getElementById("guessInput").value.toLowerCase();
    if (userGuess === answer.toLowerCase()) {
        playSuccessSound();
        showNotification("Benar! 🎉");
        state.currentUser.storyCoins += 20;
    } else {
        showNotification(`Salah! Jawaban: ${answer}`);
    }
}

// Suara Umpan Balik
function playSuccessSound() {
    const sound = new Audio("success.mp3");
    sound.play();
}

function playClickSound() {
    const sound = new Audio("click.mp3");
    sound.play();
}

// Confetti Efek
function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = ["#FFD54F", "#8BC34A", "#81CFFE", "#F8BBD0", "#CE93D8"][Math.floor(Math.random() * 5)];
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 3000);
    }
}

// Service Worker untuk Mode Offline
function setupServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js")
            .then(reg => console.log("SW Terdaftar"))
            .catch(err => console.error("SW Gagal:", err));
    }
}

// Service Worker (sw.js)
const CACHE_NAME = "story-app-v2";
const ASSETS = ["/", "/index.html", "/styles.css", "/app.js", "/data.js"];

self.addEventListener("install", e => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// WebSocket untuk Multiplayer
function initMultiplayer() {
    try {
        const ws = new WebSocket("wss://realtime-api.example.com");
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.type === "challenge") {
                showNotification(`Tantangan dari ${data.user}!`);
                startChallenge(data.question);
            }
        };
    } catch (e) {
        console.error("Multiplayer error:", e);
    }
}

// Grafik Progres
function renderSkillChart() {
    const ctx = document.getElementById("skillChart").getContext("2d");
    if (window.skillChart) window.skillChart.destroy();
    
    window.skillChart = new Chart(ctx, {
        type: "radar",
        data: {
            labels: ["Membaca", "Kosakata", "Ejaan", "Logika"],
            datasets: [{
                label: "Kemampuan",
                data: [
                    state.currentUser.readingScore || 50,
                    state.currentUser.vocabScore || 60,
                    state.currentUser.spellingScore || 45,
                    state.currentUser.logicScore || 70
                ],
                backgroundColor: "rgba(139, 195, 74, 0.2)",
                borderColor: "#8BC34A"
            }]
        },
        options: {
            scale: { ticks: { beginAtZero: true, max: 100 } }
        }
    });
}

// Evaluasi Kosakata
function startVocabQuiz() {
    const words = Object.keys(definitions);
    const randomWord = words[Math.floor(Math.random() * words.length)];
    document.getElementById("gameArea").innerHTML = `
        <div class="vocab-quiz">
            <h3>Apa arti kata ini?</h3>
            <h2>${randomWord}</h2>
            <input type="text" id="vocabInput" placeholder="Jawaban...">
            <button onclick="checkVocab('${randomWord}')">Periksa</button>
        </div>
    `;
}

function checkVocab(word) {
    const answer = document.getElementById("vocabInput").value.toLowerCase();
    if (answer === definitions[word].definition.toLowerCase()) {
        playSuccessSound();
        showNotification("Benar! 🎉");
        state.currentUser.wordsLearned++;
    } else {
        showNotification(`Salah! Jawaban: ${definitions[word].definition}`);
    }
}

// Rekomendasi Cerita Otomatis
function showRecommendedStories() {
    const recommendations = recommendStories();
    document.getElementById("recommendations").innerHTML = `
        <h2>Rekomendasi Cerita</h2>
        ${recommendations.map(story => `
            <div class="story-card" onclick="showStoryDetail('${story.id}')">
                <div class="avatar">${story.illustration}</div>
                <h3>${story.title}</h3>
                <p>${story.words.join(", ")}</p>
            </div>
        `).join("")}
    `;
}

// Tampilan Feedback
function showFeedback(title, message) {
    const modal = document.getElementById("feedbackModal");
    document.getElementById("feedbackTitle").textContent = title;
    document.getElementById("feedbackMessage").textContent = message;
    modal.style.display = "flex";
}

function closeFeedback() {
    document.getElementById("feedbackModal").style.display = "none";
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", initApp);