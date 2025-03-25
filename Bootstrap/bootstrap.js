// Inisialisasi AOS untuk animasi scroll
AOS.init({
    duration: 1000,
    once: true
  });
  
  // Mode Gelap / Terang
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.innerText = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
  
  // Efek Suara Tombol
  function playSound() {
    let audio = new Audio("https://www.fesliyanstudios.com/play-mp3/4384");
    audio.play();
  }
  
  // Inisialisasi Particles.js untuk efek partikel futuristik
  particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "opacity": {
        "value": 0.5,
        "random": false
      },
      "size": {
        "value": 3,
        "random": true
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 2
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        }
      }
    },
    "retina_detect": true
  });
  
  // Digital Clock
  function updateClock() {
    const clockElement = document.getElementById("digitalClock");
    const now = new Date();
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();
  
  // Validasi Form Login (Contoh Sederhana)
  document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "1234") {
      alert("Login sukses! Selamat datang di dunia terchanggih 2040.");
    } else {
      alert("Username atau password salah.");
    }
  });
  