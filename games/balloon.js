// 🎈 MODÜL 5: BALON PATLATMA
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).

// Şekilli balon gövdeleri (emoji değil, SVG çizim): adı, rozet simgesi ve parlak yansıması
const BALLOON_SHAPE_INFO = {
    heart: {
        name: 'Kalp', icon: '❤️',
        svg: '<path d="M50 90 C22 68 4 50 4 31 C4 15 16 5 29 5 C39 5 46 11 50 20 C54 11 61 5 71 5 C84 5 96 15 96 31 C96 50 78 68 50 90 Z"/>'
            + '<ellipse class="shine" cx="27" cy="26" rx="8" ry="11"/>'
    },
    star: {
        name: 'Yıldız', icon: '⭐',
        svg: '<polygon points="50,4 62,36 96,37 69,58 79,93 50,73 21,93 31,58 4,37 38,36"/>'
            + '<ellipse class="shine" cx="44" cy="42" rx="6" ry="9"/>'
    },
    round: {
        name: 'Yuvarlak', icon: '⚪',
        svg: '<circle cx="50" cy="50" r="44"/>'
            + '<ellipse class="shine" cx="33" cy="32" rx="9" ry="13"/>'
    }
};
const BALLOON_NUMBER_WORDS = ['Sıfır', 'Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı'];
const BALLOON_PALETTE = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

class BalloonGame {
    // ==========================================
    // 🎈 MODÜL 5: BALON PATLATMA
    // ==========================================

    loadBalloonLevel(idx) {
        this.levelEpoch++;
        this.balloonLevelIdx = idx;
        const level = window.GAME_DATA.BALLOON_LEVELS[idx];
        this.balloonScore = 0;
        // Turlu görevlerin durumu (hayvan sesi, sayma, büyüklük)
        this.balloonRound = 0;
        this.balloonRoundTarget = null;
        this.balloonBusy = false;
        this.balloonAsking = false;

        this.setLevelHeader('balloon', level);

        this.updateBalloonScoreUI();

        // Sayma ve büyüklük görevlerinde balonlar sürekli uçmaz: her tur kendi balonlarını çıkarır
        if (level.mode === 'count' || level.mode === 'size') {
            this.stopBalloonSpawner();
            this.balloonSky.innerHTML = '';
            soundManager.speak(level.instruction);
            if (level.mode === 'count') this.startBalloonCountRound(2200);
            else this.startBalloonSizeRound();
            return;
        }

        if (level.mode === 'animal') this.balloonRoundTarget = this.pickBalloonAnimal();
        this.startBalloonSpawner();

        if (level.mode === 'animal') {
            // Hayvan görevinde yönerge yerine doğrudan ilk ses sorulur; 🔊 düğmesi sesi tekrar söyletir
            this.addBalloonListenButton();
            this.speakBalloonAnimalCue();
        } else {
            soundManager.speak(level.instruction);
        }
    }

    // 🐶 / Tekrar: turlu görevlerde o anki soru söylenir
    getBalloonInstruction() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        if (level.mode === 'animal' && this.balloonRoundTarget) return this.getBalloonAnimalCue();
        if (level.mode === 'count' && this.balloonAsking) return 'Kaç balon gördün?';
        return level.instruction;
    }

    updateBalloonScoreUI() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        if (level.mode === 'sequence') {
            // Sırayla saymada rozet sıradaki sayıyı gösterir
            const next = this.getBalloonSequenceItem();
            this.balloonScoreBadge.textContent = next
                ? `👉 ${next.label} · ${this.balloonScore}/${level.targetCount}`
                : `🎉 ${this.balloonScore}/${level.targetCount}`;
            return;
        }
        // Renk görevinde hedef rengin dairesi görünür (🎯 yerine 🔴 gibi); şekil görevinde hedef şekil
        let icon = '🎯';
        if (level.mode === 'color_filter') {
            const target = level.colors.find(c => c.name === level.targetColor);
            if (target) icon = target.emoji;
        } else if (level.mode === 'shape') {
            const shape = BALLOON_SHAPE_INFO[level.targetShape];
            if (shape) icon = shape.icon;
        } else if (level.mode === 'animal') {
            icon = '🔊';
        } else if (level.mode === 'count') {
            icon = '🔢';
        } else if (level.mode === 'size') {
            icon = '🎈';
        }
        this.balloonScoreBadge.textContent = `${icon} ${this.balloonScore} / ${level.targetCount}`;
    }

    // Sırayla sayma bölümünde sıradaki sayı: doğru patlatılan balon sayısı kadar ilerler
    getBalloonSequenceItem() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        if (level.mode !== 'sequence') return null;
        return level.items[this.balloonScore] || null;
    }

    // Aranan balon gökyüzünde yoksa hemen bir tane çıkar (7 balon sınırına takılmasın):
    // sırayla saymada sıradaki sayı, renk görevinde hedef renk, şekil görevinde hedef şekil,
    // hayvan görevinde sesi sorulan hayvan
    ensureSequenceBalloon() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        if (level.mode === 'color_filter') {
            if (!this.activeBalloons.some(b => b.data.name === level.targetColor)) {
                const target = level.colors.find(c => c.name === level.targetColor);
                if (target) this.spawnBalloon(target);
            }
            return;
        }
        if (level.mode === 'shape') {
            if (!this.activeBalloons.some(b => b.data.shape === level.targetShape)) {
                this.spawnBalloon(level.targetShape);
            }
            return;
        }
        if (level.mode === 'animal') {
            // Turlar arasında (doğru cevaptan sonra) yeni hedef seçilene kadar beklenir
            const target = this.balloonRoundTarget;
            if (this.balloonBusy || !target) return;
            if (!this.activeBalloons.some(b => b.data.id === target.id)) {
                this.spawnBalloon(target);
            }
            return;
        }
        const next = this.getBalloonSequenceItem();
        if (!next) return;
        if (!this.activeBalloons.some(b => b.data.text === next.label)) {
            this.spawnBalloon(next);
        }
    }

    startBalloonSpawner() {
        this.stopBalloonSpawner();
        this.balloonSky.innerHTML = '';
        this.activeBalloons = [];

        for (let i = 0; i < 3; i++) {
            this.spawnBalloon();
        }
        this.ensureSequenceBalloon();

        this.balloonInterval = setInterval(() => {
            // Uygulama arka plandayken yeni balon çıkmasın (dönünce kaldığı yerden sürer)
            if (document.hidden) return;
            if (this.activeBalloons.length < 7) {
                this.spawnBalloon();
            }
            this.ensureSequenceBalloon();
        }, 1200);
    }

    stopBalloonSpawner() {
        if (this.balloonInterval) {
            clearInterval(this.balloonInterval);
            this.balloonInterval = null;
        }
        this.activeBalloons.forEach(b => {
            if (b.element && b.element.parentNode) {
                b.element.parentNode.removeChild(b.element);
            }
        });
        this.activeBalloons = [];
    }

    // Şekilli balonun SVG gövdesi (renk dolgu + kenar: yıldızın uçları yuvarlak görünsün)
    getBalloonShapeSvg(shape, color) {
        const info = BALLOON_SHAPE_INFO[shape] || BALLOON_SHAPE_INFO.round;
        return `<svg class="balloon-shape-svg" viewBox="0 0 100 100" style="fill:${color};stroke:${color}" aria-hidden="true">${info.svg}</svg>`;
    }

    spawnBalloon(forcedItem = null) {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        const randomColor = BALLOON_PALETTE[Math.floor(Math.random() * BALLOON_PALETTE.length)];

        let balloonData = {};
        if (level.mode === 'numbers' || level.mode === 'sequence') {
            const item = forcedItem || level.items[Math.floor(Math.random() * level.items.length)];
            balloonData = {
                type: 'number',
                text: item.label,
                speech: item.speech,
                color: randomColor
            };
        } else if (level.mode === 'shape') {
            const shape = forcedItem || level.shapes[Math.floor(Math.random() * level.shapes.length)];
            balloonData = {
                type: 'shape',
                shape,
                color: randomColor
            };
        } else if (level.mode === 'animal') {
            const a = forcedItem || level.animals[Math.floor(Math.random() * level.animals.length)];
            balloonData = {
                type: 'animal',
                id: a.id,
                name: a.name,
                sound: a.sound,
                emoji: a.emoji,
                color: randomColor
            };
        } else {
            const c = forcedItem || level.colors[Math.floor(Math.random() * level.colors.length)];
            balloonData = {
                type: 'color',
                name: c.name,
                color: c.hex,
                emoji: c.emoji
            };
        }

        const el = document.createElement('div');
        el.className = 'floating-balloon';
        if (balloonData.type === 'shape') {
            // Şekilli balonda gövde SVG'dir; kutunun kendi zemini/gölgesi olmaz
            el.classList.add('shape-balloon');
        } else {
            el.style.backgroundColor = balloonData.color;
        }

        const leftPercent = 10 + Math.random() * 75;
        el.style.left = `${leftPercent}%`;
        el.style.bottom = '-120px';

        if (balloonData.type === 'number') {
            el.innerHTML = `<span class="balloon-label">${balloonData.text}</span><div class="balloon-string"></div>`;
        } else if (balloonData.type === 'shape') {
            el.innerHTML = `${this.getBalloonShapeSvg(balloonData.shape, balloonData.color)}<div class="balloon-string"></div>`;
        } else {
            el.innerHTML = `<span class="balloon-emoji">${balloonData.emoji}</span><div class="balloon-string"></div>`;
        }

        const speed = 7 + Math.random() * 4;
        el.style.animation = `balloonFloat ${speed}s linear infinite`;

        const popHandler = (e) => {
            e.stopPropagation();
            this.popBalloon(el, balloonData);
        };
        el.addEventListener('pointerdown', popHandler);

        this.balloonSky.appendChild(el);
        this.activeBalloons.push({ element: el, data: balloonData });
    }

    async popBalloon(balloonEl, data) {
        soundManager.playBalloonPop();

        this.activeBalloons = this.activeBalloons.filter(b => b.element !== balloonEl);
        balloonEl.classList.add('balloon-popped');

        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];

        if (data.type === 'number') {
            soundManager.speak(data.speech);
        } else if (data.type === 'color') {
            soundManager.speak(data.name);
        }

        let isCorrect = true;
        if (level.mode === 'color_filter') {
            if (data.name !== level.targetColor) {
                isCorrect = false;
                soundManager.speak(`Bu ${data.name}! ${level.targetColor} balonu bulalım!`);
            }
        } else if (level.mode === 'sequence') {
            const next = this.getBalloonSequenceItem();
            if (next && data.text !== next.label) {
                isCorrect = false;
                soundManager.speak(`Sıradaki sayı ${next.speech}`);
            }
        } else if (level.mode === 'shape') {
            const target = BALLOON_SHAPE_INFO[level.targetShape];
            const popped = BALLOON_SHAPE_INFO[data.shape];
            if (data.shape !== level.targetShape) {
                isCorrect = false;
                soundManager.speak(`Bu ${popped.name.toLocaleLowerCase('tr-TR')}! ${target.name} balonları bulalım!`);
            } else {
                soundManager.speak(`${target.name}!`);
            }
        } else if (level.mode === 'animal') {
            const target = this.balloonRoundTarget;
            if (this.balloonBusy || !target) {
                // Turlar arasında patlatılan balon sayılmaz, yalnızca hayvanın adı söylenir
                isCorrect = false;
                soundManager.speak(data.name);
            } else if (data.id !== target.id) {
                isCorrect = false;
                soundManager.speak(`Bu ${data.name.toLocaleLowerCase('tr-TR')}, ${data.sound.toLocaleLowerCase('tr-TR')} der. ${target.sound} diyeni bulalım!`);
            } else {
                soundManager.speak(`Evet! ${data.name} ${data.sound.toLocaleLowerCase('tr-TR')} der!`);
            }
        }

        if (isCorrect) {
            this.balloonScore++;
            this.updateBalloonScoreUI();

            if (this.balloonScore >= level.targetCount) {
                this.finishBalloonLevel(level);
            } else if (level.mode === 'animal') {
                this.nextBalloonAnimalRound();
            } else {
                this.ensureSequenceBalloon();
            }
        }

        setTimeout(() => {
            if (balloonEl.parentNode) {
                balloonEl.parentNode.removeChild(balloonEl);
            }
        }, 300);
    }

    // Bölüm bitti: balonlar durur, yıldız ve kutlama
    finishBalloonLevel(level, delayMs = 700) {
        this.stopBalloonSpawner();
        soundManager.playSuccess();
        this.triggerConfetti();
        this.addStar(2);

        const messages = {
            count: `Balonları çok güzel saydın, ${level.id}. bölüm tamam!`,
            size: `En büyük balonları buldun, ${level.id}. bölüm tamam!`,
            shape: `Bütün yıldız balonları buldun, ${level.id}. bölüm tamam!`,
            animal: `Hayvanları seslerinden tanıdın, ${level.id}. bölüm tamam!`,
            color_filter: `Doğru renkteki balonları buldun, ${level.id}. bölüm tamam!`
        };
        const message = messages[level.mode] || `Bütün balonları patlattın, ${level.id}. bölüm tamam!`;
        this.celebrateAfter(delayMs, "Müthiş Balon Avcısı! 🎈⭐", message);
    }

    // ==========================================
    // 🐶 HAYVAN SESİ: "Hav hav! Kim böyle der?"
    // ==========================================

    // Sıradaki hayvan: art arda aynı hayvan sorulmaz
    pickBalloonAnimal() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        const prev = this.balloonRoundTarget;
        const pool = level.animals.filter(a => !prev || a.id !== prev.id);
        return pool[Math.floor(Math.random() * pool.length)];
    }

    getBalloonAnimalCue() {
        return `${this.balloonRoundTarget.sound}! Kim böyle der?`;
    }

    speakBalloonAnimalCue() {
        const target = this.balloonRoundTarget;
        if (!target) return;
        if (target.bark) soundManager.playBark();
        soundManager.speak(this.getBalloonAnimalCue());
    }

    // Gökyüzünün köşesinde büyük 🔊 düğmesi: sesi tekrar dinletir
    addBalloonListenButton() {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'balloon-listen-btn';
        btn.textContent = '🔊';
        btn.setAttribute('aria-label', 'Sesi tekrar dinle');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speakBalloonAnimalCue();
        });
        this.balloonSky.appendChild(btn);
    }

    // Doğru hayvandan sonra kısa bir sevinç arası, ardından yeni ses
    async nextBalloonAnimalRound() {
        const epoch = this.levelEpoch;
        this.balloonBusy = true;
        await this.sleep(2200);
        if (epoch !== this.levelEpoch) return;
        this.balloonBusy = false;
        this.balloonRoundTarget = this.pickBalloonAnimal();
        this.ensureSequenceBalloon();
        this.speakBalloonAnimalCue();
    }

    // ==========================================
    // 🔢 SAYMA: balonlar tek tek uçup gider, sonra "Kaç balon gördün?"
    // ==========================================

    // countAloud: yanlış cevaptan sonraki tekrar izlemede her balonla birlikte sayı söylenir
    async startBalloonCountRound(delayMs = 600, countAloud = false) {
        const epoch = this.levelEpoch;
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        const count = level.rounds[this.balloonRound];
        this.balloonAsking = false;
        this.balloonBusy = true;
        this.balloonSky.innerHTML = '';

        await this.sleep(delayMs);
        if (epoch !== this.levelEpoch) return;

        // Balonlar gökyüzünün altından çıkıp üstünden çıkana kadar yavaşça yükselir
        const skyH = this.balloonSky.clientHeight || 400;
        const rise = skyH + 320;
        const duration = Math.max(4200, rise / 150 * 1000);
        const gap = 1100;
        const slots = this.shuffleArray([...Array(count).keys()]);

        for (let i = 0; i < count; i++) {
            if (epoch !== this.levelEpoch) return;
            const el = document.createElement('div');
            el.className = 'floating-balloon count-balloon';
            el.style.backgroundColor = BALLOON_PALETTE[i % BALLOON_PALETTE.length];
            el.style.left = `${12 + (slots[i] + 0.5) * (76 / count)}%`;
            el.innerHTML = '<div class="balloon-string"></div>';
            this.balloonSky.appendChild(el);
            const anim = el.animate(
                [{ transform: 'translate(-50%, 0)' }, { transform: `translate(-50%, -${rise}px)` }],
                { duration, easing: 'linear', fill: 'forwards' }
            );
            anim.finished.then(() => el.remove()).catch(() => {});
            if (countAloud) soundManager.speak(BALLOON_NUMBER_WORDS[i + 1]);
            else soundManager.playNote(392 + i * 60, 0.3);
            await this.sleep(gap);
        }

        await this.sleep(Math.max(0, duration - gap) + 200);
        if (epoch !== this.levelEpoch) return;
        this.showBalloonCountQuestion();
    }

    // Doğru sayı + yakın iki sayı (1-6 arası), karışık sırada
    getBalloonCountOptions(count) {
        const near = [];
        for (let n = Math.max(1, count - 2); n <= Math.min(6, count + 2); n++) {
            if (n !== count) near.push(n);
        }
        return this.shuffleArray([count, ...this.shuffleArray(near).slice(0, 2)]);
    }

    showBalloonCountQuestion() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        const count = level.rounds[this.balloonRound];
        this.balloonSky.innerHTML = '';
        this.balloonBusy = false;
        this.balloonAsking = true;

        const panel = document.createElement('div');
        panel.className = 'balloon-question-panel';
        panel.innerHTML = '<div class="bq-title">Kaç balon gördün?</div><div class="bq-cards"></div>';
        const cards = panel.querySelector('.bq-cards');

        // Kartta rakam + o kadar nokta: rakamı bilmeyen çocuk noktaları sayar
        this.getBalloonCountOptions(count).forEach(n => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'bq-card';
            btn.dataset.value = n;
            btn.setAttribute('aria-label', BALLOON_NUMBER_WORDS[n]);
            btn.innerHTML = `<span class="bq-digit">${n}</span><span class="bq-dots">${'<i></i>'.repeat(n)}</span>`;
            btn.addEventListener('click', () => this.answerBalloonCount(btn, n));
            cards.appendChild(btn);
        });

        const replay = document.createElement('button');
        replay.type = 'button';
        replay.className = 'bq-replay';
        replay.textContent = '🔁 Tekrar izle';
        replay.addEventListener('click', () => {
            if (this.balloonBusy) return;
            soundManager.playPop();
            this.startBalloonCountRound(300);
        });
        panel.appendChild(replay);

        this.balloonSky.appendChild(panel);
        soundManager.speak('Kaç balon gördün?');
    }

    async answerBalloonCount(btn, n) {
        if (this.balloonBusy || !this.balloonAsking) return;
        const epoch = this.levelEpoch;
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        const count = level.rounds[this.balloonRound];
        this.balloonBusy = true;

        if (n === count) {
            btn.classList.add('bq-correct');
            this.balloonAsking = false;
            soundManager.playStar();
            soundManager.speak(`Evet! ${BALLOON_NUMBER_WORDS[count]} balon!`);
            this.balloonScore++;
            this.updateBalloonScoreUI();
            if (this.balloonScore >= level.targetCount) {
                this.finishBalloonLevel(level, 1200);
                return;
            }
            await this.sleep(1800);
            if (epoch !== this.levelEpoch) return;
            this.balloonRound++;
            this.startBalloonCountRound(300);
            return;
        }

        // Yanlışta ceza yok: aynı balonlar bir daha uçar, bu kez birlikte sayılır
        btn.classList.add('balloon-nudge');
        soundManager.speak('Bir daha bakalım! Hadi birlikte sayalım.');
        await this.sleep(2200);
        if (epoch !== this.levelEpoch) return;
        this.startBalloonCountRound(200, true);
    }

    // ==========================================
    // 📏 BÜYÜKLÜK: "En büyük balonu patlat!"
    // ==========================================

    startBalloonSizeRound() {
        this.balloonSky.innerHTML = '';
        this.balloonBusy = false;

        const row = document.createElement('div');
        row.className = 'balloon-size-row';
        this.balloonSky.appendChild(row);

        // Üç balon aynı renkte, boyları belirgin farklı (büyük, orta, küçük); yerleri karışık
        const color = BALLOON_PALETTE[Math.floor(Math.random() * BALLOON_PALETTE.length)];
        const ratios = this.shuffleArray([1, 0.7, 0.46]);
        ratios.forEach((ratio, i) => {
            const slot = document.createElement('div');
            slot.className = 'balloon-size-slot';
            slot.dataset.ratio = ratio;
            const el = document.createElement('div');
            el.className = 'floating-balloon size-bob';
            el.style.backgroundColor = color;
            el.style.animationDelay = `${i * 0.4}s`;
            el.innerHTML = '<div class="balloon-string"></div>';
            el.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
                this.popBalloonSize(el, ratio === 1);
            });
            slot.appendChild(el);
            row.appendChild(slot);
        });

        // En büyük balon (ipiyle) gökyüzüne sığsın: ölçek gökyüzünün boyuna ve enine göre
        const probe = row.querySelector('.floating-balloon');
        const bw = probe.offsetWidth || 120;
        const bh = probe.offsetHeight || 150;
        const skyW = this.balloonSky.clientWidth || 600;
        const skyH = this.balloonSky.clientHeight || 400;
        const big = Math.max(0.5, Math.min(1.25, (skyH * 0.8) / (bh * 1.3), (skyW / 3 * 0.92) / bw));
        row.querySelectorAll('.balloon-size-slot').forEach(slot => {
            slot.style.transform = `scale(${(big * Number(slot.dataset.ratio)).toFixed(3)})`;
        });
    }

    async popBalloonSize(el, isBig) {
        if (this.balloonBusy) return;
        const epoch = this.levelEpoch;
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];

        if (!isBig) {
            // Küçük balon patlamaz, nazikçe sallanır: üç balon da karşılaştırma için yerinde kalır
            el.classList.remove('size-bob', 'balloon-nudge');
            void el.offsetWidth;
            el.classList.add('balloon-nudge');
            el.addEventListener('animationend', () => {
                el.classList.remove('balloon-nudge');
                el.classList.add('size-bob');
            }, { once: true });
            soundManager.speak('Daha büyüğü var! En büyük balonu bul!');
            return;
        }

        this.balloonBusy = true;
        soundManager.playBalloonPop();
        el.classList.remove('size-bob', 'balloon-nudge');
        el.classList.add('balloon-popped');
        soundManager.speak('Evet! En büyük balon bu!');
        this.balloonScore++;
        this.updateBalloonScoreUI();

        if (this.balloonScore >= level.targetCount) {
            this.finishBalloonLevel(level);
            return;
        }
        await this.sleep(1600);
        if (epoch !== this.levelEpoch) return;
        this.balloonRound++;
        this.startBalloonSizeRound();
    }
}

installGameMethods(BalloonGame);
