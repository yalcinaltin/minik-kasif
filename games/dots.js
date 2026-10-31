// ✏️ MODÜL: NOKTALARI BİRLEŞTİR
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).

// Sayı adları ve "-i" hâli ("Sırada dört var! Dördü bul!")
const DOTS_NUMBER_NAMES = ['Bir', 'İki', 'Üç', 'Dört', 'Beş', 'Altı', 'Yedi', 'Sekiz', 'Dokuz', 'On', 'On bir', 'On iki'];
const DOTS_NUMBER_ACC = ['Biri', 'İkiyi', 'Üçü', 'Dördü', 'Beşi', 'Altıyı', 'Yediyi', 'Sekizi', 'Dokuzu', 'Onu', 'On biri', 'On ikiyi'];
// Her noktada biraz daha tiz nota: sıra ilerledikçe merdiven çıkar gibi
const DOTS_NOTE_BASE = 392;

class DotsGame {
    // ==========================================
    // ✏️ MODÜL: NOKTALARI BİRLEŞTİR
    // ==========================================

    loadDotsLevel(idx) {
        this.levelEpoch++;
        this.dotsLevelIdx = idx;
        const level = window.GAME_DATA.DOTS_LEVELS[idx];
        this.dotsNext = 0;
        this.dotsDone = false;
        this.dotsDrag = null;
        this.setLevelHeader('dots', level);

        const pts = level.points;
        const ptsAttr = pts.map(p => p.join(',')).join(' ');
        const [cx, cy] = this.getDotsCenter(level);
        const xs = pts.map(p => p[0]);
        const ys = pts.map(p => p[1]);
        // Gizli resim şeklin içine sığacak kadar büyük olsun
        const picSize = Math.max(18, Math.min(36, Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.45));

        const dots = pts.map((p, i) => `
            <g class="dot" data-i="${i}">
                <circle class="dot-core" cx="${p[0]}" cy="${p[1]}" r="6.5" style="stroke: ${level.color}"></circle>
                <text class="dot-num" x="${p[0]}" y="${p[1]}">${i + 1}</text>
            </g>`).join('');

        // viewBox kenar payı: kenardaki noktalar ve halkaları kesilmesin
        this.dotsBoard.innerHTML = `
            <svg class="dots-svg" viewBox="-6 -6 112 112" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${level.title}">
                <polygon class="dots-fill" points="${ptsAttr}" style="fill: ${level.color}"></polygon>
                <g class="dots-lines"></g>
                <line class="dots-rubber" x1="0" y1="0" x2="0" y2="0" style="stroke: ${level.color}"></line>
                <g class="dots-dots">${dots}</g>
                <text class="dots-picture" x="${cx}" y="${cy}" style="font-size: ${picSize.toFixed(1)}px">${level.picture}</text>
            </svg>`;

        this.dotsSvg = this.dotsBoard.querySelector('.dots-svg');
        this.dotsLines = this.dotsSvg.querySelector('.dots-lines');
        this.dotsRubber = this.dotsSvg.querySelector('.dots-rubber');

        // Dokun ya da parmağı noktadan noktaya kaydır
        this.dotsSvg.addEventListener('pointerdown', (e) => this.handleDotsPointerDown(e));
        this.dotsSvg.addEventListener('pointermove', (e) => this.handleDotsPointerMove(e));
        this.dotsSvg.addEventListener('pointerup', () => this.endDotsDrag());
        this.dotsSvg.addEventListener('pointercancel', () => this.endDotsDrag());

        this.markDotsHint(false);
        this.updateDotsProgress();
        soundManager.speak(level.instruction);
    }

    // Resmin konacağı yer: köşe noktalarının ortalaması (bölümde pictureAt verilmişse o)
    getDotsCenter(level) {
        if (level.pictureAt) return level.pictureAt;
        const n = level.points.length;
        return [
            Math.round(level.points.reduce((s, p) => s + p[0], 0) / n),
            Math.round(level.points.reduce((s, p) => s + p[1], 0) / n)
        ];
    }

    // Ekrandaki parmak konumunu SVG koordinatına çevirir
    getDotsSvgPoint(e) {
        const ctm = this.dotsSvg.getScreenCTM();
        if (!ctm) return null;
        const pt = this.dotsSvg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        return pt.matrixTransform(ctm.inverse());
    }

    // Parmağa en yakın nokta (küçük parmaklar için nokta çizgisinden geniş bir dokunma alanı)
    findDotsHit(p) {
        const pts = window.GAME_DATA.DOTS_LEVELS[this.dotsLevelIdx].points;
        let best = -1;
        let bestDist = 10;
        pts.forEach((q, i) => {
            const d = Math.hypot(q[0] - p.x, q[1] - p.y);
            if (d < bestDist) {
                bestDist = d;
                best = i;
            }
        });
        return best;
    }

    handleDotsPointerDown(e) {
        if (this.dotsDone || e.button > 0) return;
        e.preventDefault();
        const p = this.getDotsSvgPoint(e);
        if (!p) return;
        // Parmak tahtadan çıksa da kaydırma izlensin
        try { this.dotsSvg.setPointerCapture(e.pointerId); } catch (err) { /* desteklenmiyorsa sorun değil */ }
        this.dotsDrag = { pointerId: e.pointerId };

        const hit = this.findDotsHit(p);
        if (hit === this.dotsNext) {
            this.connectDot(hit);
        } else if (hit > this.dotsNext) {
            this.wrongDot(hit);
        }
        this.updateDotsRubber(p);
    }

    handleDotsPointerMove(e) {
        if (!this.dotsDrag || this.dotsDone || e.pointerId !== this.dotsDrag.pointerId) return;
        const p = this.getDotsSvgPoint(e);
        if (!p) return;
        // Kaydırırken yalnızca sıradaki nokta bağlanır; yanlış noktanın üstünden geçmek uyarı vermez
        if (this.findDotsHit(p) === this.dotsNext) this.connectDot(this.dotsNext);
        this.updateDotsRubber(p);
    }

    endDotsDrag() {
        this.dotsDrag = null;
        if (this.dotsRubber) this.dotsRubber.classList.remove('active');
    }

    // Son bağlanan noktadan parmağa uzanan lastik çizgi
    updateDotsRubber(p) {
        if (!this.dotsDrag || this.dotsDone || this.dotsNext === 0) {
            this.dotsRubber.classList.remove('active');
            return;
        }
        const last = window.GAME_DATA.DOTS_LEVELS[this.dotsLevelIdx].points[this.dotsNext - 1];
        this.dotsRubber.setAttribute('x1', last[0]);
        this.dotsRubber.setAttribute('y1', last[1]);
        this.dotsRubber.setAttribute('x2', p.x.toFixed(1));
        this.dotsRubber.setAttribute('y2', p.y.toFixed(1));
        this.dotsRubber.classList.add('active');
    }

    drawDotsLine(from, to, color) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'dots-line');
        line.setAttribute('x1', from[0]);
        line.setAttribute('y1', from[1]);
        line.setAttribute('x2', to[0]);
        line.setAttribute('y2', to[1]);
        line.setAttribute('pathLength', '1'); // çizilme animasyonu için uzunluk 1 sayılır
        line.style.stroke = color;
        this.dotsLines.appendChild(line);
    }

    connectDot(i) {
        const level = window.GAME_DATA.DOTS_LEVELS[this.dotsLevelIdx];
        const pts = level.points;
        if (i > 0) this.drawDotsLine(pts[i - 1], pts[i], level.color);

        const dotEl = this.dotsSvg.querySelector(`.dot[data-i="${i}"]`);
        dotEl.classList.add('dot-done');
        dotEl.querySelector('.dot-core').style.fill = level.color;
        this.dotsNext = i + 1;
        this.markDotsHint(false);
        this.updateDotsProgress();

        soundManager.playNote(DOTS_NOTE_BASE * Math.pow(2, Math.min(i, 11) / 12), 0.4);
        soundManager.speak(DOTS_NUMBER_NAMES[i] || String(i + 1));

        if (this.dotsNext === pts.length) this.finishDots();
    }

    wrongDot(i) {
        const dotEl = this.dotsSvg.querySelector(`.dot[data-i="${i}"]`);
        soundManager.playObstacle();
        dotEl.classList.remove('dot-wrong');
        void dotEl.getBBox(); // animasyonu yeniden başlatmak için
        dotEl.classList.add('dot-wrong');
        setTimeout(() => dotEl.classList.remove('dot-wrong'), 550);

        // Nazik ipucu: sıradaki nokta parlar ve adı söylenir
        this.markDotsHint(true);
        const n = this.dotsNext;
        soundManager.speak(n === 0
            ? "Bir numaradan başla!"
            : `Sırada ${DOTS_NUMBER_NAMES[n].toLocaleLowerCase('tr-TR')} var! ${DOTS_NUMBER_ACC[n]} bul!`);
    }

    // Sıradaki noktayı parlat (başta "1" hep hafifçe parlar; yanlış dokunuşta güçlü ipucu)
    markDotsHint(strong) {
        this.dotsSvg.querySelectorAll('.dot').forEach(el => {
            const isNext = Number(el.dataset.i) === this.dotsNext;
            el.classList.toggle('dot-next', isNext && (strong || this.dotsNext === 0));
        });
    }

    finishDots() {
        const level = window.GAME_DATA.DOTS_LEVELS[this.dotsLevelIdx];
        const pts = level.points;
        this.dotsDone = true;
        this.endDotsDrag();
        // Şekil kapalıysa son noktadan ilk noktaya da çizgi çekilir
        if (level.closed !== false) this.drawDotsLine(pts[pts.length - 1], pts[0], level.color);

        const epoch = this.levelEpoch;
        setTimeout(() => {
            // Bu arada bölüm/sekme değiştiyse eski tahtayı boyama
            if (epoch !== this.levelEpoch) return;
            this.dotsSvg.classList.add('dots-revealed');
            soundManager.playMagicChime();
            soundManager.speak(`Bravo! Bu bir ${level.pictureLabel}!`);
        }, 700); // son noktanın sayısı söylensin, sonra resim açılsın

        this.triggerConfetti();
        this.addStar(2);
        this.celebrateAfter(2200, "Nokta Ustası! ✏️✨", `${pts.length} noktayı birleştirip ${level.pictureLabel} resmini buldun!`);
    }

    updateDotsProgress() {
        const level = window.GAME_DATA.DOTS_LEVELS[this.dotsLevelIdx];
        this.dotsProgress.textContent = `✏️ ${this.dotsNext} / ${level.points.length}`;
    }
}

installGameMethods(DotsGame);
