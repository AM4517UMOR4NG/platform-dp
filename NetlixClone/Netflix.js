// Variabel Global
const playButtonHero = document.getElementById('play-button');
const heroSection = document.getElementById('hero-section');
const heroContent = document.getElementById('hero-content');
const trailerContainer = document.getElementById('trailer-container');
const backToHeroButton = document.getElementById('back-to-hero-button');
const heroIframe = document.getElementById('hero-iframe');
const movieCards = document.querySelectorAll('.movie-card');
const movieDetailPopup = document.getElementById('movie-detail-popup');
const popupIframe = document.getElementById('popup-iframe');
const popupCloseButton = document.getElementById('popup-close-button');
const overlay = document.getElementById('overlay');

// Header Scroll Effect
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('bg-black', 'shadow-lg');
        header.classList.remove('from-black', 'to-transparent');
    } else {
        header.classList.remove('bg-black', 'shadow-lg');
        header.classList.add('from-black', 'to-transparent');
    }
});

// Hero Trailer Playback
playButtonHero.addEventListener('click', () => {
    heroContent.classList.add('hidden');
    trailerContainer.classList.remove('hidden');
    const baseUrl = 'https://www.youtube.com/embed/nW948Va-l10'; // URL trailer Loki
    heroIframe.src = `${baseUrl}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`;
    heroSection.style.backgroundImage = 'none';
});

backToHeroButton.addEventListener('click', () => {
    trailerContainer.classList.add('hidden');
    heroContent.classList.remove('hidden');
    heroIframe.src = ''; // Hentikan video
    heroSection.style.backgroundImage = "url('https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40ff-8d53-a39118bcabff/f80b2a59-195c-4f15-a7b3-c351f0ee3a85/ID-en-20240506-popsignuptwoweeks-perspective_alpha_website_large.jpg')";
});

// Movie Card Popup
let currentPlayingIframe = null;

movieCards.forEach(card => {
    card.addEventListener('click', () => { // Ubah ke 'click' untuk memudahkan pengujian
        const movieTrailerUrl = card.dataset.trailerUrl;
        if (movieTrailerUrl) {
            movieDetailPopup.style.top = `${window.scrollY + 50}px`; // Posisi tetap di atas
            movieDetailPopup.style.left = '50%';
            movieDetailPopup.style.transform = 'translateX(-50%)';
            movieDetailPopup.classList.add('show');
            overlay.classList.remove('hidden');
            popupIframe.src = movieTrailerUrl; // Muat trailer langsung
            currentPlayingIframe = popupIframe;
        }
    });
});

popupCloseButton.addEventListener('click', () => {
    movieDetailPopup.classList.remove('show');
    overlay.classList.add('hidden');
    if (currentPlayingIframe) {
        popupIframe.src = ''; // Hentikan video
        currentPlayingIframe = null;
    }
});

overlay.addEventListener('click', () => {
    movieDetailPopup.classList.remove('show');
    overlay.classList.add('hidden');
    if (currentPlayingIframe) {
        popupIframe.src = ''; // Hentikan video
        currentPlayingIframe = null;
    }
});

// Scroll Row (Opsional)
function scrollRow(rowId, amount) {
    const row = document.getElementById(rowId);
    row.scrollBy({ left: amount, behavior: 'smooth' });
}