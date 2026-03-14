const cards = Array.from(document.querySelectorAll('.memory-card'));
const images = Array.from(document.querySelectorAll('.memory-img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const voiceNoteBtn = document.getElementById('voiceNoteBtn');
const openLetterBtn = document.getElementById('openLetterBtn');
const closeLetterBtn = document.getElementById('closeLetterBtn');
const letterModal = document.getElementById('letterModal');
const letterContent = document.getElementById('letterContent');

if (typeof window.setupRomanticEnhancements === 'function') {
    window.setupRomanticEnhancements();
}

if (typeof window.setupBirthdayMusic === 'function') {
    window.setupBirthdayMusic();
}

let activeCard = 0;
let slideTimer = null;

function runSlideshow() {
    if (!cards.length) {
        return;
    }

    cards.forEach((card, index) => {
        card.classList.toggle('active', index === activeCard);
    });

    activeCard = (activeCard + 1) % cards.length;
}

function startSlideshow() {
    runSlideshow();
    slideTimer = window.setInterval(runSlideshow, 2300);
}

function openLightbox(src, altText) {
    if (!lightbox || !lightboxImg) {
        return;
    }
    lightboxImg.src = src;
    lightboxImg.alt = altText || 'Memory';
    lightbox.classList.add('open');
}

function closeLightbox() {
    if (!lightbox) {
        return;
    }
    lightbox.classList.remove('open');
}

images.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
});

if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
}

const letterText = [
    "Barsha,",
    "",
    "Tumhari smile har din ko bright bana deti hai.",
    "Tumhari presence se life me warmth, peace aur happiness aati hai.",
    "Aaj tumhara din hai, aur meri dil se dua hai ki tum hamesha khush raho.",
    "Happy Birthday, always keep shining."
].join('\n');

function typeLetter(text) {
    if (!letterContent) {
        return;
    }
    letterContent.textContent = '';
    let idx = 0;
    const timer = window.setInterval(() => {
        letterContent.textContent += text.charAt(idx);
        idx += 1;
        if (idx >= text.length) {
            window.clearInterval(timer);
        }
    }, 24);
}

if (openLetterBtn && letterModal) {
    openLetterBtn.addEventListener('click', () => {
        letterModal.classList.add('open');
        typeLetter(letterText);
        if (typeof window.createConfettiBurst === 'function') {
            window.createConfettiBurst(Math.floor(window.innerWidth / 2), 150, 30);
        }
    });
}

if (closeLetterBtn && letterModal) {
    closeLetterBtn.addEventListener('click', () => {
        letterModal.classList.remove('open');
    });
}

if (letterModal) {
    letterModal.addEventListener('click', (e) => {
        if (e.target === letterModal) {
            letterModal.classList.remove('open');
        }
    });
}

if (voiceNoteBtn) {
    voiceNoteBtn.addEventListener('click', () => {
        const note = new Audio('voice-note.mp3');
        note.play().then(() => {
            voiceNoteBtn.textContent = 'Voice Note Playing...';
        }).catch(() => {
            if ('speechSynthesis' in window) {
                const msg = new SpeechSynthesisUtterance('Barsha, happy birthday. You are very special and loved. Stay blessed always.');
                msg.lang = 'en-IN';
                window.speechSynthesis.speak(msg);
            }
        });
    });
}

window.addEventListener('load', () => {
    startSlideshow();
    if (typeof window.createConfettiBurst === 'function') {
        window.createConfettiBurst(Math.floor(window.innerWidth / 2), 130, 44);
    }
});
