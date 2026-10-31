/**
 * Minik Kaşif - Ses ve Türkçe Seslendirme Motoru
 * - Yalnızca gerçek Türkçe ses motorlarını kullanır (Yabancı dilli robot seslerin Türkçeyi bozmasını kesinlikle engeller).
 * - Cihazda Türkçe ses yoksa İngilizce robotun anlaşılmaz okumasını durdurur ve görsel maskot konuşma balonunu devreye sokar.
 * - %100 yerel Web Audio API ses efektleri sunar.
 */

class SoundManager {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.voiceEnabled = true;
        this.turkishVoice = null;
        this.hasTurkishVoice = false;

        this.initAudioContext();
        this.initSpeechVoices();
    }

    initAudioContext() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
            this.ctx = new AudioCtx();
        }
    }

    ensureContext() {
        if (!this.ctx) {
            this.initAudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    initSpeechVoices() {
        if (!('speechSynthesis' in window)) return;

        const updateVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (!voices || voices.length === 0) return;

            // Yalnızca Türkçe sesleri ara
            const trVoices = voices.filter(v => {
                const lang = (v.lang || '').toLowerCase();
                const name = (v.name || '').toLowerCase();
                return lang.startsWith('tr') || name.includes('turkish') || name.includes('türkçe');
            });

            if (trVoices.length > 0) {
                // En doğal, anlaşılır Türkçe sesi seç (Örn: Microsoft Emel Natural, Tolga Natural, Google Türkçe)
                const naturalVoice = trVoices.find(v => 
                    v.name.includes('Natural') || 
                    v.name.includes('Emel') || 
                    v.name.includes('Tolga') || 
                    v.name.includes('Google')
                );
                this.turkishVoice = naturalVoice || trVoices[0];
                this.hasTurkishVoice = true;
                console.log("Aktif Türkçe Ses Motoru:", this.turkishVoice.name);
            } else {
                this.turkishVoice = null;
                this.hasTurkishVoice = false;
                console.warn("Cihazda yerel Türkçe ses motoru bulunamadı. Yabancı dilli robot seslerin Türkçeyi bozması engellendi.");
            }
        };

        updateVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    }

    /**
     * Türkçe Temizleme: Emojileri ve garip sembolleri metinden ayıklar.
     * Böylece sentezleyici "tavşan yüzü havuç pençe..." gibi anlamsız kelimeler okumaz.
     */
    cleanTurkishText(text) {
        if (!text) return '';
        return text
            .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '') // Emojileri temizle
            .replace(/[★⚫▲⬛✓✕]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    /**
     * Türkçe Sesli Yönerge:
     * Gerçek Türkçe ses varsa anlaşılır, yumuşak tempoda konuşur.
     * Cihazda Türkçe ses yoksa İngilizce sentezleyicinin Türkçeyi bozmasına ASLA izin vermez;
     * bunun yerine büyük görsel konuşma balonu ve hoş bir dikkat ziliyle yönergeyi iletir.
     */
    speak(text) {
        const cleanText = this.cleanTurkishText(text);
        if (!cleanText) return;

        // Görsel konuşma balonunu her durumda ekranda göster (çocuk ve ebeveyn hemen net olarak okur)
        this.showMascotSpeechBubble(cleanText);

        if (!this.voiceEnabled) return;
        if (!('speechSynthesis' in window)) return;

        // Sesleri yeniden kontrol et (asenkron gecikmeler için)
        if (!this.turkishVoice) {
            this.initSpeechVoices();
        }

        // Cihazda GERÇEK bir Türkçe ses yoksa, kesinlikle yabancı/İngilizce robot sesi konuşturma!
        // Çünkü İngilizce ses motorunun Türkçe okuması tamamen anlaşılmaz ve bozuk olur.
        if (!this.turkishVoice) {
            this.playPop(); // Nazik bir dikkat zili çal
            return;
        }

        try {
            window.speechSynthesis.cancel(); // Önceki konuşmayı kes

            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.voice = this.turkishVoice;
            utterance.lang = 'tr-TR';
            utterance.rate = 0.92; // 4 yaş için berrak, tane tane ve anlaşılır tempo
            utterance.pitch = 1.0;  // Doğal insan tonu (yapay tizliği kaldır)
            utterance.volume = 1.0;

            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("Konuşma motoru hatası:", e);
        }
    }

    // Maskot Konuşma Balonunu Görsel Olarak Göster
    showMascotSpeechBubble(text) {
        let bubble = document.getElementById('mascot-speech-bubble');
        if (!bubble) return;

        const textEl = bubble.querySelector('.bubble-text');
        if (textEl) {
            textEl.textContent = text;
        }

        bubble.classList.remove('bubble-hidden');
        bubble.classList.add('bubble-active');

        // Önceki zamanlayıcıyı sıfırla
        if (this.bubbleTimeout) {
            clearTimeout(this.bubbleTimeout);
        }

        // 6 saniye sonra nazikçe kaybolsun
        this.bubbleTimeout = setTimeout(() => {
            bubble.classList.remove('bubble-active');
            bubble.classList.add('bubble-hidden');
        }, 6000);
    }

    // ==========================================
    // 🎵 %100 YEREL WEB AUDIO API SES EFEKTLERİ
    // ==========================================

    playPop() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    playBalloonPop() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.1);

        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);

        try {
            const bufferSize = this.ctx.sampleRate * 0.06;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

            noise.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noise.start(now);
        } catch (e) {}
    }

    playCardFlip() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    playMatch() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const startTime = now + idx * 0.07;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.005, startTime + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.22);
        });
    }

    playHop() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    playWhoosh() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playStar() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const freqs = [659.25, 830.61, 987.77, 1318.51];
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            const startTime = now + idx * 0.05;
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + 0.25);
        });
    }

    playSuccess() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const notes = [
            { f: 523.25, d: 0.12 },
            { f: 659.25, d: 0.12 },
            { f: 783.99, d: 0.14 },
            { f: 1046.50, d: 0.35 }
        ];

        let timeOffset = 0;
        const now = this.ctx.currentTime;

        notes.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            const startTime = now + timeOffset;
            osc.frequency.setValueAtTime(note.f, startTime);

            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.005, startTime + note.d);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + note.d);

            timeOffset += note.d * 0.85;
        });
    }

    playObstacle() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        const now = this.ctx.currentTime;
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.1);
        osc.frequency.linearRampToValueAtTime(160, now + 0.2);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    playTrainWhistle() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const tones = [587.33, 739.99];

        tones.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.linearRampToValueAtTime(freq + 15, now + 0.15);
            osc.frequency.linearRampToValueAtTime(freq, now + 0.35);

            gain.gain.setValueAtTime(0.01, now);
            gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.4);
        });
    }

    // Sabun köpüğü patlama sesi (Sulu, hoş baloncuk pıtırtısı)
    playBubblePlop() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
    }

    // Top sekme sesi (Kauçuk / basketbol zıplaması)
    playBounce() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.12);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Basket / Halka içinden geçiş sesi (Swish)
    playSwish() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        try {
            const bufferSize = this.ctx.sampleRate * 0.15;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
            }
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1400, now);
            filter.Q.setValueAtTime(3, now);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.35, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
        } catch (e) {
            this.playPop();
        }
    }

    // Sevimli köpek havlaması / sevinç sesi
    playBark() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const tones = [380, 480];
        tones.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.08;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);
            osc.frequency.exponentialRampToValueAtTime(freq * 0.7, start + 0.1);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.1);
        });
    }

    // ✨ Sihirli Ses Algılama Çanı (Sesle söylenince otomatik tıklama melodisi)
    playMagicChime() {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // C5, E5, G5, C6 (Neşeli ve berrak pırıltı melodisi)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.055;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.22, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.28);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.28);
        });
    }

    // 🎹 Ksilofon Notası: hızlı vuruş + yumuşak sönüm (temel ton + parlak üst harmonik)
    playNote(freq, duration = 0.7) {
        if (!this.soundEnabled) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        [
            { mult: 1, type: 'triangle', vol: 0.32 },
            { mult: 4, type: 'sine', vol: 0.06 } // tahta/metal "tın" parlaklığı
        ].forEach(({ mult, type, vol }) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq * mult, now);

            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(vol, now + 0.012);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration * (mult === 1 ? 1 : 0.35));

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + duration);
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleVoice() {
        this.voiceEnabled = !this.voiceEnabled;
        if (!this.voiceEnabled && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        return this.voiceEnabled;
    }
}

// Global ses yöneticisi örneği
window.soundManager = new SoundManager();
