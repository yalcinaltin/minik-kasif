// ⚖️ MODÜL 9: BOYUT DÜNYASI (SIRALAMA)
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class SizeGame {
    // ==========================================
    // ⚖️ MODÜL 9: BOYUT DÜNYASI (SIRALAMA)
    // ==========================================

    loadSizeLevel(idx) {
        this.levelEpoch++;
        this.sizeLevelIdx = idx;
        const level = window.GAME_DATA.SIZE_LEVELS[idx];

        this.setLevelHeader('size', level);

        this.resetSizeLevel();
        soundManager.speak(level.instruction);
    }

    resetSizeLevel() {
        const level = window.GAME_DATA.SIZE_LEVELS[this.sizeLevelIdx];
        this.sizeLocked = false;
        this.sizeToken = (this.sizeToken || 0) + 1; // Bekleyen değerlendirme yeni dizilişe dokunmasın
        this.sizePodiumSlots = [null, null, null];
        this.availableSizeItems = this.shuffleArray(level.items);
        // Önceki bölümün yeşil "başardın" / kırmızı "karıştı" görünümü yeni bölüme taşınmasın
        this.podiumSlotsEl.forEach(el => el.classList.remove('podium-success', 'podium-error'));

        this.renderSizePool();
        this.renderSizePodium();
    }

    renderSizePool() {
        this.sizePool.innerHTML = '';

        if (this.availableSizeItems.length === 0) {
            const emptyNotice = document.createElement('div');
            emptyNotice.className = 'pool-all-placed';
            emptyNotice.textContent = '✨ Bütün nesneler podyuma yerleştirildi!';
            this.sizePool.appendChild(emptyNotice);
            return;
        }

        this.availableSizeItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'size-item-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                <div class="item-visual" style="transform: scale(${item.scale});">${item.symbol}</div>
                <div class="item-name">${item.label}</div>
            `;

            card.addEventListener('click', () => {
                this.placeItemOnFirstAvailableSlot(item);
            });

            this.sizePool.appendChild(card);
        });
    }

    renderSizePodium() {
        this.podiumSlotsEl.forEach((slotEl, idx) => {
            const placedItem = this.sizePodiumSlots[idx];
            slotEl.innerHTML = '';

            const slotHeader = document.createElement('div');
            slotHeader.className = 'podium-header';
            const rankTexts = ['1. EN KÜÇÜK 🥉', '2. ORTA BOY 🥈', '3. EN BÜYÜK 🥇'];
            slotHeader.textContent = rankTexts[idx];
            slotEl.appendChild(slotHeader);

            if (placedItem) {
                const itemEl = document.createElement('div');
                itemEl.className = 'podium-placed-item';
                itemEl.innerHTML = `
                    <div class="placed-symbol" style="transform: scale(${placedItem.scale});">${placedItem.symbol}</div>
                    <div class="placed-label">${placedItem.label}</div>
                    <span class="remove-chip" title="Geri Al">✕</span>
                `;

                itemEl.addEventListener('click', () => {
                    this.returnItemToPool(idx);
                });

                slotEl.appendChild(itemEl);
                slotEl.classList.add('has-item');
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'podium-empty-box';
                placeholder.innerHTML = '<span>Boş</span>';
                slotEl.appendChild(placeholder);
                slotEl.classList.remove('has-item');
            }
        });
    }

    placeItemOnFirstAvailableSlot(item) {
        if (this.sizeLocked) return;
        const emptyIndex = this.sizePodiumSlots.findIndex(slot => slot === null);
        if (emptyIndex === -1) return;

        soundManager.playPop();

        this.availableSizeItems = this.availableSizeItems.filter(i => i.id !== item.id);
        this.sizePodiumSlots[emptyIndex] = item;

        this.renderSizePool();
        this.renderSizePodium();

        if (this.sizePodiumSlots.every(slot => slot !== null)) {
            this.checkSizeOrder();
        }
    }

    returnItemToPool(slotIndex) {
        // Doğru sıralandıktan sonra nesneyi çıkarıp yeniden koyarak tekrar tekrar yıldız kazanılmasın
        if (this.sizeLocked) return;
        const item = this.sizePodiumSlots[slotIndex];
        if (!item) return;

        soundManager.playWhoosh();
        this.sizePodiumSlots[slotIndex] = null;
        this.availableSizeItems.push(item);

        this.renderSizePool();
        this.renderSizePodium();
    }

    async checkSizeOrder() {
        // Üç podyum doldu: değerlendirme bitene kadar (ve doğruysa bölüm boyunca) tıklamalar kilitli
        this.sizeLocked = true;
        const epoch = this.levelEpoch;
        const token = this.sizeToken;
        const isCorrect = this.sizePodiumSlots.every((item, idx) => item.rank === (idx + 1));

        await this.sleep(300);
        if (epoch !== this.levelEpoch || token !== this.sizeToken) return;

        if (isCorrect) {
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.podiumSlotsEl.forEach(el => el.classList.add('podium-success'));
            soundManager.speak("Tebrikler! Küçükten büyüğe kusursuz sıraladın!");

            this.celebrateAfter(900,
                "Boyut Ustası! ⚖️🌟",
                "Nesneleri küçükten büyüğe harika bir şekilde yerleştirdin!"
            );
        } else {
            soundManager.playObstacle();
            this.podiumSlotsEl.forEach(el => el.classList.add('podium-error'));
            soundManager.speak("Biraz karıştı! Hadi baştan en küçüğü bularak başlayalım.");

            await this.sleep(1000);
            if (epoch !== this.levelEpoch || token !== this.sizeToken) return;
            this.podiumSlotsEl.forEach(el => el.classList.remove('podium-error'));
            this.resetSizeLevel();
        }
    }
}

installGameMethods(SizeGame);
