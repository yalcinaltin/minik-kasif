// 🏀 MODÜL 2: NEŞELİ TOP ATMA & BASKET
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class BallTossGame {
    // ==========================================
    // 🏀 MODÜL 2: NEŞELİ TOP ATMA & BASKET
    // ==========================================

    loadBallTossLevel(idx) {
        this.levelEpoch++;
        this.ballTossLevelIdx = idx;
        const level = window.GAME_DATA.BALL_TOSS_LEVELS[idx];
        this.ballTossScore = 0;
        this.isTossLaunching = false;

        this.setLevelHeader('balltoss', level);

        this.targetEmojiDisplay.textContent = level.targetEmoji;
        this.targetLabelDisplay.textContent = level.targetLabel;
        this.ballAmmoEmoji.textContent = level.ballEmoji;

        this.updateBallTossScoreUI();
        soundManager.speak(level.instruction);

        // Hedef ortadan başlar; kayan bölümlerde hareket döngüsü çalışır
        this.tossTargetX = 0;
        this.tossTargetDir = 1;
        this.applyTossTargetPosition();
        this.startTossTargetLoop();
    }

    // Hedefin gidebileceği en uzak yatay mesafe (alanın yarısı - hedefin yarısı)
    getTossTargetRange() {
        const zoneW = this.balltossTargetZone.clientWidth;
        const boxW = this.balltossTargetBox.offsetWidth;
        return Math.max(0, zoneW / 2 - boxW / 2 - 12);
    }

    applyTossTargetPosition() {
        // 'translate' özelliği, hedefin zıplama animasyonundaki 'transform' ile çakışmaz
        this.balltossTargetBox.style.translate = `${this.tossTargetX}px 0`;
    }

    startTossTargetLoop() {
        this.stopTossTargetLoop();
        const level = window.GAME_DATA.BALL_TOSS_LEVELS[this.ballTossLevelIdx];
        if (!level.targetSpeed) return;

        let last = performance.now();
        const step = (now) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            const range = this.getTossTargetRange();
            const speed = level.targetSpeed * this.balltossTargetZone.clientWidth;

            this.tossTargetX += this.tossTargetDir * speed * dt;
            if (this.tossTargetX > range) { this.tossTargetX = range; this.tossTargetDir = -1; }
            if (this.tossTargetX < -range) { this.tossTargetX = -range; this.tossTargetDir = 1; }
            this.applyTossTargetPosition();

            this.tossTargetRaf = requestAnimationFrame(step);
        };
        this.tossTargetRaf = requestAnimationFrame(step);
    }

    stopTossTargetLoop() {
        if (this.tossTargetRaf) {
            cancelAnimationFrame(this.tossTargetRaf);
            this.tossTargetRaf = null;
        }
    }

    // Duran hedef her isabetten sonra sola / ortaya / sağa geçer: çocuk nişan almayı öğrenir
    relocateStaticTossTarget() {
        const range = this.getTossTargetRange();
        const spots = [-0.7, -0.35, 0, 0.35, 0.7].map(f => f * range)
            .filter(x => Math.abs(x - this.tossTargetX) > range * 0.2);
        this.tossTargetX = spots[Math.floor(Math.random() * spots.length)] || 0;
        this.applyTossTargetPosition();
    }

    getBallStartPoint() {
        const arenaRect = this.balltossArena.getBoundingClientRect();
        const holderRect = this.balltossBallHolder.getBoundingClientRect();
        return {
            x: holderRect.left + holderRect.width / 2 - arenaRect.left,
            y: holderRect.top + holderRect.height / 2 - arenaRect.top
        };
    }

    // Hedefin yüksekliğinde, verilen yönde topun varacağı x noktası (arena koordinatı)
    getAimXFromDirection(dx, dy) {
        const start = this.getBallStartPoint();
        const arenaRect = this.balltossArena.getBoundingClientRect();
        const targetRect = this.balltossTargetBox.getBoundingClientRect();
        const targetY = targetRect.top + targetRect.height / 2 - arenaRect.top;
        const x = start.x + dx * ((start.y - targetY) / -dy);
        return Math.max(0, Math.min(arenaRect.width, x));
    }

    handleTossPointerDown(e) {
        if (e.target.closest('button')) return; // "Topu Fırlat" butonu kendi click'ini kullanır
        e.preventDefault();

        if (e.target.closest('#balltoss-ball-holder')) {
            this.tossDrag = { startX: e.clientX, startY: e.clientY, arrow: null };
            this.balltossBallHolder.classList.add('dragging');
            return;
        }

        // Arenanın herhangi bir yerine dokunmak: topu o noktanın hizasına at
        const arenaRect = this.balltossArena.getBoundingClientRect();
        this.launchBall(e.clientX - arenaRect.left);
    }

    getTossDragVector(e) {
        let dx = e.clientX - this.tossDrag.startX;
        let dy = e.clientY - this.tossDrag.startY;
        // Aşağı çekip bırakma = sapan: atış ters yöne gider
        if (dy > 0) { dx = -dx; dy = -dy; }
        return { dx, dy, dist: Math.hypot(dx, dy) };
    }

    handleTossPointerMove(e) {
        if (!this.tossDrag) return;
        const { dx, dy, dist } = this.getTossDragVector(e);

        if (dist < 14 || dy > -6) {
            if (this.tossDrag.arrow) this.tossDrag.arrow.style.display = 'none';
            return;
        }

        if (!this.tossDrag.arrow) {
            this.tossDrag.arrow = document.createElement('div');
            this.tossDrag.arrow.className = 'toss-aim-arrow';
            this.balltossArena.appendChild(this.tossDrag.arrow);
        }

        const start = this.getBallStartPoint();
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;
        const arrow = this.tossDrag.arrow;
        arrow.style.display = 'block';
        arrow.style.left = `${start.x}px`;
        arrow.style.top = `${start.y - 4}px`;
        arrow.style.width = `${Math.min(220, 70 + dist)}px`;
        arrow.style.transform = `rotate(${angle}deg)`;
    }

    handleTossPointerUp(e) {
        if (!this.tossDrag) return;
        const { dx, dy, dist } = this.getTossDragVector(e);
        this.cancelTossDrag();

        if (dist < 14 || dy > -6) {
            this.launchBall(null); // Topa sadece dokunuldu: düz yukarı
        } else {
            this.launchBall(this.getAimXFromDirection(dx, dy));
        }
    }

    cancelTossDrag() {
        if (!this.tossDrag) return;
        if (this.tossDrag.arrow) this.tossDrag.arrow.remove();
        this.tossDrag = null;
        this.balltossBallHolder.classList.remove('dragging');
    }

    updateBallTossScoreUI() {
        const level = window.GAME_DATA.BALL_TOSS_LEVELS[this.ballTossLevelIdx];
        this.balltossScoreBadge.textContent = `🎯 ${this.ballTossScore} / ${level.targetCount} İsabet`;
    }

    // aimX: topun varacağı x (arena koordinatı); null ise top düz yukarı gider
    async launchBall(aimX) {
        const level = window.GAME_DATA.BALL_TOSS_LEVELS[this.ballTossLevelIdx];
        if (this.isTossLaunching || this.ballTossScore >= level.targetCount) return;
        this.isTossLaunching = true;
        const epoch = this.levelEpoch;

        soundManager.playPop();

        const arenaRect = this.balltossArena.getBoundingClientRect();
        const start = this.getBallStartPoint();
        const endX = aimX === null || aimX === undefined ? start.x : aimX;
        const targetRect = this.balltossTargetBox.getBoundingClientRect();
        const endY = targetRect.top + targetRect.height / 2 - arenaRect.top;

        const flyingBall = document.createElement('div');
        flyingBall.className = 'flying-projectile-ball';
        flyingBall.textContent = level.ballEmoji;
        this.balltossArena.appendChild(flyingBall);

        const at = (x, y, scale, deg) =>
            `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale}) rotate(${deg}deg)`;
        const midX = (start.x + endX) / 2;
        const midY = (start.y + endY) / 2 - 50; // hafif kavis
        const flight = flyingBall.animate([
            { transform: at(start.x, start.y, 1, 0) },
            { transform: at(midX, midY, 1.25, 180), offset: 0.5 },
            { transform: at(endX, endY, 0.85, 360) }
        ], { duration: 650, easing: 'cubic-bezier(0.3, 0.8, 0.5, 1)', fill: 'forwards' });

        await this.waitForAnimation(flight, 650);

        // Sekme ya da bölüm değiştiyse sonuç sayılmaz (yeni bölüm kendi durumunu zaten sıfırladı)
        if (epoch !== this.levelEpoch) {
            flyingBall.remove();
            return;
        }

        // İsabet: top vardığı anda hedefin genişliği içinde mi?
        const hitRect = this.balltossTargetBox.getBoundingClientRect();
        const ballScreenX = arenaRect.left + endX;
        const tolerance = hitRect.width * 0.12;
        const isHit = ballScreenX >= hitRect.left - tolerance && ballScreenX <= hitRect.right + tolerance;

        if (!isHit) {
            soundManager.playWhoosh();
            soundManager.speak("Az kaldı! Hedefe doğru tekrar at.");
            await this.waitForAnimation(flyingBall.animate([
                { transform: at(endX, endY, 0.85, 360), opacity: 1 },
                { transform: at(endX, endY - 70, 0.5, 450), opacity: 0 }
            ], { duration: 350, fill: 'forwards' }), 350);
            flyingBall.remove();
            this.isTossLaunching = false;
            return;
        }

        if (level.targetEmoji === '🗑️') {
            soundManager.playSwish();
        } else {
            soundManager.playBounce();
        }

        this.balltossTargetBox.classList.add('target-hit-bounce');
        setTimeout(() => this.balltossTargetBox.classList.remove('target-hit-bounce'), 500);
        this.waitForAnimation(flyingBall.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: 'forwards' }), 250)
            .then(() => flyingBall.remove());

        this.ballTossScore++;
        this.updateBallTossScoreUI();

        if (this.ballTossScore >= level.targetCount) {
            this.stopTossTargetLoop();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak("Harikasın! Bütün atışları tam hedefe yaptın!");

            this.celebrateAfter(800,
                "Müthiş Nişancı! 🏀🎯",
                `Tüm hedefleri vurdun ve görevi bitirdin!`
            );
        } else if (!level.targetSpeed) {
            await this.sleep(350);
            if (epoch !== this.levelEpoch) return;
            this.relocateStaticTossTarget();
        }

        this.isTossLaunching = false;
    }
}

installGameMethods(BallTossGame);
