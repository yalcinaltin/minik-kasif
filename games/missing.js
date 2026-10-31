// 🙈 MODÜL 17: KİM KAYBOLDU?
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class MissingGame {
    // ==========================================
    // 🙈 MODÜL 17: KİM KAYBOLDU?
    // ==========================================
    // Tur akışı: kartlar gösterilir (aklında tut) → perde iner → biri gizlice çıkar → perde kalkar →
    // alttaki seçeneklerden kaybolan bulunur. Seçenekler: kaybolan + hâlâ duranlardan birkaçı.
    // Bölüm verisi: { pool, show, options, rounds, gap?, shuffle?, memorizeMs? }
    //   gap      → kaybolanın yeri "❓" ile boş kalır (kolay); yoksa kartlar kayar
    //   shuffle  → perde kalkınca kalanların yeri de karışır (zor)

    loadMissingLevel(idx) {
        this.levelEpoch++;
        this.missingLevelIdx = idx;
        this.missingRoundIdx = 0;
        const level = window.GAME_DATA.MISSING_LEVELS[idx];

        this.setLevelHeader('missing', level);

        this.startMissingRound();
    }

    // "Tekrar" düğmesi: soru anında soruyu, ezber anında bölüm yönergesini söyler
    getMissingInstruction() {
        const level = window.GAME_DATA.MISSING_LEVELS[this.missingLevelIdx];
        return this.missingPhase === 'ask' ? "Kim kayboldu? Aşağıdan bul!" : level.instruction;
    }

    setMissingStatus(text) {
        this.missingStatus.textContent = text;
    }

    createMissingCard(item, extraClass = '') {
        const card = document.createElement('div');
        card.className = `missing-card ${extraClass}`.trim();
        card.innerHTML = `
            <span class="missing-symbol">${item.symbol}</span>
            <span class="missing-label">${item.label}</span>
        `;
        return card;
    }

    renderMissingShelf(items, missingItem) {
        this.missingShelf.innerHTML = '';
        // Kart sayısı CSS'e: dikey telefonda 4 kart 2×2 dizilir
        this.missingShelf.dataset.count = String(items.length);
        items.forEach(item => {
            if (item === missingItem) {
                // Boş yer: kaybolanın yeri belli kalsın (kolay bölümler)
                const slot = document.createElement('div');
                slot.className = 'missing-card missing-empty-slot';
                slot.innerHTML = '<span class="missing-symbol">❓</span>';
                this.missingShelf.appendChild(slot);
            } else {
                this.missingShelf.appendChild(this.createMissingCard(item));
            }
        });
    }

    async startMissingRound() {
        const level = window.GAME_DATA.MISSING_LEVELS[this.missingLevelIdx];
        const epoch = this.levelEpoch;
        const token = ++this.missingToken;
        const stillHere = () => epoch === this.levelEpoch && token === this.missingToken;

        this.missingPhase = 'look';
        this.missingWrongCount = 0;
        this.missingBusy = true;
        this.missingProgress.textContent = `⭐ ${this.missingRoundIdx + 1} / ${level.rounds}`;

        // Bu turun kartları ve kaybolacak olan
        const shown = this.shuffleArray(level.pool).slice(0, level.show);
        const missingItem = shown[Math.floor(Math.random() * shown.length)];
        this.missingItem = missingItem;

        this.missingOptions.innerHTML = '';
        this.missingOptions.classList.add('missing-options-hidden');
        this.missingShelf.classList.remove('missing-curtain');
        this.renderMissingShelf(shown, null);
        this.setMissingStatus('👀 İyi bak, aklında tut!');
        soundManager.speak(this.missingRoundIdx === 0 ? level.instruction : "Şimdi bunlara iyi bak!");

        await this.sleep(level.memorizeMs || 1800 + 700 * level.show);
        if (!stillHere()) return;

        // Perde iner, biri gizlice çıkar
        this.missingPhase = 'hide';
        this.setMissingStatus('🙈 Gözlerini kapat!');
        this.missingShelf.classList.add('missing-curtain');
        soundManager.playWhoosh();

        await this.sleep(1400);
        if (!stillHere()) return;

        let rest = shown;
        if (!level.gap) rest = shown.filter(item => item !== missingItem);
        // "Yerleri karışacak" denildiği için karışım hiç değişmeden çıkmasın
        if (level.shuffle && rest.length > 1) {
            const base = rest;
            do { rest = this.shuffleArray(base); } while (rest.every((x, k) => x === base[k]));
        }
        this.renderMissingShelf(rest, level.gap ? missingItem : null);
        this.missingShelf.classList.remove('missing-curtain');

        // Seçenekler: kaybolan + hâlâ duranlardan rastgele (options - 1) tanesi
        const others = this.shuffleArray(shown.filter(item => item !== missingItem)).slice(0, level.options - 1);
        const options = this.shuffleArray([missingItem, ...others]);
        this.missingOptions.innerHTML = '';
        this.missingOptions.dataset.count = String(options.length);
        options.forEach(item => {
            const btn = this.createMissingCard(item, 'missing-option');
            btn.setAttribute('role', 'button');
            btn.setAttribute('tabindex', '0');
            btn.setAttribute('aria-label', item.label);
            btn.addEventListener('click', () => this.chooseMissing(item, btn));
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.chooseMissing(item, btn);
                }
            });
            this.missingOptions.appendChild(btn);
        });
        this.missingOptions.classList.remove('missing-options-hidden');

        this.missingPhase = 'ask';
        this.missingBusy = false;
        this.setMissingStatus('❓ Kim kayboldu?');
        soundManager.speak("Kim kayboldu? Aşağıdan bul!");
    }

    async chooseMissing(item, btnEl) {
        if (this.missingBusy || this.missingPhase !== 'ask') return;
        const level = window.GAME_DATA.MISSING_LEVELS[this.missingLevelIdx];

        if (item !== this.missingItem) {
            soundManager.playObstacle();
            btnEl.classList.add('missing-wrong');
            this.missingWrongCount++;
            soundManager.speak(`${item.label} burada! Kaybolanı bul.`);
            setTimeout(() => btnEl.classList.remove('missing-wrong'), 600);

            // İki yanlıştan sonra doğru seçenek nazikçe parlar (çocuk takılıp kalmasın)
            if (this.missingWrongCount >= 2) {
                const hint = [...this.missingOptions.children].find(el => el.getAttribute('aria-label') === this.missingItem.label);
                if (hint) hint.classList.add('missing-hint');
            }
            return;
        }

        this.missingBusy = true;
        this.missingPhase = 'done';
        const epoch = this.levelEpoch;
        const token = this.missingToken;

        btnEl.classList.add('missing-correct');
        // Boş yere kaybolan geri döner (boşluksuz bölümde sona eklenir)
        const slot = this.missingShelf.querySelector('.missing-empty-slot');
        const back = this.createMissingCard(this.missingItem, 'missing-returned');
        if (slot) slot.replaceWith(back);
        else this.missingShelf.appendChild(back);
        this.missingShelf.dataset.count = String(this.missingShelf.children.length);

        soundManager.playSuccess();
        this.addStar(1);
        this.setMissingStatus(`🎉 ${this.missingItem.label} geri geldi!`);
        soundManager.speak(`Evet! ${this.missingItem.label} kaybolmuştu!`);

        await this.sleep(1800);
        if (epoch !== this.levelEpoch || token !== this.missingToken) return;

        if (this.missingRoundIdx < level.rounds - 1) {
            this.missingRoundIdx++;
            this.startMissingRound();
            return;
        }

        this.triggerConfetti();
        this.addStar(2);
        soundManager.speak("Tebrikler! Kaybolanların hepsini buldun!");
        this.celebrateAfter(600,
            "Hafıza Dedektifi! 🙈✨",
            `${level.title} bölümünde kaybolanların hepsini buldun!`
        );
    }
}

installGameMethods(MissingGame);
