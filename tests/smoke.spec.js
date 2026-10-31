// Duman testi: 18 oyunun bütün bölümleri her cihaz profilinde hatasız açılır ve ekrana kaydırmasız sığar
const { test, expect } = require('@playwright/test');
const { collectErrors, openGame } = require('./helpers');

test('18 oyunun bütün bölümleri hatasız açılır ve ekrana sığar', async ({ page }) => {
    test.setTimeout(180000);
    const errors = collectErrors(page);
    await openGame(page);

    const report = await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        // Yatay taşma: kaydırma kapları (overflow hidden/auto) içindekiler sayılmaz
        const maxRight = (root) => {
            let m = 0;
            const walk = (el) => {
                const cs = getComputedStyle(el);
                if (cs.display === 'none') return;
                const r = el.getBoundingClientRect();
                if (r.width && r.height) m = Math.max(m, r.right);
                if (el !== root && ['hidden', 'auto', 'scroll', 'clip'].includes(cs.overflowX)) return;
                [...el.children].forEach(walk);
            };
            walk(root);
            return Math.round(m);
        };
        const tabs = [...document.querySelectorAll('.nav-tab-btn')].map(b => b.dataset.tab);
        const problems = [];
        let levels = 0;
        for (const t of tabs) {
            app.switchTab(t);
            await sleep(300);
            const count = app.games[t].levels().length;
            for (let i = 0; i < count; i++) {
                if (i > 0) { app.games[t].load(i); await sleep(300); }
                speechSynthesis.cancel();
                levels++;
                const where = `${t} ${i + 1}. bölüm`;
                const view = document.getElementById(`view-${t}`);
                const overflowY = document.documentElement.scrollHeight - innerHeight;
                const right = maxRight(view);
                if (!view.classList.contains('active')) problems.push(`${where}: görünüm açılmadı`);
                if (overflowY > 0) problems.push(`${where}: ${overflowY}px dikey taşma`);
                if (right > innerWidth + 1) problems.push(`${where}: ${right - innerWidth}px yatay taşma`);
            }
        }
        app.switchTab('home');
        return { count: tabs.length, levels, problems };
    });

    expect(report.count).toBe(18);
    expect(report.problems).toEqual([]);
    expect(errors).toEqual([]);
});

test('ana ekran: menü kartları ve 🏠 dönüşü', async ({ page }) => {
    const errors = collectErrors(page);
    await openGame(page);
    await expect(page.locator('body')).toHaveClass(/on-home/);
    await page.locator('.nav-tab-btn[data-tab="memory"]').click();
    await expect(page.locator('#view-memory')).toHaveClass(/active/);
    await page.locator('#btn-home').click();
    await expect(page.locator('body')).toHaveClass(/on-home/);
    expect(errors).toEqual([]);
});

test('çevrimdışı: bir kez açıldıktan sonra internetsiz oynanır', async ({ page, context }, testInfo) => {
    test.skip(testInfo.project.name !== 'masaustu', 'service worker testi bir profilde yeterli');
    const errors = collectErrors(page);
    await openGame(page);
    // Ön yükleme listesi (APP_SHELL) sayfanın yüklediği her dosyayı içermeli:
    // denetim çevrimiçi yeniden yüklemeden önce yapılır, yoksa çalışma anı önbelleği eksikleri örter
    const missing = await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
        await new Promise(r => setTimeout(r, 1500));
        const urls = [...document.querySelectorAll('script[src], link[rel="stylesheet"][href], link[rel="manifest"]')]
            .map(el => new URL(el.getAttribute('src') || el.getAttribute('href'), location.href))
            .filter(u => u.origin === location.origin).map(u => u.href);
        const keys = await caches.keys();
        const app = await caches.open(keys.find(k => k.startsWith('minik-kasif-app-')));
        const out = [];
        for (const u of urls) if (!(await app.match(u))) out.push(u);
        return out;
    });
    expect(missing).toEqual([]);
    await page.reload();
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

    await context.setOffline(true);
    await page.reload();
    const offline = await page.evaluate(async () => {
        app.switchTab('jigsaw');
        await new Promise(r => setTimeout(r, 400));
        return { onLine: navigator.onLine, pieces: document.querySelectorAll('#jigsaw-tray .jigsaw-piece').length };
    });
    await context.setOffline(false);
    expect(offline.onLine).toBe(false);
    expect(offline.pieces).toBeGreaterThan(0);
    expect(errors).toEqual([]);
});
