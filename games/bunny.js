// 🥕 MODÜL 4: TAVŞANCIK HAVUÇ PEŞİNDE (KODLAMA)
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class BunnyGame {
    // ==========================================
    // 🥕 MODÜL 4: TAVŞANCIK HAVUÇ PEŞİNDE (KODLAMA)
    // ==========================================

    loadBunnyLevel(idx) {
        this.levelEpoch++;
        this.bunnyLevelIdx = idx;
        const level = window.GAME_DATA.BUNNY_LEVELS[idx];

        this.setLevelHeader('bunny', level);

        this.commands = [];
        this.bunnySolved = false;
        this.collectedStars.clear();
        this.bunnyPos = { ...level.start, facing: 'right' };
        // Önceki tahtadaki yarım kalmış yürüyüş (levelEpoch ile kendiliğinden biter) kontrolleri kilitli bırakmasın
        this.finishBunnyRun();

        this.renderBunnyGrid();
        this.renderCommandTrain();

        soundManager.speak(level.instruction);
    }

    resetBunnyPosition() {
        const level = window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx];
        this.bunnyPos = { ...level.start, facing: 'right' };
        this.collectedStars.clear();
        this.renderBunnyGrid();
    }

    renderBunnyGrid() {
        const level = window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx];
        const { cols, rows } = level.gridSize;

        this.bunnyGrid.innerHTML = '';
        this.bunnyGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        this.bunnyGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                if (x === level.start.x && y === level.start.y) {
                    cell.classList.add('start-tile');
                }

                if (x === level.target.x && y === level.target.y) {
                    const carrot = document.createElement('div');
                    carrot.className = 'tile-item item-carrot';
                    carrot.innerHTML = '<span class="item-emoji">🥕</span>';
                    cell.appendChild(carrot);
                }

                const obs = level.obstacles.find(o => o.x === x && o.y === y);
                if (obs) {
                    const obstacleEl = document.createElement('div');
                    obstacleEl.className = `tile-item item-obstacle item-${obs.type}`;
                    obstacleEl.innerHTML = `<span class="item-emoji">${obs.emoji}</span>`;
                    cell.appendChild(obstacleEl);
                }

                const star = level.stars.find(s => s.x === x && s.y === y);
                if (star && !this.collectedStars.has(`${x},${y}`)) {
                    const starEl = document.createElement('div');
                    starEl.className = 'tile-item item-star';
                    starEl.innerHTML = '<span class="item-emoji">⭐</span>';
                    cell.appendChild(starEl);
                }

                if (x === this.bunnyPos.x && y === this.bunnyPos.y) {
                    const bunny = document.createElement('div');
                    bunny.className = `bunny-avatar facing-${this.bunnyPos.facing}`;
                    bunny.id = 'bunny-player';
                    bunny.innerHTML = `
                        <div class="bunny-inner">
                            <span class="bunny-emoji">🐰</span>
                        </div>
                    `;
                    cell.appendChild(bunny);
                }

                this.bunnyGrid.appendChild(cell);
            }
        }
    }

    addCommand(direction) {
        if (this.commands.length >= this.maxCommands) {
            soundManager.playObstacle();
            return;
        }

        soundManager.playPop();
        this.commands.push(direction);
        this.renderCommandTrain();
    }

    removeCommand(idx) {
        if (this.isRunning) return;
        soundManager.playWhoosh();
        this.commands.splice(idx, 1);
        this.renderCommandTrain();
    }

    renderCommandTrain() {
        this.commandTrain.innerHTML = '';

        if (this.commands.length === 0) {
            const emptyHint = document.createElement('div');
            emptyHint.className = 'train-empty-placeholder';
            emptyHint.innerHTML = '<span>👇 Aşağıdaki ok düğmelerine basarak tavşana yol göster!</span>';
            this.commandTrain.appendChild(emptyHint);
            return;
        }

        const dirMap = {
            UP: { icon: '⬆️', label: 'Yukarı', class: 'cmd-up' },
            DOWN: { icon: '⬇️', label: 'Aşağı', class: 'cmd-down' },
            LEFT: { icon: '⬅️', label: 'Sola', class: 'cmd-left' },
            RIGHT: { icon: '➡️', label: 'Sağa', class: 'cmd-right' }
        };

        this.commands.forEach((cmd, idx) => {
            const info = dirMap[cmd];
            const card = document.createElement('div');
            card.className = `command-card ${info.class}`;
            card.dataset.index = idx;
            card.title = `${info.label} (Kaldırmak için tıkla)`;
            card.innerHTML = `
                <div class="card-step-badge">${idx + 1}</div>
                <div class="card-arrow">${info.icon}</div>
                <div class="card-remove-badge" aria-label="Sil">✕</div>
            `;

            card.addEventListener('click', () => {
                this.removeCommand(idx);
            });

            this.commandTrain.appendChild(card);
        });

        this.commandTrain.scrollLeft = this.commandTrain.scrollWidth;
    }

    async executeCommands() {
        // Havuca varılmış bölüm yeniden yürütülüp ikinci kez yıldız alınamaz
        if (this.isRunning || this.bunnySolved) return;
        if (this.commands.length === 0) {
            soundManager.playObstacle();
            soundManager.speak("Önce tavşana yön göstermek için oklara bas!");
            return;
        }

        this.isRunning = true;
        this.setBunnyControlsDisabled(true);
        this.resetBunnyPosition();

        // Yürüyüş sürerken çocuk menüye döner ya da bölüm değişirse yürüyüş sessizce biter
        const epoch = this.levelEpoch;
        const leftBoard = () => epoch !== this.levelEpoch;

        // Dar/dikey ekranda tahta yukarıda kalabilir: yürüyüşü izlemek için görünür yap
        const gridRect = this.bunnyGrid.getBoundingClientRect();
        if (gridRect.top < 0 || gridRect.bottom > window.innerHeight) {
            this.bunnyGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const level = window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx];
        const cards = this.commandTrain.querySelectorAll('.command-card');

        let hitObstacle = false;
        let reachedTarget = false;

        for (let i = 0; i < this.commands.length; i++) {
            cards.forEach(c => c.classList.remove('active-executing'));
            if (cards[i]) cards[i].classList.add('active-executing');

            const dir = this.commands[i];
            let nextX = this.bunnyPos.x;
            let nextY = this.bunnyPos.y;
            let facing = this.bunnyPos.facing;

            if (dir === 'UP') { nextY--; facing = 'up'; }
            else if (dir === 'DOWN') { nextY++; facing = 'down'; }
            else if (dir === 'LEFT') { nextX--; facing = 'left'; }
            else if (dir === 'RIGHT') { nextX++; facing = 'right'; }

            this.bunnyPos.facing = facing;

            if (nextX < 0 || nextX >= level.gridSize.cols || nextY < 0 || nextY >= level.gridSize.rows) {
                hitObstacle = true;
                if (cards[i]) cards[i].classList.add('cmd-error');
                await this.animateObstacleHit("Çitten dışarı çıkamayız!");
                if (leftBoard()) return this.finishBunnyRun();
                break;
            }

            const obstacle = level.obstacles.find(o => o.x === nextX && o.y === nextY);
            if (obstacle) {
                hitObstacle = true;
                if (cards[i]) cards[i].classList.add('cmd-error');
                await this.animateObstacleHit("Dikkat! Engele takıldık!");
                if (leftBoard()) return this.finishBunnyRun();
                break;
            }

            this.bunnyPos.x = nextX;
            this.bunnyPos.y = nextY;
            soundManager.playHop();
            this.renderBunnyGrid();

            const starKey = `${nextX},${nextY}`;
            const starOnTile = level.stars.find(s => s.x === nextX && s.y === nextY);
            if (starOnTile && !this.collectedStars.has(starKey)) {
                this.collectedStars.add(starKey);
                soundManager.playStar();
                this.addStar(1);
                this.renderBunnyGrid();
            }

            if (nextX === level.target.x && nextY === level.target.y) {
                reachedTarget = true;
                break;
            }

            await this.sleep(450);
            if (leftBoard()) return this.finishBunnyRun();
        }

        cards.forEach(c => c.classList.remove('active-executing'));

        if (reachedTarget) {
            // Pencere açılana dek kontroller kilitli kalır (yoksa arada yeniden çalıştırıp yıldız toplanırdı)
            await this.handleBunnyVictory();
        } else if (!hitObstacle) {
            soundManager.playObstacle();
            soundManager.speak("Tavşancık havuca henüz varamadı, biraz daha adım ekleyelim!");
        }

        this.finishBunnyRun();
    }

    finishBunnyRun() {
        this.isRunning = false;
        this.setBunnyControlsDisabled(false);
    }

    async animateObstacleHit(speechText) {
        soundManager.playObstacle();
        const bunnyEl = document.getElementById('bunny-player');
        if (bunnyEl) {
            bunnyEl.classList.add('bunny-wobble');
        }
        soundManager.speak(speechText);
        await this.sleep(600);
    }

    async handleBunnyVictory() {
        this.bunnySolved = true;
        soundManager.playSuccess();
        this.triggerConfetti();

        const bunnyEl = document.getElementById('bunny-player');
        if (bunnyEl) {
            bunnyEl.classList.add('bunny-dance');
        }

        this.addStar(2);

        const level = window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx];
        const isLastLevel = (this.bunnyLevelIdx === window.GAME_DATA.BUNNY_LEVELS.length - 1);

        soundManager.speak("Aferin sana! Çıtır havucu yakaladın!");

        await this.celebrateAfter(800,
            "Harikasın Küçük Kaşif! 🥕⭐",
            isLastLevel
                ? "Tüm labirentleri başarıyla bitirdin! Tam bir Algoritma Ustasısın!"
                : `${level.id}. bölüm tamam! Tavşancık çok mutlu oldu!`
        );
    }

    setBunnyControlsDisabled(disabled) {
        this.btnRunCode.disabled = disabled || this.bunnySolved;
        this.btnClearCode.disabled = disabled;
        this.btnResetBunny.disabled = disabled;
        this.arrowBtns.forEach(btn => btn.disabled = disabled);
        // Yürüyüş sürerken bölüm değiştirilemez; bitince ilk/son bölüm sınırları geri gelir
        const lastIdx = window.GAME_DATA.BUNNY_LEVELS.length - 1;
        this.bunnyPrevLevelBtn.disabled = disabled || this.bunnyLevelIdx === 0;
        this.bunnyNextLevelBtn.disabled = disabled || this.bunnyLevelIdx === lastIdx;
    }
}

installGameMethods(BunnyGame);
