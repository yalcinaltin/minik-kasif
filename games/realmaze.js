// 🐶 MODÜL 1: CANLI YÖN TUŞLU LABİRENT
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class RealmazeGame {
    // ==========================================
    // 🐶 MODÜL 1: CANLI YÖN TUŞLU LABİRENT
    // ==========================================

    loadRealmazeLevel(idx) {
        this.levelEpoch++;
        this.realmazeLevelIdx = idx;
        // "Başa Dön" tahtayı sıfırlar ama yıldızlar bölüm başına bir kez verilir
        this.realmazePaidStars = new Set();
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[idx];

        this.setLevelHeader('realmaze', level);

        this.resetRealmazePosition();
        soundManager.speak(level.instruction);
    }

    resetRealmazePosition() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        this.realmazePlayer = { ...level.start, facing: 'right' };
        this.realmazeStars.clear();
        this.realmazeFinished = false;
        this.updateRealmazeStarsUI();
        this.renderRealmazeGrid();
    }

    updateRealmazeStarsUI() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        this.realmazeStarsBadge.textContent = `⭐ ${this.realmazeStars.size} / ${level.stars.length} Toplandı`;
    }

    renderRealmazeGrid() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        const { cols, rows } = level;

        this.realmazeGrid.innerHTML = '';
        this.realmazeGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        this.realmazeGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                // Başlangıç Karesi
                if (x === level.start.x && y === level.start.y) {
                    cell.classList.add('start-tile');
                }

                // Çıkış ve Kemik Hedefi 🦴
                if (x === level.goal.x && y === level.goal.y) {
                    const goal = document.createElement('div');
                    goal.className = 'tile-item item-carrot';
                    goal.innerHTML = '<span class="item-emoji">🦴</span>';
                    cell.appendChild(goal);
                }

                // Çit / Duvar Engelleri 🌳
                const isWall = level.walls.some(w => w.x === x && w.y === y);
                if (isWall) {
                    cell.classList.add('realmaze-wall-cell');
                    const wall = document.createElement('div');
                    wall.className = 'tile-item item-obstacle item-bush';
                    // Bölüm teması: isteğe bağlı wallEmoji (yoksa eskisi gibi ağaç)
                    wall.innerHTML = `<span class="item-emoji">${level.wallEmoji || '🌳'}</span>`;
                    cell.appendChild(wall);
                }

                // Yıldız Ödülleri ⭐
                const isStar = level.stars.some(s => s.x === x && s.y === y);
                if (isStar && !this.realmazeStars.has(`${x},${y}`)) {
                    const starEl = document.createElement('div');
                    starEl.className = 'tile-item item-star';
                    starEl.innerHTML = '<span class="item-emoji">⭐</span>';
                    cell.appendChild(starEl);
                }

                // Canlı Köpekçik Karakteri 🐶
                if (x === this.realmazePlayer.x && y === this.realmazePlayer.y) {
                    const puppy = document.createElement('div');
                    puppy.className = `bunny-avatar facing-${this.realmazePlayer.facing}`;
                    puppy.id = 'realmaze-puppy';
                    puppy.innerHTML = `
                        <div class="bunny-inner">
                            <span class="bunny-emoji">🐶</span>
                        </div>
                    `;
                    cell.appendChild(puppy);
                }

                this.realmazeGrid.appendChild(cell);
            }
        }
    }

    async moveRealmaze(dir) {
        if (this.realmazeFinished) return;

        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        let nextX = this.realmazePlayer.x;
        let nextY = this.realmazePlayer.y;
        let facing = this.realmazePlayer.facing;

        if (dir === 'UP') { nextY--; facing = 'up'; }
        else if (dir === 'DOWN') { nextY++; facing = 'down'; }
        else if (dir === 'LEFT') { nextX--; facing = 'left'; }
        else if (dir === 'RIGHT') { nextX++; facing = 'right'; }

        this.realmazePlayer.facing = facing;

        // Sınır Kontrolü
        if (nextX < 0 || nextX >= level.cols || nextY < 0 || nextY >= level.rows) {
            soundManager.playObstacle();
            return;
        }

        // Çit / Duvar Kontrolü
        const hitWall = level.walls.some(w => w.x === nextX && w.y === nextY);
        if (hitWall) {
            soundManager.playObstacle();
            const puppyEl = document.getElementById('realmaze-puppy');
            if (puppyEl) puppyEl.classList.add('bunny-wobble');
            setTimeout(() => { if (puppyEl) puppyEl.classList.remove('bunny-wobble'); }, 400);
            return;
        }

        // Güvenli Adım: Köpekçiği İlerlet
        this.realmazePlayer.x = nextX;
        this.realmazePlayer.y = nextY;
        soundManager.playHop();
        this.renderRealmazeGrid();

        // Yıldız Toplama
        const starKey = `${nextX},${nextY}`;
        const starTile = level.stars.find(s => s.x === nextX && s.y === nextY);
        if (starTile && !this.realmazeStars.has(starKey)) {
            this.realmazeStars.add(starKey);
            soundManager.playStar();
            if (!this.realmazePaidStars.has(starKey)) {
                this.realmazePaidStars.add(starKey);
                this.addStar(1);
            }
            this.updateRealmazeStarsUI();
            this.renderRealmazeGrid();
        }

        // Kemik / Çıkış Hedefine Ulaştı mı?
        if (nextX === level.goal.x && nextY === level.goal.y) {
            this.realmazeFinished = true;
            soundManager.playBark();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            const puppyEl = document.getElementById('realmaze-puppy');
            if (puppyEl) puppyEl.classList.add('bunny-dance');

            soundManager.speak("Aferin sana! Kemik ödülünü yakaladın!");

            this.celebrateAfter(900,
                "Labirent Şampiyonu! 🐶🦴⭐",
                `Köpekçik kemiğine ulaştı, ${level.id}. bölüm tamam!`
            );
        }
    }
}

installGameMethods(RealmazeGame);
