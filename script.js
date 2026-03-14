const cursor = document.querySelector('.cursor');
const greetingElement = document.querySelector('.greeting');
const ctaButton = document.querySelector('.cta-button');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const greetingText = "Hey, you know what? You are the most adorable human I have ever met! 💖";
const floatingElements = ['💖', '✨', '🌸', '💫', '💕'];
let charIndex = 0;
let floatingIntervalId = null;

function typeGreeting() {
    if (!greetingElement || charIndex >= greetingText.length) {
        return;
    }

    greetingElement.textContent += greetingText.charAt(charIndex);
    charIndex += 1;
    setTimeout(typeGreeting, 70);
}

function createFloating() {
    if (document.querySelectorAll('.floating').length > 14) {
        return;
    }

    const element = document.createElement('div');
    element.className = 'floating';
    element.textContent = floatingElements[Math.floor(Math.random() * floatingElements.length)];
    element.style.left = `${Math.random() * 100}vw`;
    element.style.top = `${Math.random() * 100}vh`;
    element.style.fontSize = `${Math.random() * 18 + 20}px`;
    document.body.appendChild(element);

    gsap.to(element, {
        y: -420,
        x: Math.random() * 80 - 40,
        rotation: Math.random() * 300,
        duration: Math.random() * 4 + 4,
        opacity: 1,
        ease: 'none',
        onComplete: () => element.remove()
    });
}

function startFloating() {
    if (prefersReducedMotion || floatingIntervalId) {
        return;
    }
    floatingIntervalId = window.setInterval(createFloating, 1600);
}

function stopFloating() {
    if (!floatingIntervalId) {
        return;
    }
    clearInterval(floatingIntervalId);
    floatingIntervalId = null;
}

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });
}

window.addEventListener('load', () => {
    if (prefersReducedMotion) {
        if (greetingElement) {
            greetingElement.textContent = greetingText;
        }
        if (ctaButton) {
            ctaButton.style.opacity = '1';
        }
        return;
    }

    gsap.to('h1', {
        opacity: 1,
        duration: 1,
        y: 20,
        ease: 'bounce.out'
    });

    gsap.to('.cta-button', {
        opacity: 1,
        duration: 1,
        y: -20,
        ease: 'back.out'
    });

    typeGreeting();
    startFloating();
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopFloating();
    } else {
        startFloating();
    }
});

if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
        gsap.to(ctaButton, {
            scale: 1.1,
            duration: 0.3
        });
    });

    ctaButton.addEventListener('mouseleave', () => {
        gsap.to(ctaButton, {
            scale: 1,
            duration: 0.3
        });
    });

    ctaButton.addEventListener('click', () => {
        gsap.to('body', {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                window.location.href = 'cause.html';
            }
        });
    });
}
