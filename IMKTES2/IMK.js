let progressChart;
let currentSection = 'story';
let gameScore = 0;
let totalQuestions = 4;
let gameWords = ['kucing', 'anjing', 'taman', 'bermain'];
let currentWordIndex = 0;
let isRecording = false;
let mediaRecorder;
let recordedChunks = [];
let progressData = {
    wordsLearned: 12,
    storiesCompleted: 3,
    gamesPlayed: 8,
    accuracyRate: 85
};

const stories = [
    {
        title: 'Petualangan Kucing Kecil',
        illustration: '🐱',
        text: 'Ada seekor kucing kecil bernama Mimi yang suka bermain di taman. Hari ini Mimi ingin mencari teman baru untuk bermain bersama. Mimi berjalan ke taman dan bertemu dengan seekor anjing yang ramah.'
    },
    {
        title: 'Hari di Pantai',
        illustration: '🏖️',
        text: 'Keluarga kecil pergi ke pantai untuk bermain pasir dan berenang. Mereka membangun istana pasir yang besar dan bermain dengan ombak kecil.'
    }
];

const vocabulary = [
    { word: 'kucing', emoji: '🐱' },
    { word: 'anjing', emoji: '🐶' },
    { word: 'taman', emoji: '🌳' },
    { word: 'bermain', emoji: '⚽' }
];

function showSection(section) {
    document.querySelectorAll('.story-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(`${section}-section`).classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    currentSection = section;

    if (section === 'games') {
        resetGame();
    }
}

function loadStory(index) {
    const story = stories[index];
    document.querySelector('.story-title').textContent = story.title;
    document.querySelector('.story-illustration').textContent = story.illustration;
    document.getElementById('story-text').textContent = story.text;
}

function addStoryNavigation() {
    const storySection = document.querySelector('.storybook');
    const navControls = document.createElement('div');
    navControls.style.textAlign = 'center';
    navControls.style.marginTop = '20px';
    navControls.innerHTML = `
        <button class="audio-btn" id="prev-story-btn">⬅️ Cerita Sebelumnya</button>
        <button class="audio-btn" id="next-story-btn">Cerita Selanjutnya ➡️</button>
    `;
    storySection.appendChild(navControls);

    document.getElementById('prev-story-btn').addEventListener('click', previousStory);
    document.getElementById('next-story-btn').addEventListener('click', nextStory);
}

function previousStory() {
    let index = stories.findIndex(s => s.title === document.querySelector('.story-title').textContent);
    if (index > 0) {
        loadStory(index - 1);
    }
}

function nextStory() {
    let index = stories.findIndex(s => s.title === document.querySelector('.story-title').textContent);
    if (index < stories.length - 1) {
        loadStory(index + 1);
        updateProgress('stories');
    }
}

function playStoryAudio() {
    const text = document.getElementById('story-text').textContent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
}

function pauseStoryAudio() {
    window.speechSynthesis.cancel();
}

function initializeDragAndDrop() {
    const draggables = document.querySelectorAll('.draggable-word');
    const blanks = document.querySelectorAll('.word-blank');

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text', draggable.textContent);
        });
    });

    blanks.forEach(blank => {
        blank.addEventListener('dragover', (e) => e.preventDefault());
        blank.addEventListener('drop', (e) => {
            e.preventDefault();
            const word = e.dataTransfer.getData('text');
            blank.textContent = word;
            blank.style.background = '#dff9fb';
        });
    });
}

function checkAnswers() {
    const blanks = document.querySelectorAll('.word-blank');
    let correct = 0;
    blanks.forEach(blank => {
        if (blank.textContent.toLowerCase() === blank.dataset.answer) {
            blank.style.borderColor = '#2ecc71';
            correct++;
        } else {
            blank.style.borderColor = '#e74c3c';
        }
    });
    if (correct === blanks.length) {
        showFeedback('✨ Selamat! Semua jawaban benar!', '#2ecc71');
        updateProgress('words');
    } else {
        showFeedback('Coba lagi, ada yang belum tepat!', '#e74c3c');
    }
}

function resetGame() {
    gameScore = 0;
    currentWordIndex = 0;
    document.getElementById('game-score').textContent = gameScore;
    document.getElementById('current-word').textContent = gameWords[currentWordIndex].toUpperCase();
    document.querySelectorAll('.picture-card').forEach(card => card.style.background = '#fff');
}

function selectPicture(card, answer) {
    const currentWord = gameWords[currentWordIndex];
    if (answer === currentWord) {
        card.style.background = '#2ecc71';
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        showFeedback('✅ Benar sekali!', '#2ecc71');
        updateProgress('games');
        setTimeout(() => {
            currentWordIndex++;
            if (currentWordIndex < gameWords.length) {
                document.getElementById('current-word').textContent = gameWords[currentWordIndex].toUpperCase();
                document.querySelectorAll('.picture-card').forEach(c => c.style.background = '#fff');
            } else {
                showFeedback('🎉 Permainan selesai! Skor maksimal!', '#3498db');
            }
        }, 1000);
    } else {
        card.style.background = '#e74c3c';
        showFeedback('❌ Salah, coba lagi!', '#e74c3c');
    }
}

function addVocabularyNavigation() {
    // Implementation can be added if needed
}

function addDifficultySelector() {
    // Implementation can be added if needed
}

function playPracticeWord() {
    const word = document.getElementById('practice-word').textContent;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
}

function toggleRecording() {
    if (!isRecording) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                isRecording = true;
                document.getElementById('record-btn').classList.add('recording');
                recordedChunks = [];

                mediaRecorder.ondataavailable = (e) => recordedChunks.push(e.data);
                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    document.getElementById('play-recording-btn').style.display = 'inline-block';
                    document.getElementById('play-recording-btn').dataset.audioUrl = url;
                };
            });
    } else {
        mediaRecorder.stop();
        isRecording = false;
        document.getElementById('record-btn').classList.remove('recording');
        updateProgress('words');
    }
}

function playRecording() {
    const audioUrl = document.getElementById('play-recording-btn').dataset.audioUrl;
    const audio = new Audio(audioUrl);
    audio.play();
}

function showFeedback(message, color) {
    const container = document.getElementById('feedback-container');
    container.innerHTML = `<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: ${color}; color: #fff; padding: 15px 25px; border-radius: 10px; font-size: 1.2em; z-index: 1001;">${message}</div>`;
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = ['#3498db', '#2ecc71', '#e67e22', '#9b59b6'][Math.floor(Math.random() * 4)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10vh';
        confetti.style.animation = `confetti-fall ${Math.random() * 2 + 1}s linear`;
        container.appendChild(confetti);
    }
    setTimeout(() => container.innerHTML = '', 2000);
}

function updateProgress(type) {
    switch(type) {
        case 'words':
            progressData.wordsLearned++;
            document.getElementById('words-learned').textContent = progressData.wordsLearned;
            break;
        case 'stories':
            progressData.storiesCompleted++;
            document.getElementById('stories-completed').textContent = progressData.storiesCompleted;
            break;
        case 'games':
            progressData.gamesPlayed++;
            document.getElementById('games-played').textContent = progressData.gamesPlayed;
            break;
        case 'accuracy':
            progressData.accuracyRate = Math.min(100, progressData.accuracyRate + 1);
            document.getElementById('accuracy-rate').textContent = progressData.accuracyRate + '%';
            break;
    }
    progressChart.data.datasets[0].data = [
        progressData.wordsLearned,
        progressData.storiesCompleted,
        progressData.gamesPlayed,
        progressData.accuracyRate
    ];
    progressChart.update();
}

function initializeApp() {
    loadStory(0);
    initializeDragAndDrop();
    addStoryNavigation();
    addVocabularyNavigation();
    addDifficultySelector();

    const ctx = document.getElementById('progress-chart').getContext('2d');
    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Words Learned', 'Stories Completed', 'Games Played', 'Accuracy Rate (%)'],
            datasets: [{
                label: 'Progress',
                data: [progressData.wordsLearned, progressData.storiesCompleted, progressData.gamesPlayed, progressData.accuracyRate],
                backgroundColor: ['#3498db', '#2ecc71', '#e67e22', '#9b59b6'],
                borderColor: ['#2980b9', '#27ae60', '#d35400', '#8e44ad'],
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => showSection(btn.dataset.section));
    });
    document.getElementById('play-story-btn').addEventListener('click', playStoryAudio);
    document.getElementById('pause-story-btn').addEventListener('click', pauseStoryAudio);
    document.getElementById('check-answers-btn').addEventListener('click', checkAnswers);
    document.querySelectorAll('.picture-card').forEach(card => {
        card.addEventListener('click', () => selectPicture(card, card.dataset.answer));
    });
    document.getElementById('play-practice-word-btn').addEventListener('click', playPracticeWord);
    document.getElementById('record-btn').addEventListener('click', toggleRecording);
    document.getElementById('play-recording-btn').addEventListener('click', playRecording);
}

document.addEventListener('DOMContentLoaded', initializeApp);