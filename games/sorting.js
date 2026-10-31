// 🧺 MODÜL 15: SEPETLERE AYIR
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class SortingGame {
    // ==========================================
    // 🧺 MODÜL 15: SEPETLERE AYIR
    // ==========================================

    loadSortingLevel(idx) {
        this.levelEpoch++;
        this.sortingLevelIdx = idx;
        const level = window.GAME_DATA.SORTING_LEVELS[idx];
        this.sortingSelected = null;
        this.sortingDone = 0;
        this.setLevelHeader('sorting', level);

        this.sortingBaskets.innerHTML = '';
        this.sortingBaskets.style.setProperty('--basket-count', level.baskets.length);
        level.baskets.forEach(basket => {
            const el = document.createElement('div');
            el.className = 'sorting-basket';
            el.dataset.basket = basket.id;
            el.style.setProperty('--basket-color', basket.color);
            el.innerHTML = `
                <div class="basket-header"><span class="basket-icon">${basket.icon}</span><span>${basket.label}</span></div>
                <div class="basket-content"></div>
                <div class="basket-weave">🧺</div>
            `;
            el.addEventListener('click', () => {
                if (this.sortingSelected) this.trySortItem(this.sortingSelected, el);
            });
            this.sortingBaskets.appendChild(el);
        });

        this.sortingPool.innerHTML = '';
        this.shuffleArray(level.items).forEach(item => {
            const el = document.createElement('div');
            el.className = 'sorting-item';
            el.dataset.basket = item.basket;
            el.dataset.label = item.label;
            el.innerHTML = `<span class="sorting-symbol">${item.symbol}</span><span class="sorting-label">${item.label}</span>`;

            this.attachDragOrTap(el, {
                onTap: () => this.selectSortingItem(el),
                onDrop: (x, y) => {
                    const basket = document.elementFromPoint(x, y)?.closest('.sorting-basket');
                    if (basket) this.trySortItem(el, basket);
                }
            });
            this.sortingPool.appendChild(el);
        });

        this.updateSortingProgress();
        soundManager.speak(level.instruction);
    }

    selectSortingItem(el) {
        const same = this.sortingSelected === el;
        this.sortingPool.querySelectorAll('.sorting-item').forEach(i => i.classList.remove('selected-piece'));
        this.sortingSelected = same ? null : el;
        if (!same) {
            el.classList.add('selected-piece');
            soundManager.speak(el.dataset.label);
        }
        soundManager.playPop();
    }

    trySortItem(itemEl, basketEl) {
        const level = window.GAME_DATA.SORTING_LEVELS[this.sortingLevelIdx];
        this.sortingPool.querySelectorAll('.sorting-item').forEach(i => i.classList.remove('selected-piece'));
        this.sortingSelected = null;

        if (itemEl.dataset.basket !== basketEl.dataset.basket) {
            soundManager.playObstacle();
            soundManager.speak(`Hmm, ${itemEl.dataset.label} bu sepete ait değil. Başka bir sepeti dene!`);
            itemEl.classList.add('piece-wrong');
            basketEl.classList.add('basket-wrong');
            setTimeout(() => {
                itemEl.classList.remove('piece-wrong');
                basketEl.classList.remove('basket-wrong');
            }, 550);
            return;
        }

        const chip = document.createElement('span');
        chip.className = 'basket-chip';
        chip.textContent = itemEl.querySelector('.sorting-symbol').textContent;
        basketEl.querySelector('.basket-content').appendChild(chip);
        basketEl.classList.add('basket-happy');
        setTimeout(() => basketEl.classList.remove('basket-happy'), 450);
        itemEl.remove();

        soundManager.playMatch();
        this.sortingDone++;
        this.updateSortingProgress();

        if (this.sortingDone === level.items.length) {
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak("Süpersin! Her şeyi doğru sepete koydun!");
            this.celebrateAfter(1200, "Sınıflandırma Ustası! 🧺✨", "Hepsini doğru gruplara ayırdın!");
        }
    }

    updateSortingProgress() {
        const level = window.GAME_DATA.SORTING_LEVELS[this.sortingLevelIdx];
        this.sortingProgress.textContent = `🧺 ${this.sortingDone} / ${level.items.length}`;
    }
}

installGameMethods(SortingGame);
