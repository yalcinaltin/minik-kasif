// Gerileme testleri: Faz 1'de düzeltilen hataların geri gelmediğini doğrular (masaüstü profilinde)
const { test, expect } = require('@playwright/test');
const { collectErrors, openGame, switchTab } = require('./helpers');

test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== 'masaustu', 'oyun mantığı testleri bir profilde yeterli');
});

const modalOpen = (page) => page.evaluate(() => document.getElementById('celebration-modal').open);

// Şekil bölümünü programla çözer
const solveShape = (page) => page.evaluate(() => {
    GAME_DATA.SHAPE_MATCH_LEVELS[app.shapeLevelIdx].items.forEach(item => {
        const slot = document.querySelector(`#shape-silhouettes .silhouette-slot[data-id="${item.id}"]`);
        app.tryMatchShape(item, slot, item);
    });
});

test('kutlama penceresi: beklerken 🏠 ya da sonraki bölüm → pencere açılmaz', async ({ page }) => {
    const errors = collectErrors(page);
    await openGame(page);

    await page.evaluate(() => { app.shapeLevelIdx = 0; });
    await switchTab(page, 'shape');
    await solveShape(page);
    await page.locator('#btn-home').click();
    await page.waitForTimeout(1300);
    expect(await modalOpen(page)).toBe(false);

    await page.evaluate(() => { app.shapeLevelIdx = 0; });
    await switchTab(page, 'shape');
    await solveShape(page);
    await page.locator('#btn-shape-next').click();
    await page.waitForTimeout(1300);
    expect(await modalOpen(page)).toBe(false);
    expect(await page.evaluate(() => app.shapeLevelIdx)).toBe(1);

    // Normal akışta pencere açılır
    await solveShape(page);
    await expect.poll(() => modalOpen(page), { timeout: 3000 }).toBe(true);
    await expect(page.locator('#btn-next-celebration span')).toHaveText('Sonraki Bölüm 🌟');
    expect(errors).toEqual([]);
});

test('son bölüm: pencere menüye götürür', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { app.patternLevelIdx = GAME_DATA.PATTERN_LEVELS.length - 1; });
    await switchTab(page, 'pattern');
    const label = await page.evaluate(() => GAME_DATA.PATTERN_LEVELS[app.patternLevelIdx].correct.label);
    await page.locator('.pattern-option-card', { hasText: label }).first().click();
    await expect.poll(() => modalOpen(page), { timeout: 3000 }).toBe(true);
    await expect(page.locator('#btn-next-celebration span')).toHaveText('🏠 Oyun Menüsü');
    await page.locator('#btn-next-celebration').click();
    await expect(page.locator('body')).toHaveClass(/on-home/);
});

test('tavşancık: yürürken menüye dönülünce yürüyüş durur; havuçtan sonra yeniden çalıştırma yıldız vermez', async ({ page }) => {
    const errors = collectErrors(page);
    await openGame(page);
    await page.evaluate(() => { app.bunnyLevelIdx = 0; });
    await switchTab(page, 'bunny');
    // Engelsiz ileri-geri yürüyüş: bekleme süresinden uzun sürer, kendiliğinden bitmez
    await page.evaluate(() => { for (let i = 0; i < 6; i++) { app.addCommand('RIGHT'); app.addCommand('LEFT'); } });
    await page.locator('#btn-run-code').click();
    await page.waitForTimeout(200);
    await expect(page.locator('#btn-bunny-next')).toBeDisabled();
    await page.locator('#btn-home').click();
    await page.waitForTimeout(2500);
    expect(await page.evaluate(() => app.isRunning)).toBe(false);
    await expect(page.locator('#mascot-speech-bubble .bubble-text')).not.toContainText('varamadı');

    await switchTab(page, 'bunny');
    await page.evaluate(() => ['RIGHT', 'RIGHT'].forEach(d => app.addCommand(d)));
    const before = await page.evaluate(() => app.totalStars);
    await page.locator('#btn-run-code').click();
    await page.waitForTimeout(1100);
    await expect(page.locator('#btn-run-code')).toBeDisabled();
    await expect.poll(() => modalOpen(page), { timeout: 3000 }).toBe(true);
    expect(await page.evaluate(() => app.totalStars) - before).toBe(2);

    // Havuçtan sonra yeniden çalıştırma (düğme kapalı olsa da doğrudan çağrı) yıldız vermez
    await page.evaluate(() => document.getElementById('celebration-modal').close());
    await page.waitForTimeout(300);
    await expect(page.locator('#btn-run-code')).toBeDisabled();
    await page.evaluate(() => app.executeCommands());
    await page.waitForTimeout(1500);
    expect(await page.evaluate(() => app.totalStars) - before).toBe(2);
    expect(errors).toEqual([]);
});

test('hafıza: yanlış çiftten hemen sonra bölüm değişse de oyun kilitlenmez', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { app.memoryLevelIdx = 0; });
    await switchTab(page, 'memory');
    await page.evaluate(() => {
        const cards = [...document.querySelectorAll('#memory-board .memory-card')];
        cards[0].click();
        cards.find(c => c.dataset.id !== cards[0].dataset.id).click();
    });
    await page.waitForTimeout(100);
    await page.locator('#btn-memory-next').click();
    await page.waitForTimeout(150);
    await page.locator('#memory-board .memory-card').first().click();
    await page.waitForTimeout(1200);
    const state = await page.evaluate(() => ({ lock: app.memoryLock, flipped: app.flippedCards.length }));
    expect(state).toEqual({ lock: false, flipped: 1 });
});

test('boyut: doğru sıralamadan sonra tıklamak yıldız vermez', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { app.sizeLevelIdx = 0; });
    await switchTab(page, 'size');
    await page.evaluate(() => {
        [...GAME_DATA.SIZE_LEVELS[0].items].sort((a, b) => a.rank - b.rank)
            .forEach(it => app.placeItemOnFirstAvailableSlot(app.availableSizeItems.find(x => x.id === it.id)));
    });
    await expect.poll(() => modalOpen(page), { timeout: 3000 }).toBe(true);
    const stars = await page.evaluate(() => app.totalStars);
    await page.evaluate(() => {
        document.getElementById('celebration-modal').close();
        document.querySelector('.podium-slot .podium-placed-item').click();
    });
    expect(await page.evaluate(() => app.totalStars)).toBe(stars);
    expect(await page.evaluate(() => app.sizePodiumSlots.every(Boolean))).toBe(true);
});

test('her oyunda önceki/sonraki bölüm düğmeleri ve yönerge çalışır', async ({ page }) => {
    const errors = collectErrors(page);
    await openGame(page);
    const keys = await page.evaluate(() => Object.keys(app.games));
    expect(keys).toHaveLength(18);

    for (const key of keys) {
        const result = await page.evaluate(async (k) => {
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            const game = app.games[k];
            const count = game.levels().length;
            app.switchTab(k);
            await sleep(80);
            game.load(0);
            await sleep(80);
            const title = () => document.getElementById(game.titleId || `${k}-title`).textContent;
            const prev = document.getElementById(`btn-${k}-prev`);
            const next = document.getElementById(`btn-${k}-next`);
            const r = { count, prevDisabledAt0: prev.disabled, title0: title(), instruction: app.getCurrentInstruction() };
            next.click(); await sleep(80);
            r.idxAfterNext = app.getGameIdx(k);
            r.title1 = title();
            prev.click(); await sleep(80);
            r.idxAfterPrev = app.getGameIdx(k);
            game.load(count - 1); await sleep(80);
            r.nextDisabledAtLast = next.disabled;
            speechSynthesis.cancel();
            return r;
        }, key);
        expect(result.prevDisabledAt0, key).toBe(true);
        expect(result.title0, key).toMatch(/^(Bölüm|Sayfa) 1: /);
        expect(result.instruction, key).toBeTruthy();
        expect(result.idxAfterNext, key).toBe(1);
        expect(result.title1, key).toMatch(/^(Bölüm|Sayfa) 2: /);
        expect(result.idxAfterPrev, key).toBe(0);
        expect(result.nextDisabledAtLast, key).toBe(true);
    }
    expect(errors).toEqual([]);
});

test('labirent: kutlama penceresi Esc ile kapanmaz, bitmiş bölüm yeniden oynanıp yıldız toplanamaz', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { app.realmazeLevelIdx = 0; });
    await switchTab(page, 'realmaze');
    // Hedefe doğrudan götür (yol bulma testin konusu değil)
    await page.evaluate(() => {
        const lv = GAME_DATA.REALTIME_MAZE_LEVELS[0];
        app.realmazePlayer = { x: lv.goal.x - 1, y: lv.goal.y, facing: 'right' };
        if (lv.walls.some(w => w.x === lv.goal.x - 1 && w.y === lv.goal.y)) app.realmazePlayer = { x: lv.goal.x, y: lv.goal.y - 1, facing: 'right' };
        app.moveRealmaze(app.realmazePlayer.x < lv.goal.x ? 'RIGHT' : 'DOWN');
    });
    await expect.poll(() => modalOpen(page), { timeout: 3000 }).toBe(true);
    const stars = await page.evaluate(() => app.totalStars);
    await page.keyboard.press('Escape');
    expect(await modalOpen(page)).toBe(true);
    await page.evaluate(() => document.getElementById('btn-reset-realmaze').click());
    expect(await page.evaluate(() => app.realmazeFinished)).toBe(true);
    expect(await page.evaluate(() => app.totalStars)).toBe(stars);
});

test('balon: renk görevinde hedef renkte balon hep vardır (yalnız doğru renk patlatılsa da takılmaz)', async ({ page }) => {
    const errors = collectErrors(page);
    await openGame(page);
    const idx = await page.evaluate(() => GAME_DATA.BALLOON_LEVELS.findIndex(l => l.mode === 'color_filter'));
    await page.evaluate((i) => { app.balloonLevelIdx = i; }, idx);
    await switchTab(page, 'balloon');
    const result = await page.evaluate(async (i) => {
        const level = GAME_DATA.BALLOON_LEVELS[i];
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const seen = [];
        for (let k = 0; k < level.targetCount - 1; k++) {
            await sleep(1300);
            const target = app.activeBalloons.find(b => b.data.name === level.targetColor);
            seen.push(!!target);
            if (target) await app.popBalloon(target.element, target.data);
        }
        return seen;
    }, idx);
    expect(result.every(Boolean)).toBe(true);
    expect(errors).toEqual([]);
});

test('dinle & bul: mikrofon yok, doğru karta dokununca tur ilerler', async ({ page }) => {
    await openGame(page);
    await switchTab(page, 'colorfinder');
    await expect(page.locator('[id*="-mic"]')).toHaveCount(0);
    await expect(page.locator('#color-round-badge')).toHaveText(/Tur 1 \//);
    const target = await page.evaluate(() => app.getFinderRound('color').target);
    await page.locator(`#color-cards-container .finder-card[data-id="${target}"]`).click();
    await expect(page.locator('#color-round-badge')).toHaveText(/Tur 2 \//, { timeout: 3000 });
});

test('şekil: gölgeler gerçek siluet, cevap yazısı gizli', async ({ page }) => {
    await openGame(page);
    await page.evaluate(() => { app.shapeLevelIdx = 1; });
    await switchTab(page, 'shape');
    const icons = await page.locator('#shape-silhouettes .silhouette-icon').allTextContents();
    expect(new Set(icons.map(s => s.trim())).size).toBe(icons.length);
    await expect(page.locator('#shape-silhouettes .slot-hint').first()).toHaveText('?');
});

test('depolama kapalıyken uygulama açılır ve oynanır', async ({ browser }) => {
    const context = await browser.newContext();
    await context.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } });
    });
    const page = await context.newPage();
    const errors = collectErrors(page);
    await openGame(page);
    const stars = await page.evaluate(async () => {
        app.addStar(2);
        app.switchTab('jigsaw');
        await new Promise(r => setTimeout(r, 300));
        return app.totalStars;
    });
    expect(stars).toBe(2);
    expect(errors).toEqual([]);
    await context.close();
});

test('ses tercihi yeniden açılışta korunur', async ({ page }) => {
    await openGame(page);
    await page.locator('#btn-sound-toggle').click();
    await page.reload();
    await expect.poll(() => page.evaluate(() => typeof window.app === 'object')).toBe(true);
    expect(await page.evaluate(() => soundManager.soundEnabled)).toBe(false);
    await expect(page.locator('#btn-sound-toggle .btn-icon')).toHaveText('🔇');
});
