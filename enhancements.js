(() => {
    const THEMES = {
        romantic: {
            "--bg-1": "#fee9f7",
            "--bg-2": "#e8f5fe",
            "--bg-3": "#fef2e8",
            "--bg-4": "#f0ffe8",
            "--accent": "#ff4fa4",
            "--accent-soft": "#ff9fce",
            "--text-strong": "#7c2450"
        },
        dreamy: {
            "--bg-1": "#dff7ff",
            "--bg-2": "#efe9ff",
            "--bg-3": "#ffeedd",
            "--bg-4": "#e9fffb",
            "--accent": "#4a8dff",
            "--accent-soft": "#8fb5ff",
            "--text-strong": "#1b3969"
        },
        golden: {
            "--bg-1": "#fff3d1",
            "--bg-2": "#ffe5c4",
            "--bg-3": "#fff8ea",
            "--bg-4": "#f8edd6",
            "--accent": "#d78b12",
            "--accent-soft": "#f1b24d",
            "--text-strong": "#6f4610"
        }
    };

    function applyTheme(themeName) {
        const theme = THEMES[themeName] || THEMES.romantic;
        Object.entries(theme).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
        localStorage.setItem("birthday-theme", themeName);
    }

    function mountThemeSwitcher() {
        if (document.querySelector(".theme-switcher")) {
            return;
        }

        const wrap = document.createElement("div");
        wrap.className = "theme-switcher";
        wrap.innerHTML = `
            <label for="themePick">Theme</label>
            <select id="themePick" aria-label="Theme switcher">
                <option value="romantic">Romantic Pink</option>
                <option value="dreamy">Dreamy Blue</option>
                <option value="golden">Golden Glow</option>
            </select>
        `;
        document.body.appendChild(wrap);

        const select = wrap.querySelector("#themePick");
        const saved = localStorage.getItem("birthday-theme") || "romantic";
        select.value = saved;
        applyTheme(saved);
        select.addEventListener("change", (e) => applyTheme(e.target.value));
    }

    function mountVisualizer() {
        if (document.querySelector(".music-visualizer")) {
            return;
        }

        const visualizer = document.createElement("div");
        visualizer.className = "music-visualizer";
        for (let i = 0; i < 18; i += 1) {
            const bar = document.createElement("span");
            bar.style.setProperty("--delay", `${i * 0.08}s`);
            bar.style.setProperty("--height", `${10 + (i % 6) * 6}px`);
            visualizer.appendChild(bar);
        }
        document.body.appendChild(visualizer);
    }

    function createConfettiBurst(x, y, amount = 32) {
        const container = document.createElement("div");
        container.className = "confetti-burst";
        container.style.left = `${x}px`;
        container.style.top = `${y}px`;
        document.body.appendChild(container);

        const colors = ["#ff5fa2", "#ffd166", "#7bdff2", "#c77dff", "#6ede8a"];
        for (let i = 0; i < amount; i += 1) {
            const piece = document.createElement("i");
            const angle = (Math.PI * 2 * i) / amount;
            const velocity = 50 + Math.random() * 90;
            piece.style.setProperty("--dx", `${Math.cos(angle) * velocity}px`);
            piece.style.setProperty("--dy", `${Math.sin(angle) * velocity}px`);
            piece.style.background = colors[i % colors.length];
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(piece);
        }

        window.setTimeout(() => container.remove(), 1100);
    }

    function mountEnhancementStyles() {
        if (document.querySelector("#enhancementStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "enhancementStyles";
        style.textContent = `
            .theme-switcher {
                position: fixed;
                top: 12px;
                left: 12px;
                z-index: 9999;
                background: rgba(255,255,255,0.88);
                border-radius: 999px;
                padding: 8px 12px;
                box-shadow: 0 8px 22px rgba(0,0,0,0.12);
                display: flex;
                align-items: center;
                gap: 8px;
                backdrop-filter: blur(6px);
                font-size: 12px;
            }
            .theme-switcher label {
                font-weight: 700;
                color: var(--text-strong, #6f4610);
            }
            .theme-switcher select {
                border: 0;
                outline: 0;
                border-radius: 999px;
                padding: 4px 8px;
                background: #fff;
                color: #333;
            }
            .music-visualizer {
                position: fixed;
                left: 50%;
                bottom: 10px;
                transform: translateX(-50%);
                z-index: 9998;
                width: min(320px, 86vw);
                height: 34px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                gap: 5px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            .music-visualizer.active { opacity: 1; }
            .music-visualizer span {
                display: inline-block;
                width: 7px;
                height: var(--height, 14px);
                background: linear-gradient(180deg, var(--accent, #ff4fa4), var(--accent-soft, #ff9fce));
                border-radius: 999px;
                transform-origin: center bottom;
                animation: vizJump 0.8s ease-in-out infinite;
                animation-delay: var(--delay, 0s);
            }
            @keyframes vizJump {
                0%, 100% { transform: scaleY(0.35); }
                50% { transform: scaleY(1); }
            }
            .confetti-burst {
                position: fixed;
                z-index: 9997;
                width: 0;
                height: 0;
                pointer-events: none;
            }
            .confetti-burst i {
                position: absolute;
                width: 10px;
                height: 6px;
                border-radius: 2px;
                animation: confettiFly 1s ease-out forwards;
            }
            @keyframes confettiFly {
                from { opacity: 1; transform: translate(0,0) rotate(0deg); }
                to { opacity: 0; transform: translate(var(--dx), var(--dy)) rotate(480deg); }
            }
            @media (max-width: 680px) {
                .theme-switcher { top: auto; bottom: 52px; left: 10px; }
            }
        `;
        document.head.appendChild(style);
    }

    function setupRomanticEnhancements() {
        mountEnhancementStyles();
        mountThemeSwitcher();
        mountVisualizer();
    }

    function setMusicVisualizerState(active) {
        const el = document.querySelector(".music-visualizer");
        if (!el) {
            return;
        }
        el.classList.toggle("active", Boolean(active));
    }

    window.setupRomanticEnhancements = setupRomanticEnhancements;
    window.createConfettiBurst = createConfettiBurst;
    window.setMusicVisualizerState = setMusicVisualizerState;
})();
