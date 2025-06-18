const board = document.getElementById('board');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

let timeRemaining = 30;
let score = 0;
let timerInterval;
let boxTimeout;

function startGame() {
  // reset
  timeRemaining = 30;
  score = 0;
  timeEl.textContent = timeRemaining;
  scoreEl.textContent = score;
  startBtn.style.display = 'none';
  board.innerHTML = '';

  // jalankan timer
  timerInterval = setInterval(() => {
    timeRemaining--;
    timeEl.textContent = timeRemaining;
    if (timeRemaining <= 0) endGame();
  }, 1000);

  spawnBox();
}

function spawnBox() {
  const box = document.createElement('div');
  box.classList.add('box');

  // posisi acak di dalam board
  const maxX = board.clientWidth - 50;
  const maxY = board.clientHeight - 50;
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  box.style.left = `${x}px`;
  box.style.top = `${y}px`;

  box.addEventListener('click', () => {
    score++;
    scoreEl.textContent = score;
    board.removeChild(box);
    clearTimeout(boxTimeout);
    spawnBox();
  });

  board.appendChild(box);

  // jika kotak tidak diklik dalam 1 detik, hilang dan munculkan lagi
  boxTimeout = setTimeout(() => {
    if (board.contains(box)) {
      board.removeChild(box);
      spawnBox();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  clearTimeout(boxTimeout);
  board.innerHTML = '';
  startBtn.style.display = 'inline-block';
  alert(`Waktu habis! Skor kamu: ${score}`);
}

startBtn.addEventListener('click', startGame);

// mulai otomatis saat load
window.onload = startGame;
