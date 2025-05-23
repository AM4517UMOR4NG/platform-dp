// Story data
const stories = [
    {
        title: "The Adventurous Cat",
        segments: [
            {
                illustration: "https://via.placeholder.com/600x400?text=Cat+Adventure",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                text: "Once upon a time, there was a <span class='blank' data-position='0'></span> who loved to explore.",
                blanks: [{ position: 0, correctWord: "cat" }],
                words: ["cat", "dog", "bird"]
            }
        ],
        minigames: [
            {
                type: "matchPicture",
                items: [
                    { picture: "https://via.placeholder.com/100?text=Cat", word: "cat" },
                    { picture: "https://via.placeholder.com/100?text=Dog", word: "dog" }
                ]
            }
        ]
    }
];

let currentStory = 0;
let currentSegment = 0;
let masteredWords = new Set();
let completedStories = [];
let audioChunks = [];
let mediaRecorder = null;
let isPlaying = false;
const confetti = window.confetti;

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    console.log(`Showing section: ${sectionId}`);
}

// Enable navigation buttons
function enableNavButtons() {
    document.getElementById('minigame-btn').disabled = false;
    document.getElementById('recording-btn').disabled = false;
    console.log("Mini-Game and Listen & Repeat buttons enabled.");
}

// Display story
function showStory() {
    try {
        showSection('story');
        const segment = stories[currentStory].segments[currentSegment];
        document.getElementById('story-illustration').src = segment.illustration;
        const audio = document.getElementById('story-audio');
        audio.src = segment.audio;
        audio.onended = () => {
            isPlaying = false;
            updatePlayPauseButton();
            document.getElementById('next-segment').style.display = 'block';
        };
        document.getElementById('story-text').innerHTML = segment.text;
        const wordBank = document.getElementById('word-bank');
        wordBank.innerHTML = '';
        segment.words.forEach(word => {
            const wordEl = document.createElement('div');
            wordEl.className = 'word';
            wordEl.textContent = word;
            wordEl.draggable = true;
            wordEl.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text', e.target.textContent);
                console.log(`Dragging word: ${word}`);
            });
            wordBank.appendChild(wordEl);
        });
        document.querySelectorAll('.blank').forEach(blank => {
            blank.addEventListener('dragover', e => e.preventDefault());
            blank.addEventListener('drop', drop);
        });
        updatePlayPauseButton();
        // Check if story is already completed
        if (completedStories.includes(stories[currentStory].title)) {
            enableNavButtons();
        }
    } catch (err) {
        console.error("Story error:", err);
        alert("Failed to load story. Please refresh.");
    }
}

// Handle drop
function drop(e) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text');
    e.target.textContent = word;
    e.target.classList.add('filled');
    const position = e.target.dataset.position;
    const correctWord = stories[currentStory].segments[currentSegment].blanks.find(b => b.position == position).correctWord;
    console.log(`Dropped word: ${word}, Correct word: ${correctWord}`);
    if (word === correctWord) {
        masteredWords.add(word);
        showFeedback();
        if (checkAllBlanksCorrect()) {
            document.getElementById('next-segment').style.display = 'block';
            enableNavButtons();
        }
    } else {
        e.target.classList.add('wrong');
        setTimeout(() => e.target.classList.remove('wrong'), 500);
    }
}

function checkAllBlanksCorrect() {
    const allCorrect = Array.from(document.querySelectorAll('.blank')).every(blank => {
        const position = blank.dataset.position;
        const correctWord = stories[currentStory].segments[currentSegment].blanks.find(b => b.position == position).correctWord;
        return blank.textContent === correctWord;
    });
    console.log(`All blanks correct: ${allCorrect}`);
    return allCorrect;
}

// Feedback
function showFeedback() {
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#FF4081', '#FFD740', '#40C4FF', '#AB47BC'] });
    document.getElementById('feedback-sound').play().catch(err => console.error("Feedback sound error:", err));
}

// Mini-Game
function showMinigame() {
    try {
        showSection('minigame');
        const minigame = stories[currentStory].minigames[0];
        const content = document.getElementById('minigame-content');
        content.innerHTML = '';
        minigame.items.forEach(item => {
            const img = document.createElement('div');
            img.className = 'minigame-item';
            img.innerHTML = `<img src="${item.picture}" alt="${item.word}" data-word="${item.word}">`;
            img.addEventListener('dragover', e => e.preventDefault());
            img.addEventListener('drop', e => dropMinigame(e, item.word));
            content.appendChild(img);

            const word = document.createElement('div');
            word.className = 'minigame-item word';
            word.textContent = item.word;
            word.draggable = true;
            word.addEventListener('dragstart', e => e.dataTransfer.setData('text', e.target.textContent));
            content.appendChild(word);
        });
    } catch (err) {
        console.error("Minigame error:", err);
        alert("Failed to load mini-game. Please refresh.");
    }
}

function dropMinigame(e, correctWord) {
    e.preventDefault();
    const word = e.dataTransfer.getData('text');
    const target = e.target.closest('.minigame-item');
    if (target.dataset.word === word) {
        target.classList.add('matched');
        target.innerHTML = `<span>${word}</span>`;
        masteredWords.add(word);
        showFeedback();
        console.log(`Mini-Game match correct: ${word}`);
    } else {
        target.classList.add('wrong');
        setTimeout(() => target.classList.remove('wrong'), 500);
        console.log(`Mini-Game match incorrect: ${word}`);
    }
}

document.getElementById('check-minigame').addEventListener('click', () => {
    const items = document.querySelectorAll('.minigame-item:not(.word)');
    if (Array.from(items).every(item => item.classList.contains('matched'))) {
        showFeedback();
        alert("Great job! All matches correct!");
    } else {
        alert("Try again! Some matches are incorrect.");
    }
});

// Listen & Repeat
function setupRecording() {
    try {
        showSection('recording');
        const select = document.getElementById('word-select');
        select.innerHTML = '<option value="" disabled selected>Pick a word</option>';
        stories[currentStory].segments[0].words.forEach(word => {
            const option = document.createElement('option');
            option.value = word;
            option.textContent = word;
            select.appendChild(option);
        });
        console.log("Listen & Repeat section loaded.");
    } catch (err) {
        console.error("Recording error:", err);
        alert("Failed to load Listen & Repeat. Please refresh.");
    }
}

document.getElementById('record-btn').addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            document.getElementById('record-btn').disabled = true;
            document.getElementById('stop-btn').disabled = false;
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                document.getElementById('playback').src = URL.createObjectURL(audioBlob);
                document.getElementById('record-btn').disabled = false;
                document.getElementById('stop-btn').disabled = true;
                stream.getTracks().forEach(track => track.stop());
                showFeedback();
                console.log("Recording completed and playable.");
            };
        })
        .catch(err => {
            console.error("Microphone error:", err);
            alert("Cannot access microphone. Please enable permissions.");
        });
});

document.getElementById('stop-btn').addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
});

// Dashboard
function updateDashboard() {
    try {
        showSection('dashboard');
        const completedList = document.getElementById('completed-stories');
        completedList.innerHTML = completedStories.length ? '' : '<li>No stories completed yet.</li>';
        completedStories.forEach(story => {
            const li = document.createElement('li');
            li.textContent = story;
            completedList.appendChild(li);
        });
        const wordsList = document.getElementById('mastered-words');
        wordsList.innerHTML = masteredWords.size ? '' : '<li>No words mastered yet.</li>';
        masteredWords.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            wordsList.appendChild(li);
        });
        console.log("Dashboard updated:", { completedStories, masteredWords: Array.from(masteredWords) });
    } catch (err) {
        console.error("Dashboard error:", err);
        alert("Failed to load dashboard. Please refresh.");
    }
}
function showFeedback() {
    confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#FF4081', '#FFD740', '#40C4FF', '#AB47BC'] });
    document.getElementById('feedback-sound').play().catch(err => console.error("Feedback sound error:", err));
}
function showFeedback() {
    console.log("Feedback triggered (confetti skipped due to error)");
    document.getElementById('feedback-sound').play().catch(err => console.error("Feedback sound error:", err));
}
// Audio controls
document.getElementById('volume-control').addEventListener('input', e => {
    document.getElementById('story-audio').volume = e.target.value;
});

document.getElementById('play-pause-btn').addEventListener('click', () => {
    const audio = document.getElementById('story-audio');
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play().catch(err => alert("Audio playback failed. Please refresh."));
        isPlaying = true;
    }
    updatePlayPauseButton();
});

function updatePlayPauseButton() {
    document.getElementById('play-pause-btn').innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Navigation
document.getElementById('story-btn').addEventListener('click', showStory);
document.getElementById('minigame-btn').addEventListener('click', showMinigame);
document.getElementById('recording-btn').addEventListener('click', setupRecording);
document.getElementById('dashboard-btn').addEventListener('click', updateDashboard);
document.getElementById('next-segment').addEventListener('click', () => {
    currentSegment++;
    if (currentSegment >= stories[currentStory].segments.length) {
        if (!completedStories.includes(stories[currentStory].title)) {
            completedStories.push(stories[currentStory].title);
            console.log(`Story completed: ${stories[currentStory].title}`);
        }
        currentSegment = 0;
        updateDashboard();
    }
    document.getElementById('next-segment').style.display = 'none';
    showStory();
});

// Button animation
document.querySelectorAll('.btn, nav button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('bounce');
        setTimeout(() => button.classList.remove('bounce'), 400);
    });
});

// Initialize
showStory();