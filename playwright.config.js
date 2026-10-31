// Minik Kaşif testleri: npm test (sunucuyu kendisi başlatır)
const { defineConfig, devices } = require('@playwright/test');

const PORT = 8765;

module.exports = defineConfig({
    testDir: './tests',
    timeout: 90_000,
    fullyParallel: true,
    reporter: process.env.CI ? 'github' : 'list',
    use: {
        baseURL: `http://localhost:${PORT}/`,
        // Testlerde sayfa hiç Türkçe ses bulamazsa çıkan ebeveyn uyarısı kapalı başlasın
        storageState: {
            cookies: [],
            origins: [{ origin: `http://localhost:${PORT}`, localStorage: [{ name: 'minik_kasif_voice_notice_closed', value: '1' }] }]
        }
    },
    webServer: {
        command: `node tools/serve.mjs ${PORT}`,
        url: `http://localhost:${PORT}/`,
        reuseExistingServer: !process.env.CI
    },
    projects: [
        { name: 'masaustu', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
        { name: 'tablet', use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
        { name: 'telefon-dikey', use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true } },
        { name: 'telefon-yatay', use: { ...devices['Desktop Chrome'], viewport: { width: 812, height: 375 }, isMobile: true, hasTouch: true } }
    ]
});
