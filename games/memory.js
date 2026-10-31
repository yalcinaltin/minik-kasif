// 🧠 MODÜL 7: SEVİMLİ HAFIZA KARTLARI
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class MemoryGame {
    // ==========================================
    // 🧠 MODÜL 7: SEVİMLİ HAFIZA KARTLARI
    // ==========================================

    // Yatay ekranda en çok 2 sıra: 4 kart tek sıra, 6 kart 3×2, 8 kart 4×2, 12 kart 6×2.
    // Dikey ekranda 2 sütun; 8'den çok kartta 3 sütun (yoksa 5-6 sıra olup kartlar çok küçülür).
    // Kart boyu CSS'te bu satır/sütun sayısına göre ekrana sığacak şekilde hesaplanır.
    applyMemoryGrid(cardCount) {
        const isLandscape = window.innerWidth >= window.innerHeight;
        const landscapeCols = cardCount <= 4 ? cardCount : Math.ceil(cardCount / 2);
        const cols = isLandscape ? landscapeCols : (cardCount > 8 ? 3 : 2);
        const rows = Math.ceil(cardCount / cols);
        this.memoryBoard.style.gridTemplateColumns = `repeat(${cols}, auto)`;
        this.memoryBoard.style.setProperty('--mem-cols', cols);
        this.memoryBoard.style.setProperty('--mem-rows', rows);
        // 3 sütunda son sırada tek kart kalırsa ortaya alınır (10 kart: 3+3+3+1)
        const cards = [...this.memoryBoard.children];
        cards.forEach(c => { c.style.gridColumn = ''; });
        if (cols === 3 && cardCount % 3 === 1 && cards.length) cards[cards.length - 1].style.gridColumn = '2';
    }

    loadMemoryLevel(idx) {
        this.levelEpoch++;
        this.memoryLevelIdx = idx;
        const level = window.GAME_DATA.MEMORY_LEVELS[idx];
        this.flippedCards = [];
        this.matchedPairsCount = 0;
        this.memoryLock = false;

        this.setLevelHeader('memory', level);

        this.renderMemoryBoard();
        soundManager.speak(level.instruction);
    }

    renderMemoryBoard() {
        const level = window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx];
        this.memoryBoard.innerHTML = '';

        const cardsData = [];
        level.pairs.forEach(pair => {
            cardsData.push({ ...pair, uid: `${pair.id}_1` });
            cardsData.push({ ...pair, uid: `${pair.id}_2` });
        });
        cardsData.sort(() => Math.random() - 0.5);


        cardsData.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.id;
            cardEl.dataset.uid = card.uid;

            cardEl.innerHTML = `
                <div class="card-face card-back">
                    <span class="card-back-mark">❓</span>
                </div>
                <div class="card-face card-front">
                    <span class="memory-symbol">${card.symbol}</span>
                    <span class="memory-label">${card.label}</span>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                this.handleMemoryCardClick(cardEl, card);
            });

            this.memoryBoard.appendChild(cardEl);
        });

        this.applyMemoryGrid(cardsData.length);
    }

    async handleMemoryCardClick(cardEl, card) {
        if (this.memoryLock) return;
        if (cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;

        soundManager.playCardFlip();
        cardEl.classList.add('is-flipped');
        this.flippedCards.push({ element: cardEl, data: card });

        if (this.flippedCards.length === 2) {
            this.memoryLock = true;
            const [c1, c2] = this.flippedCards;

            if (c1.data.id === c2.data.id) {
                soundManager.playMatch();
                c1.element.classList.add('is-matched');
                c2.element.classList.add('is-matched');
                this.matchedPairsCount++;

                soundManager.speak(`Harika! ${c1.data.label}!`);
                this.flippedCards = [];
                this.memoryLock = false;

                const level = window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx];
                if (this.matchedPairsCount === level.pairs.length) {
                    soundManager.playSuccess();
                    this.triggerConfetti();
                    this.addStar(2);

                    this.celebrateAfter(900,
                        "Muazzam Hafıza! 🧠🌟",
                        "Tüm çiftleri başarıyla aklında tuttun ve buldun!"
                    );
                }
            } else {
                soundManager.playObstacle();
                const epoch = this.levelEpoch;
                await this.sleep(900);
                // Bu arada bölüm değiştiyse yeni tahtanın kartlarına/kilidine dokunma
                if (epoch !== this.levelEpoch) return;
                c1.element.classList.remove('is-flipped');
                c2.element.classList.remove('is-flipped');
                this.flippedCards = [];
                this.memoryLock = false;
            }
        }
    }
}

installGameMethods(MemoryGame);
