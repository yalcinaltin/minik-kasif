// 🖍️ MODÜL 12: BOYAMA KİTABI
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class ColoringGame {
    // ==========================================
    // 🖍️ MODÜL 12: BOYAMA KİTABI
    // ==========================================

    loadColoringLevel(idx) {
        this.levelEpoch++;
        this.coloringLevelIdx = idx;
        const page = window.GAME_DATA.COLORING_PAGES[idx];
        this.coloringDone = false;
        this.setLevelHeader('coloring', page, 'Sayfa');

        this.coloringSvgHolder.innerHTML =
            `<svg class="coloring-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${page.title}">${page.svg}</svg>`;

        this.coloringSvgHolder.querySelectorAll('.paint-region').forEach(region => {
            region.dataset.filled = '0';
            region.addEventListener('click', () => this.paintRegion(region));
        });

        this.renderColoringPalette();
        this.updateColoringProgress();
        soundManager.speak(page.instruction);
    }

    renderColoringPalette() {
        const palette = window.GAME_DATA.COLORING_PALETTE;
        this.coloringPalette.innerHTML = '';

        palette.forEach((color, i) => {
            const swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.className = 'palette-swatch' + (color.isEraser ? ' is-eraser' : '');
            swatch.classList.toggle('selected', i === this.coloringColorIdx);
            swatch.style.setProperty('--swatch', color.hex);
            swatch.setAttribute('aria-label', color.name);
            swatch.title = color.name;
            swatch.innerHTML = color.isEraser ? '<span>🧽</span>' : '';

            swatch.addEventListener('click', () => {
                this.coloringColorIdx = i;
                this.coloringPalette.querySelectorAll('.palette-swatch')
                    .forEach((el, j) => el.classList.toggle('selected', j === i));
                soundManager.playPop();
                soundManager.speak(color.name); // Renk adını duyarak öğrenme
            });

            this.coloringPalette.appendChild(swatch);
        });
    }

    paintRegion(region) {
        const color = window.GAME_DATA.COLORING_PALETTE[this.coloringColorIdx];
        region.style.fill = color.hex;
        region.dataset.filled = color.isEraser ? '0' : '1';

        region.classList.remove('paint-splash');
        void region.getBBox(); // animasyonu yeniden başlatmak için
        region.classList.add('paint-splash');
        soundManager.playBubblePlop();

        this.updateColoringProgress();
    }

    updateColoringProgress() {
        const regions = [...this.coloringSvgHolder.querySelectorAll('.paint-region')];
        const filled = regions.filter(r => r.dataset.filled === '1').length;
        this.coloringProgress.textContent = `🖍️ ${filled} / ${regions.length} Boyandı`;

        // Boyama yaratıcı bir etkinlik: bitince kutlanır ama sonraki sayfaya zorlanmaz
        if (filled === regions.length && !this.coloringDone) {
            this.coloringDone = true;
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak("Harika bir ressamsın! Resmin rengarenk oldu!");
        }
    }

    clearColoringPage() {
        this.coloringSvgHolder.querySelectorAll('.paint-region').forEach(region => {
            region.style.fill = '';
            region.dataset.filled = '0';
        });
        this.updateColoringProgress();
    }
}

installGameMethods(ColoringGame);
