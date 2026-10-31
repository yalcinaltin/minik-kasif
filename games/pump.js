// 🎁 MODÜL: BALON ŞİŞİR
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).

// Sayma bölümlerinde her dokunuşta söylenen sayı adları
const PUMP_NUMBER_NAMES = ['Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz'];
// Her pompada biraz daha tiz nota: balon şiştikçe ses de yükselir
const PUMP_NOTE_BASE = 330;
// Çizgi bölümleri: balon çizgiye gelince bu kadar beklenir; dokunulmazsa balon bağlanıp uçar
const PUMP_SETTLE_MS = 1400;
// Çizgiyi geçince kaç fazla pompada balon (cezasız) patlar
const PUMP_OVER_STEPS = 2;
// En söndük balonun boyu (tam boyun oranı)
const PUMP_MIN_SCALE = 0.28;
// Balonun SVG içindeki yeri: düğüm (büyüme merkezi) ve tam şişkin balonun tepesi
const PUMP_KNOT_Y = 104;
const PUMP_TOP_Y = 6;
// Patlayınca saçılan kâğıt parçalarının renkleri
const PUMP_BIT_COLORS = ['#FF4081', '#00E676', '#FFD600', '#00B0FF', '#FF6D00', '#D500F9'];

class PumpGame {
    // ==========================================
    // 🎁 MODÜL: BALON ŞİŞİR
    // ==========================================
    // Her dokunuş (balona ya da pompaya) balonu bir adım şişirir; hedef boya gelince patlar,
    // içinden çıkan sürpriz (hayvan/oyuncak) aşağıdaki rafa uçar. Raf dolunca bölüm biter.
    // Bölüm verisi: { mode, taps, balloons, surprises, colors? }
    //   tap    → dokun, şişir; taps kez dokununca patlar
    //   count  → aynı, ama noktalar dolar ve her dokunuş sesli sayılır
    //   choose → iki balon; söylenen renkteki şişirilir (pompa gizli, yanlış balon yalnızca sallanır)
    //   line   → çizgiye kadar şişir, dur: beklenince balon bağlanıp uçar; fazla şişirilirse
    //            nazikçe patlar ve yine sayılır (ceza yok)

    loadPumpLevel(idx) {
        this.levelEpoch++;
        this.stopPumpTimers();
        this.pumpLevelIdx = idx;
        const level = window.GAME_DATA.PUMP_LEVELS[idx];
        this.pumpDone = 0;
        this.pumpQueue = this.shuffleArray(level.surprises).slice(0, level.balloons);
        this.pumpLastColor = null;
        this.setLevelHeader('pump', level);

        this.pumpStage.dataset.mode = level.mode;
        this.btnPumpInflate.hidden = level.mode === 'choose';
        this.pumpTray.innerHTML = Array.from({ length: level.balloons }, () => '<span class="pump-slot"></span>').join('');
        this.updatePumpProgress();
        this.startPumpBalloon(true);
    }

    // Bölümden/oyundan çıkarken bekleyen "çizgide dur" sayacını ve uçmakta olan sürprizi temizler
    stopPumpTimers() {
        clearTimeout(this.pumpSettleTimer);
        this.pumpSettleTimer = null;
        document.querySelectorAll('.pump-surprise').forEach(el => el.remove());
    }

    // "Tekrar" düğmesi: renk bölümlerinde o anki rengi söyler
    getPumpInstruction() {
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];
        if (level.mode === 'choose' && this.pumpLanes && this.pumpLanes[this.pumpTargetLane]) {
            const name = this.pumpLanes[this.pumpTargetLane].name;
            return `${name.charAt(0).toLocaleUpperCase('tr-TR')}${name.slice(1)} balonu şişir!`;
        }
        return level.instruction;
    }

    // Toplam adım: normalde taps (o anda patlar); çizgi bölümünde çizgiden sonra birkaç adım daha
    getPumpTotalSteps(level) {
        return level.mode === 'line' ? level.taps + PUMP_OVER_STEPS : level.taps;
    }

    getPumpScale(step, level) {
        return PUMP_MIN_SCALE + (1 - PUMP_MIN_SCALE) * Math.min(step, this.getPumpTotalSteps(level)) / this.getPumpTotalSteps(level);
    }

    startPumpBalloon(first) {
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];
        this.pumpStep = 0;
        this.pumpBusy = false;
        clearTimeout(this.pumpSettleTimer);
        this.pumpSettleTimer = null;

        this.renderPumpSky(level);
        // Renk bölümünde istenen renk bölüm kartında da yazsın (telefonda balon yok, ses kapalı olabilir)
        document.getElementById('pump-instruction').textContent = this.getPumpInstruction();
        this.renderPumpDots(level);

        // İlk balonda bölüm yönergesi; sonrakilerde yalnızca sayma ve renk bölümleri yeniden söyler
        if (first || level.mode === 'choose' || level.mode === 'count') {
            soundManager.speak(this.getPumpInstruction());
        }
    }

    renderPumpSky(level) {
        const colors = window.GAME_DATA.PUMP_COLORS;
        let picks;
        if (level.mode === 'choose') {
            // İki farklı renk; hedef ikisinden biri (bir önceki hedef rengi tekrar edilmez)
            const pool = colors.filter(c => level.colors.includes(c.name));
            picks = this.shuffleArray(pool).slice(0, 2);
            const fresh = [0, 1].filter(i => picks[i] !== this.pumpLastColor);
            this.pumpTargetLane = fresh[Math.floor(Math.random() * fresh.length)];
        } else {
            const pool = colors.filter(c => c !== this.pumpLastColor);
            picks = [pool[Math.floor(Math.random() * pool.length)]];
            this.pumpTargetLane = 0;
        }
        this.pumpLanes = picks;
        this.pumpLastColor = picks[this.pumpTargetLane];

        // Çizgi bölümü: balonun tepesi taps. adımda tam çizgiye değer
        const lineY = level.mode === 'line'
            ? (PUMP_KNOT_Y - (PUMP_KNOT_Y - PUMP_TOP_Y) * this.getPumpScale(level.taps, level)).toFixed(1)
            : null;

        this.pumpSky.innerHTML = picks.map((c, i) => `
            <div class="pump-lane" data-lane="${i}" aria-label="${c.name} balon">
                <svg class="pump-svg" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    ${lineY !== null ? `<line class="pump-line" x1="0" y1="${lineY}" x2="100" y2="${lineY}"></line>` : ''}
                    <g class="pump-rig">
                        <path class="pump-string" d="M50 106 Q44 113 50 119 T50 130"></path>
                        <g class="pump-balloon" style="transform: scale(${PUMP_MIN_SCALE})">
                            <g class="pump-balloon-body">
                                <ellipse cx="50" cy="54" rx="38" ry="48" style="fill: ${c.color}"></ellipse>
                                <path d="M44 107 L56 107 L50 100 Z" style="fill: ${c.color}"></path>
                                <ellipse class="pump-shine" cx="35" cy="32" rx="7" ry="13"></ellipse>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>`).join('');

        // Bütün şerit dokunma alanıdır (küçük parmaklar için balondan geniş)
        this.pumpSky.querySelectorAll('.pump-lane').forEach(lane => {
            lane.addEventListener('pointerdown', (e) => {
                if (e.button > 0) return;
                e.preventDefault();
                this.handlePumpTap(Number(lane.dataset.lane));
            });
        });
    }

    renderPumpDots(level) {
        const show = level.mode === 'count';
        this.pumpDots.hidden = !show;
        this.pumpDots.innerHTML = show
            ? Array.from({ length: level.taps }, () => '<span class="pump-dot"></span>').join('')
            : '';
    }

    handlePumpTap(laneIdx) {
        if (this.pumpBusy || !this.pumpLanes) return;
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];

        if (laneIdx !== this.pumpTargetLane) {
            this.wrongPumpLane(laneIdx);
            return;
        }

        this.pumpStep++;
        const step = this.pumpStep;
        const total = this.getPumpTotalSteps(level);
        const lane = this.getPumpLane(this.pumpTargetLane);
        lane.querySelector('.pump-balloon').style.transform = `scale(${this.getPumpScale(step, level).toFixed(3)})`;
        lane.classList.remove('pump-hint');
        soundManager.playNote(PUMP_NOTE_BASE * Math.pow(2, Math.min(step * 2, 24) / 12), 0.35);
        this.pushPumpHandle();

        if (level.mode === 'count') {
            const dot = this.pumpDots.children[step - 1];
            if (dot) {
                dot.classList.add('filled');
                dot.style.background = this.pumpLanes[this.pumpTargetLane].color;
            }
            soundManager.speak(PUMP_NUMBER_NAMES[step - 1] || String(step));
        }

        if (level.mode === 'line') {
            const line = lane.querySelector('.pump-line');
            if (step >= total) {
                // Çok şişti: nazikçe patlar, sürpriz yine çıkar
                this.finishPumpBalloon('over');
                return;
            }
            if (step === level.taps) {
                line.classList.add('pump-line-hit');
                soundManager.speak("Dur!");
            } else if (step > level.taps) {
                line.classList.add('pump-line-over');
            }
            // Çizgiye geldiyse (ya da biraz geçtiyse) dokunuş bitince balon bağlanır
            if (step >= level.taps) this.startPumpSettle();
            return;
        }

        if (step >= level.taps) this.finishPumpBalloon('pop');
    }

    startPumpSettle() {
        clearTimeout(this.pumpSettleTimer);
        const epoch = this.levelEpoch;
        this.pumpSettleTimer = setTimeout(() => {
            this.pumpSettleTimer = null;
            if (epoch !== this.levelEpoch || this.pumpBusy) return;
            this.finishPumpBalloon('tie');
        }, PUMP_SETTLE_MS);
    }

    getPumpLane(idx) {
        return this.pumpSky.querySelector(`.pump-lane[data-lane="${idx}"]`);
    }

    // Pompa kolu aşağı iner (pompa gizliyse görünmez, zararsız)
    pushPumpHandle() {
        const btn = this.btnPumpInflate;
        btn.classList.remove('pump-pushing');
        void btn.offsetWidth; // animasyonu yeniden başlatmak için
        btn.classList.add('pump-pushing');
    }

    // Yanlış renk: balon yalnızca sallanır, doğru balon parlar ve renk yeniden söylenir
    wrongPumpLane(laneIdx) {
        const lane = this.getPumpLane(laneIdx);
        const target = this.getPumpLane(this.pumpTargetLane);
        if (!lane || !target) return;
        lane.classList.remove('pump-wrong');
        void lane.offsetWidth;
        lane.classList.add('pump-wrong');
        target.classList.add('pump-hint');
        const epoch = this.levelEpoch;
        setTimeout(() => {
            if (epoch !== this.levelEpoch) return;
            lane.classList.remove('pump-wrong');
        }, 550);
        soundManager.speak(`Bu ${this.pumpLanes[laneIdx].name}! ${this.getPumpInstruction()}`);
    }

    // kind: 'pop' (hedefe geldi, patladı) | 'tie' (çizgide durdu, bağlanıp uçtu) | 'over' (fazla şişti, patladı)
    async finishPumpBalloon(kind) {
        if (this.pumpBusy) return;
        this.pumpBusy = true;
        clearTimeout(this.pumpSettleTimer);
        this.pumpSettleTimer = null;

        const epoch = this.levelEpoch;
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];
        const item = this.pumpQueue[this.pumpDone];
        const lane = this.getPumpLane(this.pumpTargetLane);
        const body = lane.querySelector('.pump-balloon-body');
        const bodyRect = body.getBoundingClientRect();
        const laneRect = lane.getBoundingClientRect();
        const cx = bodyRect.left + bodyRect.width / 2;
        const cy = bodyRect.top + bodyRect.height / 2;

        if (kind === 'tie') {
            soundManager.playMagicChime();
            lane.querySelector('.pump-svg').classList.add('pump-flyaway');
        } else {
            soundManager.playBalloonPop();
            body.classList.add('pump-popped');
            lane.querySelector('.pump-string').classList.add('pump-string-drop');
            this.burstPumpBits(lane, cx - laneRect.left, cy - laneRect.top);
        }
        // Öteki balon (renk bölümü) sessizce söner
        this.pumpSky.querySelectorAll('.pump-lane').forEach(l => {
            if (l !== lane) l.classList.add('pump-fade');
        });

        // Sürpriz balonun yerinden çıkar (sayfanın üstünde: gökyüzü kartının kenarında kesilmez)
        const surprise = document.createElement('span');
        surprise.className = 'pump-surprise';
        surprise.textContent = item.symbol;
        surprise.style.left = `${cx}px`;
        surprise.style.top = `${cy}px`;
        document.body.appendChild(surprise);

        // Sayma bölümünde son sayı söylensin, sonra sürpriz
        await this.sleep(level.mode === 'count' ? 650 : 250);
        if (epoch !== this.levelEpoch) { surprise.remove(); return; }
        const lead = kind === 'tie' ? 'Tam çizgide!' : (kind === 'over' ? 'Pat! Olsun!' : 'Pat!');
        soundManager.speak(`${lead} Bir ${item.label} çıktı!`);

        await this.sleep(900);
        if (epoch !== this.levelEpoch) { surprise.remove(); return; }

        // Sürpriz raftaki boş yere uçar
        const slot = this.pumpTray.children[this.pumpDone];
        if (slot && surprise.animate) {
            const slotRect = slot.getBoundingClientRect();
            const dx = slotRect.left + slotRect.width / 2 - cx;
            const dy = slotRect.top + slotRect.height / 2 - cy;
            const fly = surprise.animate([
                { transform: 'translate(-50%, -50%) scale(1)' },
                { transform: `translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${dy.toFixed(0)}px)) scale(0.4)` }
            ], { duration: 600, easing: 'ease-in', fill: 'forwards' });
            await this.waitForAnimation(fly, 600);
        }
        surprise.remove();
        if (epoch !== this.levelEpoch) return;

        if (slot) {
            slot.textContent = item.symbol;
            slot.classList.add('filled');
        }
        soundManager.playStar();
        this.pumpDone++;
        this.updatePumpProgress();

        if (this.pumpDone >= level.balloons) {
            this.finishPumpLevel();
            return;
        }

        await this.sleep(700);
        if (epoch !== this.levelEpoch) return;
        this.startPumpBalloon(false);
    }

    // Patlayan balondan saçılan renkli kâğıtlar (şeridin içinde kalır)
    burstPumpBits(lane, x, y) {
        for (let i = 0; i < 12; i++) {
            const bit = document.createElement('span');
            bit.className = 'pump-bit';
            const angle = (i / 12) * Math.PI * 2;
            const dist = 60 + Math.random() * 60;
            bit.style.left = `${x}px`;
            bit.style.top = `${y}px`;
            bit.style.background = PUMP_BIT_COLORS[i % PUMP_BIT_COLORS.length];
            bit.style.setProperty('--dx', `${(Math.cos(angle) * dist).toFixed(0)}px`);
            bit.style.setProperty('--dy', `${(Math.sin(angle) * dist).toFixed(0)}px`);
            lane.appendChild(bit);
            setTimeout(() => bit.remove(), 800);
        }
    }

    finishPumpLevel() {
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];
        this.triggerConfetti();
        soundManager.playSuccess();
        this.addStar(2);
        this.celebrateAfter(1400, "Balon Ustası! 🎈✨", `${level.balloons} balonu şişirip ${level.balloons} sürpriz topladın!`);
    }

    updatePumpProgress() {
        const level = window.GAME_DATA.PUMP_LEVELS[this.pumpLevelIdx];
        this.pumpProgress.textContent = `🎈 ${this.pumpDone} / ${level.balloons}`;
    }
}

installGameMethods(PumpGame);
