// 🔍 MODÜL 16: FARKLI OLANI BUL
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class OddOneGame {
    // ==========================================
    // 🔍 MODÜL 16: FARKLI OLANI BUL
    // ==========================================
    // Her turda 3-4 kart: hepsi aynı, biri tek bir özelliğiyle farklı (tür, renk, boy, yön).
    // Tur verisi: { base, odd?, oddStyle?, count, say? }
    //   odd      → farklı kartın emojisi (yoksa base kullanılır, fark oddStyle ile verilir)
    //   oddStyle → 'big' | 'small' | 'flip' (aynaya dönük) | 'upside' (baş aşağı)
    //   say      → doğru seçimde söylenecek kısa açıklama (yoksa genel övgü)

    loadOddOneLevel(idx) {
        this.levelEpoch++;
        this.oddoneLevelIdx = idx;
        this.oddoneRoundIdx = 0;
        const level = window.GAME_DATA.ODDONE_LEVELS[idx];

        this.setLevelHeader('oddone', level);

        this.renderOddOneRound();
        soundManager.speak(level.instruction);
    }

    renderOddOneRound() {
        const level = window.GAME_DATA.ODDONE_LEVELS[this.oddoneLevelIdx];
        const round = level.rounds[this.oddoneRoundIdx];

        this.oddoneBusy = false;
        this.oddoneToken++;
        this.oddoneProgress.textContent = `⭐ ${this.oddoneRoundIdx + 1} / ${level.rounds.length}`;

        // Farklı kartın yeri her turda rastgele
        const oddPos = Math.floor(Math.random() * round.count);
        const sizeRound = round.oddStyle === 'big' || round.oddStyle === 'small';

        this.oddoneBoard.innerHTML = '';
        this.oddoneBoard.dataset.count = String(round.count);
        this.oddoneBoard.classList.toggle('oddone-size-round', sizeRound);
        this.oddoneBoard.classList.toggle('oddone-shrink-round', round.oddStyle === 'small');

        for (let i = 0; i < round.count; i++) {
            const isOdd = i === oddPos;
            const card = document.createElement('button');
            card.type = 'button';
            card.className = 'oddone-card';
            card.setAttribute('aria-label', `Kart ${i + 1}`);

            const symbol = document.createElement('span');
            symbol.className = 'oddone-symbol';
            symbol.textContent = isOdd ? (round.odd || round.base) : round.base;
            if (isOdd && round.oddStyle) symbol.classList.add(`oddone-${round.oddStyle}`);
            card.appendChild(symbol);

            card.addEventListener('click', () => this.chooseOddOne(isOdd, card));
            this.oddoneBoard.appendChild(card);
        }
    }

    async chooseOddOne(isOdd, cardEl) {
        if (this.oddoneBusy) return;
        const level = window.GAME_DATA.ODDONE_LEVELS[this.oddoneLevelIdx];
        const round = level.rounds[this.oddoneRoundIdx];

        if (!isOdd) {
            soundManager.playObstacle();
            cardEl.classList.add('oddone-wrong');
            soundManager.speak("Bu ötekilerle aynı! Farklı olanı bul.");
            setTimeout(() => cardEl.classList.remove('oddone-wrong'), 600);
            return;
        }

        this.oddoneBusy = true;
        const token = this.oddoneToken;
        cardEl.classList.add('oddone-correct');
        soundManager.playSuccess();
        this.addStar(1);
        soundManager.speak(round.say || "Harika! Farklı olanı buldun!");

        await this.sleep(1600);
        // Bekleme sırasında bölüm/sekme değiştiyse eski turu ilerletme
        if (token !== this.oddoneToken || this.activeTab !== 'oddone') return;

        if (this.oddoneRoundIdx < level.rounds.length - 1) {
            this.oddoneRoundIdx++;
            this.renderOddOneRound();
            soundManager.speak("Şimdi bunlara bak!");
            return;
        }

        this.triggerConfetti();
        this.addStar(2);
        soundManager.speak("Tebrikler! Hepsini buldun!");
        this.celebrateAfter(600,
            "Keskin Gözler! 🔍✨",
            `${level.title} bölümünde bütün farklıları buldun!`
        );
    }
}

installGameMethods(OddOneGame);
