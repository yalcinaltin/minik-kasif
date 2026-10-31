// 🎨🔢 MODÜL 10-11: RENK & SAYI BULUCU (SÖYLE & TIKLA)
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class FinderGame {
    // ==========================================
    // 🎨🔢 MODÜL 10-11: RENK & SAYI BULUCU (SÖYLE & TIKLA)
    // ==========================================

    getFinderConfig(kind) {
        const data = window.GAME_DATA;
        return kind === 'color'
            ? { levels: data.COLOR_FINDER_LEVELS, items: data.ALL_COLORS }
            : { levels: data.NUMBER_FINDER_LEVELS, items: data.ALL_NUMBERS };
    }

    getActiveFinderKind() {
        if (this.activeTab === 'colorfinder') return 'color';
        if (this.activeTab === 'numberfinder') return 'number';
        return null;
    }

    getFinderRound(kind) {
        const { levels } = this.getFinderConfig(kind);
        const state = this.finderState[kind];
        return levels[state.levelIdx].rounds[state.roundIdx];
    }

    // "Kırmızı" / "Üç" gibi konuşmaya ve ekrana uygun ad
    getFinderItemName(kind, item) {
        if (kind === 'color') return item.name;
        return item.word.charAt(0) + item.word.slice(1).toLocaleLowerCase('tr-TR');
    }

    getFinderRoundPrompt(kind) {
        const { items } = this.getFinderConfig(kind);
        const name = this.getFinderItemName(kind, items[this.getFinderRound(kind).target]);
        return kind === 'color' ? `${name} rengi bul!` : `${name} sayısını bul!`;
    }

    loadFinderLevel(kind, idx) {
        this.levelEpoch++;
        const { levels } = this.getFinderConfig(kind);
        const level = levels[idx];
        const state = this.finderState[kind];

        state.levelIdx = idx;
        state.roundIdx = 0;

        this.setLevelHeader(kind === 'color' ? 'colorfinder' : 'numberfinder', level);

        this.renderFinderRound(kind);
        soundManager.speak(`${level.instruction} ${this.getFinderRoundPrompt(kind)}`);
    }

    renderFinderRound(kind) {
        const { levels, items } = this.getFinderConfig(kind);
        const ui = this.finderUI[kind];
        const state = this.finderState[kind];
        const level = levels[state.levelIdx];
        const round = level.rounds[state.roundIdx];
        const target = items[round.target];
        const targetName = this.getFinderItemName(kind, target);

        state.busy = false;
        state.roundToken++;

        ui.roundBadge.textContent = `⭐ Tur ${state.roundIdx + 1} / ${level.rounds.length}`;
        ui.targetPrompt.textContent = kind === 'color'
            ? `${targetName} kartı bul ve dokun!`
            : `${targetName} sayısının kartını bul ve dokun!`;

        if (kind === 'color') {
            ui.targetWord.textContent = targetName.toLocaleUpperCase('tr-TR');
            this.applyFinderColorText(ui.targetWord, target);
            ui.targetCircle.textContent = target.items[0].split(' ')[0];
        } else {
            ui.targetDigit.textContent = target.num;
            ui.targetSpelling.textContent = target.word;
            ui.targetVisual.textContent = target.countVisual;
        }

        ui.cards.innerHTML = '';
        round.options.forEach(id => {
            ui.cards.appendChild(this.createFinderCard(kind, id, items[id]));
        });
    }

    // Renk adı yazısı okunur kalsın: açık renkler (sarı) için koyu kenar tonu,
    // beyaz için konturlu beyaz harf (beyaz zeminde kaybolmasın, gri de görünmesin)
    applyFinderColorText(el, item) {
        if (item.id === 'white') {
            el.style.color = '#FFFFFF';
            el.style.webkitTextStroke = '1.5px #64748B';
            el.style.paintOrder = 'stroke fill';
        } else {
            el.style.color = item.borderHex;
            el.style.webkitTextStroke = '';
            el.style.paintOrder = '';
        }
    }

    createFinderCard(kind, id, item) {
        const name = this.getFinderItemName(kind, item);
        const card = document.createElement('div');
        card.className = 'finder-card';
        card.dataset.id = String(id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', name);

        if (kind === 'color') {
            card.style.background = item.cardBg;
            card.style.borderColor = item.borderHex;
            card.innerHTML = `
                <button type="button" class="card-speak-btn" title="Adını Dinle">🔊</button>
                <div class="card-emoji-visual">${item.emoji}</div>
                <div class="card-title-text">${name}</div>
                <div class="card-count-visual">${item.items.map(s => s.split(' ')[0]).join(' ')}</div>
            `;
            this.applyFinderColorText(card.querySelector('.card-title-text'), item);
        } else {
            card.style.borderColor = '#A78BFA';
            card.innerHTML = `
                <button type="button" class="card-speak-btn" title="Adını Dinle">🔊</button>
                <div class="card-emoji-visual" style="color: #7C3AED; font-weight: 900">${item.num}</div>
                <div class="card-title-text">${item.word}</div>
                <div class="card-count-visual">${item.countVisual}</div>
                <div class="card-count-label">${item.countLabel}</div>
            `;
        }

        card.querySelector('.card-speak-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            soundManager.playPop();
            soundManager.speak(name);
        });

        card.addEventListener('click', () => this.chooseFinderCard(kind, id, card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.chooseFinderCard(kind, id, card);
            }
        });

        return card;
    }

    async chooseFinderCard(kind, id, cardEl) {
        const state = this.finderState[kind];
        if (state.busy) return;

        const { levels, items } = this.getFinderConfig(kind);
        const level = levels[state.levelIdx];
        const round = level.rounds[state.roundIdx];
        const targetName = this.getFinderItemName(kind, items[round.target]);
        const chosenName = this.getFinderItemName(kind, items[id]);

        if (String(id) !== String(round.target)) {
            soundManager.playObstacle();
            cardEl.classList.add('card-wrong-shake');
            soundManager.speak(kind === 'color'
                ? `Bu ${chosenName}! Hadi ${targetName} rengi bulalım!`
                : `Bu ${chosenName}! Hadi ${targetName} sayısını bulalım!`);
            setTimeout(() => cardEl.classList.remove('card-wrong-shake'), 600);
            return;
        }

        state.busy = true;
        const token = state.roundToken;
        cardEl.classList.add('magic-voice-selected');
        soundManager.playSuccess();
        this.addStar(1);
        soundManager.speak(`Harika! Bu ${chosenName}!`);

        await this.sleep(1500);
        // Bekleme sırasında bölüm/sekme değiştiyse eski turu ilerletme
        if (token !== state.roundToken || this.getActiveFinderKind() !== kind) {
            state.busy = false;
            return;
        }

        if (state.roundIdx < level.rounds.length - 1) {
            state.roundIdx++;
            this.renderFinderRound(kind);
            soundManager.speak(this.getFinderRoundPrompt(kind));
            return;
        }

        this.triggerConfetti();
        this.addStar(2);
        soundManager.speak(kind === 'color'
            ? "Tebrikler! Bütün renkleri buldun!"
            : "Tebrikler! Bütün sayıları buldun!");
        this.showCelebrationModal(
            kind === 'color' ? "Renk Ustası! 🎨✨" : "Sayı Şampiyonu! 🔢✨",
            `${level.title} bölümündeki bütün ${kind === 'color' ? 'renkleri' : 'sayıları'} buldun!`
        );
    }
}

installGameMethods(FinderGame);
