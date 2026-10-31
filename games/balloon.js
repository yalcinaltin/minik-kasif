// 🎈 MODÜL 5: BALON PATLATMA
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class BalloonGame {
    // ==========================================
    // 🎈 MODÜL 5: BALON PATLATMA
    // ==========================================

    loadBalloonLevel(idx) {
        this.levelEpoch++;
        this.balloonLevelIdx = idx;
        const level = window.GAME_DATA.BALLOON_LEVELS[idx];
        this.balloonScore = 0;

        this.setLevelHeader('balloon', level);

        this.updateBalloonScoreUI();
        this.startBalloonSpawner();

        soundManager.speak(level.instruction);
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
        // Renk görevinde hedef rengin dairesi görünür (🎯 yerine 🔴 gibi)
        let icon = '🎯';
        if (level.mode === 'color_filter') {
            const target = level.colors.find(c => c.name === level.targetColor);
            if (target) icon = target.emoji;
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
    // sırayla saymada sıradaki sayı, renk görevinde hedef renk
    ensureSequenceBalloon() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        if (level.mode === 'color_filter') {
            if (!this.activeBalloons.some(b => b.data.name === level.targetColor)) {
                const target = level.colors.find(c => c.name === level.targetColor);
                if (target) this.spawnBalloon(target);
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

    spawnBalloon(forcedItem = null) {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];

        let balloonData = {};
        if (level.mode === 'numbers' || level.mode === 'sequence') {
            const item = forcedItem || level.items[Math.floor(Math.random() * level.items.length)];
            const randomColor = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)];
            balloonData = {
                type: 'number',
                text: item.label,
                speech: item.speech,
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
        el.style.backgroundColor = balloonData.color;

        const leftPercent = 10 + Math.random() * 75;
        el.style.left = `${leftPercent}%`;
        el.style.bottom = '-120px';

        if (balloonData.type === 'number') {
            el.innerHTML = `<span class="balloon-label">${balloonData.text}</span><div class="balloon-string"></div>`;
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
        } else {
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
        }

        if (isCorrect) {
            this.balloonScore++;
            this.updateBalloonScoreUI();
            if (this.balloonScore < level.targetCount) this.ensureSequenceBalloon();

            if (this.balloonScore >= level.targetCount) {
                this.stopBalloonSpawner();
                soundManager.playSuccess();
                this.triggerConfetti();
                this.addStar(2);

                this.celebrateAfter(700,
                    "Müthiş Balon Avcısı! 🎈⭐",
                    `Bütün balonları patlattın, ${level.id}. bölüm tamam!`
                );
            }
        }

        setTimeout(() => {
            if (balloonEl.parentNode) {
                balloonEl.parentNode.removeChild(balloonEl);
            }
        }, 300);
    }
}

installGameMethods(BalloonGame);
