// 🚂 MODÜL 8: ÖRÜNTÜ TRENİ
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class PatternGame {
    // ==========================================
    // 🚂 MODÜL 8: ÖRÜNTÜ TRENİ
    // ==========================================

    loadPatternLevel(idx) {
        this.levelEpoch++;
        this.patternLevelIdx = idx;
        const level = window.GAME_DATA.PATTERN_LEVELS[idx];
        this.patternSolved = false;

        this.setLevelHeader('pattern', level);

        this.renderPatternTrain();
        this.renderPatternOptions();

        // Dar ekranda tren yana taşar: "?" vagonu görünsün diye sona kaydır
        const trainWrap = this.patternTrainWagons.parentElement;
        trainWrap.scrollLeft = trainWrap.scrollWidth;

        soundManager.speak(level.instruction);
    }

    renderPatternTrain() {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];
        this.patternTrainWagons.innerHTML = '';

        const loco = document.createElement('div');
        loco.className = 'train-locomotive';
        loco.innerHTML = `
            <div class="train-steam">☁️</div>
            <div class="loco-body">🚂</div>
        `;
        this.patternTrainWagons.appendChild(loco);

        level.pattern.forEach((item) => {
            const wagon = document.createElement('div');
            wagon.className = 'train-wagon';
            wagon.innerHTML = `
                <div class="wagon-cargo">${item.symbol}</div>
                <div class="wagon-label">${item.label}</div>
                <div class="wagon-wheels">⚫⚫</div>
            `;
            this.patternTrainWagons.appendChild(wagon);
        });

        const questionWagon = document.createElement('div');
        questionWagon.className = 'train-wagon wagon-question';
        questionWagon.id = 'wagon-target';
        questionWagon.innerHTML = `
            <div class="wagon-cargo question-mark">❓</div>
            <div class="wagon-label">Sırada ne var?</div>
            <div class="wagon-wheels">⚫⚫</div>
        `;
        this.patternTrainWagons.appendChild(questionWagon);
    }

    renderPatternOptions() {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];
        this.patternOptionsContainer.innerHTML = '';

        level.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pattern-option-card';
            btn.innerHTML = `
                <span class="option-symbol">${opt.symbol}</span>
                <span class="option-label">${opt.label}</span>
            `;

            btn.addEventListener('click', () => {
                if (this.patternSolved) return;
                this.checkPatternChoice(opt, btn);
            });

            this.patternOptionsContainer.appendChild(btn);
        });
    }

    async checkPatternChoice(chosenOpt, btnEl) {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];

        if (chosenOpt.symbol === level.correct.symbol) {
            this.patternSolved = true;
            btnEl.classList.add('correct-choice');

            const targetWagon = document.getElementById('wagon-target');
            if (targetWagon) {
                targetWagon.classList.remove('wagon-question');
                targetWagon.classList.add('wagon-solved');
                targetWagon.innerHTML = `
                    <div class="wagon-cargo solved-cargo">${chosenOpt.symbol}</div>
                    <div class="wagon-label">${chosenOpt.label}</div>
                    <div class="wagon-wheels">⚫⚫</div>
                `;
            }

            soundManager.playTrainWhistle();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.patternTrainWagons.classList.add('train-moving');

            soundManager.speak("Tebrikler! Trenin vagonunu doğru tamamladın!");

            this.celebrateAfter(1200,
                "Harika Bir Örüntü Çözücü! 🚂✨",
                `Sıradaki vagonu doğru tahmin ettin! (${chosenOpt.label})`
            );
        } else {
            soundManager.playObstacle();
            btnEl.classList.add('wrong-choice');
            soundManager.speak("Tekrar dene! Vagonların sırasına dikkatlice bakalım.");
            setTimeout(() => {
                btnEl.classList.remove('wrong-choice');
            }, 600);
        }
    }
}

installGameMethods(PatternGame);
