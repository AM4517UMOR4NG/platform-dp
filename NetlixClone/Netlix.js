// ===== Data Video =====
// Menggunakan video bebas hak cipta dari Sample‑Videos.com
const videos = [
  {
    title: 'Big Buck Bunny',
    year: 2008,
    genre: 'Animation',
    thumb: 'https://via.placeholder.com/300x170?text=Big+Buck+Bunny',
    src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    title: 'Sintel Trailer',
    year: 2010,
    genre: 'Animation',
    thumb: 'https://via.placeholder.com/300x170?text=Sintel',
    src: 'https://sample-videos.com/video123/mp4/720/sintel-trailer-480p.mp4'
  },
  {
    title: 'Elephants Dream',
    year: 2006,
    genre: 'Animation',
    thumb: 'https://via.placeholder.com/300x170?text=Elephants+Dream',
    src: 'https://sample-videos.com/video123/mp4/720/elephants_dream_480p_5mb.mp4'
  },
  {
    title: 'For Bigger Blazes',
    year: 2017,
    genre: 'Documentary',
    thumb: 'https://via.placeholder.com/300x170?text=Bigger+Blazes',
    src: 'https://sample-videos.com/video123/mp4/720/for_bigger_blazes.mp4'
  },
  {
    title: 'Tears of Steel',
    year: 2012,
    genre: 'Sci-Fi',
    thumb: 'https://via.placeholder.com/300x170?text=Tears+of+Steel',
    src: 'https://sample-videos.com/video123/mp4/720/tears_of_steel_720p.mp4'
  },
  {
    title: 'Coffee Break',
    year: 2014,
    genre: 'Short',
    thumb: 'https://via.placeholder.com/300x170?text=Coffee+Break',
    src: 'https://sample-videos.com/video123/mp4/720/coffee_break_720p.mp4'
  }
];

// Elemen referensi
const grid   = document.getElementById('videos');
const modal  = document.getElementById('modal');
const player = document.getElementById('player');
const close  = document.getElementById('close');

// Render semua video ke grid
function renderVideos(list) {
  grid.innerHTML = '';
  list.forEach(v => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <img src="${v.thumb}" alt="${v.title}">
      <div class="video-info">
        <h3>${v.title}</h3>
        <p>${v.year} | ${v.genre}</p>
      </div>`;
    card.onclick = () => openModal(v.src);
    grid.appendChild(card);
  });
}

// Filter berdasarkan input pencarian
function filterVideos() {
  const term = document.getElementById('search').value.toLowerCase();
  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(term) ||
    v.genre.toLowerCase().includes(term)
  );
  renderVideos(filtered);
}

// Buka modal dan putar video
function openModal(src) {
  player.src = src;
  modal.style.display = 'flex';
}

// Tutup modal
close.onclick = () => {
  player.pause();
  player.src = '';
  modal.style.display = 'none';
};

// Tutup modal jika klik di luar
window.onclick = e => {
  if (e.target === modal) {
    player.pause();
    player.src = '';
    modal.style.display = 'none';
  }
};

// Inisialisasi
renderVideos(videos);
