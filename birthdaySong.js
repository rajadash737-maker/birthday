(() => {
    const LYRICS = [
        "आज का दिन है स्पेशल, क्योंकि तुम आई थी।",
        "मेरी लाइफ में खुशियों की लाइट तुम लाई थी।",
        "जब भी देखूं तुम्हें दिल स्माइल कर जाता है।",
        "बरशा नाम सुनते ही दिल प्यार से भर जाता है।",
        "हैप्पी बर्थडे बरशा, माय ब्यूटीफुल स्टार।",
        "दिल से दुआ है तुम जाओ बहुत फार।",
        "खुशियां मिलें तुम्हें हजार।",
        "हैप्पी बर्थडे मेरी बरशा यार।",
        "तुम्हारी स्माइल जैसे मॉर्निंग की सनशाइन।",
        "तुम्हारे बिना लाइफ लगती है ऑफलाइन।",
        "हर मोमेंट में तुम मेरे साथ रहो।",
        "बरशा तुम हमेशा मेरी लाइफ में रहो।",
        "हैप्पी बर्थडे बरशा, मेरी जान हो तुम।",
        "मेरी हर खुशी का अरमान हो तुम।",
        "आज का दिन सिर्फ तुम्हारे नाम।",
        "हैप्पी बर्थडे बरशा, आई लव यू सो मच।"
    ];
    const MP3_PATH = "birthday-song.mp3";

    const NOTE_MAP = {
        C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
        C5: 523.25, D5: 587.33, E5: 659.25
    };

    const MELODY = [
        ["C4", 1], ["E4", 1], ["G4", 1], ["E4", 1],
        ["F4", 1], ["A4", 1], ["G4", 2],
        ["E4", 1], ["G4", 1], ["C5", 1], ["B4", 1],
        ["A4", 1], ["G4", 1], ["E4", 2]
    ];

    function createMusicButton() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "music-toggle";
        button.textContent = "गाना चलाओ";
        button.setAttribute("aria-pressed", "false");
        button.style.position = "fixed";
        button.style.top = "14px";
        button.style.right = "14px";
        button.style.zIndex = "9999";
        button.style.border = "none";
        button.style.borderRadius = "999px";
        button.style.padding = "10px 16px";
        button.style.fontSize = "14px";
        button.style.fontWeight = "700";
        button.style.color = "#fff";
        button.style.background = "linear-gradient(45deg, #ff5fa2, #ff8ec5)";
        button.style.boxShadow = "0 8px 20px rgba(255, 95, 162, 0.35)";
        button.style.cursor = "pointer";
        button.style.backdropFilter = "blur(2px)";
        return button;
    }

    function BirthdaySongPlayer() {
        this.audioContext = null;
        this.masterGain = null;
        this.melodyTimer = null;
        this.noteCursor = 0;
        this.lyricCursor = 0;
        this.isPlaying = false;
        this.button = null;
        this.isUsingMp3 = false;
        this.lyricTimeout = null;
        this.audioElement = null;
        this.voice = null;
        this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    BirthdaySongPlayer.prototype.initAudio = function () {
        if (this.audioContext) {
            return;
        }

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.06;
        this.masterGain.connect(this.audioContext.destination);
    };

    BirthdaySongPlayer.prototype.playNote = function (noteName, beats) {
        if (!this.audioContext || !this.masterGain) {
            return;
        }

        const freq = NOTE_MAP[noteName];
        if (!freq) {
            return;
        }

        const beatSeconds = 0.34;
        const now = this.audioContext.currentTime;
        const duration = Math.max(0.1, beats * beatSeconds);

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.16, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.02);
    };

    BirthdaySongPlayer.prototype.startMelody = function () {
        const step = () => {
            const [noteName, beats] = MELODY[this.noteCursor];
            this.playNote(noteName, beats);
            this.noteCursor = (this.noteCursor + 1) % MELODY.length;
        };

        step();
        this.melodyTimer = window.setInterval(step, 340);
    };

    BirthdaySongPlayer.prototype.pickVoice = function () {
        if (!("speechSynthesis" in window)) {
            return null;
        }

        const voices = window.speechSynthesis.getVoices();
        if (!voices || !voices.length) {
            return null;
        }

        return (
            voices.find((v) => /hi[-_]?IN/i.test(v.lang) && /female|google|microsoft/i.test(v.name)) ||
            voices.find((v) => /hi[-_]?IN/i.test(v.lang)) ||
            voices.find((v) => /en[-_]?IN/i.test(v.lang)) ||
            null
        );
    };

    BirthdaySongPlayer.prototype.speakNextLine = function () {
        if (!this.isPlaying || this.isUsingMp3 || !("speechSynthesis" in window)) {
            return;
        }

        const line = LYRICS[this.lyricCursor];
        this.lyricCursor = (this.lyricCursor + 1) % LYRICS.length;
        if (!line) {
            return;
        }

        const utterance = new SpeechSynthesisUtterance(line);
        utterance.lang = (this.voice && this.voice.lang) || "hi-IN";
        utterance.rate = 0.94;
        utterance.pitch = 1.12;
        utterance.volume = 0.98;

        if (this.voice) {
            utterance.voice = this.voice;
        }

        utterance.onend = () => {
            if (!this.isPlaying || this.isUsingMp3) {
                return;
            }
            this.lyricTimeout = window.setTimeout(() => this.speakNextLine(), 220);
        };

        window.speechSynthesis.speak(utterance);
    };

    BirthdaySongPlayer.prototype.startLyrics = function () {
        if (!("speechSynthesis" in window)) {
            return;
        }

        this.voice = this.pickVoice();
        if (!this.voice) {
            window.speechSynthesis.onvoiceschanged = () => {
                this.voice = this.pickVoice();
            };
        }

        window.speechSynthesis.cancel();
        this.speakNextLine();
    };

    BirthdaySongPlayer.prototype.initMp3 = function () {
        if (this.audioElement) {
            return this.audioElement;
        }

        const audio = document.createElement("audio");
        audio.src = MP3_PATH;
        audio.loop = true;
        audio.preload = "auto";
        audio.volume = 0.45;
        audio.style.display = "none";
        document.body.appendChild(audio);
        this.audioElement = audio;
        return audio;
    };

    BirthdaySongPlayer.prototype.startMp3IfAvailable = function () {
        const audio = this.initMp3();
        return audio.play().then(() => {
            this.isUsingMp3 = true;
        }).catch(() => {
            this.isUsingMp3 = false;
        });
    };

    BirthdaySongPlayer.prototype.start = function () {
        if (this.isPlaying) {
            return;
        }

        this.initAudio();
        if (!this.audioContext) {
            return;
        }

        this.audioContext.resume();
        this.isPlaying = true;
        this.startMp3IfAvailable().finally(() => {
            if (!this.isUsingMp3) {
                this.startMelody();
                this.startLyrics();
            }

            if (typeof window.setMusicVisualizerState === "function") {
                window.setMusicVisualizerState(true);
            }

            if (this.button) {
                this.button.textContent = "गाना रोको";
                this.button.setAttribute("aria-pressed", "true");
            }
        });
    };

    BirthdaySongPlayer.prototype.stop = function () {
        if (!this.isPlaying) {
            return;
        }

        this.isPlaying = false;
        window.clearInterval(this.melodyTimer);
        window.clearTimeout(this.lyricTimeout);
        this.melodyTimer = null;
        this.lyricTimeout = null;
        this.noteCursor = 0;
        this.lyricCursor = 0;
        this.isUsingMp3 = false;

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }

        if (this.audioContext && this.audioContext.state !== "closed") {
            this.audioContext.suspend();
        }

        if (typeof window.setMusicVisualizerState === "function") {
            window.setMusicVisualizerState(false);
        }

        if (this.button) {
            this.button.textContent = "गाना चलाओ";
            this.button.setAttribute("aria-pressed", "false");
        }
    };

    BirthdaySongPlayer.prototype.mount = function () {
        this.button = createMusicButton();
        document.body.appendChild(this.button);
        this.button.addEventListener("click", () => {
            if (this.isPlaying) {
                this.stop();
                return;
            }
            this.start();
        });

        // Autoplay starts only after first user interaction due browser policy.
        document.addEventListener("pointerdown", () => {
            if (this.prefersReducedMotion || this.isPlaying) {
                return;
            }
            this.start();
        }, { once: true });
    };

    window.setupBirthdayMusic = function () {
        if (typeof window.setupRomanticEnhancements === "function") {
            window.setupRomanticEnhancements();
        }
        const player = new BirthdaySongPlayer();
        player.mount();
    };
})();
