// 🧩 MODÜL 6: ŞEKİL VE GÖLGE EŞLEŞTİRME
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class ShapeGame {
    // ==========================================
    // 🧩 MODÜL 6: ŞEKİL VE GÖLGE EŞLEŞTİRME
    // ==========================================

    loadShapeLevel(idx) {
        this.levelEpoch++;
        this.shapeLevelIdx = idx;
        const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[idx];
        this.selectedShapeItem = null;
        this.matchedShapesCount = 0;

        this.setLevelHeader('shape', level);

        this.renderShapeGame();
        soundManager.speak(level.instruction);
    }

    renderShapeGame() {
        const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx];

        this.shapeSilhouettesContainer.innerHTML = '';
        this.shapePiecesContainer.innerHTML = '';

        // Gölge, nesnenin kendi emojisinden CSS ile üretilir (siyah siluet): her nesnenin gölgesi
        // gerçekten kendine benzer. Cevabı söyleyen yazı yalnızca eşleşince görünür.
        this.shuffleArray(level.items).forEach(item => {
            const silSlot = document.createElement('div');
            silSlot.className = 'silhouette-slot';
            silSlot.dataset.id = item.id;
            silSlot.setAttribute('aria-label', 'Gölge');
            silSlot.innerHTML = `
                <div class="silhouette-icon">${item.symbol}</div>
                <div class="slot-hint">?</div>
            `;

            silSlot.addEventListener('click', () => {
                if (this.selectedShapeItem) {
                    this.tryMatchShape(this.selectedShapeItem, silSlot, item);
                }
            });

            this.shapeSilhouettesContainer.appendChild(silSlot);
        });

        this.shuffleArray(level.items).forEach(item => {
            const piece = document.createElement('div');
            piece.className = 'shape-piece-card';
            piece.dataset.id = item.id;
            piece.innerHTML = `
                <div class="piece-symbol">${item.symbol}</div>
                <div class="piece-label">${item.label}</div>
            `;

            piece.addEventListener('click', () => {
                soundManager.playPop();
                document.querySelectorAll('.shape-piece-card').forEach(p => p.classList.remove('selected-piece'));
                piece.classList.add('selected-piece');
                this.selectedShapeItem = item;
            });

            this.shapePiecesContainer.appendChild(piece);
        });
    }

    async tryMatchShape(selectedItem, slotEl, targetItem) {
        if (selectedItem.id === targetItem.id) {
            soundManager.playMatch();
            this.matchedShapesCount++;

            slotEl.classList.add('slot-matched');
            slotEl.innerHTML = `
                <div class="matched-symbol">${selectedItem.symbol}</div>
                <div class="slot-hint matched-hint">${selectedItem.label} ✓</div>
            `;

            const pieceEl = this.shapePiecesContainer.querySelector(`[data-id="${selectedItem.id}"]`);
            if (pieceEl) {
                pieceEl.classList.add('piece-placed');
            }

            this.selectedShapeItem = null;
            soundManager.speak(`${selectedItem.label} bulundu!`);

            const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx];
            if (this.matchedShapesCount === level.items.length) {
                soundManager.playSuccess();
                this.triggerConfetti();
                this.addStar(2);

                this.celebrateAfter(900,
                    "Şekil Ustası! 🧩✨",
                    "Bütün nesneleri gölgeleriyle kusursuz eşleştirdin!"
                );
            }
        } else {
            soundManager.playObstacle();
            slotEl.classList.add('slot-error');
            soundManager.speak("Farklı bir gölge gibi, hadi tekrar bakalım!");
            setTimeout(() => {
                slotEl.classList.remove('slot-error');
            }, 600);
        }
    }
}

installGameMethods(ShapeGame);
