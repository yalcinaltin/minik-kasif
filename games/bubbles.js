// 🧼 MODÜL 3: SİHİRLİ SABUN KÖPÜĞÜ PATLATMA
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class BubblesGame {
    // ==========================================
    // 🧼 MODÜL 3: SİHİRLİ SABUN KÖPÜĞÜ PATLATMA
    // ==========================================

    loadBubblesLevel(idx) {
        this.levelEpoch++;
        this.bubblesLevelIdx = idx;
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[idx];
        this.bubblesPoppedScore = 0;

        this.setLevelHeader('bubbles', level);

        this.updateBubblesScoreUI();
        this.startBubblesSpawner();

        soundManager.speak(level.instruction);
    }

    updateBubblesScoreUI() {
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        this.bubblesScoreBadge.textContent = `🧼 ${this.bubblesPoppedScore} / ${level.targetCount} Kurtarıldı`;
    }

    startBubblesSpawner() {
        this.stopBubblesSpawner();
        this.bubblesPond.innerHTML = '';
        this.bubblesChestItems.innerHTML = '<span class="chest-empty-hint">Köpükleri patlatınca sürprizler buraya gelecek! ✨</span>';
        this.activeBubbles = [];

        // İlk 4 baloncuk hemen çıksın
        for (let i = 0; i < 4; i++) {
            this.spawnSoapBubble();
        }

        this.bubblesSpawnTimer = setInterval(() => {
            // Uygulama arka plandayken yeni köpük çıkmasın (dönünce kaldığı yerden sürer)
            if (document.hidden) return;
            // Seçmeli bölümde ekran sayılmayan köpüklerle dolarsa en eskisi süzülüp gider
            if (this.activeBubbles.length >= 8) this.fadeOldestWrongBubble();
            if (this.activeBubbles.length < 8) {
                this.spawnSoapBubble();
            }
        }, 1300);
    }

    stopBubblesSpawner() {
        if (this.bubblesSpawnTimer) {
            clearInterval(this.bubblesSpawnTimer);
            this.bubblesSpawnTimer = null;
        }
        this.activeBubbles.forEach(b => {
            if (b.parentNode) b.parentNode.removeChild(b);
        });
        this.activeBubbles = [];
    }

    // goalSymbols varsa yalnız o sürprizler sayılır (yoksa her köpük sayılır)
    isGoalSurprise(level, surprise) {
        return !level.goalSymbols || level.goalSymbols.includes(surprise.symbol);
    }

    // Seçmeli bölümde hedef köpükler sık çıkar; ekranda hiç yoksa mutlaka hedef çıkar
    pickBubbleSurprise(level) {
        const pick = (list) => list[Math.floor(Math.random() * list.length)];
        if (!level.goalSymbols) return pick(level.surprises);
        const goals = level.surprises.filter(s => this.isGoalSurprise(level, s));
        const others = level.surprises.filter(s => !this.isGoalSurprise(level, s));
        const goalCount = this.activeBubbles.filter(b => b.dataset.goal === '1').length;
        if (goalCount === 0 || !others.length) return pick(goals);
        // Ekranın yarısı zaten hedefse çeldirici çıkar: "sadece balıklı köpükler" görevi hep anlamlı kalsın
        if (goalCount * 2 >= this.activeBubbles.length) return pick(others);
        return Math.random() < 0.55 ? pick(goals) : pick(others);
    }

    // Sayılmayan en eski köpüğü yavaşça silip yer açar (normal bölümlerde hepsi sayıldığı için hiçbir şey yapmaz)
    fadeOldestWrongBubble() {
        const old = this.activeBubbles.find(b => b.dataset.goal !== '1');
        if (!old) return;
        this.activeBubbles = this.activeBubbles.filter(b => b !== old);
        old.style.pointerEvents = 'none';
        this.waitForAnimation(old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' }), 400)
            .then(() => old.remove());
    }

    spawnSoapBubble() {
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        const surprise = this.pickBubbleSurprise(level);

        const bubble = document.createElement('div');
        bubble.className = 'magic-soap-bubble';
        bubble.dataset.goal = this.isGoalSurprise(level, surprise) ? '1' : '0';
        // İsteğe bağlı küçük köpük ('scale' özelliği uçuş animasyonundaki 'transform' ile çakışmaz)
        if (level.bubbleScale) bubble.style.scale = String(level.bubbleScale);

        // Yatay rastgele konum (%8 - %88)
        const leftPercent = 8 + Math.random() * 80;
        bubble.style.left = `${leftPercent}%`;
        bubble.style.bottom = '-140px';

        bubble.innerHTML = `
            <div class="bubble-sheen-shine"></div>
            <div class="bubble-surprise-inside">${surprise.symbol}</div>
        `;

        const duration = (6.5 + Math.random() * 4) / (level.floatSpeed || 1);
        bubble.style.animation = `soapBubbleFloat ${duration}s linear infinite`;

        const popHandler = (e) => {
            e.stopPropagation();
            this.popSoapBubble(bubble, surprise);
        };
        bubble.addEventListener('pointerdown', popHandler);

        this.bubblesPond.appendChild(bubble);
        this.activeBubbles.push(bubble);
    }

    async popSoapBubble(bubbleEl, surprise) {
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        if (this.bubblesPoppedScore >= level.targetCount) return;

        // Seçmeli bölümde aranmayan köpük patlamaz: sallanır ve ipucu söylenir (ceza yok)
        if (!this.isGoalSurprise(level, surprise)) {
            bubbleEl.animate([
                { rotate: '0deg' }, { rotate: '-14deg' }, { rotate: '14deg' }, { rotate: '0deg' }
            ], { duration: 400 });
            const now = Date.now();
            if (!this.bubblesHintAt || now - this.bubblesHintAt > 1500) {
                this.bubblesHintAt = now;
                soundManager.speak(level.goalHint);
            }
            return;
        }

        soundManager.playBubblePlop();

        this.activeBubbles = this.activeBubbles.filter(b => b !== bubbleEl);
        bubbleEl.classList.add('soap-bubble-popped');

        // Sesli isimlendirme
        soundManager.speak(surprise.label);

        // Sandığa oyuncak ekle
        const emptyHint = this.bubblesChestItems.querySelector('.chest-empty-hint');
        if (emptyHint) {
            this.bubblesChestItems.innerHTML = '';
        }

        const toyEl = document.createElement('div');
        toyEl.className = 'chest-toy-item';
        toyEl.innerHTML = `<span>${surprise.symbol}</span>`;
        this.bubblesChestItems.appendChild(toyEl);

        this.bubblesPoppedScore++;
        this.updateBubblesScoreUI();

        if (this.bubblesPoppedScore >= level.targetCount) {
            this.stopBubblesSpawner();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.celebrateAfter(800,
                "Sihirli Köpük Ustası! 🧼✨",
                `Tüm gizli sürprizleri sandığına topladın!`
            );
        }

        setTimeout(() => {
            if (bubbleEl.parentNode) {
                bubbleEl.parentNode.removeChild(bubbleEl);
            }
        }, 300);
    }
}

installGameMethods(BubblesGame);
