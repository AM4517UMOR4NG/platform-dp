// utils.js
function sanitize(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

function loadProfiles() {
    const profileGrid = document.getElementById("profileGrid");
    profileGrid.innerHTML = "";
    state.users.forEach((user, index) => {
        const card = document.createElement("div");
        card.className = "story-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Pilih profil ${user.name}`);
        card.addEventListener("click", () => selectProfile(index));
        card.innerHTML = `
            <div class="avatar">${user.avatar}</div>
            <h3>${sanitize(user.name)}</h3>
            <p>Level ${user.level}</p>
        `;
        profileGrid.appendChild(card);
    });
}

function selectProfile(index) {
    state.currentUser = state.users[index];
    showHome();
}

function showHome() {
    showPage("home");
    updateDashboard();
}

function updateDashboard() {
    if (state.currentUser) {
        document.getElementById("wordsLearned").textContent = state.currentUser.wordsLearned || 0;
        document.getElementById("storiesCompleted").textContent = state.currentUser.storiesCompleted || 0;
        document.getElementById("minutesToday").textContent = state.currentUser.minutesToday || 0;
        document.getElementById("userLevel").textContent = `Level ${state.currentUser.level}`;
        document.getElementById("storyCoins").textContent = state.currentUser.storyCoins || 100;
        renderSkillChart();
    }
}

function resetGame() {
    document.getElementById("gameArea").innerHTML = "";
    state.gameProgress = 0;
}

function toggleHighContrast() {
    state.isHighContrast = !state.isHighContrast;
    document.body.classList.toggle("high-contrast", state.isHighContrast);
    document.querySelectorAll(".card, .btn").forEach(el => {
        el.classList.toggle("high-contrast-element", state.isHighContrast);
    });
}

function exportParentalData() {
    const csvContent = "data:text/csv;charset=utf-8," + 
        ["Nama,Level,Kata Dikuasai,Cerita Selesai,Menit Membaca"].join(",") + "\n" +
        state.users.map(u => 
            [u.name, u.level, u.wordsLearned, u.storiesCompleted, u.minutesToday].join(",")
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan_anak.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function saveToStorage() {
    try {
        localStorage.setItem("users", JSON.stringify(state.users));
        localStorage.setItem("customStories", JSON.stringify(state.customStories));
        localStorage.setItem("leaderboard", JSON.stringify(state.leaderboard));
        localStorage.setItem("darkMode", state.darkMode);
    } catch (e) {
        console.error("LocalStorage gagal:", e);
        showNotification("Penyimpanan gagal");
    }
}

function checkLocalStorage() {
    try {
        const savedUsers = localStorage.getItem("users");
        if (savedUsers) state.users = JSON.parse(savedUsers);
        const darkMode = localStorage.getItem("darkMode") === "true";
        if (darkMode) toggleTheme();
    } catch (e) {
        console.warn("LocalStorage tidak tersedia");
    }
}