// ESLint: tanımsız değişken, kullanılmayan kod ve bariz hataları yakalar (stil kuralı yok)
const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    { ignores: ['node_modules/', 'test-results/', 'playwright-report/'] },
    js.configs.recommended,
    {
        // Oyun dosyaları: tarayıcıda sırayla <script> olarak yüklenir, ortak global alanı paylaşır
        files: ['audio.js', 'levels.js', 'game.js', 'games/**/*.js', 'sw.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.serviceworker,
                soundManager: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['error', { caughtErrors: 'none', varsIgnorePattern: '^(BUNNY|BALLOON|SHAPE|MEMORY|PATTERN|SIZE|REALTIME|BALL|SOAP|ALL|COLOR|NUMBER|COLORING|JIGSAW|MELODY|SORTING)_' }],
            'no-empty': ['error', { allowEmptyCatch: true }]
        }
    },
    {
        // Oyun dosyaları game.js'teki ortak yardımcıları kullanır
        files: ['games/**/*.js'],
        languageOptions: { globals: { safeStorage: 'readonly', installGameMethods: 'readonly' } }
    },
    {
        files: ['tests/**/*.js', 'playwright.config.js', 'eslint.config.js'],
        languageOptions: { sourceType: 'commonjs', globals: { ...globals.node, ...globals.browser, app: 'readonly', GAME_DATA: 'readonly', soundManager: 'readonly' } },
        rules: { 'no-empty-pattern': 'off' }
    },
    {
        files: ['tools/**/*.mjs'],
        languageOptions: { sourceType: 'module', globals: globals.node }
    }
];
