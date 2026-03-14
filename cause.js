const reasons = [
    {
        text: "You are such a kind and wonderful person, and I feel lucky to share such a good bond with you.",
        emoji: "🌟",
        gif: "gif1.gif"
    },
    {
        text: "May your day be filled with love, laughter, and endless joy.",
        emoji: "💗",
        gif: "gif2.gif"
    },
    {
        text: "Wishing you success, happiness, and everything your heart desires.",
        emoji: "✨",
        gif: "gif1.gif"
    },
    {
        text: "Stay the amazing girl you are, always spreading positivity around. Have the happiest year ahead!",
        emoji: "🥳",
        gif: "gif2.gif"
    }
];

const reasonsContainer = document.getElementById('reasons-container');
const shuffleButton = document.querySelector('.shuffle-button');
const reasonCounter = document.querySelector('.reason-counter');
const cursor = document.querySelector('.custom-cursor');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentReasonIndex = 0;
let isTransitioning = false;
let canNavigate = false;
let floatingIntervalId = null;

function createReasonCard(reason) {
    const card = document.createElement('div');
    card.className = 'reason-card';

    const text = document.createElement('div');
    text.className = 'reason-text';
    text.textContent = `${reason.emoji} ${reason.text}`;

    const gifOverlay = document.createElement('div');
    gifOverlay.className = 'gif-overlay';
    gifOverlay.innerHTML = `<img src="${reason.gif}" alt="Friendship memory" loading="lazy">`;

    card.appendChild(text);
    card.appendChild(gifOverlay);

    if (!prefersReducedMotion) {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'back.out'
        });
    }

    return card;
}

function updateCounter() {
    reasonCounter.textContent = `Reason ${Math.min(currentReasonIndex, reasons.length)} of ${reasons.length}`;
}

function enableStoryMode() {
    canNavigate = true;
    shuffleButton.textContent = 'Enter Our Storylane 💫';
    shuffleButton.classList.add('story-mode');
}

function goToLastPage() {
    if (prefersReducedMotion) {
        window.location.href = 'last.html';
        return;
    }

    gsap.to('body', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            window.location.href = 'last.html';
        }
    });
}

function createFloatingElement() {
    if (document.querySelectorAll('.floating').length > 12) {
        return;
    }

    const elements = ['🌸', '✨', '💖', '🦋', '⭐'];
    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = elements[Math.floor(Math.random() * elements.length)];
    element.style.left = `${Math.random() * window.innerWidth}px`;
    element.style.top = `${Math.random() * window.innerHeight}px`;
    element.style.fontSize = `${Math.random() * 18 + 12}px`;
    document.body.appendChild(element);

    gsap.to(element, {
        y: -420,
        duration: Math.random() * 6 + 6,
        opacity: 0,
        onComplete: () => element.remove()
    });
}

function startFloating() {
    if (prefersReducedMotion || floatingIntervalId) {
        return;
    }

    floatingIntervalId = window.setInterval(createFloatingElement, 2200);
}

function stopFloating() {
    if (!floatingIntervalId) {
        return;
    }

    clearInterval(floatingIntervalId);
    floatingIntervalId = null;
}

function displayNewReason() {
    if (isTransitioning || canNavigate) {
        return;
    }

    if (currentReasonIndex >= reasons.length) {
        enableStoryMode();
        return;
    }

    isTransitioning = true;

    const card = createReasonCard(reasons[currentReasonIndex]);
    reasonsContainer.appendChild(card);
    currentReasonIndex += 1;
    updateCounter();

    if (currentReasonIndex === reasons.length) {
        if (prefersReducedMotion) {
            enableStoryMode();
        } else {
            gsap.to(shuffleButton, {
                scale: 1.1,
                duration: 0.5,
                ease: 'elastic.out',
                onComplete: enableStoryMode
            });
        }
    }

    createFloatingElement();
    window.setTimeout(() => {
        isTransitioning = false;
    }, 350);
}

if (shuffleButton) {
    shuffleButton.addEventListener('click', () => {
        if (canNavigate) {
            goToLastPage();
            return;
        }

        gsap.to(shuffleButton, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });

        displayNewReason();
    });
}

if (cursor && !prefersReducedMotion) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX - 15,
            y: e.clientY - 15,
            duration: 0.15
        });
    });
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopFloating();
    } else {
        startFloating();
    }
});

startFloating();
updateCounter();
