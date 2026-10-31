// 🖼️ MODÜL 13: YAPBOZ
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class JigsawGame {
    // ==========================================
    // 🖼️ MODÜL 13: YAPBOZ
    // ==========================================

    // Kahraman emoji + her parçada farklı küçük süs: parçalar birbirinden ayırt edilebilsin
    buildJigsawImage(level) {
        const cell = 220;
        const canvas = document.createElement('canvas');
        canvas.width = level.cols * cell;
        canvas.height = level.rows * cell;
        const ctx = canvas.getContext('2d');
        const emojiFont = (size) => `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, level.colors[0]);
        grad.addColorStop(1, level.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Alt tepe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height * 1.05, canvas.width * 0.7, canvas.height * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Renkli emoji, dolgu renginin saydamlığını alır: tam opak dolguya dön
        ctx.fillStyle = '#000000';

        const decorations = window.GAME_DATA.JIGSAW_DECORATIONS;
        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const i = r * level.cols + c;
                ctx.font = emojiFont(cell * 0.24);
                ctx.fillText(decorations[(i + level.id) % decorations.length], c * cell + cell * 0.2, r * cell + cell * 0.2);
            }
        }

        ctx.font = emojiFont(Math.min(canvas.width, canvas.height) * 0.66);
        ctx.fillText(level.hero, canvas.width / 2, canvas.height / 2 + cell * 0.06);

        return canvas.toDataURL('image/png');
    }

    loadJigsawLevel(idx) {
        this.levelEpoch++;
        this.jigsawLevelIdx = idx;
        const level = window.GAME_DATA.JIGSAW_LEVELS[idx];
        this.jigsawSelected = null;
        this.jigsawPlaced = 0;
        this.setLevelHeader('jigsaw', level);

        const image = this.buildJigsawImage(level);
        const total = level.cols * level.rows;

        this.jigsawBoard.innerHTML = '';
        this.jigsawBoard.style.setProperty('--cols', level.cols);
        this.jigsawBoard.style.setProperty('--rows', level.rows);

        const guide = document.createElement('div');
        guide.className = 'jigsaw-guide';
        guide.style.backgroundImage = `url(${image})`;
        guide.style.opacity = level.guide;
        this.jigsawBoard.appendChild(guide);

        for (let i = 0; i < total; i++) {
            const slot = document.createElement('div');
            slot.className = 'jigsaw-slot';
            slot.dataset.index = i;
            slot.addEventListener('click', () => {
                if (this.jigsawSelected) this.tryPlaceJigsawPiece(this.jigsawSelected, slot);
            });
            this.jigsawBoard.appendChild(slot);
        }

        this.jigsawTray.innerHTML = '';
        this.shuffleArray([...Array(total).keys()]).forEach(i => {
            const piece = document.createElement('div');
            piece.className = 'jigsaw-piece';
            piece.dataset.index = i;
            const r = Math.floor(i / level.cols);
            const c = i % level.cols;
            piece.style.backgroundImage = `url(${image})`;
            piece.style.backgroundSize = `${level.cols * 100}% ${level.rows * 100}%`;
            piece.style.backgroundPosition =
                `${level.cols > 1 ? (c / (level.cols - 1)) * 100 : 0}% ${level.rows > 1 ? (r / (level.rows - 1)) * 100 : 0}%`;

            this.attachDragOrTap(piece, {
                canStart: () => piece.dataset.placed !== '1',
                onTap: () => this.selectJigsawPiece(piece),
                onDrop: (x, y) => {
                    const slot = document.elementFromPoint(x, y)?.closest('.jigsaw-slot');
                    if (slot) this.tryPlaceJigsawPiece(piece, slot);
                }
            });

            this.jigsawTray.appendChild(piece);
        });

        this.updateJigsawProgress();
        soundManager.speak(level.instruction);
    }

    selectJigsawPiece(piece) {
        const same = this.jigsawSelected === piece;
        this.jigsawTray.querySelectorAll('.jigsaw-piece').forEach(p => p.classList.remove('selected-piece'));
        this.jigsawSelected = same ? null : piece;
        if (!same) piece.classList.add('selected-piece');
        soundManager.playPop();
    }

    tryPlaceJigsawPiece(piece, slot) {
        if (slot.classList.contains('filled')) return;
        const level = window.GAME_DATA.JIGSAW_LEVELS[this.jigsawLevelIdx];
        piece.classList.remove('selected-piece');
        this.jigsawSelected = null;

        if (piece.dataset.index !== slot.dataset.index) {
            soundManager.playObstacle();
            soundManager.speak("Bu parça buraya uymadı, başka bir yere dene!");
            piece.classList.add('piece-wrong');
            slot.classList.add('slot-wrong');
            setTimeout(() => {
                piece.classList.remove('piece-wrong');
                slot.classList.remove('slot-wrong');
            }, 550);
            return;
        }

        piece.dataset.placed = '1';
        piece.classList.add('placed');
        slot.classList.add('filled');
        slot.appendChild(piece);
        soundManager.playMatch();
        this.jigsawPlaced++;
        this.updateJigsawProgress();

        if (this.jigsawPlaced === level.cols * level.rows) {
            this.jigsawBoard.classList.add('jigsaw-complete');
            setTimeout(() => this.jigsawBoard.classList.remove('jigsaw-complete'), 1200);
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak(`Yapboz tamam! Bu bir ${level.heroLabel}!`);
            this.celebrateAfter(1200, "Yapboz Ustası! 🖼️✨", `${level.heroLabel} resmini parça parça tamamladın!`);
        }
    }

    updateJigsawProgress() {
        const level = window.GAME_DATA.JIGSAW_LEVELS[this.jigsawLevelIdx];
        this.jigsawProgress.textContent = `🧩 ${this.jigsawPlaced} / ${level.cols * level.rows} Parça`;
    }
}

installGameMethods(JigsawGame);
