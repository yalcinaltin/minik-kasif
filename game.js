/**
 * Minik Kaşif - Ana Oyun Motoru (3-5 Yaş Çocuk Gelişim Sürümü)
 * 19 Zengin ve Eğlenceli Oyun Modülü:
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
 * 16. 🔍 Farklı Olanı Bul (Görsel Ayırt Etme)
 * 17. 🙈 Kim Kayboldu? (Görsel Bellek)
 * 18. ✏️ Noktaları Birleştir (Sayı Sırası)
 * 19. 🎁 Balon Şişir (Sayma, Renk & Dur Komutu)
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

        // ✏️ Noktaları Birleştir Durumu
        this.dotsLevelIdx = 0;
        this.dotsNext = 0;         // Sıradaki noktanın sırası (0 = "1" numaralı nokta)
        this.dotsDone = false;
        this.dotsDrag = null;      // Parmak kaydırılarak birleştirme durumu

        // 🔍 16. Farklı Olanı Bul Durumu
        this.oddoneLevelIdx = 0;
        this.oddoneRoundIdx = 0;
        this.oddoneBusy = false;
        this.oddoneToken = 0;      // Tur değişince bekleyen "sonraki tur" işini iptal eder

        // 🙈 17. Kim Kayboldu Durumu
        this.missingLevelIdx = 0;
        this.missingRoundIdx = 0;
        this.missingPhase = 'look'; // look → hide → ask → done
        this.missingBusy = false;
        this.missingToken = 0;     // Bölüm/tur değişince süren bak-sakla akışını iptal eder
        this.missingItem = null;
        this.missingWrongCount = 0;

        // 🎁 Balon Şişir Durumu
        this.pumpLevelIdx = 0;
        this.pumpStep = 0;         // Açık balona kaç kez pompalandı
        this.pumpDone = 0;         // Bölümde toplanan sürpriz sayısı
        this.pumpBusy = false;     // Patlama/sürpriz uçarken dokunuş sayılmaz
        this.pumpQueue = [];       // Bu bölümde balonlardan çıkacak sürprizler (karışık sıra)
        this.pumpLanes = null;     // Ekrandaki balonların renkleri
        this.pumpTargetLane = 0;   // Şişirilecek balonun sırası (renk bölümünde söylenen)
        this.pumpLastColor = null;
        this.pumpSettleTimer = null; // Çizgi bölümü: balon çizgide durunca bağlanma sayacı

        // 19 oyunun ortak kaydı: önceki/sonraki düğmeleri, sekme açılışı, yönerge, kutlama sonrası
        // ilerleme ve oyundan çıkarken temizlik buradan yürür. Anahtar = sekme adı = HTML kimlik öneki
        // (`${anahtar}-title`, `${anahtar}-instruction`, `btn-${anahtar}-prev/next`).
        //   levels()      → bölüm listesi          idxKey / getIdx() → açık bölüm sırası
        //   load(i)       → bölümü kurar           onLeave()         → oyundan çıkarken (zamanlayıcıları durdur)
        //   instruction() → "Tekrar" düğmesinin söyleyeceği yönerge (yoksa bölümün instruction alanı)
        const D = () => window.GAME_DATA;
        const finder = (kind) => ({
            levels: () => this.getFinderConfig(kind).levels,
            getIdx: () => this.finderState[kind].levelIdx,
            load: (i) => this.loadFinderLevel(kind, i),
            instruction: () => this.getFinderRoundPrompt(kind)
        });
        this.games = {
            realmaze: { levels: () => D().REALTIME_MAZE_LEVELS, idxKey: 'realmazeLevelIdx', load: (i) => this.loadRealmazeLevel(i) },
            colorfinder: finder('color'),
            numberfinder: finder('number'),
            balltoss: {
                levels: () => D().BALL_TOSS_LEVELS, idxKey: 'ballTossLevelIdx', load: (i) => this.loadBallTossLevel(i),
                onLeave: () => { this.stopTossTargetLoop(); this.cancelTossDrag(); }
            },
            bubbles: {
                levels: () => D().SOAP_BUBBLE_LEVELS, idxKey: 'bubblesLevelIdx', load: (i) => this.loadBubblesLevel(i),
                onLeave: () => this.stopBubblesSpawner()
            },
            // titleId: eski önbellekteki game.js yeni sayfayla eşleşirse kırılmasın diye başlık kimliği değişmedi
            bunny: { levels: () => D().BUNNY_LEVELS, idxKey: 'bunnyLevelIdx', load: (i) => this.loadBunnyLevel(i), titleId: 'bunny-level-title' },
            balloon: {
                levels: () => D().BALLOON_LEVELS, idxKey: 'balloonLevelIdx', load: (i) => this.loadBalloonLevel(i),
                onLeave: () => this.stopBalloonSpawner(),
                // Turlu bölümlerde (hayvan sesi, sayma) Tekrar düğmesi o anki soruyu söyler
                instruction: () => this.getBalloonInstruction()
            },
            shape: { levels: () => D().SHAPE_MATCH_LEVELS, idxKey: 'shapeLevelIdx', load: (i) => this.loadShapeLevel(i) },
            memory: { levels: () => D().MEMORY_LEVELS, idxKey: 'memoryLevelIdx', load: (i) => this.loadMemoryLevel(i) },
            pattern: { levels: () => D().PATTERN_LEVELS, idxKey: 'patternLevelIdx', load: (i) => this.loadPatternLevel(i) },
            size: { levels: () => D().SIZE_LEVELS, idxKey: 'sizeLevelIdx', load: (i) => this.loadSizeLevel(i) },
            coloring: { levels: () => D().COLORING_PAGES, idxKey: 'coloringLevelIdx', load: (i) => this.loadColoringLevel(i) },
            jigsaw: { levels: () => D().JIGSAW_LEVELS, idxKey: 'jigsawLevelIdx', load: (i) => this.loadJigsawLevel(i) },
            melody: {
                levels: () => D().MELODY_LEVELS, idxKey: 'melodyLevelIdx', load: (i) => this.loadMelodyLevel(i),
                // Çalmakta olan melodiyi durdur
                onLeave: () => { this.melodyToken++; this.melodyBusy = false; }
            },
            sorting: { levels: () => D().SORTING_LEVELS, idxKey: 'sortingLevelIdx', load: (i) => this.loadSortingLevel(i) },
            dots: {
                levels: () => D().DOTS_LEVELS, idxKey: 'dotsLevelIdx', load: (i) => this.loadDotsLevel(i),
                onLeave: () => this.endDotsDrag()
            },
            oddone: { levels: () => D().ODDONE_LEVELS, idxKey: 'oddoneLevelIdx', load: (i) => this.loadOddOneLevel(i) },
            // Bak-sakla akışı levelEpoch ile kendiliğinden durur; Tekrar düğmesi aşamaya göre konuşur
            missing: {
                levels: () => D().MISSING_LEVELS, idxKey: 'missingLevelIdx', load: (i) => this.loadMissingLevel(i),
                instruction: () => this.getMissingInstruction()
            },
            // Renk bölümünde Tekrar düğmesi o anki rengi söyler; çıkarken çizgi sayacı ve uçan sürpriz temizlenir
            pump: {
                levels: () => D().PUMP_LEVELS, idxKey: 'pumpLevelIdx', load: (i) => this.loadPumpLevel(i),
                instruction: () => this.getPumpInstruction(),
                onLeave: () => this.stopPumpTimers()
            }
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
            sorting: document.getElementById('view-sorting'),
            dots: document.getElementById('view-dots'),
            oddone: document.getElementById('view-oddone'),
            missing: document.getElementById('view-missing'),
            pump: document.getElementById('view-pump')
        };

        // Üst panel
        this.totalStarsEl = document.getElementById('total-stars-count');
        this.btnSoundToggle = document.getElementById('btn-sound-toggle');
        this.btnVoiceToggle = document.getElementById('btn-voice-toggle');
        this.btnFullscreen = document.getElementById('btn-fullscreen-toggle');
        this.btnHelp = document.getElementById('btn-parent-guide');
        this.dialogGuide = document.getElementById('parent-guide-dialog');
        this.btnCloseGuide = document.getElementById('btn-close-guide');

        // --- 1. Canlı Yön Tuşlu Labirent ---
        this.realmazeGrid = document.getElementById('realmaze-grid');
        this.realmazeStarsBadge = document.getElementById('realmaze-stars-badge');
        this.btnResetRealmaze = document.getElementById('btn-reset-realmaze');
        this.realmazeArrowBtns = document.querySelectorAll('[data-realdir]');

        // --- 2. Neşeli Top Atma & Basket ---
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

        // --- 3. Sabun Köpüğü Patlatma ---
        this.bubblesScoreBadge = document.getElementById('bubbles-score-badge');
        this.bubblesPond = document.getElementById('bubbles-pond');
        this.bubblesChestItems = document.getElementById('bubbles-chest-items');

        // --- 4. Tavşancık Kodlama Öğeleri ---
        this.bunnyGrid = document.getElementById('bunny-grid');
        this.commandTrain = document.getElementById('command-train');
        this.btnRunCode = document.getElementById('btn-run-code');
        this.btnClearCode = document.getElementById('btn-clear-code');
        this.btnResetBunny = document.getElementById('btn-reset-bunny');
        this.bunnyPrevLevelBtn = document.getElementById('btn-bunny-prev');
        this.bunnyNextLevelBtn = document.getElementById('btn-bunny-next');
        this.arrowBtns = document.querySelectorAll('.btn-command-arrow[data-direction]');

        // --- 5. Balon Patlatma Öğeleri ---
        this.balloonSky = document.getElementById('balloon-sky');
        this.balloonScoreBadge = document.getElementById('balloon-score-badge');

        // --- 6. Şekil Eşleştirme Öğeleri ---
        this.shapeSilhouettesContainer = document.getElementById('shape-silhouettes');
        this.shapePiecesContainer = document.getElementById('shape-pieces');

        // --- 7. Hafıza Kartları Öğeleri ---
        this.memoryBoard = document.getElementById('memory-board');

        // --- 8. Örüntü Öğeleri ---
        this.patternTrainWagons = document.getElementById('pattern-train-wagons');
        this.patternOptionsContainer = document.getElementById('pattern-options');

        // --- 9. Boyut Öğeleri ---
        this.sizePool = document.getElementById('size-pool');
        this.podiumSlotsEl = document.querySelectorAll('.podium-slot');
        this.btnResetSize = document.getElementById('btn-reset-size');

        // --- 10-11. Renk & Sayı Bulucu Öğeleri ---
        this.finderUI = {
            color: {
                roundBadge: document.getElementById('color-round-badge'),
                switchBtn: document.getElementById('btn-switch-to-numbers'),
                targetWord: document.getElementById('color-target-word'),
                targetCircle: document.getElementById('color-target-circle'),
                targetPrompt: document.getElementById('color-target-prompt'),
                listenBtn: document.getElementById('btn-color-listen'),
                cards: document.getElementById('color-cards-container')
            },
            number: {
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

        // --- Noktaları Birleştir ---
        this.dotsProgress = document.getElementById('dots-progress');
        this.dotsBoard = document.getElementById('dots-board');

        // --- 16. Farklı Olanı Bul ---
        this.oddoneProgress = document.getElementById('oddone-progress');
        this.oddoneBoard = document.getElementById('oddone-board');

        // --- 17. Kim Kayboldu? ---
        this.missingProgress = document.getElementById('missing-progress');
        this.missingStatus = document.getElementById('missing-status');
        this.missingShelf = document.getElementById('missing-shelf');
        this.missingOptions = document.getElementById('missing-options');

        // --- Balon Şişir ---
        this.pumpProgress = document.getElementById('pump-progress');
        this.pumpStage = document.getElementById('pump-stage');
        this.pumpDots = document.getElementById('pump-dots');
        this.pumpSky = document.getElementById('pump-sky');
        this.pumpTray = document.getElementById('pump-tray');
        this.btnPumpInflate = document.getElementById('btn-pump-inflate');

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
            // Kemiğe varıldıysa kutlama penceresi bölümü ilerletir; arada sıfırlayıp yeniden oynanmaz
            if (this.realmazeFinished) return;
            soundManager.playPop();
            this.resetRealmazePosition();
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

        // --- 9. BOYUT ETKİNLİKLERİ ---
        this.btnResetSize.addEventListener('click', () => {
            soundManager.playWhoosh();
            this.resetSizeLevel();
        });

        // --- 10-11. RENK & SAYI BULUCU ETKİNLİKLERİ ---
        ['color', 'number'].forEach(kind => {
            const ui = this.finderUI[kind];

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

        // --- 15 OYUNUN ÖNCEKİ / SONRAKİ BÖLÜM DÜĞMELERİ (ortak kayıttan) ---
        Object.entries(this.games).forEach(([key, game]) => {
            document.getElementById(`btn-${key}-prev`).addEventListener('click', () => {
                const idx = this.getGameIdx(key);
                if (idx > 0) {
                    soundManager.playPop();
                    game.load(idx - 1);
                }
            });
            document.getElementById(`btn-${key}-next`).addEventListener('click', () => {
                const idx = this.getGameIdx(key);
                if (idx < game.levels().length - 1) {
                    soundManager.playPop();
                    game.load(idx + 1);
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

        // Balon Şişir: büyük pompa düğmesi açık balonu bir adım şişirir (klavyede Enter/Boşluk da)
        this.btnPumpInflate.addEventListener('click', () => this.handlePumpTap(this.pumpTargetLane));

        // Başarı modalı kapatma/ilerleme
        // Esc / telefonun geri tuşu pencereyi kapatmasın: bölüm bitmiş halde kalır ve
        // yeniden oynanıp yıldız toplanırdı; ilerlemek için pencerenin düğmesi kullanılır
        this.celebrationModal.addEventListener('cancel', (e) => e.preventDefault());

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

    getCurrentInstruction() {
        if (this.activeTab === 'home') {
            return "Hangi oyunu oynamak istersin? Bir resme dokun!";
        }
        const game = this.games[this.activeTab];
        if (game) {
            return game.instruction ? game.instruction() : game.levels()[this.getGameIdx(this.activeTab)].instruction;
        }
        return "Hadi oyuna başlayalım!";
    }

    switchTab(tabName) {
        // Çıkılan oyunun zamanlayıcıları/döngüleri durur (balon, köpük, top hedefi, melodi)
        const leaving = this.games[this.activeTab];
        if (leaving && leaving.onLeave && this.activeTab !== tabName) {
            leaving.onLeave();
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
        } else if (this.games[tabName]) {
            this.games[tabName].load(this.getGameIdx(tabName));
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

    // Kayıttaki oyunun açık bölüm sırası
    getGameIdx(key) {
        const game = this.games[key];
        return game.getIdx ? game.getIdx() : this[game.idxKey];
    }

    setLevelHeader(key, level, prefix = 'Bölüm') {
        const game = this.games[key];
        const levels = game.levels();
        const idx = levels.indexOf(level);
        document.getElementById(game.titleId || `${key}-title`).textContent = `${prefix} ${level.id}: ${level.title}`;
        document.getElementById(`${key}-instruction`).textContent = level.instruction;
        document.getElementById(`btn-${key}-prev`).disabled = (idx === 0);
        document.getElementById(`btn-${key}-next`).disabled = (idx === levels.length - 1);
        // Başlık/yönerge satır sayısı değişebilir: tahta boyu bir sonraki karede yeniden ölçülür
        requestAnimationFrame(() => this.updatePlayAreaHeight());
    }

    // ==========================================
    // 🌟 BAŞARI KUTLAMA VE MODAL
    // ==========================================

    // Açık oyunun bölüm sırası ve toplam bölüm sayısı (son bölüm mü kararı için)
    getActiveLevelProgress() {
        const game = this.games[this.activeTab];
        if (!game) return null;
        return { idx: this.getGameIdx(this.activeTab), count: game.levels().length };
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

        const game = this.games[this.activeTab];
        if (!game) return;
        const idx = this.getGameIdx(this.activeTab);
        if (idx < game.levels().length - 1) game.load(idx + 1);
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

/* exported installGameMethods */
// Oyunlar games/*.js dosyalarında ayrı sınıflar olarak yazılır; bu yardımcı yöntemlerini ana sınıfa ekler.
// Aynı adlı yöntem iki yerde tanımlanırsa sessizce ezilmesin diye hata verir.
function installGameMethods(GameClass) {
    for (const name of Object.getOwnPropertyNames(GameClass.prototype)) {
        if (name === 'constructor') continue;
        if (Object.prototype.hasOwnProperty.call(MiniExplorerApp.prototype, name)) {
            throw new Error(`Yöntem iki kez tanımlı: ${name}`);
        }
        Object.defineProperty(MiniExplorerApp.prototype, name, Object.getOwnPropertyDescriptor(GameClass.prototype, name));
    }
}

// Uygulamayı DOM hazır olunca başlat
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MiniExplorerApp();
});
