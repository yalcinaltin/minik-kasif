// 🎹 MODÜL 14: MELODİ TEKRARLA
// Bu dosyadaki yöntemler game.js'teki MiniExplorerApp sınıfına eklenir (game.js'ten sonra yüklenir).
class MelodyGame {
    // ==========================================
    // 🎹 MODÜL 14: MELODİ TEKRARLA
    // ==========================================

    getMelodyNote(id) {
        return window.GAME_DATA.MELODY_NOTES.find(n => n.id === id);
    }

    loadMelodyLevel(idx) {
        this.levelEpoch++;
        this.melodyLevelIdx = idx;
        const level = window.GAME_DATA.MELODY_LEVELS[idx];
        this.melodyToken++;
        this.melodyBusy = false;
        this.melodyFreeCount = 0;
        this.melodyRound = 1;
        this.melodySeq = [];
        this.melodyInputPos = 0;
        this.setLevelHeader('melody', level);

        // Ksilofon: soldan sağa notalar inceldikçe çubuk kısalır
        this.melodyXylophone.innerHTML = '';
        level.notes.forEach((id, i) => {
            const note = this.getMelodyNote(id);
            const bar = document.createElement('button');
            bar.type = 'button';
            bar.className = 'xylo-bar';
            bar.dataset.note = id;
            bar.style.setProperty('--bar-color', note.color);
            bar.style.setProperty('--bar-dark', note.dark);
            bar.style.setProperty('--bar-scale', 1 - i * (0.32 / Math.max(1, level.notes.length - 1)));
            bar.setAttribute('aria-label', `${note.name} notası`);
            bar.innerHTML = `
                <span class="xylo-emoji">${note.emoji}</span>
                <span class="xylo-name">${note.name}</span>
            `;
            bar.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.handleMelodyTap(id);
            });
            bar.addEventListener('click', (e) => {
                // Klavye (1-6) ve ekran okuyucu tıklamaları; dokunuş pointerdown ile çalındı
                if (e.detail === 0) this.handleMelodyTap(id);
            });
            this.melodyXylophone.appendChild(bar);
        });

        this.btnMelodyReplay.hidden = level.mode !== 'echo';
        this.updateMelodyProgress();

        if (level.mode === 'free') {
            this.setMelodyStatus('🎶 İstediğin tuşa dokun!');
            soundManager.speak(level.instruction);
        } else {
            this.setMelodyStatus('🎧 Hazır ol, melodi geliyor...');
            soundManager.speak(level.instruction);
            this.startMelodyRound(2200);
        }
    }

    setMelodyStatus(text, tone = '') {
        this.melodyStatus.textContent = text;
        this.melodyStatus.className = `melody-status-chip ${tone}`.trim();
    }

    updateMelodyProgress() {
        const level = window.GAME_DATA.MELODY_LEVELS[this.melodyLevelIdx];
        this.melodyProgress.textContent = level.mode === 'free'
            ? `🎵 ${Math.min(this.melodyFreeCount, level.goal)} / ${level.goal} Nota`
            : `⭐ Tur ${Math.min(this.melodyRound, level.rounds)} / ${level.rounds}`;
    }

    flashMelodyBar(id) {
        const bar = this.melodyXylophone.querySelector(`.xylo-bar[data-note="${id}"]`);
        if (!bar) return;
        bar.classList.remove('playing');
        void bar.offsetWidth; // animasyonu yeniden başlat
        bar.classList.add('playing');
        setTimeout(() => bar.classList.remove('playing'), 420);
    }

    async startMelodyRound(delay = 600) {
        const level = window.GAME_DATA.MELODY_LEVELS[this.melodyLevelIdx];
        // Arka arkaya aynı nota gelmesin: dizi kulakta daha kolay ayırt edilir
        const seq = [];
        while (seq.length < level.length) {
            const pick = level.notes[Math.floor(Math.random() * level.notes.length)];
            if (pick !== seq[seq.length - 1]) seq.push(pick);
        }
        this.melodySeq = seq;
        this.updateMelodyProgress();

        const token = this.melodyToken;
        this.melodyBusy = true;
        await this.sleep(delay);
        if (token !== this.melodyToken) return;
        this.playMelodySequence();
    }

    async playMelodySequence() {
        const token = ++this.melodyToken;
        this.melodyBusy = true;
        this.melodyInputPos = 0;
        this.setMelodyStatus('👂 Dikkatle dinle...', 'listening');

        // Hızlı bölümlerde notalar arası bekleme kısalır (varsayılan 700 ms)
        const tempo = window.GAME_DATA.MELODY_LEVELS[this.melodyLevelIdx].tempo || 700;
        await this.sleep(500);
        for (const id of this.melodySeq) {
            if (token !== this.melodyToken) return;
            soundManager.playNote(this.getMelodyNote(id).freq);
            this.flashMelodyBar(id);
            await this.sleep(tempo);
        }
        if (token !== this.melodyToken) return;

        this.melodyBusy = false;
        this.setMelodyStatus('👆 Sıra sende! Aynısını çal.', 'your-turn');
        soundManager.speak("Sıra sende!");
    }

    async handleMelodyTap(id) {
        const level = window.GAME_DATA.MELODY_LEVELS[this.melodyLevelIdx];
        soundManager.playNote(this.getMelodyNote(id).freq);
        this.flashMelodyBar(id);

        if (level.mode === 'free') {
            this.melodyFreeCount++;
            this.updateMelodyProgress();
            if (this.melodyFreeCount === level.goal) {
                this.addStar(2);
                this.triggerConfetti();
                this.setMelodyStatus('🌟 Harika bir müzisyensin!', 'success');
                soundManager.speak("Harika bir müzisyensin!");
                const token = this.melodyToken;
                await this.sleep(1400);
                if (token !== this.melodyToken) return;
                this.showCelebrationModal("Küçük Müzisyen! 🎹🎶", "Ksilofonda kendi şarkını çaldın. Şimdi melodileri tekrarlama zamanı!");
            }
            return;
        }

        // Melodi çalarken ya da tur geçişinde dokunuşlar yalnızca ses çıkarır
        if (this.melodyBusy || this.melodySeq.length === 0) return;

        if (id !== this.melodySeq[this.melodyInputPos]) {
            this.melodyBusy = true;
            const token = this.melodyToken;
            this.setMelodyStatus('🙈 Az kaldı! Bir daha dinleyelim.', 'oops');
            soundManager.speak("Az kaldı! Bir daha dinleyelim.");
            await this.sleep(1500);
            if (token !== this.melodyToken) return;
            this.playMelodySequence();
            return;
        }

        this.melodyInputPos++;
        if (this.melodyInputPos < this.melodySeq.length) return;

        // Dizinin tamamı doğru çalındı
        this.melodyBusy = true;
        const token = this.melodyToken;
        this.addStar(1);
        soundManager.playMagicChime();
        this.setMelodyStatus('🎉 Harika! Aynısını çaldın!', 'success');
        soundManager.speak("Harika! Aynısını çaldın!");
        await this.sleep(1500);
        if (token !== this.melodyToken) return;

        if (this.melodyRound >= level.rounds) {
            this.triggerConfetti();
            soundManager.playSuccess();
            this.showCelebrationModal("Melodi Ustası! 🎹✨", `${level.length} notalık melodileri ezbere çaldın!`);
            return;
        }
        this.melodyRound++;
        this.startMelodyRound(300);
    }
}

installGameMethods(MelodyGame);
