/**
 * Minik Kaşif - Ana Oyun Motoru (3-5 Yaş Çocuk Gelişim Sürümü)
 * 15 Zengin ve Eğlenceli Oyun Modülü:
 * 1. 🐶 Yön Tuşlu Canlı Labirent (Klavyeyle/Dokunmatik Canlı Çıkış)
 * 2. 🏀 Neşeli Top Atma & Basket (Fizik & Hedef Vurma)
 * 3. 🧼 Sihirli Sabun Köpüğü (Duyusal Patlatma & Sürprizler)
 * 4. 🥕 Tavşancık Kodlama (Algoritmik Sıralama)
 * 5. 🎈 Balon Avı (Renkler & Sayılar)
 * 6. 🧩 Şekil & Gölge (Form & Eşleme)
 * 7. 🧠 Hafıza Kartları (3D Kart Çevirme)
 * 8. 🚂 Örüntü Treni (Mantık & Tahmin)
 * 9. ⚖️ Boyut Dünyası (Küçükten Büyüğe Sıralama)
 * 10. 🎨 Renk Bulucu (Dinle & Bul)
 * 11. 🔢 Sayı Bulucu (Dinle & Bul)
 * 12. 🖍️ Boyama Kitabı (Renk Seç & Dokun Boya)
 * 13. 🖼️ Yapboz (Parça - Bütün)
 * 14. 🎹 Melodi Tekrarla (Ksilofon & İşitsel Bellek)
 * 15. 🧺 Sepetlere Ayır (Sınıflandırma)
 */

// Tarayıcı depolaması kapalı ya da dolu olabilir (gizli pencere, engellenmiş site verisi):
// okuma/yazma hata fırlatsa da oyun açılsın ve oynansın
const safeStorage = {
    get(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : value;
        } catch (e) {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, String(value));
        } catch (e) { /* kaydedilemedi: oyun yine de sürer */ }
    },
    getInt(key, fallback = 0) {
        const n = parseInt(this.get(key, ''), 10);
        return Number.isFinite(n) && n >= 0 ? n : fallback;
    }
};

class MiniExplorerApp {
    constructor() {
        this.activeTab = 'home'; // Başlangıçta oyun seçim ana ekranı açılsın
        this.totalStars = safeStorage.getInt('minik_kasif_stars', 0);
        // Her bölüm yüklemesinde ve sekme değişiminde artar; geciken işler (kutlama penceresi,
        // tavşan yürüyüşü, hafıza kartı geri çevirme) hâlâ aynı tahtada mıyız diye buna bakar
        this.levelEpoch = 0;

        // 🐶 1. Canlı Labirent Durumu
        this.realmazeLevelIdx = 0;
        this.realmazePlayer = { x: 0, y: 0, facing: 'right' };
        this.realmazeStars = new Set();
        this.realmazeFinished = false;

        // 🏀 2. Top Atma Durumu
        this.ballTossLevelIdx = 0;
        this.ballTossScore = 0;
        this.isTossLaunching = false;
        this.tossTargetX = 0;        // Hedefin alan ortasına göre yatay kayması (px)
        this.tossTargetDir = 1;
        this.tossTargetRaf = null;
        this.tossDrag = null;        // Topu kaydırarak nişan alma durumu

        // 🧼 3. Sabun Köpüğü Durumu
        this.bubblesLevelIdx = 0;
        this.bubblesPoppedScore = 0;
        this.bubblesSpawnTimer = null;
        this.activeBubbles = [];

        // 🥕 4. Tavşan Kodlama Durumu
        this.bunnyLevelIdx = 0;
        this.commands = [];
        this.maxCommands = 14;
        this.bunnyPos = { x: 0, y: 0, facing: 'right' };
        this.collectedStars = new Set();
        this.isRunning = false;

        // 🎈 5. Balon Modülü Durumu
        this.balloonLevelIdx = 0;
        this.balloonScore = 0;
        this.balloonInterval = null;
        this.activeBalloons = [];

        // 🧩 6. Şekil Eşleştirme Durumu
        this.shapeLevelIdx = 0;
        this.selectedShapeItem = null;
        this.matchedShapesCount = 0;

        // 🧠 7. Hafıza Kartları Durumu
        this.memoryLevelIdx = 0;
        this.memoryCards = [];
        this.flippedCards = [];
        this.matchedPairsCount = 0;
        this.memoryLock = false;
        
        // 🚂 8. Örüntü Modülü Durumu
        this.patternLevelIdx = 0;
        this.patternSolved = false;

        // ⚖️ 9. Boyut Modülü Durumu
        this.sizeLevelIdx = 0;
        this.sizePodiumSlots = [null, null, null];
        this.availableSizeItems = [];
        this.sizeLocked = false;     // Üç podyum dolunca/başarınca tıklamalar kilitlenir

        // 🎨🔢 10-11. Renk & Sayı Bulucu Durumu (ortak motor, tür başına ayrı ilerleme)
        this.finderState = {
            color: { levelIdx: 0, roundIdx: 0, busy: false, roundToken: 0 },
            number: { levelIdx: 0, roundIdx: 0, busy: false, roundToken: 0 }
        };

        // 🖍️ 12. Boyama Kitabı Durumu
        this.coloringLevelIdx = 0;
        this.coloringColorIdx = 0;
        this.coloringDone = false;

        // 🖼️ 13. Yapboz Durumu
        this.jigsawLevelIdx = 0;
        this.jigsawSelected = null;
        this.jigsawPlaced = 0;

        // 🎹 14. Melodi Durumu
        this.melodyLevelIdx = 0;
        this.melodySeq = [];
        this.melodyInputPos = 0;
        this.melodyRound = 1;
        this.melodyFreeCount = 0;
        this.melodyBusy = false;
        this.melodyToken = 0;      // Bölüm/sekme değişince süren çalma döngüsünü iptal eder

        // 🧺 15. Sınıflandırma Durumu
        this.sortingLevelIdx = 0;
        this.sortingSelected = null;
        this.sortingDone = 0;

        // Yeni modüllerin ortak kaydı: önceki/sonraki, sekme açılışı, yönerge ve kutlama sonrası ilerleme
        this.extraModules = {
            coloring: { levels: () => window.GAME_DATA.COLORING_PAGES, idxKey: 'coloringLevelIdx', load: (i) => this.loadColoringLevel(i) },
            jigsaw: { levels: () => window.GAME_DATA.JIGSAW_LEVELS, idxKey: 'jigsawLevelIdx', load: (i) => this.loadJigsawLevel(i) },
            melody: { levels: () => window.GAME_DATA.MELODY_LEVELS, idxKey: 'melodyLevelIdx', load: (i) => this.loadMelodyLevel(i) },
            sorting: { levels: () => window.GAME_DATA.SORTING_LEVELS, idxKey: 'sortingLevelIdx', load: (i) => this.loadSortingLevel(i) }
        };

        // Konfeti motoru
        this.confettiCanvas = null;
        this.confettiCtx = null;
        this.confettiParticles = [];
        this.confettiActive = false;

        this.init();
    }

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.initConfetti();
        this.updateStarDisplay();

        // Kayıtlı Dev Ekran Tercihi
        if (safeStorage.get('minik_kasif_giant_mode') === '1') {
            document.body.classList.add('giant-screen-active');
            if (this.btnScreenScale) {
                this.btnScreenScale.classList.add('active-mode');
                this.btnScreenScale.querySelector('.btn-icon').textContent = '🔎';
            }
        }

        // Kayıtlı ses efekti / sesli anlatım tercihleri
        if (safeStorage.get('minik_kasif_sound') === '0') {
            soundManager.soundEnabled = false;
            this.showSoundState(false);
        }
        if (safeStorage.get('minik_kasif_voice') === '0') {
            soundManager.voiceEnabled = false;
            this.showVoiceState(false);
        }

        this.setupPlayAreaSizing();
        this.setupFullscreenButton();
        this.setupPwa();

        // Başlangıçta oyun seçim ekranını aç
        this.switchTab('home');

        this.checkTurkishVoice();
    }

    // Oyun tahtaları ekrana kaydırmasız sığsın diye başlık + balon + bölüm kartı
    // yüksekliğini ölçüp CSS'teki --chrome-h değişkenine yazar (--play-h buradan hesaplanır)
    setupPlayAreaSizing() {
        const update = () => this.updatePlayAreaHeight();
        window.addEventListener('resize', () => {
            update();
            // Telefon döndürülünce hafıza kartları yeni yöne göre yeniden dizilir
            if (this.activeTab === 'memory') this.applyMemoryGrid(this.memoryBoard.children.length);
        });
        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(update);
            document.querySelectorAll('.level-banner-card, .app-header, .mascot-speech-container')
                .forEach(el => observer.observe(el));
        }
    }

    updatePlayAreaHeight() {
        const view = this.tabViews[this.activeTab];
        const banner = view && view.querySelector('.level-banner-card');
        if (!banner) return;

        const viewGap = parseFloat(getComputedStyle(view).rowGap) || 16;
        const mainPadBottom = parseFloat(getComputedStyle(document.querySelector('.main-content')).paddingBottom) || 16;
        const playTop = banner.getBoundingClientRect().bottom + window.scrollY + viewGap;
        // +2px: alt-piksel yuvarlamaları yüzünden 1-3px'lik kaydırma çubuğu çıkmasın
        document.documentElement.style.setProperty('--chrome-h', `${Math.ceil(playTop + mainPadBottom) + 2}px`);
    }

    // Cihazda Türkçe ses yoksa ebeveyne bir kez nasıl kurulacağını göster
    checkTurkishVoice() {
        if (!('speechSynthesis' in window) || !this.voiceNotice) return;
        if (safeStorage.get('minik_kasif_voice_notice_closed') === '1') return;

        // Telefon/tablette Windows yerine cihazın metin okuma ayarı anlatılır
        const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
        this.voiceNotice.querySelector('.notice-desktop').hidden = isTouchDevice;
        this.voiceNotice.querySelector('.notice-mobile').hidden = !isTouchDevice;

        // Ses listesi tarayıcıda gecikmeli yüklenir; kısa bir süre bekleyip karar ver
        setTimeout(() => {
            if (!soundManager.hasTurkishVoice) {
                this.voiceNotice.hidden = false;
            }
        }, 2500);
    }

    // 📲 Uygulama (PWA): internetsiz oynama için service worker + "Ana ekrana ekle" düğmesi
    setupPwa() {
        // Service worker yalnızca güvenli bağlamda (https ya da localhost) çalışır; dosyadan açılışta atlanır
        if ('serviceWorker' in navigator && window.isSecureContext) {
            const register = () => navigator.serviceWorker.register('./sw.js')
                .catch(err => console.log('Service worker kaydedilemedi:', err));
            if (document.readyState === 'complete') register();
            else window.addEventListener('load', register);
        }

        // Kurulu uygulama olarak mı açıldı? Açılışta bir kez bakılır: tarayıcıdaki tam ekran
        // (Fullscreen API / F11) da display-mode: fullscreen eşleştirdiği için o durum ayrılır
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches
            || (window.matchMedia('(display-mode: fullscreen)').matches
                && !(document.fullscreenElement || document.webkitFullscreenElement))
            || window.navigator.standalone === true;
        document.documentElement.classList.toggle('pwa-launched', isInstalled);
        if (isInstalled || !this.btnInstallApp) return;

        // Android Chrome / masaüstü: tarayıcının kendi kurulum penceresi bu düğmeyle açılır
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredInstallPrompt = e;
            this.btnInstallApp.hidden = false;
        });
        window.addEventListener('appinstalled', () => {
            this.deferredInstallPrompt = null;
            this.btnInstallApp.hidden = true;
        });

        // iPhone/iPad'de kurulum penceresi yok: düğme adım adım yardımı açar
        const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent)
            || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        if (isIos) this.btnInstallApp.hidden = false;

        this.btnInstallApp.addEventListener('click', async () => {
            soundManager.playPop();
            if (this.deferredInstallPrompt) {
                const promptEvent = this.deferredInstallPrompt;
                this.deferredInstallPrompt = null;
                promptEvent.prompt();
                const choice = await promptEvent.userChoice;
                // Reddedilirse de gizlenir (yardım penceresi yalnızca telefon adımlarını anlatır);
                // tarayıcı daha sonra yeniden kurulum önerirse beforeinstallprompt düğmeyi geri getirir
                if (choice.outcome === 'accepted' || !isIos) this.btnInstallApp.hidden = true;
            } else {
                this.installHelpDialog.showModal();
            }
        });

        this.btnCloseInstallHelp.addEventListener('click', () => {
            soundManager.playPop();
            this.installHelpDialog.close();
        });
    }

    // iPhone Safari gibi tam ekran API'si olmayan tarayıcılarda düğme gizlenir
    setupFullscreenButton() {
        const root = document.documentElement;
        this.requestFullscreenFn = root.requestFullscreen || root.webkitRequestFullscreen;
        if (!this.requestFullscreenFn && this.btnFullscreen) {
            this.btnFullscreen.hidden = true;
            return;
        }

        // Esc / geri tuşuyla tam ekrandan çıkılınca da simge doğru kalsın
        const syncIcon = () => {
            const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
            this.btnFullscreen.querySelector('.btn-icon').textContent = isFull ? '🗗' : '⛶';
        };
        document.addEventListener('fullscreenchange', syncIcon);
        document.addEventListener('webkitfullscreenchange', syncIcon);
    }

    cacheDOM() {
        // Sekmeler
        this.tabBtns = document.querySelectorAll('.nav-tab-btn');
        this.btnHome = document.getElementById('btn-home');
        this.btnInstallApp = document.getElementById('btn-install-app');
        this.installHelpDialog = document.getElementById('install-help-dialog');
        this.btnCloseInstallHelp = document.getElementById('btn-close-install-help');
        this.voiceNotice = document.getElementById('voice-missing-notice');
        this.btnCloseVoiceNotice = document.getElementById('btn-close-voice-notice');
        this.tabViews = {
            realmaze: document.getElementById('view-realmaze'),
            balltoss: document.getElementById('view-balltoss'),
            bubbles: document.getElementById('view-bubbles'),
            bunny: document.getElementById('view-bunny'),
            balloon: document.getElementById('view-balloon'),
            shape: document.getElementById('view-shape'),
            memory: document.getElementById('view-memory'),
            pattern: document.getElementById('view-pattern'),
            size: document.getElementById('view-size'),
            colorfinder: document.getElementById('view-colorfinder'),
            numberfinder: document.getElementById('view-numberfinder'),
            coloring: document.getElementById('view-coloring'),
            jigsaw: document.getElementById('view-jigsaw'),
            melody: document.getElementById('view-melody'),
            sorting: document.getElementById('view-sorting')
        };

        // Üst panel
        this.totalStarsEl = document.getElementById('total-stars-count');
        this.btnSoundToggle = document.getElementById('btn-sound-toggle');
        this.btnVoiceToggle = document.getElementById('btn-voice-toggle');
        this.btnFullscreen = document.getElementById('btn-fullscreen-toggle');
        this.btnScreenScale = document.getElementById('btn-screen-scale');
        this.btnHelp = document.getElementById('btn-parent-guide');
        this.dialogGuide = document.getElementById('parent-guide-dialog');
        this.btnCloseGuide = document.getElementById('btn-close-guide');

        // --- 1. Canlı Yön Tuşlu Labirent ---
        this.realmazeTitle = document.getElementById('realmaze-title');
        this.realmazeInstruction = document.getElementById('realmaze-instruction');
        this.realmazeGrid = document.getElementById('realmaze-grid');
        this.realmazeStarsBadge = document.getElementById('realmaze-stars-badge');
        this.btnResetRealmaze = document.getElementById('btn-reset-realmaze');
        this.realmazePrevBtn = document.getElementById('btn-realmaze-prev');
        this.realmazeNextBtn = document.getElementById('btn-realmaze-next');
        this.realmazeArrowBtns = document.querySelectorAll('[data-realdir]');

        // --- 2. Neşeli Top Atma & Basket ---
        this.balltossTitle = document.getElementById('balltoss-title');
        this.balltossInstruction = document.getElementById('balltoss-instruction');
        this.balltossScoreBadge = document.getElementById('balltoss-score-badge');
        this.targetEmojiDisplay = document.getElementById('target-emoji-display');
        this.targetLabelDisplay = document.getElementById('target-label-display');
        this.ballAmmoEmoji = document.getElementById('ball-ammo-emoji');
        this.btnLaunchBall = document.getElementById('btn-launch-ball');
        this.balltossFlyingField = document.getElementById('balltoss-flying-field');
        this.balltossTargetBox = document.getElementById('balltoss-target-box');
        this.balltossTargetZone = document.getElementById('balltoss-target-zone');
        this.balltossArena = document.querySelector('.balltoss-arena-card');
        this.balltossBallHolder = document.getElementById('balltoss-ball-holder');
        this.balltossPrevBtn = document.getElementById('btn-balltoss-prev');
        this.balltossNextBtn = document.getElementById('btn-balltoss-next');

        // --- 3. Sabun Köpüğü Patlatma ---
        this.bubblesTitle = document.getElementById('bubbles-title');
        this.bubblesInstruction = document.getElementById('bubbles-instruction');
        this.bubblesScoreBadge = document.getElementById('bubbles-score-badge');
        this.bubblesPond = document.getElementById('bubbles-pond');
        this.bubblesChestItems = document.getElementById('bubbles-chest-items');
        this.bubblesPrevBtn = document.getElementById('btn-bubbles-prev');
        this.bubblesNextBtn = document.getElementById('btn-bubbles-next');

        // --- 4. Tavşancık Kodlama Öğeleri ---
        this.bunnyGrid = document.getElementById('bunny-grid');
        this.bunnyLevelTitle = document.getElementById('bunny-level-title');
        this.bunnyInstruction = document.getElementById('bunny-instruction');
        this.commandTrain = document.getElementById('command-train');
        this.btnRunCode = document.getElementById('btn-run-code');
        this.btnClearCode = document.getElementById('btn-clear-code');
        this.btnResetBunny = document.getElementById('btn-reset-bunny');
        this.bunnyPrevLevelBtn = document.getElementById('btn-bunny-prev');
        this.bunnyNextLevelBtn = document.getElementById('btn-bunny-next');
        this.arrowBtns = document.querySelectorAll('.btn-command-arrow[data-direction]');

        // --- 5. Balon Patlatma Öğeleri ---
        this.balloonTitle = document.getElementById('balloon-title');
        this.balloonInstruction = document.getElementById('balloon-instruction');
        this.balloonSky = document.getElementById('balloon-sky');
        this.balloonScoreBadge = document.getElementById('balloon-score-badge');
        this.balloonPrevBtn = document.getElementById('btn-balloon-prev');
        this.balloonNextBtn = document.getElementById('btn-balloon-next');

        // --- 6. Şekil Eşleştirme Öğeleri ---
        this.shapeTitle = document.getElementById('shape-title');
        this.shapeInstruction = document.getElementById('shape-instruction');
        this.shapeSilhouettesContainer = document.getElementById('shape-silhouettes');
        this.shapePiecesContainer = document.getElementById('shape-pieces');
        this.shapePrevBtn = document.getElementById('btn-shape-prev');
        this.shapeNextBtn = document.getElementById('btn-shape-next');

        // --- 7. Hafıza Kartları Öğeleri ---
        this.memoryTitle = document.getElementById('memory-title');
        this.memoryInstruction = document.getElementById('memory-instruction');
        this.memoryBoard = document.getElementById('memory-board');
        this.memoryPrevBtn = document.getElementById('btn-memory-prev');
        this.memoryNextBtn = document.getElementById('btn-memory-next');

        // --- 8. Örüntü Öğeleri ---
        this.patternTitle = document.getElementById('pattern-title');
        this.patternInstruction = document.getElementById('pattern-instruction');
        this.patternTrainWagons = document.getElementById('pattern-train-wagons');
        this.patternOptionsContainer = document.getElementById('pattern-options');
        this.patternPrevBtn = document.getElementById('btn-pattern-prev');
        this.patternNextBtn = document.getElementById('btn-pattern-next');

        // --- 9. Boyut Öğeleri ---
        this.sizeTitle = document.getElementById('size-title');
        this.sizeInstruction = document.getElementById('size-instruction');
        this.sizePool = document.getElementById('size-pool');
        this.podiumSlotsEl = document.querySelectorAll('.podium-slot');
        this.sizePrevBtn = document.getElementById('btn-size-prev');
        this.sizeNextBtn = document.getElementById('btn-size-next');
        this.btnResetSize = document.getElementById('btn-reset-size');

        // --- 10-11. Renk & Sayı Bulucu Öğeleri ---
        this.finderUI = {
            color: {
                title: document.getElementById('colorfinder-title'),
                instruction: document.getElementById('colorfinder-instruction'),
                prevBtn: document.getElementById('btn-colorfinder-prev'),
                nextBtn: document.getElementById('btn-colorfinder-next'),
                roundBadge: document.getElementById('color-round-badge'),
                switchBtn: document.getElementById('btn-switch-to-numbers'),
                targetWord: document.getElementById('color-target-word'),
                targetCircle: document.getElementById('color-target-circle'),
                targetPrompt: document.getElementById('color-target-prompt'),
                listenBtn: document.getElementById('btn-color-listen'),
                cards: document.getElementById('color-cards-container')
            },
            number: {
                title: document.getElementById('numberfinder-title'),
                instruction: document.getElementById('numberfinder-instruction'),
                prevBtn: document.getElementById('btn-numberfinder-prev'),
                nextBtn: document.getElementById('btn-numberfinder-next'),
                roundBadge: document.getElementById('number-round-badge'),
                switchBtn: document.getElementById('btn-switch-to-colors'),
                targetDigit: document.getElementById('number-target-digit'),
                targetSpelling: document.getElementById('number-target-spelling'),
                targetVisual: document.getElementById('number-target-visual'),
                targetPrompt: document.getElementById('number-target-prompt'),
                listenBtn: document.getElementById('btn-number-listen'),
                cards: document.getElementById('number-cards-container')
            }
        };

        // --- 12. Boyama Kitabı ---
        this.coloringTitle = document.getElementById('coloring-title');
        this.coloringInstruction = document.getElementById('coloring-instruction');
        this.coloringProgress = document.getElementById('coloring-progress');
        this.coloringSvgHolder = document.getElementById('coloring-svg-holder');
        this.coloringPalette = document.getElementById('coloring-palette');
        this.btnColoringClear = document.getElementById('btn-coloring-clear');

        // --- 13. Yapboz ---
        this.jigsawTitle = document.getElementById('jigsaw-title');
        this.jigsawInstruction = document.getElementById('jigsaw-instruction');
        this.jigsawProgress = document.getElementById('jigsaw-progress');
        this.jigsawBoard = document.getElementById('jigsaw-board');
        this.jigsawTray = document.getElementById('jigsaw-tray');

        // --- 14. Melodi ---
        this.melodyTitle = document.getElementById('melody-title');
        this.melodyInstruction = document.getElementById('melody-instruction');
        this.melodyProgress = document.getElementById('melody-progress');
        this.melodyStatus = document.getElementById('melody-status');
        this.melodyXylophone = document.getElementById('melody-xylophone');
        this.btnMelodyReplay = document.getElementById('btn-melody-replay');

        // --- 15. Sepetlere Ayır ---
        this.sortingTitle = document.getElementById('sorting-title');
        this.sortingInstruction = document.getElementById('sorting-instruction');
        this.sortingProgress = document.getElementById('sorting-progress');
        this.sortingPool = document.getElementById('sorting-pool');
        this.sortingBaskets = document.getElementById('sorting-baskets');

        // Başarı Kutlama Modalı
        this.celebrationModal = document.getElementById('celebration-modal');
        this.celebrationTitle = document.getElementById('celebration-title');
        this.celebrationMessage = document.getElementById('celebration-message');
        this.btnNextCelebration = document.getElementById('btn-next-celebration');
    }

    bindEvents() {
        // Sekme Değişimi
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                soundManager.playPop();
                this.switchTab(targetTab);
            });
        });

        // Başlıktaki köpeğe dokununca yönerge tekrar söylenir (telefonda balon gizliyken de)
        const mascot = document.querySelector('.brand-mascot');
        mascot.addEventListener('click', () => {
            soundManager.playBark();
            soundManager.speak(this.getCurrentInstruction());
        });

        // Oyun menüsüne dön
        this.btnHome.addEventListener('click', () => {
            soundManager.playPop();
            this.switchTab('home');
        });

        this.btnCloseVoiceNotice.addEventListener('click', () => {
            soundManager.playPop();
            this.voiceNotice.hidden = true;
            safeStorage.set('minik_kasif_voice_notice_closed', '1');
        });

        // Ses Düğmeleri (tercih kaydedilir, bir sonraki açılışta aynı kalır)
        this.btnSoundToggle.addEventListener('click', () => {
            const active = soundManager.toggleSound();
            soundManager.playPop();
            this.showSoundState(active);
            safeStorage.set('minik_kasif_sound', active ? '1' : '0');
        });

        this.btnVoiceToggle.addEventListener('click', () => {
            const active = soundManager.toggleVoice();
            soundManager.playPop();
            this.showVoiceState(active);
            safeStorage.set('minik_kasif_voice', active ? '1' : '0');
            if (active) {
                soundManager.speak("Sesli anlatım açık!");
            }
        });

        // Tam Ekran Düğmesi
        if (this.btnFullscreen) {
            this.btnFullscreen.addEventListener('click', () => {
                soundManager.playPop();
                this.toggleFullscreen();
            });
        }

        // Dev Ekran Modu
        if (this.btnScreenScale) {
            this.btnScreenScale.addEventListener('click', () => {
                soundManager.playPop();
                this.toggleGiantScreen();
            });
        }

        // Yönergeyi Tekrar Oynat/Dinle Düğmesi
        const btnReplay = document.getElementById('btn-replay-speech');
        if (btnReplay) {
            btnReplay.addEventListener('click', () => {
                soundManager.playPop();
                soundManager.speak(this.getCurrentInstruction());
            });
        }

        // Ebeveyn Rehberi Modal
        this.btnHelp.addEventListener('click', () => {
            soundManager.playPop();
            this.dialogGuide.showModal();
        });
        this.btnCloseGuide.addEventListener('click', () => {
            soundManager.playPop();
            this.dialogGuide.close();
        });
        this.dialogGuide.addEventListener('click', (e) => {
            if (e.target === this.dialogGuide) {
                this.dialogGuide.close();
            }
        });

        // ==========================================
        // ⌨️ KLAVYE YÖN TUŞLARI DİNLEYİCİSİ
        // ==========================================
        window.addEventListener('keydown', (e) => {
            // Açık bir pencere (rehber, kutlama, kurulum yardımı) varken oyun arkada yürümesin;
            // tuşu basılı tutunca köpek/top art arda gitmesin
            if (e.repeat || document.querySelector('dialog[open]')) return;

            if (this.activeTab === 'realmaze') {
                if (['ArrowUp', 'KeyW'].includes(e.code)) {
                    e.preventDefault();
                    this.moveRealmaze('UP');
                } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
                    e.preventDefault();
                    this.moveRealmaze('DOWN');
                } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
                    e.preventDefault();
                    this.moveRealmaze('LEFT');
                } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
                    e.preventDefault();
                    this.moveRealmaze('RIGHT');
                }
            } else if (this.activeTab === 'balltoss') {
                if (['Space', 'Enter', 'ArrowUp'].includes(e.code)) {
                    e.preventDefault();
                    this.launchBall(null);
                }
            } else if (this.activeTab === 'melody' && /^Digit[1-6]$/.test(e.code)) {
                // Klavyede 1-6 rakamları ksilofon tuşlarını çalar
                const bar = this.melodyXylophone.querySelectorAll('.xylo-bar')[Number(e.code.slice(5)) - 1];
                if (bar) bar.click();
            }
        });

        // --- 1. CANLI LABİRENT ETKİNLİKLERİ ---
        this.realmazeArrowBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dir = btn.dataset.realdir;
                this.moveRealmaze(dir);
            });
        });

        this.btnResetRealmaze.addEventListener('click', () => {
            soundManager.playPop();
            this.resetRealmazePosition();
        });

        this.realmazePrevBtn.addEventListener('click', () => {
            if (this.realmazeLevelIdx > 0) {
                soundManager.playPop();
                this.realmazeLevelIdx--;
                this.loadRealmazeLevel(this.realmazeLevelIdx);
            }
        });

        this.realmazeNextBtn.addEventListener('click', () => {
            if (this.realmazeLevelIdx < window.GAME_DATA.REALTIME_MAZE_LEVELS.length - 1) {
                soundManager.playPop();
                this.realmazeLevelIdx++;
                this.loadRealmazeLevel(this.realmazeLevelIdx);
            }
        });

        // --- 2. TOP ATMA ETKİNLİKLERİ ---
        // Buton / Boşluk tuşu: düz yukarı at. Arenaya dokunmak: o noktaya at.
        // Topu kaydırmak: kaydırma yönüne at (aşağı çekip bırakırsan sapan gibi ters yöne).
        this.btnLaunchBall.addEventListener('click', () => {
            this.launchBall(null);
        });

        this.balltossArena.addEventListener('pointerdown', (e) => this.handleTossPointerDown(e));
        window.addEventListener('pointermove', (e) => this.handleTossPointerMove(e));
        window.addEventListener('pointerup', (e) => this.handleTossPointerUp(e));
        window.addEventListener('pointercancel', () => this.cancelTossDrag());

        this.balltossPrevBtn.addEventListener('click', () => {
            if (this.ballTossLevelIdx > 0) {
                soundManager.playPop();
                this.ballTossLevelIdx--;
                this.loadBallTossLevel(this.ballTossLevelIdx);
            }
        });

        this.balltossNextBtn.addEventListener('click', () => {
            if (this.ballTossLevelIdx < window.GAME_DATA.BALL_TOSS_LEVELS.length - 1) {
                soundManager.playPop();
                this.ballTossLevelIdx++;
                this.loadBallTossLevel(this.ballTossLevelIdx);
            }
        });

        // --- 3. SABUN KÖPÜĞÜ ETKİNLİKLERİ ---
        this.bubblesPrevBtn.addEventListener('click', () => {
            if (this.bubblesLevelIdx > 0) {
                soundManager.playPop();
                this.bubblesLevelIdx--;
                this.loadBubblesLevel(this.bubblesLevelIdx);
            }
        });

        this.bubblesNextBtn.addEventListener('click', () => {
            if (this.bubblesLevelIdx < window.GAME_DATA.SOAP_BUBBLE_LEVELS.length - 1) {
                soundManager.playPop();
                this.bubblesLevelIdx++;
                this.loadBubblesLevel(this.bubblesLevelIdx);
            }
        });

        // --- 4. TAVŞAN KODLAMA ETKİNLİKLERİ ---
        this.arrowBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.isRunning) return;
                const dir = btn.dataset.direction;
                this.addCommand(dir);
            });
        });

        this.btnRunCode.addEventListener('click', () => {
            if (this.isRunning) return;
            this.executeCommands();
        });

        this.btnClearCode.addEventListener('click', () => {
            if (this.isRunning) return;
            soundManager.playWhoosh();
            this.commands = [];
            this.renderCommandTrain();
        });

        this.btnResetBunny.addEventListener('click', () => {
            if (this.isRunning) return;
            soundManager.playPop();
            this.resetBunnyPosition();
        });

        this.bunnyPrevLevelBtn.addEventListener('click', () => {
            if (this.bunnyLevelIdx > 0) {
                soundManager.playPop();
                this.bunnyLevelIdx--;
                this.loadBunnyLevel(this.bunnyLevelIdx);
            }
        });

        this.bunnyNextLevelBtn.addEventListener('click', () => {
            if (this.bunnyLevelIdx < window.GAME_DATA.BUNNY_LEVELS.length - 1) {
                soundManager.playPop();
                this.bunnyLevelIdx++;
                this.loadBunnyLevel(this.bunnyLevelIdx);
            }
        });

        // --- 5. BALON ETKİNLİKLERİ ---
        this.balloonPrevBtn.addEventListener('click', () => {
            if (this.balloonLevelIdx > 0) {
                soundManager.playPop();
                this.balloonLevelIdx--;
                this.loadBalloonLevel(this.balloonLevelIdx);
            }
        });

        this.balloonNextBtn.addEventListener('click', () => {
            if (this.balloonLevelIdx < window.GAME_DATA.BALLOON_LEVELS.length - 1) {
                soundManager.playPop();
                this.balloonLevelIdx++;
                this.loadBalloonLevel(this.balloonLevelIdx);
            }
        });

        // --- 6. ŞEKİL ETKİNLİKLERİ ---
        this.shapePrevBtn.addEventListener('click', () => {
            if (this.shapeLevelIdx > 0) {
                soundManager.playPop();
                this.shapeLevelIdx--;
                this.loadShapeLevel(this.shapeLevelIdx);
            }
        });

        this.shapeNextBtn.addEventListener('click', () => {
            if (this.shapeLevelIdx < window.GAME_DATA.SHAPE_MATCH_LEVELS.length - 1) {
                soundManager.playPop();
                this.shapeLevelIdx++;
                this.loadShapeLevel(this.shapeLevelIdx);
            }
        });

        // --- 7. HAFIZA ETKİNLİKLERİ ---
        this.memoryPrevBtn.addEventListener('click', () => {
            if (this.memoryLevelIdx > 0) {
                soundManager.playPop();
                this.memoryLevelIdx--;
                this.loadMemoryLevel(this.memoryLevelIdx);
            }
        });

        this.memoryNextBtn.addEventListener('click', () => {
            if (this.memoryLevelIdx < window.GAME_DATA.MEMORY_LEVELS.length - 1) {
                soundManager.playPop();
                this.memoryLevelIdx++;
                this.loadMemoryLevel(this.memoryLevelIdx);
            }
        });

        // --- 8. ÖRÜNTÜ ETKİNLİKLERİ ---
        this.patternPrevBtn.addEventListener('click', () => {
            if (this.patternLevelIdx > 0) {
                soundManager.playPop();
                this.patternLevelIdx--;
                this.loadPatternLevel(this.patternLevelIdx);
            }
        });

        this.patternNextBtn.addEventListener('click', () => {
            if (this.patternLevelIdx < window.GAME_DATA.PATTERN_LEVELS.length - 1) {
                soundManager.playPop();
                this.patternLevelIdx++;
                this.loadPatternLevel(this.patternLevelIdx);
            }
        });

        // --- 9. BOYUT ETKİNLİKLERİ ---
        this.sizePrevBtn.addEventListener('click', () => {
            if (this.sizeLevelIdx > 0) {
                soundManager.playPop();
                this.sizeLevelIdx--;
                this.loadSizeLevel(this.sizeLevelIdx);
            }
        });

        this.sizeNextBtn.addEventListener('click', () => {
            if (this.sizeLevelIdx < window.GAME_DATA.SIZE_LEVELS.length - 1) {
                soundManager.playPop();
                this.sizeLevelIdx++;
                this.loadSizeLevel(this.sizeLevelIdx);
            }
        });

        this.btnResetSize.addEventListener('click', () => {
            soundManager.playWhoosh();
            this.resetSizeLevel();
        });

        // --- 10-11. RENK & SAYI BULUCU ETKİNLİKLERİ ---
        ['color', 'number'].forEach(kind => {
            const ui = this.finderUI[kind];
            const { levels } = this.getFinderConfig(kind);

            ui.prevBtn.addEventListener('click', () => {
                const state = this.finderState[kind];
                if (state.levelIdx > 0) {
                    soundManager.playPop();
                    this.loadFinderLevel(kind, state.levelIdx - 1);
                }
            });

            ui.nextBtn.addEventListener('click', () => {
                const state = this.finderState[kind];
                if (state.levelIdx < levels.length - 1) {
                    soundManager.playPop();
                    this.loadFinderLevel(kind, state.levelIdx + 1);
                }
            });

            ui.switchBtn.addEventListener('click', () => {
                soundManager.playPop();
                this.switchTab(kind === 'color' ? 'numberfinder' : 'colorfinder');
            });

            // Hedef rengi/sayıyı tekrar dinle (oyun mikrofonsuz: çocuk dinler ve karta dokunur)
            // (Eski önbellekten gelen bir sayfada düğme yoksa açılış çökmesin)
            if (ui.listenBtn) ui.listenBtn.addEventListener('click', () => {
                soundManager.playPop();
                soundManager.speak(this.getFinderRoundPrompt(kind));
            });
        });

        // --- 12-15. YENİ MODÜLLERİN ÖNCEKİ / SONRAKİ DÜĞMELERİ ---
        Object.entries(this.extraModules).forEach(([key, mod]) => {
            document.getElementById(`btn-${key}-prev`).addEventListener('click', () => {
                if (this[mod.idxKey] > 0) {
                    soundManager.playPop();
                    mod.load(this[mod.idxKey] - 1);
                }
            });
            document.getElementById(`btn-${key}-next`).addEventListener('click', () => {
                if (this[mod.idxKey] < mod.levels().length - 1) {
                    soundManager.playPop();
                    mod.load(this[mod.idxKey] + 1);
                }
            });
        });

        this.btnColoringClear.addEventListener('click', () => {
            soundManager.playWhoosh();
            this.clearColoringPage();
        });

        this.btnMelodyReplay.addEventListener('click', () => {
            if (this.melodyBusy) return;
            soundManager.playPop();
            this.playMelodySequence();
        });

        // Başarı modalı kapatma/ilerleme
        this.btnNextCelebration.addEventListener('click', () => {
            soundManager.playPop();
            this.celebrationModal.close();
            this.handleCelebrationNext();
        });
    }

    toggleFullscreen() {
        if (!this.requestFullscreenFn) return;
        if (!(document.fullscreenElement || document.webkitFullscreenElement)) {
            Promise.resolve(this.requestFullscreenFn.call(document.documentElement)).catch(err => {
                console.log("Fullscreen request error:", err);
            });
        } else {
            const exit = document.exitFullscreen || document.webkitExitFullscreen;
            if (exit) exit.call(document);
        }
    }

    showSoundState(active) {
        this.btnSoundToggle.classList.toggle('muted', !active);
        this.btnSoundToggle.setAttribute('aria-label', active ? 'Ses Açık' : 'Ses Kapalı');
        this.btnSoundToggle.querySelector('.btn-icon').textContent = active ? '🔊' : '🔇';
    }

    showVoiceState(active) {
        this.btnVoiceToggle.classList.toggle('muted', !active);
        this.btnVoiceToggle.setAttribute('aria-label', active ? 'Sesli Anlatım Açık' : 'Sesli Anlatım Kapalı');
        this.btnVoiceToggle.querySelector('.btn-icon').textContent = active ? '🗣️' : '🤫';
    }

    toggleGiantScreen() {
        const isGiant = document.body.classList.toggle('giant-screen-active');
        this.updatePlayAreaHeight();
        safeStorage.set('minik_kasif_giant_mode', isGiant ? '1' : '0');
        if (this.btnScreenScale) {
            this.btnScreenScale.classList.toggle('active-mode', isGiant);
            this.btnScreenScale.querySelector('.btn-icon').textContent = isGiant ? '🔎' : '🔍';
        }
    }

    getCurrentInstruction() {
        if (this.activeTab === 'realmaze' && window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx]) {
            return window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx].instruction;
        }
        if (this.activeTab === 'balltoss' && window.GAME_DATA.BALL_TOSS_LEVELS[this.ballTossLevelIdx]) {
            return window.GAME_DATA.BALL_TOSS_LEVELS[this.ballTossLevelIdx].instruction;
        }
        if (this.activeTab === 'bubbles' && window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx]) {
            return window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx].instruction;
        }
        if (this.activeTab === 'bunny' && window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx]) {
            return window.GAME_DATA.BUNNY_LEVELS[this.bunnyLevelIdx].instruction;
        }
        if (this.activeTab === 'balloon' && window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx]) {
            return window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx].instruction;
        }
        if (this.activeTab === 'shape' && window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx]) {
            return window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx].instruction;
        }
        if (this.activeTab === 'memory' && window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx]) {
            return window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx].instruction;
        }
        if (this.activeTab === 'pattern' && window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx]) {
            return window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx].instruction;
        }
        if (this.activeTab === 'size' && window.GAME_DATA.SIZE_LEVELS[this.sizeLevelIdx]) {
            return window.GAME_DATA.SIZE_LEVELS[this.sizeLevelIdx].instruction;
        }
        const finderKind = this.getActiveFinderKind();
        if (finderKind) {
            return this.getFinderRoundPrompt(finderKind);
        }
        if (this.activeTab === 'home') {
            return "Hangi oyunu oynamak istersin? Bir resme dokun!";
        }
        const extra = this.extraModules[this.activeTab];
        if (extra) {
            return extra.levels()[this[extra.idxKey]].instruction;
        }
        return "Hadi oyuna başlayalım!";
    }

    switchTab(tabName) {
        // Balon & Köpük zamanlayıcılarını durdur
        if (this.activeTab === 'balloon' && tabName !== 'balloon') {
            this.stopBalloonSpawner();
        }
        if (this.activeTab === 'bubbles' && tabName !== 'bubbles') {
            this.stopBubblesSpawner();
        }
        if (this.activeTab === 'balltoss' && tabName !== 'balltoss') {
            this.stopTossTargetLoop();
            this.cancelTossDrag();
        }
        if (this.activeTab === 'melody' && tabName !== 'melody') {
            this.melodyToken++; // Çalmakta olan melodiyi durdur
            this.melodyBusy = false;
        }

        this.levelEpoch++;
        this.activeTab = tabName;

        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        Object.keys(this.tabViews).forEach(key => {
            if (this.tabViews[key]) {
                this.tabViews[key].classList.toggle('active', key === tabName);
            }
        });

        document.body.classList.toggle('on-home', tabName === 'home');
        window.scrollTo(0, 0);
        // Görünüm açıldıktan sonra bölüm kartı ölçülebilir; tahtalar buna göre boyutlanır
        this.updatePlayAreaHeight();

        if (tabName === 'home') {
            soundManager.speak(this.getCurrentInstruction());
        } else if (tabName === 'realmaze') {
            this.loadRealmazeLevel(this.realmazeLevelIdx);
        } else if (tabName === 'balltoss') {
            this.loadBallTossLevel(this.ballTossLevelIdx);
        } else if (tabName === 'bubbles') {
            this.loadBubblesLevel(this.bubblesLevelIdx);
        } else if (tabName === 'bunny') {
            this.loadBunnyLevel(this.bunnyLevelIdx);
        } else if (tabName === 'balloon') {
            this.loadBalloonLevel(this.balloonLevelIdx);
        } else if (tabName === 'shape') {
            this.loadShapeLevel(this.shapeLevelIdx);
        } else if (tabName === 'memory') {
            this.loadMemoryLevel(this.memoryLevelIdx);
        } else if (tabName === 'pattern') {
            this.loadPatternLevel(this.patternLevelIdx);
        } else if (tabName === 'size') {
            this.loadSizeLevel(this.sizeLevelIdx);
        } else if (tabName === 'colorfinder') {
            this.loadFinderLevel('color', this.finderState.color.levelIdx);
        } else if (tabName === 'numberfinder') {
            this.loadFinderLevel('number', this.finderState.number.levelIdx);
        } else if (this.extraModules[tabName]) {
            const mod = this.extraModules[tabName];
            mod.load(this[mod.idxKey]);
        }
    }

    addStar(count = 1) {
        this.totalStars += count;
        safeStorage.set('minik_kasif_stars', this.totalStars);
        this.updateStarDisplay();
    }

    // Bekleyip kutlama penceresini açar; bu arada sekme ya da bölüm değiştiyse (çocuk 🏠'a
    // bastı, başka bölüme geçti) açmaz — aksi halde pencere yanlış oyunu ilerletirdi
    async celebrateAfter(delayMs, title, message) {
        const epoch = this.levelEpoch;
        await this.sleep(delayMs);
        if (epoch !== this.levelEpoch) return false;
        this.showCelebrationModal(title, message);
        return true;
    }

    updateStarDisplay() {
        this.totalStarsEl.textContent = this.totalStars;
    }

    // ==========================================
    // 🐶 MODÜL 1: CANLI YÖN TUŞLU LABİRENT
    // ==========================================

    loadRealmazeLevel(idx) {
        this.levelEpoch++;
        this.realmazeLevelIdx = idx;
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[idx];

        this.realmazeTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.realmazeInstruction.textContent = level.instruction;

        this.realmazePrevBtn.disabled = (idx === 0);
        this.realmazeNextBtn.disabled = (idx === window.GAME_DATA.REALTIME_MAZE_LEVELS.length - 1);

        this.resetRealmazePosition();
        soundManager.speak(level.instruction);
    }

    resetRealmazePosition() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        this.realmazePlayer = { ...level.start, facing: 'right' };
        this.realmazeStars.clear();
        this.realmazeFinished = false;
        this.updateRealmazeStarsUI();
        this.renderRealmazeGrid();
    }

    updateRealmazeStarsUI() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        this.realmazeStarsBadge.textContent = `⭐ ${this.realmazeStars.size} / ${level.stars.length} Toplandı`;
    }

    renderRealmazeGrid() {
        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        const { cols, rows } = level;

        this.realmazeGrid.innerHTML = '';
        this.realmazeGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
        this.realmazeGrid.style.gridTemplateRows = `repeat(${rows}, minmax(0, 1fr))`;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';

                // Başlangıç Karesi
                if (x === level.start.x && y === level.start.y) {
                    cell.classList.add('start-tile');
                }

                // Çıkış ve Kemik Hedefi 🦴
                if (x === level.goal.x && y === level.goal.y) {
                    const goal = document.createElement('div');
                    goal.className = 'tile-item item-carrot';
                    goal.innerHTML = '<span class="item-emoji">🦴</span>';
                    cell.appendChild(goal);
                }

                // Çit / Duvar Engelleri 🌳
                const isWall = level.walls.some(w => w.x === x && w.y === y);
                if (isWall) {
                    cell.classList.add('realmaze-wall-cell');
                    const wall = document.createElement('div');
                    wall.className = 'tile-item item-obstacle item-bush';
                    wall.innerHTML = '<span class="item-emoji">🌳</span>';
                    cell.appendChild(wall);
                }

                // Yıldız Ödülleri ⭐
                const isStar = level.stars.some(s => s.x === x && s.y === y);
                if (isStar && !this.realmazeStars.has(`${x},${y}`)) {
                    const starEl = document.createElement('div');
                    starEl.className = 'tile-item item-star';
                    starEl.innerHTML = '<span class="item-emoji">⭐</span>';
                    cell.appendChild(starEl);
                }

                // Canlı Köpekçik Karakteri 🐶
                if (x === this.realmazePlayer.x && y === this.realmazePlayer.y) {
                    const puppy = document.createElement('div');
                    puppy.className = `bunny-avatar facing-${this.realmazePlayer.facing}`;
                    puppy.id = 'realmaze-puppy';
                    puppy.innerHTML = `
                        <div class="bunny-inner">
                            <span class="bunny-emoji">🐶</span>
                        </div>
                    `;
                    cell.appendChild(puppy);
                }

                this.realmazeGrid.appendChild(cell);
            }
        }
    }

    async moveRealmaze(dir) {
        if (this.realmazeFinished) return;

        const level = window.GAME_DATA.REALTIME_MAZE_LEVELS[this.realmazeLevelIdx];
        let nextX = this.realmazePlayer.x;
        let nextY = this.realmazePlayer.y;
        let facing = this.realmazePlayer.facing;

        if (dir === 'UP') { nextY--; facing = 'up'; }
        else if (dir === 'DOWN') { nextY++; facing = 'down'; }
        else if (dir === 'LEFT') { nextX--; facing = 'left'; }
        else if (dir === 'RIGHT') { nextX++; facing = 'right'; }

        this.realmazePlayer.facing = facing;

        // Sınır Kontrolü
        if (nextX < 0 || nextX >= level.cols || nextY < 0 || nextY >= level.rows) {
            soundManager.playObstacle();
            return;
        }

        // Çit / Duvar Kontrolü
        const hitWall = level.walls.some(w => w.x === nextX && w.y === nextY);
        if (hitWall) {
            soundManager.playObstacle();
            const puppyEl = document.getElementById('realmaze-puppy');
            if (puppyEl) puppyEl.classList.add('bunny-wobble');
            setTimeout(() => { if (puppyEl) puppyEl.classList.remove('bunny-wobble'); }, 400);
            return;
        }

        // Güvenli Adım: Köpekçiği İlerlet
        this.realmazePlayer.x = nextX;
        this.realmazePlayer.y = nextY;
        soundManager.playHop();
        this.renderRealmazeGrid();

        // Yıldız Toplama
        const starKey = `${nextX},${nextY}`;
        const starTile = level.stars.find(s => s.x === nextX && s.y === nextY);
        if (starTile && !this.realmazeStars.has(starKey)) {
            this.realmazeStars.add(starKey);
            soundManager.playStar();
            this.addStar(1);
            this.updateRealmazeStarsUI();
            this.renderRealmazeGrid();
        }

        // Kemik / Çıkış Hedefine Ulaştı mı?
        if (nextX === level.goal.x && nextY === level.goal.y) {
            this.realmazeFinished = true;
            soundManager.playBark();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            const puppyEl = document.getElementById('realmaze-puppy');
            if (puppyEl) puppyEl.classList.add('bunny-dance');

            soundManager.speak("Aferin sana! Kemik ödülünü yakaladın!");

            this.celebrateAfter(900,
                "Labirent Şampiyonu! 🐶🦴⭐",
                `Köpekçik kemiğine ulaştı, ${level.id}. bölüm tamam!`
            );
        }
    }

    // ==========================================
    // 🏀 MODÜL 2: NEŞELİ TOP ATMA & BASKET
    // ==========================================

    loadBallTossLevel(idx) {
        this.levelEpoch++;
        this.ballTossLevelIdx = idx;
        const level = window.GAME_DATA.BALL_TOSS_LEVELS[idx];
        this.ballTossScore = 0;
        this.isTossLaunching = false;

        this.balltossTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.balltossInstruction.textContent = level.instruction;

        this.targetEmojiDisplay.textContent = level.targetEmoji;
        this.targetLabelDisplay.textContent = level.targetLabel;
        this.ballAmmoEmoji.textContent = level.ballEmoji;

        this.balltossPrevBtn.disabled = (idx === 0);
        this.balltossNextBtn.disabled = (idx === window.GAME_DATA.BALL_TOSS_LEVELS.length - 1);

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

    // ==========================================
    // 🧼 MODÜL 3: SİHİRLİ SABUN KÖPÜĞÜ PATLATMA
    // ==========================================

    loadBubblesLevel(idx) {
        this.levelEpoch++;
        this.bubblesLevelIdx = idx;
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[idx];
        this.bubblesPoppedScore = 0;

        this.bubblesTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.bubblesInstruction.textContent = level.instruction;

        this.bubblesPrevBtn.disabled = (idx === 0);
        this.bubblesNextBtn.disabled = (idx === window.GAME_DATA.SOAP_BUBBLE_LEVELS.length - 1);

        this.updateBubblesScoreUI();
        this.startBubblesSpawner();

        soundManager.speak(level.instruction);
    }

    updateBubblesScoreUI() {
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        this.bubblesScoreBadge.textContent = `🧼 ${this.bubblesPoppedScore} / ${level.targetCount} Kurtarıldı`;
    }

    startBubblesSpawner() {
        this.stopBubblesSpawner();
        this.bubblesPond.innerHTML = '';
        this.bubblesChestItems.innerHTML = '<span class="chest-empty-hint">Köpükleri patlatınca sürprizler buraya gelecek! ✨</span>';
        this.activeBubbles = [];

        // İlk 4 baloncuk hemen çıksın
        for (let i = 0; i < 4; i++) {
            this.spawnSoapBubble();
        }

        this.bubblesSpawnTimer = setInterval(() => {
            // Uygulama arka plandayken yeni köpük çıkmasın (dönünce kaldığı yerden sürer)
            if (document.hidden) return;
            if (this.activeBubbles.length < 8) {
                this.spawnSoapBubble();
            }
        }, 1300);
    }

    stopBubblesSpawner() {
        if (this.bubblesSpawnTimer) {
            clearInterval(this.bubblesSpawnTimer);
            this.bubblesSpawnTimer = null;
        }
        this.activeBubbles.forEach(b => {
            if (b.parentNode) b.parentNode.removeChild(b);
        });
        this.activeBubbles = [];
    }

    spawnSoapBubble() {
        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        const surprise = level.surprises[Math.floor(Math.random() * level.surprises.length)];

        const bubble = document.createElement('div');
        bubble.className = 'magic-soap-bubble';

        // Yatay rastgele konum (%8 - %88)
        const leftPercent = 8 + Math.random() * 80;
        bubble.style.left = `${leftPercent}%`;
        bubble.style.bottom = '-140px';

        bubble.innerHTML = `
            <div class="bubble-sheen-shine"></div>
            <div class="bubble-surprise-inside">${surprise.symbol}</div>
        `;

        const duration = 6.5 + Math.random() * 4;
        bubble.style.animation = `soapBubbleFloat ${duration}s linear infinite`;

        const popHandler = (e) => {
            e.stopPropagation();
            this.popSoapBubble(bubble, surprise);
        };
        bubble.addEventListener('pointerdown', popHandler);

        this.bubblesPond.appendChild(bubble);
        this.activeBubbles.push(bubble);
    }

    async popSoapBubble(bubbleEl, surprise) {
        soundManager.playBubblePlop();

        this.activeBubbles = this.activeBubbles.filter(b => b !== bubbleEl);
        bubbleEl.classList.add('soap-bubble-popped');

        // Sesli isimlendirme
        soundManager.speak(surprise.label);

        // Sandığa oyuncak ekle
        const emptyHint = this.bubblesChestItems.querySelector('.chest-empty-hint');
        if (emptyHint) {
            this.bubblesChestItems.innerHTML = '';
        }

        const toyEl = document.createElement('div');
        toyEl.className = 'chest-toy-item';
        toyEl.innerHTML = `<span>${surprise.symbol}</span>`;
        this.bubblesChestItems.appendChild(toyEl);

        this.bubblesPoppedScore++;
        this.updateBubblesScoreUI();

        const level = window.GAME_DATA.SOAP_BUBBLE_LEVELS[this.bubblesLevelIdx];
        if (this.bubblesPoppedScore >= level.targetCount) {
            this.stopBubblesSpawner();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.celebrateAfter(800,
                "Sihirli Köpük Ustası! 🧼✨",
                `Tüm gizli sürprizleri sandığına topladın!`
            );
        }

        setTimeout(() => {
            if (bubbleEl.parentNode) {
                bubbleEl.parentNode.removeChild(bubbleEl);
            }
        }, 300);
    }

    // ==========================================
    // 🥕 MODÜL 4: TAVŞANCIK HAVUÇ PEŞİNDE (KODLAMA)
    // ==========================================

    loadBunnyLevel(idx) {
        this.levelEpoch++;
        this.bunnyLevelIdx = idx;
        const level = window.GAME_DATA.BUNNY_LEVELS[idx];

        this.bunnyLevelTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.bunnyInstruction.textContent = level.instruction;

        this.bunnyPrevLevelBtn.disabled = (idx === 0);
        this.bunnyNextLevelBtn.disabled = (idx === window.GAME_DATA.BUNNY_LEVELS.length - 1);

        this.commands = [];
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
        this.btnRunCode.disabled = disabled;
        this.btnClearCode.disabled = disabled;
        this.btnResetBunny.disabled = disabled;
        this.arrowBtns.forEach(btn => btn.disabled = disabled);
        // Yürüyüş sürerken bölüm değiştirilemez; bitince ilk/son bölüm sınırları geri gelir
        const lastIdx = window.GAME_DATA.BUNNY_LEVELS.length - 1;
        this.bunnyPrevLevelBtn.disabled = disabled || this.bunnyLevelIdx === 0;
        this.bunnyNextLevelBtn.disabled = disabled || this.bunnyLevelIdx === lastIdx;
    }

    // ==========================================
    // 🎈 MODÜL 5: BALON PATLATMA
    // ==========================================

    loadBalloonLevel(idx) {
        this.levelEpoch++;
        this.balloonLevelIdx = idx;
        const level = window.GAME_DATA.BALLOON_LEVELS[idx];
        this.balloonScore = 0;

        this.balloonTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.balloonInstruction.textContent = level.instruction;

        this.balloonPrevBtn.disabled = (idx === 0);
        this.balloonNextBtn.disabled = (idx === window.GAME_DATA.BALLOON_LEVELS.length - 1);

        this.updateBalloonScoreUI();
        this.startBalloonSpawner();

        soundManager.speak(level.instruction);
    }

    updateBalloonScoreUI() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];
        this.balloonScoreBadge.textContent = `🎯 ${this.balloonScore} / ${level.targetCount}`;
    }

    startBalloonSpawner() {
        this.stopBalloonSpawner();
        this.balloonSky.innerHTML = '';
        this.activeBalloons = [];

        for (let i = 0; i < 3; i++) {
            this.spawnBalloon();
        }

        this.balloonInterval = setInterval(() => {
            // Uygulama arka plandayken yeni balon çıkmasın (dönünce kaldığı yerden sürer)
            if (document.hidden) return;
            if (this.activeBalloons.length < 7) {
                this.spawnBalloon();
            }
        }, 1200);
    }

    stopBalloonSpawner() {
        if (this.balloonInterval) {
            clearInterval(this.balloonInterval);
            this.balloonInterval = null;
        }
        this.activeBalloons.forEach(b => {
            if (b.element && b.element.parentNode) {
                b.element.parentNode.removeChild(b.element);
            }
        });
        this.activeBalloons = [];
    }

    spawnBalloon() {
        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];

        let balloonData = {};
        if (level.mode === 'numbers') {
            const item = level.items[Math.floor(Math.random() * level.items.length)];
            const randomColor = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][Math.floor(Math.random() * 5)];
            balloonData = {
                type: 'number',
                text: item.label,
                speech: item.speech,
                color: randomColor
            };
        } else {
            const c = level.colors[Math.floor(Math.random() * level.colors.length)];
            balloonData = {
                type: 'color',
                name: c.name,
                color: c.hex,
                emoji: c.emoji
            };
        }

        const el = document.createElement('div');
        el.className = 'floating-balloon';
        el.style.backgroundColor = balloonData.color;

        const leftPercent = 10 + Math.random() * 75;
        el.style.left = `${leftPercent}%`;
        el.style.bottom = '-120px';

        if (balloonData.type === 'number') {
            el.innerHTML = `<span class="balloon-label">${balloonData.text}</span><div class="balloon-string"></div>`;
        } else {
            el.innerHTML = `<span class="balloon-emoji">${balloonData.emoji}</span><div class="balloon-string"></div>`;
        }

        const speed = 7 + Math.random() * 4;
        el.style.animation = `balloonFloat ${speed}s linear infinite`;

        const popHandler = (e) => {
            e.stopPropagation();
            this.popBalloon(el, balloonData);
        };
        el.addEventListener('pointerdown', popHandler);

        this.balloonSky.appendChild(el);
        this.activeBalloons.push({ element: el, data: balloonData });
    }

    async popBalloon(balloonEl, data) {
        soundManager.playBalloonPop();

        this.activeBalloons = this.activeBalloons.filter(b => b.element !== balloonEl);
        balloonEl.classList.add('balloon-popped');

        const level = window.GAME_DATA.BALLOON_LEVELS[this.balloonLevelIdx];

        if (data.type === 'number') {
            soundManager.speak(data.speech);
        } else {
            soundManager.speak(data.name);
        }

        let isCorrect = true;
        if (level.mode === 'color_filter') {
            if (data.name !== level.targetColor) {
                isCorrect = false;
                soundManager.speak(`Bu ${data.name}! ${level.targetColor} balonu bulalım!`);
            }
        }

        if (isCorrect) {
            this.balloonScore++;
            this.updateBalloonScoreUI();

            if (this.balloonScore >= level.targetCount) {
                this.stopBalloonSpawner();
                soundManager.playSuccess();
                this.triggerConfetti();
                this.addStar(2);

                this.celebrateAfter(700,
                    "Müthiş Balon Avcısı! 🎈⭐",
                    `Bütün balonları patlattın, ${level.id}. bölüm tamam!`
                );
            }
        }

        setTimeout(() => {
            if (balloonEl.parentNode) {
                balloonEl.parentNode.removeChild(balloonEl);
            }
        }, 300);
    }

    // ==========================================
    // 🧩 MODÜL 6: ŞEKİL VE GÖLGE EŞLEŞTİRME
    // ==========================================

    loadShapeLevel(idx) {
        this.levelEpoch++;
        this.shapeLevelIdx = idx;
        const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[idx];
        this.selectedShapeItem = null;
        this.matchedShapesCount = 0;

        this.shapeTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.shapeInstruction.textContent = level.instruction;

        this.shapePrevBtn.disabled = (idx === 0);
        this.shapeNextBtn.disabled = (idx === window.GAME_DATA.SHAPE_MATCH_LEVELS.length - 1);

        this.renderShapeGame();
        soundManager.speak(level.instruction);
    }

    renderShapeGame() {
        const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx];

        this.shapeSilhouettesContainer.innerHTML = '';
        this.shapePiecesContainer.innerHTML = '';

        // Gölge, nesnenin kendi emojisinden CSS ile üretilir (siyah siluet): her nesnenin gölgesi
        // gerçekten kendine benzer. Cevabı söyleyen yazı yalnızca eşleşince görünür.
        this.shuffleArray(level.items).forEach(item => {
            const silSlot = document.createElement('div');
            silSlot.className = 'silhouette-slot';
            silSlot.dataset.id = item.id;
            silSlot.setAttribute('aria-label', 'Gölge');
            silSlot.innerHTML = `
                <div class="silhouette-icon">${item.symbol}</div>
                <div class="slot-hint">?</div>
            `;

            silSlot.addEventListener('click', () => {
                if (this.selectedShapeItem) {
                    this.tryMatchShape(this.selectedShapeItem, silSlot, item);
                }
            });

            this.shapeSilhouettesContainer.appendChild(silSlot);
        });

        this.shuffleArray(level.items).forEach(item => {
            const piece = document.createElement('div');
            piece.className = 'shape-piece-card';
            piece.dataset.id = item.id;
            piece.innerHTML = `
                <div class="piece-symbol">${item.symbol}</div>
                <div class="piece-label">${item.label}</div>
            `;

            piece.addEventListener('click', () => {
                soundManager.playPop();
                document.querySelectorAll('.shape-piece-card').forEach(p => p.classList.remove('selected-piece'));
                piece.classList.add('selected-piece');
                this.selectedShapeItem = item;
            });

            this.shapePiecesContainer.appendChild(piece);
        });
    }

    async tryMatchShape(selectedItem, slotEl, targetItem) {
        if (selectedItem.id === targetItem.id) {
            soundManager.playMatch();
            this.matchedShapesCount++;

            slotEl.classList.add('slot-matched');
            slotEl.innerHTML = `
                <div class="matched-symbol">${selectedItem.symbol}</div>
                <div class="slot-hint matched-hint">${selectedItem.label} ✓</div>
            `;

            const pieceEl = this.shapePiecesContainer.querySelector(`[data-id="${selectedItem.id}"]`);
            if (pieceEl) {
                pieceEl.classList.add('piece-placed');
            }

            this.selectedShapeItem = null;
            soundManager.speak(`${selectedItem.label} bulundu!`);

            const level = window.GAME_DATA.SHAPE_MATCH_LEVELS[this.shapeLevelIdx];
            if (this.matchedShapesCount === level.items.length) {
                soundManager.playSuccess();
                this.triggerConfetti();
                this.addStar(2);

                this.celebrateAfter(900,
                    "Şekil Ustası! 🧩✨",
                    "Bütün nesneleri gölgeleriyle kusursuz eşleştirdin!"
                );
            }
        } else {
            soundManager.playObstacle();
            slotEl.classList.add('slot-error');
            soundManager.speak("Farklı bir gölge gibi, hadi tekrar bakalım!");
            setTimeout(() => {
                slotEl.classList.remove('slot-error');
            }, 600);
        }
    }

    // ==========================================
    // 🧠 MODÜL 7: SEVİMLİ HAFIZA KARTLARI
    // ==========================================

    // Yatay ekranda 4 kart tek sıra, 6 kart 3×2; dikey ekranda 2 sütun.
    // Kart boyu CSS'te bu satır/sütun sayısına göre ekrana sığacak şekilde hesaplanır.
    applyMemoryGrid(cardCount) {
        const isLandscape = window.innerWidth >= window.innerHeight;
        const cols = isLandscape ? (cardCount === 4 ? 4 : 3) : 2;
        const rows = Math.ceil(cardCount / cols);
        this.memoryBoard.style.gridTemplateColumns = `repeat(${cols}, auto)`;
        this.memoryBoard.style.setProperty('--mem-cols', cols);
        this.memoryBoard.style.setProperty('--mem-rows', rows);
    }

    loadMemoryLevel(idx) {
        this.levelEpoch++;
        this.memoryLevelIdx = idx;
        const level = window.GAME_DATA.MEMORY_LEVELS[idx];
        this.flippedCards = [];
        this.matchedPairsCount = 0;
        this.memoryLock = false;

        this.memoryTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.memoryInstruction.textContent = level.instruction;

        this.memoryPrevBtn.disabled = (idx === 0);
        this.memoryNextBtn.disabled = (idx === window.GAME_DATA.MEMORY_LEVELS.length - 1);

        this.renderMemoryBoard();
        soundManager.speak(level.instruction);
    }

    renderMemoryBoard() {
        const level = window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx];
        this.memoryBoard.innerHTML = '';

        const cardsData = [];
        level.pairs.forEach(pair => {
            cardsData.push({ ...pair, uid: `${pair.id}_1` });
            cardsData.push({ ...pair, uid: `${pair.id}_2` });
        });
        cardsData.sort(() => Math.random() - 0.5);

        this.applyMemoryGrid(cardsData.length);

        cardsData.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'memory-card';
            cardEl.dataset.id = card.id;
            cardEl.dataset.uid = card.uid;

            cardEl.innerHTML = `
                <div class="card-face card-back">
                    <span class="card-back-mark">❓</span>
                </div>
                <div class="card-face card-front">
                    <span class="memory-symbol">${card.symbol}</span>
                    <span class="memory-label">${card.label}</span>
                </div>
            `;

            cardEl.addEventListener('click', () => {
                this.handleMemoryCardClick(cardEl, card);
            });

            this.memoryBoard.appendChild(cardEl);
        });
    }

    async handleMemoryCardClick(cardEl, card) {
        if (this.memoryLock) return;
        if (cardEl.classList.contains('is-flipped') || cardEl.classList.contains('is-matched')) return;

        soundManager.playCardFlip();
        cardEl.classList.add('is-flipped');
        this.flippedCards.push({ element: cardEl, data: card });

        if (this.flippedCards.length === 2) {
            this.memoryLock = true;
            const [c1, c2] = this.flippedCards;

            if (c1.data.id === c2.data.id) {
                soundManager.playMatch();
                c1.element.classList.add('is-matched');
                c2.element.classList.add('is-matched');
                this.matchedPairsCount++;

                soundManager.speak(`Harika! ${c1.data.label}!`);
                this.flippedCards = [];
                this.memoryLock = false;

                const level = window.GAME_DATA.MEMORY_LEVELS[this.memoryLevelIdx];
                if (this.matchedPairsCount === level.pairs.length) {
                    soundManager.playSuccess();
                    this.triggerConfetti();
                    this.addStar(2);

                    this.celebrateAfter(900,
                        "Muazzam Hafıza! 🧠🌟",
                        "Tüm çiftleri başarıyla aklında tuttun ve buldun!"
                    );
                }
            } else {
                soundManager.playObstacle();
                const epoch = this.levelEpoch;
                await this.sleep(900);
                // Bu arada bölüm değiştiyse yeni tahtanın kartlarına/kilidine dokunma
                if (epoch !== this.levelEpoch) return;
                c1.element.classList.remove('is-flipped');
                c2.element.classList.remove('is-flipped');
                this.flippedCards = [];
                this.memoryLock = false;
            }
        }
    }

    // ==========================================
    // 🚂 MODÜL 8: ÖRÜNTÜ TRENİ
    // ==========================================

    loadPatternLevel(idx) {
        this.levelEpoch++;
        this.patternLevelIdx = idx;
        const level = window.GAME_DATA.PATTERN_LEVELS[idx];
        this.patternSolved = false;

        this.patternTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.patternInstruction.textContent = level.instruction;

        this.patternPrevBtn.disabled = (idx === 0);
        this.patternNextBtn.disabled = (idx === window.GAME_DATA.PATTERN_LEVELS.length - 1);

        this.renderPatternTrain();
        this.renderPatternOptions();

        // Dar ekranda tren yana taşar: "?" vagonu görünsün diye sona kaydır
        const trainWrap = this.patternTrainWagons.parentElement;
        trainWrap.scrollLeft = trainWrap.scrollWidth;

        soundManager.speak(level.instruction);
    }

    renderPatternTrain() {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];
        this.patternTrainWagons.innerHTML = '';

        const loco = document.createElement('div');
        loco.className = 'train-locomotive';
        loco.innerHTML = `
            <div class="train-steam">☁️</div>
            <div class="loco-body">🚂</div>
        `;
        this.patternTrainWagons.appendChild(loco);

        level.pattern.forEach((item) => {
            const wagon = document.createElement('div');
            wagon.className = 'train-wagon';
            wagon.innerHTML = `
                <div class="wagon-cargo">${item.symbol}</div>
                <div class="wagon-label">${item.label}</div>
                <div class="wagon-wheels">⚫⚫</div>
            `;
            this.patternTrainWagons.appendChild(wagon);
        });

        const questionWagon = document.createElement('div');
        questionWagon.className = 'train-wagon wagon-question';
        questionWagon.id = 'wagon-target';
        questionWagon.innerHTML = `
            <div class="wagon-cargo question-mark">❓</div>
            <div class="wagon-label">Sırada ne var?</div>
            <div class="wagon-wheels">⚫⚫</div>
        `;
        this.patternTrainWagons.appendChild(questionWagon);
    }

    renderPatternOptions() {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];
        this.patternOptionsContainer.innerHTML = '';

        level.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pattern-option-card';
            btn.innerHTML = `
                <span class="option-symbol">${opt.symbol}</span>
                <span class="option-label">${opt.label}</span>
            `;

            btn.addEventListener('click', () => {
                if (this.patternSolved) return;
                this.checkPatternChoice(opt, btn);
            });

            this.patternOptionsContainer.appendChild(btn);
        });
    }

    async checkPatternChoice(chosenOpt, btnEl) {
        const level = window.GAME_DATA.PATTERN_LEVELS[this.patternLevelIdx];

        if (chosenOpt.symbol === level.correct.symbol) {
            this.patternSolved = true;
            btnEl.classList.add('correct-choice');

            const targetWagon = document.getElementById('wagon-target');
            if (targetWagon) {
                targetWagon.classList.remove('wagon-question');
                targetWagon.classList.add('wagon-solved');
                targetWagon.innerHTML = `
                    <div class="wagon-cargo solved-cargo">${chosenOpt.symbol}</div>
                    <div class="wagon-label">${chosenOpt.label}</div>
                    <div class="wagon-wheels">⚫⚫</div>
                `;
            }

            soundManager.playTrainWhistle();
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.patternTrainWagons.classList.add('train-moving');

            soundManager.speak("Tebrikler! Trenin vagonunu doğru tamamladın!");

            this.celebrateAfter(1200,
                "Harika Bir Örüntü Çözücü! 🚂✨",
                `Sıradaki vagonu doğru tahmin ettin! (${chosenOpt.label})`
            );
        } else {
            soundManager.playObstacle();
            btnEl.classList.add('wrong-choice');
            soundManager.speak("Tekrar dene! Vagonların sırasına dikkatlice bakalım.");
            setTimeout(() => {
                btnEl.classList.remove('wrong-choice');
            }, 600);
        }
    }

    // ==========================================
    // ⚖️ MODÜL 9: BOYUT DÜNYASI (SIRALAMA)
    // ==========================================

    loadSizeLevel(idx) {
        this.levelEpoch++;
        this.sizeLevelIdx = idx;
        const level = window.GAME_DATA.SIZE_LEVELS[idx];

        this.sizeTitle.textContent = `Bölüm ${level.id}: ${level.title}`;
        this.sizeInstruction.textContent = level.instruction;

        this.sizePrevBtn.disabled = (idx === 0);
        this.sizeNextBtn.disabled = (idx === window.GAME_DATA.SIZE_LEVELS.length - 1);

        this.resetSizeLevel();
        soundManager.speak(level.instruction);
    }

    resetSizeLevel() {
        const level = window.GAME_DATA.SIZE_LEVELS[this.sizeLevelIdx];
        this.sizeLocked = false;
        this.sizeToken = (this.sizeToken || 0) + 1; // Bekleyen değerlendirme yeni dizilişe dokunmasın
        this.sizePodiumSlots = [null, null, null];
        this.availableSizeItems = this.shuffleArray(level.items);
        // Önceki bölümün yeşil "başardın" / kırmızı "karıştı" görünümü yeni bölüme taşınmasın
        this.podiumSlotsEl.forEach(el => el.classList.remove('podium-success', 'podium-error'));

        this.renderSizePool();
        this.renderSizePodium();
    }

    renderSizePool() {
        this.sizePool.innerHTML = '';

        if (this.availableSizeItems.length === 0) {
            const emptyNotice = document.createElement('div');
            emptyNotice.className = 'pool-all-placed';
            emptyNotice.textContent = '✨ Bütün nesneler podyuma yerleştirildi!';
            this.sizePool.appendChild(emptyNotice);
            return;
        }

        this.availableSizeItems.forEach(item => {
            const card = document.createElement('div');
            card.className = 'size-item-card';
            card.dataset.id = item.id;
            card.innerHTML = `
                <div class="item-visual" style="transform: scale(${item.scale});">${item.symbol}</div>
                <div class="item-name">${item.label}</div>
            `;

            card.addEventListener('click', () => {
                this.placeItemOnFirstAvailableSlot(item);
            });

            this.sizePool.appendChild(card);
        });
    }

    renderSizePodium() {
        this.podiumSlotsEl.forEach((slotEl, idx) => {
            const placedItem = this.sizePodiumSlots[idx];
            slotEl.innerHTML = '';

            const slotHeader = document.createElement('div');
            slotHeader.className = 'podium-header';
            const rankTexts = ['1. EN KÜÇÜK 🥉', '2. ORTA BOY 🥈', '3. EN BÜYÜK 🥇'];
            slotHeader.textContent = rankTexts[idx];
            slotEl.appendChild(slotHeader);

            if (placedItem) {
                const itemEl = document.createElement('div');
                itemEl.className = 'podium-placed-item';
                itemEl.innerHTML = `
                    <div class="placed-symbol" style="transform: scale(${placedItem.scale});">${placedItem.symbol}</div>
                    <div class="placed-label">${placedItem.label}</div>
                    <span class="remove-chip" title="Geri Al">✕</span>
                `;

                itemEl.addEventListener('click', () => {
                    this.returnItemToPool(idx);
                });

                slotEl.appendChild(itemEl);
                slotEl.classList.add('has-item');
            } else {
                const placeholder = document.createElement('div');
                placeholder.className = 'podium-empty-box';
                placeholder.innerHTML = '<span>Boş</span>';
                slotEl.appendChild(placeholder);
                slotEl.classList.remove('has-item');
            }
        });
    }

    placeItemOnFirstAvailableSlot(item) {
        if (this.sizeLocked) return;
        const emptyIndex = this.sizePodiumSlots.findIndex(slot => slot === null);
        if (emptyIndex === -1) return;

        soundManager.playPop();

        this.availableSizeItems = this.availableSizeItems.filter(i => i.id !== item.id);
        this.sizePodiumSlots[emptyIndex] = item;

        this.renderSizePool();
        this.renderSizePodium();

        if (this.sizePodiumSlots.every(slot => slot !== null)) {
            this.checkSizeOrder();
        }
    }

    returnItemToPool(slotIndex) {
        // Doğru sıralandıktan sonra nesneyi çıkarıp yeniden koyarak tekrar tekrar yıldız kazanılmasın
        if (this.sizeLocked) return;
        const item = this.sizePodiumSlots[slotIndex];
        if (!item) return;

        soundManager.playWhoosh();
        this.sizePodiumSlots[slotIndex] = null;
        this.availableSizeItems.push(item);

        this.renderSizePool();
        this.renderSizePodium();
    }

    async checkSizeOrder() {
        // Üç podyum doldu: değerlendirme bitene kadar (ve doğruysa bölüm boyunca) tıklamalar kilitli
        this.sizeLocked = true;
        const epoch = this.levelEpoch;
        const token = this.sizeToken;
        const isCorrect = this.sizePodiumSlots.every((item, idx) => item.rank === (idx + 1));

        await this.sleep(300);
        if (epoch !== this.levelEpoch || token !== this.sizeToken) return;

        if (isCorrect) {
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);

            this.podiumSlotsEl.forEach(el => el.classList.add('podium-success'));
            soundManager.speak("Tebrikler! Küçükten büyüğe kusursuz sıraladın!");

            this.celebrateAfter(900,
                "Boyut Ustası! ⚖️🌟",
                "Nesneleri küçükten büyüğe harika bir şekilde yerleştirdin!"
            );
        } else {
            soundManager.playObstacle();
            this.podiumSlotsEl.forEach(el => el.classList.add('podium-error'));
            soundManager.speak("Biraz karıştı! Hadi baştan en küçüğü bularak başlayalım.");

            await this.sleep(1000);
            if (epoch !== this.levelEpoch || token !== this.sizeToken) return;
            this.podiumSlotsEl.forEach(el => el.classList.remove('podium-error'));
            this.resetSizeLevel();
        }
    }

    // ==========================================
    // 🎨🔢 MODÜL 10-11: RENK & SAYI BULUCU (SÖYLE & TIKLA)
    // ==========================================

    getFinderConfig(kind) {
        const data = window.GAME_DATA;
        return kind === 'color'
            ? { levels: data.COLOR_FINDER_LEVELS, items: data.ALL_COLORS }
            : { levels: data.NUMBER_FINDER_LEVELS, items: data.ALL_NUMBERS };
    }

    getActiveFinderKind() {
        if (this.activeTab === 'colorfinder') return 'color';
        if (this.activeTab === 'numberfinder') return 'number';
        return null;
    }

    getFinderRound(kind) {
        const { levels } = this.getFinderConfig(kind);
        const state = this.finderState[kind];
        return levels[state.levelIdx].rounds[state.roundIdx];
    }

    // "Kırmızı" / "Üç" gibi konuşmaya ve ekrana uygun ad
    getFinderItemName(kind, item) {
        if (kind === 'color') return item.name;
        return item.word.charAt(0) + item.word.slice(1).toLocaleLowerCase('tr-TR');
    }

    getFinderRoundPrompt(kind) {
        const { items } = this.getFinderConfig(kind);
        const name = this.getFinderItemName(kind, items[this.getFinderRound(kind).target]);
        return kind === 'color' ? `${name} rengi bul!` : `${name} sayısını bul!`;
    }

    loadFinderLevel(kind, idx) {
        this.levelEpoch++;
        const { levels } = this.getFinderConfig(kind);
        const ui = this.finderUI[kind];
        const level = levels[idx];
        const state = this.finderState[kind];

        state.levelIdx = idx;
        state.roundIdx = 0;

        ui.title.textContent = `Bölüm ${level.id}: ${level.title}`;
        ui.instruction.textContent = level.instruction;
        ui.prevBtn.disabled = (idx === 0);
        ui.nextBtn.disabled = (idx === levels.length - 1);

        this.renderFinderRound(kind);
        soundManager.speak(`${level.instruction} ${this.getFinderRoundPrompt(kind)}`);
    }

    renderFinderRound(kind) {
        const { levels, items } = this.getFinderConfig(kind);
        const ui = this.finderUI[kind];
        const state = this.finderState[kind];
        const level = levels[state.levelIdx];
        const round = level.rounds[state.roundIdx];
        const target = items[round.target];
        const targetName = this.getFinderItemName(kind, target);

        state.busy = false;
        state.roundToken++;

        ui.roundBadge.textContent = `⭐ Tur ${state.roundIdx + 1} / ${level.rounds.length}`;
        ui.targetPrompt.textContent = kind === 'color'
            ? `${targetName} kartı bul ve dokun!`
            : `${targetName} sayısının kartını bul ve dokun!`;

        if (kind === 'color') {
            ui.targetWord.textContent = targetName.toLocaleUpperCase('tr-TR');
            this.applyFinderColorText(ui.targetWord, target);
            ui.targetCircle.textContent = target.items[0].split(' ')[0];
        } else {
            ui.targetDigit.textContent = target.num;
            ui.targetSpelling.textContent = target.word;
            ui.targetVisual.textContent = target.countVisual;
        }

        ui.cards.innerHTML = '';
        round.options.forEach(id => {
            ui.cards.appendChild(this.createFinderCard(kind, id, items[id]));
        });
    }

    // Renk adı yazısı okunur kalsın: açık renkler (sarı) için koyu kenar tonu,
    // beyaz için konturlu beyaz harf (beyaz zeminde kaybolmasın, gri de görünmesin)
    applyFinderColorText(el, item) {
        if (item.id === 'white') {
            el.style.color = '#FFFFFF';
            el.style.webkitTextStroke = '1.5px #64748B';
            el.style.paintOrder = 'stroke fill';
        } else {
            el.style.color = item.borderHex;
            el.style.webkitTextStroke = '';
            el.style.paintOrder = '';
        }
    }

    createFinderCard(kind, id, item) {
        const name = this.getFinderItemName(kind, item);
        const card = document.createElement('div');
        card.className = 'finder-card';
        card.dataset.id = String(id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', name);

        if (kind === 'color') {
            card.style.background = item.cardBg;
            card.style.borderColor = item.borderHex;
            card.innerHTML = `
                <button type="button" class="card-speak-btn" title="Adını Dinle">🔊</button>
                <div class="card-emoji-visual">${item.emoji}</div>
                <div class="card-title-text">${name}</div>
                <div class="card-count-visual">${item.items.map(s => s.split(' ')[0]).join(' ')}</div>
            `;
            this.applyFinderColorText(card.querySelector('.card-title-text'), item);
        } else {
            card.style.borderColor = '#A78BFA';
            card.innerHTML = `
                <button type="button" class="card-speak-btn" title="Adını Dinle">🔊</button>
                <div class="card-emoji-visual" style="color: #7C3AED; font-weight: 900">${item.num}</div>
                <div class="card-title-text">${item.word}</div>
                <div class="card-count-visual">${item.countVisual}</div>
                <div class="card-count-label">${item.countLabel}</div>
            `;
        }

        card.querySelector('.card-speak-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            soundManager.playPop();
            soundManager.speak(name);
        });

        card.addEventListener('click', () => this.chooseFinderCard(kind, id, card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.chooseFinderCard(kind, id, card);
            }
        });

        return card;
    }

    async chooseFinderCard(kind, id, cardEl) {
        const state = this.finderState[kind];
        if (state.busy) return;

        const { levels, items } = this.getFinderConfig(kind);
        const level = levels[state.levelIdx];
        const round = level.rounds[state.roundIdx];
        const targetName = this.getFinderItemName(kind, items[round.target]);
        const chosenName = this.getFinderItemName(kind, items[id]);

        if (String(id) !== String(round.target)) {
            soundManager.playObstacle();
            cardEl.classList.add('card-wrong-shake');
            soundManager.speak(kind === 'color'
                ? `Bu ${chosenName}! Hadi ${targetName} rengi bulalım!`
                : `Bu ${chosenName}! Hadi ${targetName} sayısını bulalım!`);
            setTimeout(() => cardEl.classList.remove('card-wrong-shake'), 600);
            return;
        }

        state.busy = true;
        const token = state.roundToken;
        cardEl.classList.add('magic-voice-selected');
        soundManager.playSuccess();
        this.addStar(1);
        soundManager.speak(`Harika! Bu ${chosenName}!`);

        await this.sleep(1500);
        // Bekleme sırasında bölüm/sekme değiştiyse eski turu ilerletme
        if (token !== state.roundToken || this.getActiveFinderKind() !== kind) {
            state.busy = false;
            return;
        }

        if (state.roundIdx < level.rounds.length - 1) {
            state.roundIdx++;
            this.renderFinderRound(kind);
            soundManager.speak(this.getFinderRoundPrompt(kind));
            return;
        }

        this.triggerConfetti();
        this.addStar(2);
        soundManager.speak(kind === 'color'
            ? "Tebrikler! Bütün renkleri buldun!"
            : "Tebrikler! Bütün sayıları buldun!");
        this.showCelebrationModal(
            kind === 'color' ? "Renk Ustası! 🎨✨" : "Sayı Şampiyonu! 🔢✨",
            `${level.title} bölümündeki bütün ${kind === 'color' ? 'renkleri' : 'sayıları'} buldun!`
        );
    }

    // ==========================================
    // ✋ ORTAK: SÜRÜKLE YA DA DOKUN
    // ==========================================
    // Kısa dokunuş → onTap(); 10px'ten fazla sürükleme → parmağı izleyen bir kopya oluşur,
    // bırakılınca onDrop(x, y) çağrılır (bırakılan yerdeki hedef elementFromPoint ile bulunur).
    attachDragOrTap(el, { onTap, onDrop, canStart = () => true }) {
        el.addEventListener('pointerdown', (e) => {
            if (e.button > 0 || !canStart()) return;
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            let ghost = null;

            const move = (ev) => {
                if (!ghost && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 10) {
                    const rect = el.getBoundingClientRect();
                    ghost = el.cloneNode(true);
                    ghost.classList.add('drag-ghost');
                    ghost.style.width = `${rect.width}px`;
                    ghost.style.height = `${rect.height}px`;
                    document.body.appendChild(ghost);
                    el.classList.add('drag-source');
                }
                if (ghost) {
                    ghost.style.left = `${ev.clientX}px`;
                    ghost.style.top = `${ev.clientY}px`;
                }
            };

            const end = (ev) => {
                window.removeEventListener('pointermove', move);
                window.removeEventListener('pointerup', end);
                window.removeEventListener('pointercancel', end);
                if (ghost) {
                    ghost.remove();
                    el.classList.remove('drag-source');
                    if (ev.type === 'pointerup') onDrop(ev.clientX, ev.clientY);
                } else if (ev.type === 'pointerup') {
                    onTap();
                }
            };

            window.addEventListener('pointermove', move);
            window.addEventListener('pointerup', end);
            window.addEventListener('pointercancel', end);
        });
    }

    shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    setLevelHeader(key, level, prefix = 'Bölüm') {
        const levels = this.extraModules[key].levels();
        const idx = levels.indexOf(level);
        document.getElementById(`${key}-title`).textContent = `${prefix} ${level.id}: ${level.title}`;
        document.getElementById(`${key}-instruction`).textContent = level.instruction;
        document.getElementById(`btn-${key}-prev`).disabled = (idx === 0);
        document.getElementById(`btn-${key}-next`).disabled = (idx === levels.length - 1);
    }

    // ==========================================
    // 🖍️ MODÜL 12: BOYAMA KİTABI
    // ==========================================

    loadColoringLevel(idx) {
        this.levelEpoch++;
        this.coloringLevelIdx = idx;
        const page = window.GAME_DATA.COLORING_PAGES[idx];
        this.coloringDone = false;
        this.setLevelHeader('coloring', page, 'Sayfa');

        this.coloringSvgHolder.innerHTML =
            `<svg class="coloring-svg" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${page.title}">${page.svg}</svg>`;

        this.coloringSvgHolder.querySelectorAll('.paint-region').forEach(region => {
            region.dataset.filled = '0';
            region.addEventListener('click', () => this.paintRegion(region));
        });

        this.renderColoringPalette();
        this.updateColoringProgress();
        soundManager.speak(page.instruction);
    }

    renderColoringPalette() {
        const palette = window.GAME_DATA.COLORING_PALETTE;
        this.coloringPalette.innerHTML = '';

        palette.forEach((color, i) => {
            const swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.className = 'palette-swatch' + (color.isEraser ? ' is-eraser' : '');
            swatch.classList.toggle('selected', i === this.coloringColorIdx);
            swatch.style.setProperty('--swatch', color.hex);
            swatch.setAttribute('aria-label', color.name);
            swatch.title = color.name;
            swatch.innerHTML = color.isEraser ? '<span>🧽</span>' : '';

            swatch.addEventListener('click', () => {
                this.coloringColorIdx = i;
                this.coloringPalette.querySelectorAll('.palette-swatch')
                    .forEach((el, j) => el.classList.toggle('selected', j === i));
                soundManager.playPop();
                soundManager.speak(color.name); // Renk adını duyarak öğrenme
            });

            this.coloringPalette.appendChild(swatch);
        });
    }

    paintRegion(region) {
        const color = window.GAME_DATA.COLORING_PALETTE[this.coloringColorIdx];
        region.style.fill = color.hex;
        region.dataset.filled = color.isEraser ? '0' : '1';

        region.classList.remove('paint-splash');
        void region.getBBox(); // animasyonu yeniden başlatmak için
        region.classList.add('paint-splash');
        soundManager.playBubblePlop();

        this.updateColoringProgress();
    }

    updateColoringProgress() {
        const regions = [...this.coloringSvgHolder.querySelectorAll('.paint-region')];
        const filled = regions.filter(r => r.dataset.filled === '1').length;
        this.coloringProgress.textContent = `🖍️ ${filled} / ${regions.length} Boyandı`;

        // Boyama yaratıcı bir etkinlik: bitince kutlanır ama sonraki sayfaya zorlanmaz
        if (filled === regions.length && !this.coloringDone) {
            this.coloringDone = true;
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak("Harika bir ressamsın! Resmin rengarenk oldu!");
        }
    }

    clearColoringPage() {
        this.coloringSvgHolder.querySelectorAll('.paint-region').forEach(region => {
            region.style.fill = '';
            region.dataset.filled = '0';
        });
        this.updateColoringProgress();
    }

    // ==========================================
    // 🖼️ MODÜL 13: YAPBOZ
    // ==========================================

    // Kahraman emoji + her parçada farklı küçük süs: parçalar birbirinden ayırt edilebilsin
    buildJigsawImage(level) {
        const cell = 220;
        const canvas = document.createElement('canvas');
        canvas.width = level.cols * cell;
        canvas.height = level.rows * cell;
        const ctx = canvas.getContext('2d');
        const emojiFont = (size) => `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, level.colors[0]);
        grad.addColorStop(1, level.colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Alt tepe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height * 1.05, canvas.width * 0.7, canvas.height * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Renkli emoji, dolgu renginin saydamlığını alır: tam opak dolguya dön
        ctx.fillStyle = '#000000';

        const decorations = window.GAME_DATA.JIGSAW_DECORATIONS;
        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const i = r * level.cols + c;
                ctx.font = emojiFont(cell * 0.24);
                ctx.fillText(decorations[(i + level.id) % decorations.length], c * cell + cell * 0.2, r * cell + cell * 0.2);
            }
        }

        ctx.font = emojiFont(Math.min(canvas.width, canvas.height) * 0.66);
        ctx.fillText(level.hero, canvas.width / 2, canvas.height / 2 + cell * 0.06);

        return canvas.toDataURL('image/png');
    }

    loadJigsawLevel(idx) {
        this.levelEpoch++;
        this.jigsawLevelIdx = idx;
        const level = window.GAME_DATA.JIGSAW_LEVELS[idx];
        this.jigsawSelected = null;
        this.jigsawPlaced = 0;
        this.setLevelHeader('jigsaw', level);

        const image = this.buildJigsawImage(level);
        const total = level.cols * level.rows;

        this.jigsawBoard.innerHTML = '';
        this.jigsawBoard.style.setProperty('--cols', level.cols);
        this.jigsawBoard.style.setProperty('--rows', level.rows);

        const guide = document.createElement('div');
        guide.className = 'jigsaw-guide';
        guide.style.backgroundImage = `url(${image})`;
        guide.style.opacity = level.guide;
        this.jigsawBoard.appendChild(guide);

        for (let i = 0; i < total; i++) {
            const slot = document.createElement('div');
            slot.className = 'jigsaw-slot';
            slot.dataset.index = i;
            slot.addEventListener('click', () => {
                if (this.jigsawSelected) this.tryPlaceJigsawPiece(this.jigsawSelected, slot);
            });
            this.jigsawBoard.appendChild(slot);
        }

        this.jigsawTray.innerHTML = '';
        this.shuffleArray([...Array(total).keys()]).forEach(i => {
            const piece = document.createElement('div');
            piece.className = 'jigsaw-piece';
            piece.dataset.index = i;
            const r = Math.floor(i / level.cols);
            const c = i % level.cols;
            piece.style.backgroundImage = `url(${image})`;
            piece.style.backgroundSize = `${level.cols * 100}% ${level.rows * 100}%`;
            piece.style.backgroundPosition =
                `${level.cols > 1 ? (c / (level.cols - 1)) * 100 : 0}% ${level.rows > 1 ? (r / (level.rows - 1)) * 100 : 0}%`;

            this.attachDragOrTap(piece, {
                canStart: () => piece.dataset.placed !== '1',
                onTap: () => this.selectJigsawPiece(piece),
                onDrop: (x, y) => {
                    const slot = document.elementFromPoint(x, y)?.closest('.jigsaw-slot');
                    if (slot) this.tryPlaceJigsawPiece(piece, slot);
                }
            });

            this.jigsawTray.appendChild(piece);
        });

        this.updateJigsawProgress();
        soundManager.speak(level.instruction);
    }

    selectJigsawPiece(piece) {
        const same = this.jigsawSelected === piece;
        this.jigsawTray.querySelectorAll('.jigsaw-piece').forEach(p => p.classList.remove('selected-piece'));
        this.jigsawSelected = same ? null : piece;
        if (!same) piece.classList.add('selected-piece');
        soundManager.playPop();
    }

    tryPlaceJigsawPiece(piece, slot) {
        if (slot.classList.contains('filled')) return;
        const level = window.GAME_DATA.JIGSAW_LEVELS[this.jigsawLevelIdx];
        piece.classList.remove('selected-piece');
        this.jigsawSelected = null;

        if (piece.dataset.index !== slot.dataset.index) {
            soundManager.playObstacle();
            soundManager.speak("Bu parça buraya uymadı, başka bir yere dene!");
            piece.classList.add('piece-wrong');
            slot.classList.add('slot-wrong');
            setTimeout(() => {
                piece.classList.remove('piece-wrong');
                slot.classList.remove('slot-wrong');
            }, 550);
            return;
        }

        piece.dataset.placed = '1';
        piece.classList.add('placed');
        slot.classList.add('filled');
        slot.appendChild(piece);
        soundManager.playMatch();
        this.jigsawPlaced++;
        this.updateJigsawProgress();

        if (this.jigsawPlaced === level.cols * level.rows) {
            this.jigsawBoard.classList.add('jigsaw-complete');
            setTimeout(() => this.jigsawBoard.classList.remove('jigsaw-complete'), 1200);
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak(`Yapboz tamam! Bu bir ${level.heroLabel}!`);
            this.celebrateAfter(1200, "Yapboz Ustası! 🖼️✨", `${level.heroLabel} resmini parça parça tamamladın!`);
        }
    }

    updateJigsawProgress() {
        const level = window.GAME_DATA.JIGSAW_LEVELS[this.jigsawLevelIdx];
        this.jigsawProgress.textContent = `🧩 ${this.jigsawPlaced} / ${level.cols * level.rows} Parça`;
    }

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

        await this.sleep(500);
        for (const id of this.melodySeq) {
            if (token !== this.melodyToken) return;
            soundManager.playNote(this.getMelodyNote(id).freq);
            this.flashMelodyBar(id);
            await this.sleep(700);
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

    // ==========================================
    // 🧺 MODÜL 15: SEPETLERE AYIR
    // ==========================================

    loadSortingLevel(idx) {
        this.levelEpoch++;
        this.sortingLevelIdx = idx;
        const level = window.GAME_DATA.SORTING_LEVELS[idx];
        this.sortingSelected = null;
        this.sortingDone = 0;
        this.setLevelHeader('sorting', level);

        this.sortingBaskets.innerHTML = '';
        this.sortingBaskets.style.setProperty('--basket-count', level.baskets.length);
        level.baskets.forEach(basket => {
            const el = document.createElement('div');
            el.className = 'sorting-basket';
            el.dataset.basket = basket.id;
            el.style.setProperty('--basket-color', basket.color);
            el.innerHTML = `
                <div class="basket-header"><span class="basket-icon">${basket.icon}</span><span>${basket.label}</span></div>
                <div class="basket-content"></div>
                <div class="basket-weave">🧺</div>
            `;
            el.addEventListener('click', () => {
                if (this.sortingSelected) this.trySortItem(this.sortingSelected, el);
            });
            this.sortingBaskets.appendChild(el);
        });

        this.sortingPool.innerHTML = '';
        this.shuffleArray(level.items).forEach(item => {
            const el = document.createElement('div');
            el.className = 'sorting-item';
            el.dataset.basket = item.basket;
            el.dataset.label = item.label;
            el.innerHTML = `<span class="sorting-symbol">${item.symbol}</span><span class="sorting-label">${item.label}</span>`;

            this.attachDragOrTap(el, {
                onTap: () => this.selectSortingItem(el),
                onDrop: (x, y) => {
                    const basket = document.elementFromPoint(x, y)?.closest('.sorting-basket');
                    if (basket) this.trySortItem(el, basket);
                }
            });
            this.sortingPool.appendChild(el);
        });

        this.updateSortingProgress();
        soundManager.speak(level.instruction);
    }

    selectSortingItem(el) {
        const same = this.sortingSelected === el;
        this.sortingPool.querySelectorAll('.sorting-item').forEach(i => i.classList.remove('selected-piece'));
        this.sortingSelected = same ? null : el;
        if (!same) {
            el.classList.add('selected-piece');
            soundManager.speak(el.dataset.label);
        }
        soundManager.playPop();
    }

    trySortItem(itemEl, basketEl) {
        const level = window.GAME_DATA.SORTING_LEVELS[this.sortingLevelIdx];
        itemEl.classList.remove('selected-piece');
        this.sortingSelected = null;

        if (itemEl.dataset.basket !== basketEl.dataset.basket) {
            soundManager.playObstacle();
            soundManager.speak(`Hmm, ${itemEl.dataset.label} bu sepete ait değil. Başka bir sepeti dene!`);
            itemEl.classList.add('piece-wrong');
            basketEl.classList.add('basket-wrong');
            setTimeout(() => {
                itemEl.classList.remove('piece-wrong');
                basketEl.classList.remove('basket-wrong');
            }, 550);
            return;
        }

        const chip = document.createElement('span');
        chip.className = 'basket-chip';
        chip.textContent = itemEl.querySelector('.sorting-symbol').textContent;
        basketEl.querySelector('.basket-content').appendChild(chip);
        basketEl.classList.add('basket-happy');
        setTimeout(() => basketEl.classList.remove('basket-happy'), 450);
        itemEl.remove();

        soundManager.playMatch();
        this.sortingDone++;
        this.updateSortingProgress();

        if (this.sortingDone === level.items.length) {
            soundManager.playSuccess();
            this.triggerConfetti();
            this.addStar(2);
            soundManager.speak("Süpersin! Her şeyi doğru sepete koydun!");
            this.celebrateAfter(1200, "Sınıflandırma Ustası! 🧺✨", "Hepsini doğru gruplara ayırdın!");
        }
    }

    updateSortingProgress() {
        const level = window.GAME_DATA.SORTING_LEVELS[this.sortingLevelIdx];
        this.sortingProgress.textContent = `🧺 ${this.sortingDone} / ${level.items.length}`;
    }

    // ==========================================
    // 🌟 BAŞARI KUTLAMA VE MODAL
    // ==========================================

    // Açık oyunun bölüm sırası ve toplam bölüm sayısı (son bölüm mü kararı için)
    getActiveLevelProgress() {
        const classic = {
            realmaze: ['realmazeLevelIdx', 'REALTIME_MAZE_LEVELS'],
            balltoss: ['ballTossLevelIdx', 'BALL_TOSS_LEVELS'],
            bubbles: ['bubblesLevelIdx', 'SOAP_BUBBLE_LEVELS'],
            bunny: ['bunnyLevelIdx', 'BUNNY_LEVELS'],
            balloon: ['balloonLevelIdx', 'BALLOON_LEVELS'],
            shape: ['shapeLevelIdx', 'SHAPE_MATCH_LEVELS'],
            memory: ['memoryLevelIdx', 'MEMORY_LEVELS'],
            pattern: ['patternLevelIdx', 'PATTERN_LEVELS'],
            size: ['sizeLevelIdx', 'SIZE_LEVELS']
        }[this.activeTab];
        if (classic) return { idx: this[classic[0]], count: window.GAME_DATA[classic[1]].length };

        const kind = this.getActiveFinderKind();
        if (kind) return { idx: this.finderState[kind].levelIdx, count: this.getFinderConfig(kind).levels.length };

        const mod = this.extraModules[this.activeTab];
        if (mod) return { idx: this[mod.idxKey], count: mod.levels().length };
        return null;
    }

    showCelebrationModal(title, msg) {
        // Son bölümde "Sonraki Bölüm" yerine menüye dönülür (eskiden tahta bitmiş halde kalıyordu)
        const progress = this.getActiveLevelProgress();
        this.celebrationGoesHome = !!progress && progress.idx >= progress.count - 1;

        this.celebrationTitle.textContent = title;
        this.celebrationMessage.textContent = this.celebrationGoesHome
            ? `${msg} Bu oyunun bütün bölümlerini bitirdin! 🏆`
            : msg;
        this.btnNextCelebration.querySelector('span').textContent = this.celebrationGoesHome
            ? '🏠 Oyun Menüsü'
            : 'Sonraki Bölüm 🌟';
        this.celebrationModal.showModal();
    }

    handleCelebrationNext() {
        if (this.celebrationGoesHome) {
            this.celebrationGoesHome = false;
            this.switchTab('home');
            return;
        }

        if (this.activeTab === 'realmaze') {
            if (this.realmazeLevelIdx < window.GAME_DATA.REALTIME_MAZE_LEVELS.length - 1) {
                this.realmazeLevelIdx++;
                this.loadRealmazeLevel(this.realmazeLevelIdx);
            }
        } else if (this.activeTab === 'balltoss') {
            if (this.ballTossLevelIdx < window.GAME_DATA.BALL_TOSS_LEVELS.length - 1) {
                this.ballTossLevelIdx++;
                this.loadBallTossLevel(this.ballTossLevelIdx);
            }
        } else if (this.activeTab === 'bubbles') {
            if (this.bubblesLevelIdx < window.GAME_DATA.SOAP_BUBBLE_LEVELS.length - 1) {
                this.bubblesLevelIdx++;
                this.loadBubblesLevel(this.bubblesLevelIdx);
            }
        } else if (this.activeTab === 'bunny') {
            if (this.bunnyLevelIdx < window.GAME_DATA.BUNNY_LEVELS.length - 1) {
                this.bunnyLevelIdx++;
                this.loadBunnyLevel(this.bunnyLevelIdx);
            }
        } else if (this.activeTab === 'balloon') {
            if (this.balloonLevelIdx < window.GAME_DATA.BALLOON_LEVELS.length - 1) {
                this.balloonLevelIdx++;
                this.loadBalloonLevel(this.balloonLevelIdx);
            }
        } else if (this.activeTab === 'shape') {
            if (this.shapeLevelIdx < window.GAME_DATA.SHAPE_MATCH_LEVELS.length - 1) {
                this.shapeLevelIdx++;
                this.loadShapeLevel(this.shapeLevelIdx);
            }
        } else if (this.activeTab === 'memory') {
            if (this.memoryLevelIdx < window.GAME_DATA.MEMORY_LEVELS.length - 1) {
                this.memoryLevelIdx++;
                this.loadMemoryLevel(this.memoryLevelIdx);
            }
        } else if (this.activeTab === 'pattern') {
            if (this.patternLevelIdx < window.GAME_DATA.PATTERN_LEVELS.length - 1) {
                this.patternLevelIdx++;
                this.loadPatternLevel(this.patternLevelIdx);
            }
        } else if (this.activeTab === 'size') {
            if (this.sizeLevelIdx < window.GAME_DATA.SIZE_LEVELS.length - 1) {
                this.sizeLevelIdx++;
                this.loadSizeLevel(this.sizeLevelIdx);
            }
        } else if (this.getActiveFinderKind()) {
            const kind = this.getActiveFinderKind();
            const { levels } = this.getFinderConfig(kind);
            const idx = this.finderState[kind].levelIdx;
            if (idx < levels.length - 1) this.loadFinderLevel(kind, idx + 1);
        } else if (this.extraModules[this.activeTab]) {
            const mod = this.extraModules[this.activeTab];
            const idx = this[mod.idxKey];
            if (idx < mod.levels().length - 1) mod.load(idx + 1);
        }
    }

    // ==========================================
    // 🎉 GÖRSEL KONFETİ SİSTEMİ
    // ==========================================

    initConfetti() {
        this.confettiCanvas = document.getElementById('confetti-canvas');
        if (!this.confettiCanvas) return;
        this.confettiCtx = this.confettiCanvas.getContext('2d');

        const resize = () => {
            this.confettiCanvas.width = window.innerWidth;
            this.confettiCanvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();
    }

    triggerConfetti() {
        if (!this.confettiCanvas || !this.confettiCtx) return;

        this.confettiParticles = [];
        const colors = ['#FF4081', '#00E676', '#FFD600', '#00B0FF', '#FF6D00', '#D500F9'];

        for (let i = 0; i < 90; i++) {
            this.confettiParticles.push({
                x: window.innerWidth * (0.2 + Math.random() * 0.6),
                y: window.innerHeight * 0.3,
                r: 6 + Math.random() * 6,
                d: Math.random() * 90,
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
                tiltAngle: 0,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() * -6) - 4
            });
        }

        // Konfeti zaten yağıyorsa yeni parçacıklar çalışan döngüyle düşer; ikinci döngü
        // başlatılmaz (yoksa konfeti iki kat hızlı düşerdi)
        if (this.confettiActive) return;
        this.confettiActive = true;
        this.runConfettiLoop();
    }

    runConfettiLoop() {
        if (!this.confettiActive) return;

        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

        this.confettiParticles.forEach((p, idx) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
            p.x += Math.sin(p.d);
            p.tilt = Math.sin(p.tiltAngle - (idx / 3)) * 15;

            this.confettiCtx.beginPath();
            this.confettiCtx.lineWidth = p.r;
            this.confettiCtx.strokeStyle = p.color;
            this.confettiCtx.moveTo(p.x + p.tilt + (p.r / 2), p.y);
            this.confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 2));
            this.confettiCtx.stroke();
        });

        const stillVisible = this.confettiParticles.some(p => p.y < this.confettiCanvas.height + 20);

        if (stillVisible) {
            requestAnimationFrame(() => this.runConfettiLoop());
        } else {
            this.confettiActive = false;
            this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Sekme arka plandayken tarayıcı kare çizmez ve animasyon bitmez; oyun takılı kalmasın diye
    // animasyon süresi + küçük pay dolunca yine de devam edilir
    waitForAnimation(animation, durationMs) {
        return Promise.race([
            animation.finished.catch(() => {}),
            this.sleep(durationMs + 150)
        ]);
    }
}

// Uygulamayı DOM hazır olunca başlat
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MiniExplorerApp();
});
