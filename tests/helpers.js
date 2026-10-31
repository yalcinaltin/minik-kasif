// Ortak test yardımcıları
const { expect } = require('@playwright/test');

// Sayfa hatalarını ve konsol hatalarını toplar; test sonunda boş olmalı
function collectErrors(page) {
    const errors = [];
    page.on('pageerror', e => errors.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    return errors;
}

async function openGame(page) {
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => typeof window.app === 'object')).toBe(true);
}

// Bir sekmeyi açar, konuşmayı keser (testlerde ses gerekmez)
async function switchTab(page, tab, waitMs = 300) {
    await page.evaluate(async ([t, ms]) => {
        app.switchTab(t);
        await new Promise(r => setTimeout(r, ms));
        if ('speechSynthesis' in window) speechSynthesis.cancel();
    }, [tab, waitMs]);
}

module.exports = { collectErrors, openGame, switchTab };
